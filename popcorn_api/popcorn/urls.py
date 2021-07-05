from django.urls import path, include

from . import views

urlpatterns = [
  path('movies/', views.MovieView.as_view()),
  path('genres/', views.GenreView.as_view()),
  path('auth/', include('djoser.urls')),
  path('auth/', include('djoser.urls.authtoken')),
  path('newmovierequest/', views.NewMovieRequestView.as_view()),
  path('movies/genre/<int:gid>', views.MovieGenreView.as_view()),
  path('comments/<int:mid>', views.MovieCommentsView.as_view())
]