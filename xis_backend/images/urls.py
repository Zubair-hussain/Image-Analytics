# ── images/urls.py ──
from django.urls import path
from .views import (
    ImageListView,
    ImageUploadView,
    ImageCountView,
    GroupByLabelView,
    GroupByDayView,
)

urlpatterns = [
    path('',                ImageListView.as_view(),    name='image-list'),
    path('upload/',         ImageUploadView.as_view(),  name='image-upload'),
    path('count/',          ImageCountView.as_view(),   name='image-count'),
    path('group-by-label/', GroupByLabelView.as_view(), name='group-by-label'),
    path('group-by-day/',   GroupByDayView.as_view(),   name='group-by-day'),
]