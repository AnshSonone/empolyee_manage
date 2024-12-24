from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import AllowAny
from . import serializers
from rest_framework import status
from rest_framework_simplejwt.tokens import RefreshToken
from . import models
from .permissions import CustomPermission
from django.contrib.auth import get_user_model, authenticate, login, logout
from django.utils.decorators import method_decorator
from django.views.decorators.csrf import csrf_protect, ensure_csrf_cookie, csrf_exempt
from .email import send_activation_email, send_forgot_password_email, send_notify_email
from .utils import encode_url, decode_url, get_token
from django.shortcuts import get_object_or_404

# Create your views here.

User = get_user_model()


def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)

    return {
        'access': str(refresh.access_token),
        'refresh': str(refresh)
    }

@method_decorator(ensure_csrf_cookie, name='dispatch')
class GetCsrfTokenView( APIView ):
     
     permission_classes = [AllowAny]

     def get(self, request):
         
         return Response({'message': 'csrf token set successfully'}, status=status.HTTP_200_OK)

class HomeView( APIView ):

    permission_classes = [AllowAny]

    def get(self, request):
        text = [
            'api/users/register/',
            'api/users/login/',
            'api/users/logout/',
            'api/users/forgot_password/',
        ]
        return Response(text, status=status.HTTP_200_OK)


# ======== Register views ===========   

@method_decorator(csrf_protect, name='dispatch')
class RegisterView( APIView ):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = serializers.UserSerializer(data=request.data)
        if serializer.is_valid():
            user = serializer.create(serializer.validated_data)

            # Send Acctount Activation email
            activation_url = encode_url(user, route='activate')
            send_activation_email(user.email, activation_url)
            return Response({"message": "User activation email send successfully"}, status=status.HTTP_201_CREATED)
        
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class ActivateView(APIView):

    permission_classes = [AllowAny]


class ActivationConfirm(APIView):
    permission_classes = [AllowAny]

    def patch(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')

        if not uid or not token:
            return Response({'detail': 'Missing uid or token.'}, status=status.HTTP_400_BAD_REQUEST)
        
        user_id = decode_url(uid)
        user = User.objects.get(id=user_id)

        if user is None:
            return Response({"message": "User does not exist"}, status=status.HTTP_400_BAD_REQUEST)
        
        if get_token(user, token):
            
            if user.is_active:
                return Response({'detail': 'Account is already activated.'}, status=status.HTTP_208_ALREADY_REPORTED)
            else:
                user.is_active = True
                user.save()
                return Response({'detail': 'Account activated successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid activation link.'}, status=status.HTTP_400_BAD_REQUEST)
        

class StaffRegisterView( APIView ):

    permission_classes = [AllowAny]

    def post(self, request):
        serializer = serializers.UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save(is_staff=True)
            return Response({'message': 'Staff register successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# ======== Forgot Password views =============

class SendForgotPasswordEmailView( APIView ):

    permission_classes = [AllowAny]

    def post( self, request):
        email = request.data.get('email')
        if email is not None:
            user = User.objects.get(email=email)
            forgot_url = encode_url(user, route='forgot')
            send_forgot_password_email(email, forgot_url)
            return Response({"message": f'{email}'}, status=status.HTTP_200_OK)
        return Response({"message": 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)

class ForgotPasswordConfrim( APIView ):
    permission_classes = [AllowAny]

class ResetPasswordView( APIView ):

    permission_classes = [AllowAny]

    def patch(self, request):
        uid = request.data.get('uid')
        token = request.data.get('token')
        password = request.data.get('password')
        conf_password = request.data.get('conf_password')

        if not uid or not token or not password:
            return Response({'detail': 'Missing uid or token or password.'}, status=status.HTTP_400_BAD_REQUEST)

        user_id = decode_url(uid)
        user = get_object_or_404(User, id=user_id)
        if user is None:
            return Response({'message': 'User does not exist'}, status=status.HTTP_400_BAD_REQUEST)
            
        print(uid, user_id, user)
        if get_token(user, token):
                user.set_password(password)
                user.save()

                return Response({'detail': 'Password reset successfully.'}, status=status.HTTP_200_OK)
        else:
            return Response({'detail': 'Invalid link.'}, status=status.HTTP_400_BAD_REQUEST)

# ======== Login views =========== 

# @method_decorator(csrf_protect, name='dispatch')
class LoginView( APIView ):

    permission_classes  = [AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        user = authenticate(request, email=email, password=password)
        if user is not None:
            login(request, user)
            token = get_tokens_for_user(user)
            send_notify_email(user.email)
            return Response({
                    'token': token,
                    'message': 'User login Successfully'
                    }, status=status.HTTP_200_OK)
        return Response({"message": "user not exist"}, status=status.HTTP_400_BAD_REQUEST)

class getUserView( APIView ):

    def get(self, request):
        user = request.user
        obj = User.objects.filter(id=user.id)
        serializer = serializers.UserSerializer(obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LeaveView( APIView ):

    def get(self, request):
        user = request.user
        leave_obj = models.LeaveModel.objects.filter(user=user.id)
        if user.is_superuser:
            leave_obj = models.LeaveModel.objects.all()
        serializer = serializers.LeaveSerializer(leave_obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request):
        serializer = serializers.LeaveSerializer(data=request.data)
        if serializer.is_valid():
            return Response({"message": "Leave applied succesfully"}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        user = request.user
        if not user:
            return Response({'message': 'user not exist'}, status=status.HTTP_404_NOT_FOUND)
        leave_obj = get_object_or_404(models.LeaveModel, user=user.id)
        
        serializer = serializers.LeaveSerializer(leave_obj, data={'leave_status': True}, partial=True)
        
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'leave status updated successfully'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        

            
    
    def delete(self, request):
        try:
            user = request.user
            user_obj = User.objects.get(id=user.id)
            user_obj.delete()
            Response({"message": "Leave deleted successfully"}, status=status.HTTP_200_OK)
        except Exception as e:
            return Response({"message": e.add_note('deletion error occured')}, status=status.HTTP_400_BAD_REQUEST)

class ProfileView( APIView ):

    def get(self, request):
        user = request.user
        user_obj = models.ProfileModel.objects.filter(user=user.id)
        leave_obj = models.LeaveModel.objects.filter(user=user.id)
        serializer = serializers.ProfileSerializer([user_obj, leave_obj], many=True)
        return Response(serializer.data)

class SuperUserLeaveView( APIView ):

    permission_classes = [CustomPermission]

    def get(self, request):
        leave_obj = models.LeaveModel.objects.all()
        serializer = serializers.UserSerializer(leave_obj, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)
    
class LogoutView( APIView ):
     def post(self, request):
         user = request.user
         queryset = User.objects.get(email=user.email)
         if queryset is not None:
            logout(request)
            return Response({'message': 'User logged out succesfully'})
         
class ForgotPasswordEmailView( APIView ):

    def post(self, request):
        email = request.data.get('email')

        if not User.objects.filter(email=email).exists():
            return Response({"message": "No User exist"}, status=status.HTTP_404_NOT_FOUND)
        
        user = User.objects.get(email=email)

        serializer = serializers.UserLoginSerializer(user, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

class ForgotPasswordView( APIView ):
     
     def patch(self, request):
         new_password = request.data.get('new_passowrd')
         Confrim_password = request.data.get('Confrim_passowrd')
         
         if new_password != Confrim_password:
             return Response({'message': 'both password should be same'}, status=status.HTTP_400_BAD_REQUEST)
         user = request.user

         user_obj = User.objects.get(id=user.id)

         serializer = serializers.UserSerializer(user_obj, many=True)
         serializer.update(
             password=new_password,
             isinstance=True
             )
         
         return Response({"message": "Password Update successfully"}, status=status.HTTP_201_CREATED)
     
class TaskView( APIView ):
    
    def get(self, request):
        try:
            user = request.user
            task_obj = models.TaskModel.objects.filter(user=user.id)
            if user.is_superuser:
                task_obj = models.TaskModel.objects.all()
            serializer = serializers.TaskSerializer(task_obj, many=True)
            return Response(serializer.data, status=status.HTTP_200_OK)
        except Exception as e:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def post(self, request):
        user = request.user
        if not user.is_superuser:
            return Response({'meesage': 'Only admins can update tasks'}, status=status.HTTP_403_FORBIDDEN)
        serializer = serializers.TaskSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response({'message': 'Task is sent'}, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    
    def patch(self, request):
        task_id = request.data.get('id')
        if not task_id:
            return Response({'message': 'Task ID is required'}, status=status.HTTP_400_BAD_REQUEST)

        user = request.user

        # Optional admin-only check
        if not user.is_superuser:
            return Response({'message': 'Only admins can update tasks'}, status=status.HTTP_403_FORBIDDEN)

        # Retrieve the task or return 404
        task_obj = get_object_or_404(models.TaskModel, id=task_id)

        # Partial update using the serializer
        serializer = serializers.TaskSerializer(task_obj, data={'is_completed': True}, partial=True)
        if serializer.is_valid():
            serializer.save()  # Save the changes
            return Response(serializer.data, status=status.HTTP_200_OK)

        # Return validation errors
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        




