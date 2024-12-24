from django.core.mail import EmailMultiAlternatives
from django.template.loader import render_to_string
from django.utils.html import strip_tags
from django.conf import settings

def send_activation_email(recipient_email, activation_url):
    subject = 'Activate your account on '+settings.SITE_NAME
    from_email = settings.EMAIL_HOST_USER
    to = [recipient_email]

    
    html_content = render_to_string('account/activation_email.html', {'activation_url': activation_url})

    # Create the email body with both HTML and plain text versions
    text_content = strip_tags(html_content)
    emaii = EmailMultiAlternatives(subject, text_content, from_email, to)
    emaii.attach_alternative(html_content, 'text/html')
    emaii.send()


def send_forgot_password_email(recipient_email, forgot_url):
    subject = 'Recover your account by changing password '+settings.SITE_NAME
    from_email = settings.EMAIL_HOST_USER
    to = [recipient_email]

    html_content = render_to_string('account/forgot_email.html', {'forgot_url': forgot_url})

    # Create the email body with both HTML and plain text versions
    text_content = strip_tags(html_content)
    emaii = EmailMultiAlternatives(subject, text_content, from_email, to)
    emaii.attach_alternative(html_content, 'text/html')
    emaii.send()
    
def send_notify_email(recipant_email):
    subject = 'Login activity detectded on your account ' +settings.SITE_NAME
    from_email = settings.EMAIL_HOST_USER
    to = [recipant_email]
    
    html_content = render_to_string('account/login_activity.html')
    text_content = strip_tags(html_content)
    email = EmailMultiAlternatives(subject, text_content, from_email, to)
    email.attach_alternative(html_content, 'text/html')
    email.send()