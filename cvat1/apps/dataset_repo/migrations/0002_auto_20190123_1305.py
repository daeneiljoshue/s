# Generated by Django 2.1.3 on 2019-01-23 10:05

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('dataset_repo', '0001_initial'),
    ]

    replaces = [('git', '0002_auto_20190123_1305')]

    operations = [
        migrations.AlterField(
            model_name='gitdata',
            name='status',
            field=models.CharField(default='!sync', max_length=20),
        ),
    ]
