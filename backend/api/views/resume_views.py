"""
Resume CRUD views.
Handles listing, creating, reading, updating, and deleting resumes in Supabase.
"""
import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from api.services import supabase_service
from api.middleware import require_auth

logger = logging.getLogger(__name__)


# ─── Generated Resumes ───

@csrf_exempt
@require_http_methods(["GET", "POST", "DELETE"])
@require_auth
def generated_resumes_list(request):
    """
    GET  → List all generated resumes for the user
    POST → Create a new generated resume
    DELETE → Delete all resumes (with ?all=true)
    """
    user_id = request.supabase_user["id"]

    if request.method == "GET":
        try:
            resumes = supabase_service.get_generated_resumes(user_id)
            return JsonResponse({"resumes": resumes})
        except Exception as e:
            logger.error(f"Error listing resumes: {e}")
            return JsonResponse({"error": "Failed to fetch resumes."}, status=500)

    elif request.method == "POST":
        try:
            body = json.loads(request.body)
            body["user_id"] = user_id
            # Remove any client-sent id to let DB generate it
            body.pop("id", None)
            resume = supabase_service.create_generated_resume(body)
            return JsonResponse({"resume": resume}, status=201)
        except Exception as e:
            logger.error(f"Error creating resume: {e}")
            return JsonResponse({"error": "Failed to save resume."}, status=500)

    elif request.method == "DELETE":
        if request.GET.get("all") == "true":
            try:
                supabase_service.delete_all_generated_resumes(user_id)
                return JsonResponse({"message": "All resumes deleted."})
            except Exception as e:
                logger.error(f"Error deleting all resumes: {e}")
                return JsonResponse({"error": "Failed to delete resumes."}, status=500)
        return JsonResponse({"error": "Use ?all=true to delete all resumes."}, status=400)


@csrf_exempt
@require_http_methods(["GET", "PUT", "DELETE"])
@require_auth
def generated_resume_detail(request, resume_id):
    """
    GET    → Get a single generated resume
    PUT    → Update a generated resume
    DELETE → Delete a generated resume
    """
    user_id = request.supabase_user["id"]

    if request.method == "GET":
        try:
            resume = supabase_service.get_generated_resume(resume_id, user_id)
            if not resume:
                return JsonResponse({"error": "Resume not found."}, status=404)
            return JsonResponse({"resume": resume})
        except Exception as e:
            logger.error(f"Error getting resume {resume_id}: {e}")
            return JsonResponse({"error": "Failed to fetch resume."}, status=500)

    elif request.method == "PUT":
        try:
            body = json.loads(request.body)
            # Don't allow changing user_id or id
            body.pop("user_id", None)
            body.pop("id", None)
            resume = supabase_service.update_generated_resume(resume_id, user_id, body)
            return JsonResponse({"resume": resume})
        except Exception as e:
            logger.error(f"Error updating resume {resume_id}: {e}")
            return JsonResponse({"error": "Failed to update resume."}, status=500)

    elif request.method == "DELETE":
        try:
            supabase_service.delete_generated_resume(resume_id, user_id)
            return JsonResponse({"message": "Resume deleted."})
        except Exception as e:
            logger.error(f"Error deleting resume {resume_id}: {e}")
            return JsonResponse({"error": "Failed to delete resume."}, status=500)


# ─── Analyzed Resumes ───

@csrf_exempt
@require_http_methods(["GET", "PUT", "POST"])
@require_auth
def analyzed_resume_detail(request, resume_id):
    """
    GET  → Get an analyzed resume by ID
    POST → Create a new analyzed resume with this ID
    PUT  → Update (e.g., checked tips)
    """
    user_id = request.supabase_user["id"]

    if request.method == "GET":
        try:
            resume = supabase_service.get_analyzed_resume(resume_id, user_id)
            if not resume:
                return JsonResponse({"error": "Analysis not found."}, status=404)
            return JsonResponse({"resume": resume})
        except Exception as e:
            logger.error(f"Error getting analysis {resume_id}: {e}")
            return JsonResponse({"error": "Failed to fetch analysis."}, status=500)

    elif request.method == "POST":
        try:
            body = json.loads(request.body)
            body["id"] = resume_id
            body["user_id"] = user_id
            resume = supabase_service.create_analyzed_resume(body)
            return JsonResponse({"resume": resume}, status=201)
        except Exception as e:
            logger.error(f"Error creating analysis {resume_id}: {e}")
            return JsonResponse({"error": f"Failed to save analysis. Detail: {str(e)}"}, status=500)

    elif request.method == "PUT":
        try:
            body = json.loads(request.body)
            body.pop("user_id", None)
            body.pop("id", None)
            resume = supabase_service.update_analyzed_resume(resume_id, user_id, body)
            return JsonResponse({"resume": resume})
        except Exception as e:
            logger.error(f"Error updating analysis {resume_id}: {e}")
            return JsonResponse({"error": "Failed to update analysis."}, status=500)

