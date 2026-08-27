"""
Authentication views for signup, login, logout, and user profile.
Uses Supabase Auth under the hood.
"""
import json
import logging
import traceback
from django.conf import settings
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from api.services import supabase_service
from api.middleware import require_auth

logger = logging.getLogger(__name__)


@csrf_exempt
@require_http_methods(["POST"])
def signup(request):
    """Register a new user with email and password."""
    try:
        body = json.loads(request.body)
        email = body.get("email", "").strip()
        password = body.get("password", "")

        if not email or not password:
            return JsonResponse({"error": "Email and password are required."}, status=400)

        if len(password) < 6:
            return JsonResponse({"error": "Password must be at least 6 characters."}, status=400)

        result = supabase_service.sign_up(email, password)
        return JsonResponse(result, status=201)

    except Exception as e:
        error_msg = getattr(e, "message", str(e))
        logger.error(f"Signup error: {error_msg}\n{traceback.format_exc()}")
        lower_msg = error_msg.lower()
        if "already registered" in lower_msg or "already been registered" in lower_msg or "user already exists" in lower_msg or "already exists" in lower_msg:
            return JsonResponse({"error": "This email is already registered. Please sign in instead."}, status=409)
        if "rate limit" in lower_msg or "too many requests" in lower_msg:
            return JsonResponse({"error": "Rate limit exceeded. Please wait a few minutes before trying again or try signing in."}, status=429)
        if "invalid email" in lower_msg:
            return JsonResponse({"error": "Invalid email address."}, status=400)
        if "password" in lower_msg and ("weak" in lower_msg or "short" in lower_msg or "minimum" in lower_msg):
            return JsonResponse({"error": "Password is too weak. Please use a stronger password."}, status=400)
        if "supabase_url" in lower_msg or "supabase_anon_key" in lower_msg or "must be configured" in lower_msg:
            return JsonResponse({"error": "Server configuration error: Supabase credentials missing."}, status=500)
        # Always return real error to help with debugging
        return JsonResponse({"error": error_msg}, status=400)


@csrf_exempt
@require_http_methods(["POST"])
def login(request):
    """Sign in a user with email and password."""
    try:
        body = json.loads(request.body)
        email = body.get("email", "").strip()
        password = body.get("password", "")

        if not email or not password:
            return JsonResponse({"error": "Email and password are required."}, status=400)

        result = supabase_service.sign_in(email, password)
        return JsonResponse(result)

    except Exception as e:
        error_msg = getattr(e, "message", str(e))
        logger.error(f"Login error: {error_msg}\n{traceback.format_exc()}")
        lower_msg = error_msg.lower()
        if "email not confirmed" in lower_msg or "not confirmed" in lower_msg:
            return JsonResponse({"error": "Email not confirmed. Please check your inbox for the confirmation link."}, status=401)
        if "rate limit" in lower_msg or "too many requests" in lower_msg:
            return JsonResponse({"error": "Rate limit exceeded. Please wait a few minutes before trying again."}, status=429)
        if "supabase_url" in lower_msg or "supabase_anon_key" in lower_msg or "must be configured" in lower_msg:
            return JsonResponse({"error": "Server configuration error: Supabase credentials missing."}, status=500)
        if "invalid" in lower_msg or "credentials" in lower_msg or "not found" in lower_msg:
            return JsonResponse({"error": "Invalid email or password."}, status=401)
        # Always return real error to help with debugging
        return JsonResponse({"error": error_msg}, status=400)



@csrf_exempt
@require_http_methods(["POST"])
def logout(request):
    """Sign out — client-side token clearing. Server just acknowledges."""
    return JsonResponse({"message": "Logged out successfully."})


@csrf_exempt
@require_http_methods(["POST"])
def refresh(request):
    """Refresh the session token."""
    try:
        body = json.loads(request.body)
        refresh_token = body.get("refresh_token", "").strip()

        if not refresh_token:
            return JsonResponse({"error": "Refresh token is required."}, status=400)

        result = supabase_service.refresh_session(refresh_token)
        return JsonResponse(result)

    except Exception as e:
        error_msg = str(e)
        logger.error(f"Refresh error: {error_msg}")
        return JsonResponse({"error": "Session refresh failed."}, status=401)


@csrf_exempt
@require_http_methods(["GET"])
@require_auth
def get_user(request):
    """Get the current authenticated user's profile."""
    return JsonResponse({"user": request.supabase_user})
