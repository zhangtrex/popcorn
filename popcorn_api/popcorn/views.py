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

from django.db import connection


class MovieView(
  APIView, 
  UpdateModelMixin,
  DestroyModelMixin, 
):

  def get(self, request, id=None):
    queryset = Movie.objects.all()
    read_serializer = MovieSerializer(queryset, many=True)
    return Response(read_serializer.data)

class MovieSingleView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):

  def get(self, request, id=None, *args, **kwargs):
    queryset = Movie.objects.filter(mid=kwargs['mid'])
    read_serializer = MovieSerializer(queryset, many=True)
    return Response(read_serializer.data[0])

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

class MovieAvgStarsView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):
  def get(self, request, id=None, *args, **kwargs):
    queryset = MovieRating.objects.filter(mid=kwargs['mid'])
    read_serializer = MovieRatingSerializer(queryset, many=True)
    total_stars = 0
    for rating_row in read_serializer.data:
      total_stars += rating_row['stars']

    if total_stars:
      return Response(total_stars / len(read_serializer.data))
    else:
      return Response(0)

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
    request.data['uid'] = request.user.uid
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
    read_serializer = CommentNestingUserSerializer(queryset, many=True)
    return Response(read_serializer.data)


class NewCommentView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):
  permission_classes = [permissions.IsAuthenticated]

  def post(self, request, id=None):
    request.data['uid'] = request.user.uid
    serializer = CommentSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class DeleteCommentView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):

  def delete(self, request, id=None, *args, **kwargs):
    queryset = User.objects.filter(uid=request.user.uid).first()
    read_serializer = UserCreateSerializer(queryset)
    is_admin = read_serializer.data['accessLevel'] == 1

    comment_object = Comment.objects.get(cid=kwargs['cid'])

    if is_admin or request.user.uid == comment_object.uid.uid:
      comment_object.delete()
      return Response(status=status.HTTP_200_OK)
    return Response(status=status.HTTP_403_FORBIDDEN)


class NewMovieRatingView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):
  permission_classes = [permissions.IsAuthenticated]

  def post(self, request, id=None):
    request.data['uid'] = request.user.uid
    serializer = MovieRatingSerializer(data=request.data)
    if serializer.is_valid():
      serializer.save()
      return Response(serializer.data, status=status.HTTP_201_CREATED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
    

class MoviePopularView(
    APIView,
    UpdateModelMixin,
    DestroyModelMixin
):
    def get(self, request):
        with connection.cursor() as cursor:
            cursor.execute("""
            SELECT Movie.mid, Movie.name, Movie.description, count(Comment.uid) FROM Comment
            JOIN Movie
            WHERE Movie.mid = Comment.mid
            AND Comment.created > DATE_SUB(CURDATE(), INTERVAL 30 DAY)
            GROUP By Movie.mid
            ORDER BY count(Comment.uid) DESC;
        """)
            row = cursor.fetchall()
            res = [{'mid': i[0], 'name': i[1], 'description': i[2], 'heat':i[3]} for i in row]
            return Response(res)

