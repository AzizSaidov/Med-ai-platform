import django_filters
from django.db.models import Q
from .models import DoctorProfile


class DoctorFilter(django_filters.FilterSet):
    search = django_filters.CharFilter(
        method="filter_search",
        label="Search"
    )
    specialization = django_filters.CharFilter(
        lookup_expr="icontains",
        label="Specialization"
    )
    status = django_filters.ChoiceFilter(
        choices=DoctorProfile.Status.choices,
        label="Status"
    )
    experience = django_filters.NumberFilter(
        label="Experience (years)"
    )

    class Meta:
        model = DoctorProfile
        fields = ["search", "specialization", "status", "experience"]

    def filter_search(self, queryset, name, value):
        if not value:
            return queryset

        return queryset.filter(
            Q(user__first_name__icontains=value) |
            Q(user__last_name__icontains=value) |
            Q(user__email__icontains=value) |
            Q(specialization__icontains=value) |
            Q(address__icontains=value) |
            Q(bio__icontains=value)
        )