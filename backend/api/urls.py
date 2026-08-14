"""
API URL configuration.
"""
from django.urls import path
from api.views import auth_views, resume_views, ai_views, upload_views

urlpatterns = [
    # Auth
    path("auth/signup", auth_views.signup, name="auth-signup"),
    path("auth/login", auth_views.login, name="auth-login"),
    path("auth/logout", auth_views.logout, name="auth-logout"),
    path("auth/refresh", auth_views.refresh, name="auth-refresh"),
    path("auth/user", auth_views.get_user, name="auth-user"),
    path("resume/generate", ai_views.generate_resume, name="resume-generate"),

    # Generated Resumes
    path("resumes/generated/", resume_views.generated_resumes_list, name="resumes-list"),
    path("resumes/generated/<str:resume_id>/", resume_views.generated_resume_detail, name="resume-detail"),

    # Analyzed Resumes
    path("resumes/analyzed/<str:resume_id>/", resume_views.analyzed_resume_detail, name="analysis-detail"),

    # AI
    path("ai/generate", ai_views.generate_resume, name="ai-generate"),
    path("ai/analyze", ai_views.analyze_resume, name="ai-analyze"),
    path("ai/suggest", ai_views.suggest_improvement, name="ai-suggest"),

    # File Upload
    path("upload/resume", upload_views.upload_resume, name="upload-resume"),
]

