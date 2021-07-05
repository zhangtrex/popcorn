from typing import AbstractSet
from django.db import models
from django.contrib.auth.models import AbstractUser

# Create your models here.

class User(AbstractUser):
    uid = models.AutoField(primary_key=True, db_column='uid')
    username = models.CharField(null=False, blank=False, unique=True, max_length=45)
    lastLogin = models.DateTimeField(default=None, null=True)
    isBlocked = models.BooleanField(default=False)
    isDeleted = models.BooleanField(default=False)
    accessLevel = models.IntegerField(default=0)

    class Meta:
        db_table = 'User'

class NewMovieRequest(models.Model):
    nid = models.AutoField(primary_key=True, db_column='nid')
    uid = models.ForeignKey('User', models.DO_NOTHING, db_column='uid')
    movieName = models.CharField(unique=True, max_length=150) 
    description = models.CharField(max_length=500, default=None)
    reason = models.CharField(max_length=200, default=None)
    status = models.IntegerField(default=0, blank=True, null=True)

    class Meta:
        db_table = 'NewMovieRequest'

class Movie(models.Model):
    mid = models.AutoField(primary_key=True, db_column='mid')
    name = models.TextField(max_length=200, null=False, blank=False)
    description = models.TextField()

    class Meta:
        db_table = 'Movie'

class Comment(models.Model):
    cid = models.AutoField(primary_key=True, db_column='cid')
    uid = models.ForeignKey('User', models.DO_NOTHING, db_column='uid')
    mid = models.ForeignKey('Movie', models.DO_NOTHING, db_column='mid')
    content = models.CharField(max_length=200)
    created = models.DateTimeField()
    lastupdated = models.DateTimeField()
    isdeleted = models.IntegerField(default=0)

    class Meta:
        db_table = 'Comment'

class Genre(models.Model):
    gid = models.AutoField(primary_key=True, db_column='gid')
    genre = models.CharField(unique=True, max_length=45)

    class Meta:
        db_table = 'Genre'

class MovieGenre(models.Model):
    mid = models.ForeignKey(Movie, models.DO_NOTHING, db_column='mid')
    gid = models.ForeignKey(Genre, models.DO_NOTHING, db_column='gid')

    class Meta:
        db_table = 'MovieGenre'
        unique_together = (("mid", "gid"),)

class MovieRating(models.Model):
    rid = models.AutoField(primary_key=True, db_column='rid')
    stars = models.IntegerField()
    uid = models.ForeignKey('User', models.DO_NOTHING, db_column='uid')
    mid = models.ForeignKey('Movie', models.DO_NOTHING, db_column='mid')
    isdeleted = models.IntegerField()

    class Meta:
        db_table = 'MovieRating'