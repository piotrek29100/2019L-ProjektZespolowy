# Generated by Django 2.1.8 on 2019-05-25 13:17

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('publications', '0015_auto_20190523_2113'),
    ]

    operations = [
        migrations.AlterField(
            model_name='annotation',
            name='annotations_used',
            field=models.ManyToManyField(related_name='_annotation_annotations_used_+', to='publications.Annotation'),
        ),
    ]
