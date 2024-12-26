from rest_framework import permissions


def _get_podcast_or_channel(obj):
    return getattr(
        obj, 'podcast',
        getattr(obj, 'channel',
                getattr(getattr(obj, 'episode', None),
                        'channel', None)))


class IsOrgOwner(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        podcast_or_channel = _get_podcast_or_channel(obj)
        if podcast_or_channel is None:
            return False
        return podcast_or_channel.membership_set.filter(user=request.user, role='Owner').exists()


class IsOrgAdmin(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True

        podcast_or_channel = _get_podcast_or_channel(obj)
        if podcast_or_channel is None:
            return False
        return podcast_or_channel.membership_set.filter(user=request.user, role='Admin').exists()


class IsOrgMember(permissions.BasePermission):
    def has_object_permission(self, request, view, obj):
        if request.method in permissions.SAFE_METHODS:
            return True
        podcast_or_channel = _get_podcast_or_channel(obj)
        if podcast_or_channel is None:
            return False
        return podcast_or_channel.membership_set.filter(user=request.user, role='Member').exists()
