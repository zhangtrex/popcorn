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
            ORDER BY count(Comment.mid) DESC;
        """)
            row = cursor.fetchall()
            res = [{'mid': i[0], 'name': i[1], 'description': i[2], 'heat':i[3]} for i in row]
            return Response(res)
