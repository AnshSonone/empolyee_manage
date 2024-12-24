from django.urls import path
from . import views
from rest_framework_simplejwt.views import TokenRefreshView, TokenVerifyView

urlpatterns = [
    path("", views.HomeView.as_view(), name="HomeView"),

    # Registration URLS
    path("users/register/", views.RegisterView.as_view(), name='RegisterView'),
    path('users/activate/', views.ActivationConfirm.as_view(), name='activationconfrim'),

    # Forgot Password URLS
    path("users/forgot/", views.SendForgotPasswordEmailView.as_view(), name='send_forgot_passowrd'),
    path("users/reset_password/", views.ResetPasswordView.as_view(), name='ResetPassword'),

    # Login URLS
    path("users/login/", views.LoginView.as_view(), name='LoginView'),
    path("users/logout/", views.LogoutView.as_view(), name='LogoutView'),
    path("staff/login/", views.StaffRegisterView.as_view(), name="StaffView"),

    # Get User URLS
    path("users/get_user/", views.getUserView.as_view(), name='getUserView'),

    # leaves URLS
    path("users/leaves/", views.LeaveView.as_view(), name='LeaveView'),
    path('leave/', views.SuperUserLeaveView.as_view(), name="SuperView"),
    
    # Task URLS
    path('users/task/', views.TaskView.as_view(), name='task'),

    # Tokens URLS
    path("token/refresh/", TokenRefreshView.as_view(), name='refresh'),
    path("token/verify_token/", TokenVerifyView.as_view(), name='verify_token'),
    path("token/csrf/", views.GetCsrfTokenView.as_view(), name='GetCsrfToken'),

]