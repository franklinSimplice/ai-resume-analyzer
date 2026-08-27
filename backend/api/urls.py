"""
API URL configuration with flexible trailing slashes.
"""
from django.urls import re_path
from api.views import auth_views, resume_views, ai_views, upload_views

urlpatterns = [
    # Auth
    re_path(r"^auth/signup/?$", auth_views.signup, name="auth-signup"),
    re_path(r"^auth/login/?$", auth_views.login, name="auth-login"),
    re_path(r"^auth/logout/?$", auth_views.logout, name="auth-logout"),
    re_path(r"^auth/refresh/?$", auth_views.refresh, name="auth-refresh"),
    re_path(r"^auth/user/?$", auth_views.get_user, name="auth-user"),

    # Generated Resumes
    re_path(r"^resumes/generated/?$", resume_views.generated_resumes_list, name="resumes-list"),
    re_path(r"^resumes/generated/(?P<resume_id>[^/]+)/?$", resume_views.generated_resume_detail, name="resume-detail"),

    # Analyzed Resumes
    re_path(r"^resumes/analyzed/(?P<resume_id>[^/]+)/?$", resume_views.analyzed_resume_detail, name="analysis-detail"),

    # AI
    re_path(r"^ai/generate/?$", ai_views.generate_resume, name="ai-generate"),
    re_path(r"^resume/generate/?$", ai_views.generate_resume, name="resume-generate"),
    re_path(r"^ai/analyze/?$", ai_views.analyze_resume, name="ai-analyze"),
    re_path(r"^ai/suggest/?$", ai_views.suggest_improvement, name="ai-suggest"),

    # File Upload
    re_path(r"^upload/resume/?$", upload_views.upload_resume, name="upload-resume"),
]
