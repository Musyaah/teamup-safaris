from django.db import models


class Booking(models.Model):
    # The first value is what the website sends; the second is what you see in admin.
    SERVICE_CHOICES = [
        ("airport-transfer", "Airport Transfers"),
        ("hotel-transfer", "Hotel Transfers"),
        ("game-drive", "Game Drives & Safaris"),
        ("personal-chauffeur", "Personal Chauffeur"),
        ("tours-excursions", "Tours & Excursions"),
        ("custom-travel-planning", "Custom Travel Planning"),
        ("accommodation", "Accommodation Enquiry"),
    ]

    STATUS_CHOICES = [
        ("pending", "Pending"),
        ("confirmed", "Confirmed"),
        ("completed", "Completed"),
        ("cancelled", "Cancelled"),
    ]

    name = models.CharField(max_length=150)
    email = models.EmailField()
    phone = models.CharField(max_length=20)

    service = models.CharField(
        max_length=50,
        choices=SERVICE_CHOICES,
    )

    # Optional: a safari enquiry may not have a pickup point yet,
    # and a custom-planning enquiry may not have a destination yet.
    pickup_location = models.CharField(max_length=255, blank=True)
    destination = models.CharField(max_length=255, blank=True)

    # Optional: some people are still deciding on dates.
    travel_date = models.DateField(null=True, blank=True)
    passengers = models.PositiveIntegerField(default=1)
    notes = models.TextField(blank=True)

    status = models.CharField(
        max_length=20,
        choices=STATUS_CHOICES,
        default="pending",
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.name} - {self.get_service_display()}"

    class Meta:
        ordering = ["-created_at"]
