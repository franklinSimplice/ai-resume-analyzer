"""
AI views for resume generation, analysis, and suggestions.
Proxies requests to NVIDIA Minimax M2.7 via the nvidia_service.
"""
import json
import logging
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
import json_repair
from api.services.nvidia_service import nvidia_ai
from api.middleware import require_auth

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def generate_resume(request):
    """
    Generate a resume from user input.
    Expects: { "prompt": "..." }
    Returns: { "content": "..." }
    """
    try:
        body = json.loads(request.body)
        prompt = body.get("prompt", "")

        if not prompt:
            return JsonResponse({"error": "Prompt is required."}, status=400)

        content = nvidia_ai.generate_resume(prompt)
        return JsonResponse({"content": content})

    except Exception as e:
        logger.error(f"Resume generation error: {e}")
        return JsonResponse(
            {"error": f"Failed to generate resume: {str(e)}"},
            status=500,
        )


@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def analyze_resume(request):
    """
    Analyze a resume (text extracted from PDF) and return structured feedback.
    Expects: { "resume_text": "...", "instructions": "..." }
    Returns: { "feedback": { ... } }
    """
    try:
        body = json.loads(request.body)
        resume_text = body.get("resume_text", "")
        instructions = body.get("instructions", "")

        if not resume_text:
            return JsonResponse({"error": "Resume text is required."}, status=400)

        if not instructions:
            return JsonResponse({"error": "Analysis instructions are required."}, status=400)

        raw_response = nvidia_ai.analyze_resume(resume_text, instructions)

        # DEBUG: write the raw output to a file so we can see why it's breaking
        with open("ai_debug.txt", "w", encoding="utf-8") as f:
            f.write(raw_response)

        # Try to parse the AI response as JSON
        try:
            feedback = json.loads(raw_response)
        except json.JSONDecodeError:
            # AI often returns slightly malformed JSON (e.g. unescaped quotes)
            # Use json_repair to intelligently fix and parse it
            try:
                feedback = json_repair.loads(raw_response)
            except Exception as repair_error:
                logger.error(f"AI returned irrevocably malformed JSON: {raw_response[:500]}... Error: {repair_error}")
                return JsonResponse(
                    {"error": "AI returned an invalid response format (malformed JSON). Please try again."},
                    status=500,
                )

        return JsonResponse({"feedback": feedback})

    except json.JSONDecodeError:
        # This only catches the request.body parsing now
        return JsonResponse({"error": "Invalid request body."}, status=400)
    except Exception as e:
        logger.error(f"Resume analysis error: {e}")
        return JsonResponse(
            {"error": f"Failed to analyze resume: {str(e)}"},
            status=500,
        )


@csrf_exempt
@require_http_methods(["POST"])
@require_auth
def suggest_improvement(request):
    """
    Get AI suggestion to improve a specific resume section.
    Expects: { "section_name": "...", "current_content": "...", "suggestion": "..." }
    Returns: { "content": "..." }
    """
    try:
        body = json.loads(request.body)
        section_name = body.get("section_name", "")
        current_content = body.get("current_content", "")
        suggestion = body.get("suggestion", "")

        if not section_name or not suggestion:
            return JsonResponse(
                {"error": "section_name and suggestion are required."},
                status=400,
            )

        content = nvidia_ai.suggest_improvement(section_name, current_content, suggestion)
        return JsonResponse({"content": content})

    except Exception as e:
        logger.error(f"AI suggestion error: {e}")
        return JsonResponse(
            {"error": f"Failed to get suggestion: {str(e)}"},
            status=500,
        )
