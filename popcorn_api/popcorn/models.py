from typing import AbstractSet
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    uid = models.AutoField(primary_key=True)
    username = models.CharField(null=False, blank=False, unique=True, max_length=45)
    lastLogin = models.DateTimeField(default=None, null=True)
    isBlocked = models.BooleanField(default=False)
    isDeleted = models.BooleanField(default=False)
    accessLevel = models.IntegerField(default=0)

    class Meta:
        db_table = 'User'

class NewMovieRequest(models.Model):
    nid = models.AutoField(primary_key=True)
    uid = models.ForeignKey('User', models.DO_NOTHING, db_column='uid', default=-1)
    movieName = models.CharField(unique=True, max_length=150) 
    description = models.CharField(max_length=500, default=None)
    reason = models.CharField(max_length=200, default=None)
    status = models.IntegerField(default=0, blank=True, null=True)

    class Meta:
        db_table = 'NewMovieRequest'

class Movie(models.Model):
    mid = models.AutoField(primary_key=True)
    name = models.TextField(max_length=200, null=False, blank=False)
    description = models.TextField()

    class Meta:
        db_table = 'Movie'

class Comment(models.Model):
    cid = models.AutoField(primary_key=True)
    uid = models.ForeignKey('User', models.DO_NOTHING, db_column='uid')
    mid = models.ForeignKey('Movie', models.DO_NOTHING, db_column='mid')
    content = models.CharField(max_length=200)
    created = models.DateTimeField()
    lastupdated = models.DateTimeField(db_column='lastUpdated')  # Field name made lowercase.
    isdeleted = models.IntegerField(db_column='isDeleted', default=0)  # Field name made lowercase.

    class Meta:
        db_table = 'Comment'

class Genre(models.Model):
    gid = models.AutoField(primary_key=True)
    genre = models.CharField(unique=True, max_length=45)

    class Meta:
        db_table = 'Genre'

class Moviegenre(models.Model):
    mid = models.OneToOneField(Movie, models.DO_NOTHING, db_column='mid', primary_key=True)
    gid = models.ForeignKey(Genre, models.DO_NOTHING, db_column='gid',default=-1)

    class Meta:
        db_table = 'moviegenre'

class Movierating(models.Model):
    rid = models.AutoField(primary_key=True)
    stars = models.IntegerField()
    uid = models.ForeignKey('User', models.DO_NOTHING, db_column='uid',default=-1)
    mid = models.ForeignKey('Movie', models.DO_NOTHING, db_column='mid',default=-1)
    isdeleted = models.IntegerField(db_column='isDeleted')  # Field name made lowercase.

    class Meta:
        db_table = 'movierating'