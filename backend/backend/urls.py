from django.contrib import admin
from django.urls import path, include
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path("api/", include('api.urls')),
    path('activate/<str:uid>/<str:token>/', views.ActivateView.as_view(), name='activate'),
    path("forgot/<str:uid>/<str:token>/", views.ForgotPasswordConfrim.as_view(), name='forgot'),
]
