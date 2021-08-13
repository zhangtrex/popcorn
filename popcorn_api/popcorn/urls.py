from django.urls import path, include

from . import views

urlpatterns = [
  path('movies/', views.MovieView.as_view()),
  path('movie/<int:mid>', views.MovieSingleView.as_view()),
  path('genres/', views.GenreView.as_view()),
  path('auth/', include('djoser.urls')),
  path('auth/', include('djoser.urls.authtoken')),
  path('newmovierequest/', views.NewMovieRequestView.as_view()),
  path('deletemovierequest/<int:nid>', views.DeleteMovieRequestView.as_view()),
  path('rejectmovierequest/<int:nid>', views.RejectMovieRequestView.as_view()),
  path('approvemovierequest/<int:nid>', views.ApproveMovieRequest.as_view()),
  path('movies/most_popular/', views.MoviePopularView.as_view()),
  path('movies/genre/<int:gid>', views.MovieGenreView.as_view()),
  path('movie/avg_star/<int:mid>', views.MovieAvgStarsView.as_view()),
  path('comments/<int:mid>', views.MovieCommentsView.as_view()),
  path('new_comment/', views.NewCommentView.as_view()),
  path('delete_comment/<int:cid>', views.DeleteCommentView.as_view()),
  path('getuserinfo/', views.GetUserInfoView.as_view()),
  path('new_movie_rating/', views.NewMovieRatingView.as_view())