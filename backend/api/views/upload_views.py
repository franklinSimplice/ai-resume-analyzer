"""
File upload views.
Handles PDF upload, text extraction with PyPDF2, image conversion,
and storage in Supabase Storage.
"""
import io
import uuid
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import fitz  # PyMuPDF
from api.services import supabase_service
from api.middleware import require_auth

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def upload_resume(request):
    """
    Upload a PDF resume file.
    - Stores the PDF in Supabase Storage
    - Extracts text using PyMuPDF (fitz)
    - Returns the storage URL and extracted text
    """
    try:
        uploaded_file = request.FILES.get("file")

        if not uploaded_file:
            return JsonResponse({"error": "No file uploaded. Use 'file' field."}, status=400)

        if not uploaded_file.name.lower().endswith(".pdf"):
            return JsonResponse({"error": "Only PDF files are accepted."}, status=400)

        if uploaded_file.size > 10 * 1024 * 1024:  # 10MB limit
            return JsonResponse({"error": "File too large. Maximum size is 10MB."}, status=400)

        user_id = request.supabase_user["id"]
        file_data = uploaded_file.read()

        # 1. Extract text from PDF using PyMuPDF (fitz)
        extracted_text = ""
        is_scanned = False
        try:
            doc = fitz.open(stream=file_data, filetype="pdf")
            for page in doc:
                text = page.get_text()
                if text:
                    extracted_text += text + "\n"
            
            # If no text found across all pages, it's likely a scan
            if not extracted_text.strip() and len(doc) > 0:
                is_scanned = True
            doc.close()
        except Exception as e:
            logger.error(f"PDF extraction error: {e}")
            return JsonResponse({"error": f"Failed to read PDF structure: {str(e)}"}, status=400)

        if is_scanned:
            return JsonResponse(
                {
                    "error": "This PDF appears to be an image-based scan. Please upload a text-based PDF or a exported file (from Word/Google Docs) for analysis.",
                    "code": "SCANNED_PDF"
                },
                status=400,
            )

        if not extracted_text.strip():
            return JsonResponse(
                {"error": "Could not extract any text from the PDF. It might be empty or corrupted."},
                status=400,
            )

        # 2. Upload PDF to Supabase Storage
        file_id = str(uuid.uuid4())
        file_path = f"{user_id}/{file_id}.pdf"

        try:
            file_url = supabase_service.upload_file(
                bucket="resumes",
                path=file_path,
                file_data=file_data,
                content_type="application/pdf",
            )
        except Exception as e:
            logger.error(f"Storage upload error: {e}")
            return JsonResponse({"error": f"Failed to upload file to Supabase storage. Detail: {str(e)}"}, status=500)

        return JsonResponse({
            "file_url": file_url,
            "file_path": file_path,
            "extracted_text": extracted_text.strip(),
            "file_id": file_id,
        })

    except Exception as e:
        logger.error(f"Upload error: {e}")
        return JsonResponse({"error": f"Upload failed: {str(e)}"}, status=500)
