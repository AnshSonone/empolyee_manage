# Generated by Django 5.1.3 on 2024-11-16 11:35

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0003_rename_leave_granted_leavemodel_leave_status'),
    ]

    operations = [
        migrations.AddField(
            model_name='usermodel',
            name='date_of_birth',
            field=models.CharField(default='01-01-2001', max_length=50),
            preserve_default=False,
        ),
    ]