from django.urls import path, include

from . import views

urlpatterns = [
  path('movies/', views.MovieView.as_view()),
  path('auth/', include('djoser.urls')),
  path('auth/', include('djoser.urls.authtoken')),
  path('newmovierequest/', views.NewMovieRequestView.as_view())
]