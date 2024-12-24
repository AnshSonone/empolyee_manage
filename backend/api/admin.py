from django.contrib import admin
from django.contrib.auth import get_user_model
from . import models

# Register your models here.

User = get_user_model()

class UserAdmin(admin.ModelAdmin):
    search_fields = ['email', 'user_role']
    list_display = ['id','username', 'email', 'phone_no', 'user_role']
    class Meta:
        model = User


class LeavesAdmin(admin.ModelAdmin):
    search_fields = ['user']
    list_display = ['id', 'user', 'leave_reason', 'start_leave_date', 'end_leave_date', 'applied_leave_date', 'leave_status']
    class Meta:
        model = models.LeaveModel

class ProfileAdmin(admin.ModelAdmin):
    list_display = ['user', 'leave']
    class Meta:
        model = models.ProfileModel
        
class TaskAdmin(admin.ModelAdmin):
    list_display = ['id', 'user', 'assigned_task', 'issued_date']
    search_fields = [ 'user', 'assigned_task']
    class Meta:
        model = models.TaskModel
    
admin.site.register(User, UserAdmin)
admin.site.register(models.LeaveModel, LeavesAdmin)
admin.site.register(models.ProfileModel, ProfileAdmin)
admin.site.register(models.TaskModel, TaskAdmin)

