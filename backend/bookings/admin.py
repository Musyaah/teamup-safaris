from urllib.parse import quote

from django.contrib import admin
from django.utils.html import format_html

from .models import Booking

admin.site.site_header = "Teamup Safaris"
admin.site.site_title = "Teamup Safaris admin"
admin.site.index_title = "Bookings and enquiries"


def whatsapp_number(phone):
    """Turn 0702 049 587 or +254 702 049 587 into 254702049587 for wa.me links."""
    digits = "".join(ch for ch in phone if ch.isdigit())
    if digits.startswith("00"):
        digits = digits[2:]
    if digits.startswith("0"):
        digits = "254" + digits[1:]
    elif len(digits) == 9 and digits[0] in "17":
        digits = "254" + digits
    return digits


@admin.register(Booking)
class BookingAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "name",
        "service",
        "trip",
        "travel_date",
        "passengers",
        "status_badge",
        "contact",
        "created_at",
    )
    list_display_links = ("id", "name")
    list_filter = ("status", "service", "travel_date")
    search_fields = ("name", "email", "phone", "pickup_location", "destination")
    date_hierarchy = "created_at"
    list_per_page = 25
    readonly_fields = ("created_at",)
    actions = ["mark_confirmed", "mark_completed", "mark_cancelled"]

    fieldsets = (
        ("Customer", {"fields": ("name", "email", "phone")}),
        (
            "Trip",
            {
                "fields": (
                    "service",
                    "pickup_location",
                    "destination",
                    "travel_date",
                    "passengers",
                    "notes",
                )
            },
        ),
        ("Status", {"fields": ("status", "created_at")}),
    )

    @admin.display(description="Trip")
    def trip(self, obj):
        parts = [p for p in (obj.pickup_location, obj.destination) if p]
        return " \u2192 ".join(parts) or "\u2014"

    @admin.display(description="Status", ordering="status")
    def status_badge(self, obj):
        return format_html(
            '<span class="epic-badge epic-badge--{}">{}</span>',
            obj.status,
            obj.get_status_display(),
        )

    @admin.display(description="Reply")
    def contact(self, obj):
        message = (
            f"Hello {obj.name}, thank you for contacting Teamup Safaris "
            f"about {obj.get_service_display()}. "
        )
        whatsapp = f"https://wa.me/{whatsapp_number(obj.phone)}?text={quote(message)}"
        return format_html(
            '<a class="epic-pill" href="{}" target="_blank" rel="noopener">WhatsApp</a> '
            '<a class="epic-pill epic-pill--ghost" href="tel:{}">Call</a> '
            '<a class="epic-pill epic-pill--ghost" href="mailto:{}">Email</a>',
            whatsapp,
            obj.phone,
            obj.email,
        )

    @admin.action(description="Mark selected bookings as confirmed")
    def mark_confirmed(self, request, queryset):
        updated = queryset.update(status="confirmed")
        self.message_user(request, f"{updated} booking(s) marked as confirmed.")

    @admin.action(description="Mark selected bookings as completed")
    def mark_completed(self, request, queryset):
        updated = queryset.update(status="completed")
        self.message_user(request, f"{updated} booking(s) marked as completed.")

    @admin.action(description="Mark selected bookings as cancelled")
    def mark_cancelled(self, request, queryset):
        updated = queryset.update(status="cancelled")
        self.message_user(request, f"{updated} booking(s) marked as cancelled.")