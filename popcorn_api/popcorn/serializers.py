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
  

class UserCreateSerializer(UserCreateSerializer):
  class Meta(UserCreateSerializer.Meta):
    model = User
    fields = ('username', 'password')

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