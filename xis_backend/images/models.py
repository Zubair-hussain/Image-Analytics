# ── models.py ──
from django.db import models

class Image(models.Model):
    filename  = models.CharField(max_length=255)
    size      = models.FloatField(help_text="Size in KB")
    label     = models.CharField(max_length=100, db_index=True)
    timestamp = models.DateTimeField(auto_now_add=True, db_index=True)

    width     = models.PositiveIntegerField(default=0)
    height    = models.PositiveIntegerField(default=0)

    image     = models.ImageField(upload_to='uploads/', null=True, blank=True)

    class Meta:
        ordering = ['-timestamp']
        indexes = [
            models.Index(fields=['label']),
            models.Index(fields=['timestamp']),
        ]

    def __str__(self):
        return f"{self.filename} ({self.label})"