# Generated by Django 5.1.3 on 2024-11-19 09:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0007_alter_usermodel_date_of_birth'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermodel',
            name='createdat',
            field=models.DateTimeField(auto_now_add=True),
        ),
        migrations.AlterField(
            model_name='usermodel',
            name='last_login',
            field=models.DateTimeField(blank=True, null=True, verbose_name='last login'),
        ),
    ]
