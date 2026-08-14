"""
Supabase JWT Authentication Middleware
Extracts the Bearer token from the Authorization header and validates it against Supabase.
Attaches the user info to request.supabase_user.
"""
import logging
from api.services.supabase_service import get_user_from_token

logger = logging.getLogger(__name__)


def require_auth(view_func):
    """
    Decorator that requires a valid Supabase JWT in the Authorization header.
    Attaches request.supabase_user = {"id": ..., "email": ...} on success.
    Returns 401 if invalid or missing.
    """
    from django.http import JsonResponse
    from functools import wraps

    @wraps(view_func)
    def wrapper(request, *args, **kwargs):
        auth_header = request.headers.get("Authorization", "")

        if not auth_header.startswith("Bearer "):
            return JsonResponse(
                {"error": "Authorization header missing or invalid. Use 'Bearer <token>'."},
                status=401,
            )

        token = auth_header[7:]  # Strip "Bearer "

        try:
            user = get_user_from_token(token)
        except Exception as e:
            logger.error(f"Auth middleware error: {e}")
            return JsonResponse({"error": "Authentication service error."}, status=500)

        if not user:
            return JsonResponse({"error": "Invalid or expired token."}, status=401)

        request.supabase_user = user
        return view_func(request, *args, **kwargs)

    return wrapper
