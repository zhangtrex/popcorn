# Generated by Django 3.1.3 on 2021-06-14 23:34

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('popcorn', '0004_comment'),
    ]

    operations = [
        migrations.CreateModel(
            name='Genre',
            fields=[
                ('gid', models.AutoField(primary_key=True, serialize=False)),
                ('genre', models.CharField(max_length=45, unique=True)),
            ],
            options={
                'db_table': 'genre',
                'managed': False,
            },
        ),
    ]
