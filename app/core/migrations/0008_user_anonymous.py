# Generated by Django 3.2.25 on 2024-11-21 00:22

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0007_alter_question_state'),
    ]

    operations = [
        migrations.AddField(
            model_name='user',
            name='anonymous',
            field=models.BooleanField(default=False),
        ),
    ]
