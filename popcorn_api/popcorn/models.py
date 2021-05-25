from django.db import models

# Create your models here.

class Movie(models.Model):
    id = models.AutoField(primary_key=True)
    name = models.TextField(max_length=200, null=False, blank=False)
    description = models.TextField()

    class Meta:
        db_table = 'Movies'