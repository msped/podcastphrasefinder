from django.urls import path
from .views import (
    PodcastListCreateView,
    MembershipListCreateView,
    MembershipDetailView,
    UserOrgSelectionView,
    PodcastDetailView,
    TransferOwnershipView
)

urlpatterns = [
    path('podcasts', PodcastListCreateView.as_view(), name='podcast-list-create'),
    path('podcasts/<slug:slug>',  PodcastDetailView.as_view(), name='podcast-detail'),
    path('memberships/user', UserOrgSelectionView.as_view(),
         name='user-org-selection'),
    path('memberships', MembershipListCreateView.as_view(), name='membership-list'),
    path('memberships/<int:id>',
         MembershipDetailView.as_view(), name='membership-detail'),
    path('podcasts/transfer/ownership', TransferOwnershipView.as_view(),
         name='transfer-ownership')
]
