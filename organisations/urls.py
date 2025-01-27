from django.urls import path
from .views import (
    PodcastListCreateView,
    MembershipListCreateView,
    MembershipDetailView,
    UserOrgSelectionView,
    PodcastDetailView,
    TransferOwnershipView,
    ConfirmDeletePodcastView,
    ConfirmTransferPodcastView
)

urlpatterns = [
    path('podcasts', PodcastListCreateView.as_view(), name='podcast-list-create'),
    path('podcasts/<slug:slug>',  PodcastDetailView.as_view(), name='podcast-detail'),
    path('memberships/user', UserOrgSelectionView.as_view(),
         name='user-org-selection'),
    path('memberships', MembershipListCreateView.as_view(), name='membership-list'),
    path('memberships/<int:id>',
         MembershipDetailView.as_view(), name='membership-detail'),
    path('podcasts/<slug:slug>/transfer', TransferOwnershipView.as_view(),
         name='transfer-ownership'),
    path('podcasts/<slug:slug>/confirm/delete/<str:token>',
         ConfirmDeletePodcastView.as_view(), name='confirm-delete-podcast'),
    path('podcasts/<slug:slug>/confirm/transfer/<str:token>',
         ConfirmTransferPodcastView.as_view(), name='confirm-transfer-podcast'),
]
