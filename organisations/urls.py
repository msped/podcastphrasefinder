from django.urls import path
from .views import (
    PodcastListCreateView,
    MembershipListCreateView,
    MembershipDetailView,
    UserOrgSelectionView,
)

urlpatterns = [
    path('podcasts', PodcastListCreateView.as_view(), name='podcast-list-create'),
    path('memberships/user', UserOrgSelectionView.as_view(),
         name='user-org-selection'),
    path('memberships', MembershipListCreateView.as_view(), name='membership-list'),
    path('memberships/<int:id>',
         MembershipDetailView.as_view(), name='membership-detail'),
]
