from rest_framework import viewsets
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User
from .models import Post
from .serializers import PostSerializer


class PostViewSet(viewsets.ModelViewSet):
    serializer_class = PostSerializer
    permission_classes = [AllowAny]  # 🔥 Removed authentication for now

    def get_queryset(self):
        return Post.objects.all().order_by("-updated_at")

    def perform_create(self, serializer):
        # 🔥 Temporary default user (for development)
        user, created = User.objects.get_or_create(username="demo_user")
        serializer.save(author=user)

    @action(detail=True, methods=['post'])
    def publish(self, request, pk=None):
        post = self.get_object()
        post.status = "published"
        post.save()
        return Response({"status": "Post published"})