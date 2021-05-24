from rest_framework import serializers

from .models import Movie


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
      'id',
      'name',
      'description'
    )