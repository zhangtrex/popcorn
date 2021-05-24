from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.mixins import UpdateModelMixin, DestroyModelMixin

from .models import Movie
from .serializers import MovieSerializer


class PopcornView(
  APIView, 
  UpdateModelMixin,
  DestroyModelMixin, 
):

  def get(self, request, id=None):
    queryset = Movie.objects.all()
    read_serializer = MovieSerializer(queryset, many=True)
    return Response(read_serializer.data)

