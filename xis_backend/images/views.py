# ── views.py ──
from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser

from django.db.models import Count
from django.db.models.functions import TruncDate

from .models import Image
from .serializers import ImageSerializer, ImageUploadSerializer
from .services import analyze_image

import os


# ── LIST ──
class ImageListView(generics.ListAPIView):
    serializer_class = ImageSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        qs = Image.objects.all()

        label     = self.request.query_params.get('label')
        date_from = self.request.query_params.get('date_from')
        date_to   = self.request.query_params.get('date_to')

        if label:
            qs = qs.filter(label=label)

        if date_from:
            qs = qs.filter(timestamp__date__gte=date_from)

        if date_to:
            qs = qs.filter(timestamp__date__lte=date_to)

        return qs

    def get_serializer_context(self):
        return {'request': self.request}

    def list(self, request, *args, **kwargs):
        queryset = self.get_queryset()

        page = self.paginate_queryset(queryset)
        if page is not None:
            serializer = self.get_serializer(page, many=True)
            paginated  = self.get_paginated_response(serializer.data)

            # rename "results" → "items"
            paginated.data['items'] = paginated.data.pop('results', [])
            return paginated

        serializer = self.get_serializer(queryset, many=True)
        return Response({
            'total': queryset.count(),
            'items': serializer.data
        })


# ── UPLOAD ──
class ImageUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes     = [MultiPartParser, FormParser]

    def post(self, request):
        serializer = ImageUploadSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        file = serializer.validated_data['image']

        # Analyze image
        try:
            meta = analyze_image(file)
        except Exception as e:
            return Response(
                {'error': f'Image analysis failed: {str(e)}'},
                status=status.HTTP_400_BAD_REQUEST
            )

        file.seek(0)

        img = Image.objects.create(
            filename=os.path.basename(file.name),
            size=meta.get('size_kb', 0),
            label=meta.get('label', 'Unknown'),
            width=meta.get('width', 0),
            height=meta.get('height', 0),
            image=file
        )

        return Response(
            ImageSerializer(img, context={'request': request}).data,
            status=status.HTTP_201_CREATED
        )


# ── COUNT ──
class ImageCountView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        return Response({
            'count': Image.objects.count()
        })


# ── GROUP BY LABEL ──
class GroupByLabelView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = (
            Image.objects
            .values('label')
            .annotate(count=Count('id'))
            .order_by('-count')
        )
        return Response(list(data))


# ── GROUP BY DAY ──
class GroupByDayView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        data = (
            Image.objects
            .annotate(date=TruncDate('timestamp'))
            .values('date')
            .annotate(count=Count('id'))
            .order_by('date')
        )

        return Response([
            {
                'date': str(item['date']),
                'count': item['count']
            }
            for item in data
        ])