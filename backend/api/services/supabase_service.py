"""
Supabase Service
Handles all communication with Supabase for auth, database, and storage operations.
"""
import logging
from django.conf import settings
from supabase import create_client, Client

logger = logging.getLogger(__name__)

_client: Client | None = None
_anon_client: Client | None = None


def get_supabase_client() -> Client:
    """Get or create a Supabase client using the service role key (server-side)."""
    global _client
    if _client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_SERVICE_ROLE_KEY:
            raise ValueError(
                "SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY must be configured in .env"
            )
        _client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_SERVICE_ROLE_KEY,
        )
    return _client


def get_anon_client() -> Client:
    """Get a Supabase client using the anon key (for auth operations)."""
    global _anon_client
    if _anon_client is None:
        if not settings.SUPABASE_URL or not settings.SUPABASE_ANON_KEY:
            raise ValueError(
                "SUPABASE_URL and SUPABASE_ANON_KEY must be configured in .env"
            )
        _anon_client = create_client(
            settings.SUPABASE_URL,
            settings.SUPABASE_ANON_KEY,
        )
    return _anon_client


# ─── Auth helpers ───

def sign_up(email: str, password: str) -> dict:
    """Register a new user with email and password.
    
    If standard sign_up triggers Supabase's email rate limit,
    fallback to service-role user creation with auto-confirmation.
    """
    try:
        client = get_anon_client()
        response = client.auth.sign_up({"email": email, "password": password})
        
        user_data = None
        if response.user:
            user_data = {
                "id": response.user.id,
                "email": response.user.email,
            }
        
        session_data = None
        if response.session:
            session_data = {
                "access_token": response.session.access_token,
                "refresh_token": response.session.refresh_token,
            }
        
        return {
            "user": user_data,
            "session": session_data,
            "email_confirmation_required": session_data is None and user_data is not None,
        }
    except Exception as e:
        error_msg = getattr(e, "message", str(e))
        if "rate limit" in error_msg.lower():
            logger.warning(f"Anon sign_up rate limited: {error_msg}. Falling back to admin creation.")
            try:
                admin_client = get_supabase_client()
                admin_res = admin_client.auth.admin.create_user({
                    "email": email,
                    "password": password,
                    "email_confirm": True,
                })
                if admin_res and admin_res.user:
                    return sign_in(email, password)
            except Exception as admin_err:
                logger.error(f"Admin fallback creation failed: {admin_err}")
                raise e
        raise e


def sign_in(email: str, password: str) -> dict:
    """Sign in a user with email and password."""
    client = get_anon_client()
    response = client.auth.sign_in_with_password({"email": email, "password": password})
    return {
        "user": {
            "id": response.user.id,
            "email": response.user.email,
        },
        "session": {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
        },
    }


def refresh_session(refresh_token: str) -> dict:
    """Refresh the user's session using a refresh token."""
    client = get_anon_client()
    response = client.auth.refresh_session(refresh_token)
    return {
        "user": {
            "id": response.user.id,
            "email": response.user.email,
        } if response.user else None,
        "session": {
            "access_token": response.session.access_token,
            "refresh_token": response.session.refresh_token,
        } if response.session else None,
    }


def get_user_from_token(access_token: str) -> dict | None:
    """Validate a JWT and return user info."""
    try:
        client = get_anon_client()
        response = client.auth.get_user(access_token)
        if response and response.user:
            return {
                "id": response.user.id,
                "email": response.user.email,
            }
        return None
    except Exception as e:
        logger.warning(f"Token validation failed: {e}")
        return None


# ─── Database helpers ───

def get_generated_resumes(user_id: str) -> list:
    """Get all generated resumes for a user, sorted by updated_at desc."""
    client = get_supabase_client()
    response = (
        client.table("generated_resumes")
        .select("*")
        .eq("user_id", user_id)
        .order("updated_at", desc=True)
        .execute()
    )
    return response.data


def get_generated_resume(resume_id: str, user_id: str) -> dict | None:
    """Get a single generated resume by ID."""
    client = get_supabase_client()
    response = (
        client.table("generated_resumes")
        .select("*")
        .eq("id", resume_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return response.data


def create_generated_resume(data: dict) -> dict:
    """Create a new generated resume."""
    client = get_supabase_client()
    response = client.table("generated_resumes").insert(data).execute()
    return response.data[0] if response.data else {}


def update_generated_resume(resume_id: str, user_id: str, data: dict) -> dict:
    """Update an existing generated resume."""
    client = get_supabase_client()
    response = (
        client.table("generated_resumes")
        .update(data)
        .eq("id", resume_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response.data[0] if response.data else {}


def delete_generated_resume(resume_id: str, user_id: str) -> bool:
    """Delete a single generated resume."""
    client = get_supabase_client()
    client.table("generated_resumes").delete().eq("id", resume_id).eq("user_id", user_id).execute()
    return True


def delete_all_generated_resumes(user_id: str) -> bool:
    """Delete all generated resumes for a user."""
    client = get_supabase_client()
    client.table("generated_resumes").delete().eq("user_id", user_id).execute()
    return True


# ─── Analyzed resumes ───

def get_analyzed_resume(resume_id: str, user_id: str) -> dict | None:
    """Get a single analyzed resume by ID."""
    client = get_supabase_client()
    response = (
        client.table("analyzed_resumes")
        .select("*")
        .eq("id", resume_id)
        .eq("user_id", user_id)
        .single()
        .execute()
    )
    return response.data


def create_analyzed_resume(data: dict) -> dict:
    """Create a new analyzed resume record."""
    client = get_supabase_client()
    response = client.table("analyzed_resumes").insert(data).execute()
    return response.data[0] if response.data else {}


def update_analyzed_resume(resume_id: str, user_id: str, data: dict) -> dict:
    """Update an analyzed resume (e.g., checked tips)."""
    client = get_supabase_client()
    response = (
        client.table("analyzed_resumes")
        .update(data)
        .eq("id", resume_id)
        .eq("user_id", user_id)
        .execute()
    )
    return response.data[0] if response.data else {}


# ─── Storage helpers ───

def upload_file(bucket: str, path: str, file_data: bytes, content_type: str = "application/pdf") -> str:
    """
    Upload a file to Supabase Storage.
    Returns the public URL of the uploaded file.
    """
    client = get_supabase_client()
    try:
        logger.info(f"Uploading file to bucket: {bucket}, path: {path}")
        upload_response = client.storage.from_(bucket).upload(
            path,
            file_data,
            {"content-type": content_type},
        )
        logger.info(f"Upload successful. Response: {upload_response}")
    except Exception as e:
        logger.error(f"Error during upload: {e}")
        raise e
    
    # Get the public URL
    url_response = client.storage.from_(bucket).get_public_url(path)
    return url_response


def get_file_url(bucket: str, path: str) -> str:
    """Get the public URL for a file in Supabase Storage."""
    client = get_supabase_client()
    return client.storage.from_(bucket).get_public_url(path)
