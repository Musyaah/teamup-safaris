from rest_framework import serializers
from django.utils import timezone

from .models import Booking


class BookingSerializer(serializers.ModelSerializer):
    class Meta:
        model = Booking
        fields = "__all__"
        read_only_fields = ["id", "status", "created_at"]

    def validate_travel_date(self, value):
        # The date is optional, so only check it when one was given.
        if value is not None and value < timezone.localdate():
            raise serializers.ValidationError(
                "Travel date cannot be in the past."
            )
        return value

    def validate_passengers(self, value):
        if not 1 <= value <= 100:
            raise serializers.ValidationError(
                "Passengers must be between 1 and 100."
            )
        return value
