# Generated by Django 5.1.3 on 2024-11-18 16:23

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0006_alter_leavemodel_end_leave_date'),
    ]

    operations = [
        migrations.AlterField(
            model_name='usermodel',
            name='date_of_birth',
            field=models.CharField(blank=True, max_length=50, null=True),
        ),
    ]
