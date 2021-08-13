from rest_framework import serializers
from django.contrib.auth.hashers import make_password
from djoser.serializers import UserCreateSerializer, UserSerializer

from .models import *

class MovieSerializer(serializers.ModelSerializer):
  name = serializers.CharField(max_length=200, required=True)

  def create(self, validated_data):
    return Movie.objects.create(
      name=validated_data.get('name')
    )

  def update(self, instance, validated_data):
    instance.name = validated_data.get('name', instance.name)
    instance.save()
    return instance

  class Meta:
    model = Movie
    fields = (
      'mid',
      'name',
      'description'
    )


class GenreSerializer(serializers.ModelSerializer):
  genre = serializers.CharField(max_length=45, required=True)
  class Meta:
    model = Genre
    fields = (
      'gid',
      'genre'
    )
  

class UserCreateSerializer(serializers.ModelSerializer):
  class Meta:
    model = User
    fields = ('username', 'password', 'accessLevel')

class NewMovieRequestSerializer(serializers.ModelSerializer):
  def create(self, validated_data):
    return NewMovieRequest.objects.create(
      uid = validated_data.get('uid'),
      movieName = validated_data.get('movieName'),
      description = validated_data.get('description'),
      reason = validated_data.get('reason'),
    )
  
  class Meta:
    model = NewMovieRequest
    fields = (
      'nid',
      'uid',
      'movieName',
      'description',
      'reason',
    )

class CommentNestingUserSerializer(serializers.ModelSerializer):
  def create(self, validated_data):
    return Comment.objects.create(
      uid = validated_data.get('uid'),
      mid = validated_data.get('mid'),
      content = validated_data.get('content'),
      isdeleted = False,
    )

  uid = UserSerializer()
  class Meta:
    model = Comment
    fields = (
      'cid',
      'uid',
      'mid',
      'content',
      'created',
      'lastupdated',
      'isdeleted',
    )

class CommentSerializer(serializers.ModelSerializer):
  def create(self, validated_data):
    return Comment.objects.create(
      uid = validated_data.get('uid'),
      mid = validated_data.get('mid'),
      content = validated_data.get('content'),
      isdeleted = False,
    )

  class Meta:
    model = Comment
    fields = (
      'cid',
      'uid',
      'mid',
      'content',
      'created',
      'lastupdated',
      'isdeleted',
    )

class MovieRatingSerializer(serializers.ModelSerializer):

  def create(self, validated_data):
    return MovieRating.objects.create(
      uid = validated_data.get('uid'),
      mid = validated_data.get('mid'),
      stars = validated_data.get('stars'),
      isdeleted = False,
    )

  class Meta:
    model = MovieRating
    fields = (
      'rid',
      'uid',
      'mid',
      'stars',
      'isdeleted',
    )
