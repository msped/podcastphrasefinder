from django.urls import path
from .views import PodcastListCreateView, MembershipListCreateView, MembershipDetailView

urlpatterns = [
    path('', PodcastListCreateView.as_view(),
         name='podcast-list-create'),
    path('memberships', MembershipListCreateView.as_view(),
         name='membership-list-create'),
    path('memberships/<str:username>', MembershipDetailView.as_view(),
         name='membership-detail'),
]
