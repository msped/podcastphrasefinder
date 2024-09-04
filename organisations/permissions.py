from rest_framework import permissions

from .models import Membership


class IsOrgOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.podcast.membership_set.filter(user=request.user, role='Owner').exists()


class IsOrgAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.podcast.membership_set.filter(user=request.user, role='Admin').exists()


class IsOrgMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        return obj.podcast.membership_set.filter(user=request.user, role='Member').exists()
