# ── serializers.py ──
from rest_framework import serializers
from .models import Image

class ImageSerializer(serializers.ModelSerializer):
    image_url = serializers.SerializerMethodField()

    class Meta:
        model  = Image
        fields = [
            'id',
            'filename',
            'size',
            'label',
            'timestamp',
            'width',
            'height',
            'image_url'
        ]
        read_only_fields = fields

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None


class ImageUploadSerializer(serializers.ModelSerializer):
    class Meta:
        model  = Image
        fields = ['image']

    def validate_image(self, file):
        allowed = ['image/jpeg', 'image/png', 'image/webp', 'image/gif']
        if file.content_type not in allowed:
            raise serializers.ValidationError(
                "Unsupported file type. Use JPG, PNG, WebP, or GIF."
            )
        return file