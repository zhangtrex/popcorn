from django.db.models import query
from rest_framework import permissions
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin
from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework import status
from rest_framework.response import Response
from djoser.serializers import UserCreateSerializer, UserSerializer
from django.contrib.auth.models import AbstractUser

from rest_framework.pagination import PageNumberPagination
from django.core.paginator import Paginator, PageNotAnInteger, EmptyPage,InvalidPage

from .models import *
from .serializers import *

from django.db import connection

class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100
    page_size_query_param = 'page_size'
    max_page_size = 1000


class MovieView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):
    def get(self, request, id=None):
      queryset = Movie.objects.all()
      name = self.request.query_params.get('name')
      gid = self.request.query_params.get('gid')
      if name is not None:
        queryset = queryset.filter(name__icontains=name)
      if gid is not None:
        queryset = queryset.filter(moviegenre__gid=gid)
      pg = StandardResultsSetPagination()
      page_roles = pg.paginate_queryset(queryset=queryset,request=request,view=self)
      read_serializer = MovieSerializer(instance=page_roles, many=True)
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
    pg = StandardResultsSetPagination()
    page_roles = pg.paginate_queryset(queryset=queryset,request=request,view=self)
    read_serializer = MovieSerializer(instance=page_roles, many=True)
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

  def get(self, request):
    queryset = User.objects.filter(uid=request.user.uid).first()
    read_serializer = UserCreateSerializer(queryset)
    is_admin = read_serializer.data['accessLevel'] == 1

    if is_admin:
      getRequestsQuery = NewMovieRequest.objects.filter(status=0)
    else:
      getRequestsQuery = NewMovieRequest.objects.filter(uid=request.user.uid)

    requests_read_serializer = NewMovieRequestSerializer(getRequestsQuery, many=True)

    return Response(requests_read_serializer.data)


class ApproveMovieRequest(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):
  permission_classes = [permissions.IsAuthenticated]

  def patch(self, request, id=None, *args, **kwargs):
    is_admin = request.user.accessLevel == 1

    if not is_admin:
      return Response(status=status.HTTP_403_FORBIDDEN)

    queryset = NewMovieRequest.objects.get(nid=kwargs['nid'])
    queryset.status = 1
    queryset.save(update_fields=['status'])

    # Insert a new movie
    new_movie_data = {"name": queryset.movieName, "description": queryset.description}
    serializer = MovieSerializer(data=new_movie_data)
    if serializer.is_valid():
      serializer.save()
      return Response(status=status.HTTP_200_OK)
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

class DeleteMovieRequestView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):

  def delete(self, request, id=None, *args, **kwargs):
    myquery = NewMovieRequest.objects.filter(nid=kwargs['nid'])
    read_serializer2 = NewMovieRequestSerializer(myquery, many=True)
    movie_request_uid = read_serializer2.data[0]['uid']

    if movie_request_uid != request.user.uid:
      return Response(status=status.HTTP_403_FORBIDDEN)

    movie_object = NewMovieRequest.objects.get(nid=kwargs['nid'])
    movie_object.delete()
    return Response(status=status.HTTP_200_OK)


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
        query_set = Movie.objects.all()
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
            # return Response(res)
            paginator = Paginator(res, 25)
            page = request.data['page']
            contacts = paginator.get_page(page)
            return Response(contacts)


class RejectMovieRequestView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):
  permission_classes = [permissions.IsAuthenticated]

  def patch(self, request, id=None, *args, **kwargs):
    is_admin = request.user.accessLevel == 1

    if not is_admin:
      return Response(status=status.HTTP_403_FORBIDDEN)

    queryset = NewMovieRequest.objects.get(nid=kwargs['nid'])
    queryset.status = 2
    queryset.save(update_fields=['status'])
    return Response(status=status.HTTP_200_OK)


class GetUserInfoView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):
  permission_classes = [permissions.IsAuthenticated]
  def get(self, request, id=None, *args, **kwargs):
    return Response({'uid': request.user.uid, 'username': request.user.username,
                     'accesslevel': request.user.accessLevel
                     }, status=status.HTTP_200_OK)


class DeleteCommentView(
  APIView,
  UpdateModelMixin,
  DestroyModelMixin,
):
  permission_classes = [permissions.IsAuthenticated]
  def delete(self, request, id=None, *args, **kwargs):
    is_admin = request.user.accessLevel == 1

    comment_object = Comment.objects.get(cid=kwargs['cid'])

    if is_admin or request.user.uid == comment_object.uid.uid:
      comment_object.delete()
      return Response(status=status.HTTP_200_OK)

    return Response(status=status.HTTP_403_FORBIDDEN)
