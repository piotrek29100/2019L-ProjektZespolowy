# Generated by Django 2.1.8 on 2019-05-23 21:12

import django.contrib.postgres.fields
from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publications', '0013_auto_20190523_2101'),
    ]

    operations = [
        migrations.AddField(
            model_name='annotation',
            name='tags',
            field=django.contrib.postgres.fields.ArrayField(base_field=models.CharField(max_length=64), default=[], size=None),
            preserve_default=False,
        ),
    ]
