from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response

from .models import *
from .serializers import *

class MovieView(
  APIView, 
  UpdateModelMixin,
  DestroyModelMixin, 
):

  def get(self, request, id=None):
    queryset = Movie.objects.all()
    read_serializer = MovieSerializer(queryset, many=True)
    return Response(read_serializer.data)

class GenreView(
  APIView, 
  UpdateModelMixin,
  DestroyModelMixin, 
):

  def get(self, request, id=None):
    queryset = Genre.objects.all()
    read_serializer = GenreSerializer(queryset, many=True)
    return Response(read_serializer.data)

class MovieGenreView(
  APIView, 
  UpdateModelMixin,
  DestroyModelMixin, 
):
  # Get the movies associated with a certain genre
  def get(self, request, id=None, *args, **kwargs):
    queryset = Movie.objects.filter(moviegenre__gid=kwargs['gid'])
    print(queryset)
    read_serializer = MovieSerializer(queryset, many=True)
    return Response(read_serializer.data)

class UserView(
  APIView, 
  UpdateModelMixin,
  DestroyModelMixin, 
):

  def post(self, request, id=None):
    queryset = User.objects.all()
    read_serializer = UserSerializer(queryset, many=True)
    return Response(read_serializer.data)


class NewMovieRequestView(
  APIView, 
  UpdateModelMixin,
  DestroyModelMixin, 
):
  permission_classes = [permissions.IsAuthenticated]

  def post(self, request, id=None):
    serializer = NewMovieRequestSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
  
class MovieCommentsView(
  APIView, 
  UpdateModelMixin,
  DestroyModelMixin,
):

  def get(self, request, id=None, *args, **kwargs):
    queryset = Comment.objects.filter(mid=kwargs['mid'])
    read_serializer = CommentSerializer(queryset, many=True)
    return Response(read_serializer.data)
    
