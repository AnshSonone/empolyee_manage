from rest_framework import serializers
from django.utils.encoding import smart_str, force_bytes, DjangoUnicodeDecodeError
from django.utils.http import urlsafe_base64_decode, urlsafe_base64_encode
from django.contrib.auth.tokens import PasswordResetTokenGenerator
from django.contrib.auth import get_user_model
from . import models

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = ['id', 'email', 'username', 'user_role', 'phone_no', 'date_of_birth', 'is_admin', 'password', 'last_login']
        
        extra_kwargs = { 'password': { 'write_only': True}}


    def create(self, validated_data):
        user = User.objects.create_user(**validated_data)
        if user is not None:
            return user

        
    
    def validate_phone_no(self, value):
        phone_no = value
        if not phone_no:
            raise serializers.ValidationError('Phone number is required')
        if len(str(phone_no)) != 10:
            raise serializers.ValidationError('Phone number must be 10 digits')
        return value

    

class UserLoginSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    email = serializers.StringRelatedField(read_only=True)
    class Meta:
        model = User
        fields = ['email', 'password']


class StaffUserSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = User
        fields = '__all__'

    def validate(self, attrs):
        if attrs.get('is_staff') == False:
            serializers.ValidationError('This is staff route')
        return attrs
    

class LeaveSerializer(serializers.ModelSerializer):
    username = serializers.StringRelatedField(source='user',read_only=True)
    class Meta:
        model = models.LeaveModel
        fields = '__all__'
        
        
    # def validate(self, attrs):
    #     leave = attrs.get('leave_status')
    #     if leave:
    #         raise serializers.ValidationError('you are already appleid for leave')
    #     return attrs


class ProfileSerializer(serializers.ModelSerializer):
    UserSerializer()
    class Meta:
        model = models.ProfileModel
        fields = ['user', 'leave']
        
class TaskSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    class Meta:
        model = models.TaskModel
        fields = ['id', 'user', 'assigned_task', 'issued_date', 'deadline_date',  'is_completed']