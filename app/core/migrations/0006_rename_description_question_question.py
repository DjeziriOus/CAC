# Generated by Django 3.2.25 on 2024-11-21 00:00

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('core', '0005_auto_20241120_2353'),
    ]

    operations = [
        migrations.RenameField(
            model_name='question',
            old_name='description',
            new_name='question',
        ),
    ]
