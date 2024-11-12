"""
Django admin customization.
"""

from django.contrib import admin
from django.contrib.auth.admin import UserAdmin as BaseUserAdmin
from django.utils.translation import gettext_lazy as _

from core import models


class UserAdmin(BaseUserAdmin):
    """Define the admin pages for users."""

    ordering = ['id']
    list_display = ['email', 'first_name', 'last_name', 'role', 'is_active', 'is_staff']
    list_filter = ['role', 'is_staff', 'is_superuser', 'is_active']
    search_fields = ['email', 'first_name', 'last_name', 'role']

    fieldsets = (
        (None, {'fields': ('email', 'password')}),
        (_('Personal Info'), {'fields': ('first_name', 'last_name', 'role')}),
        (
            _('Permissions'),
            {
                'fields': (
                    'is_active',
                    'is_staff',
                    'is_superuser',
                )
            }
        ),
        (_('Important dates'), {'fields': ('last_login',)}),
    )
    readonly_fields = ['last_login']

    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': (
                'email',
                'password1',
                'password2',
                'first_name',
                'last_name',
                'role',
                'is_active',
                'is_staff',
                'is_superuser',
            )
        }),
    )

    def get_queryset(self, request):
        """Filter user visibility based on the admin's role."""
        queryset = super().get_queryset(request)
        # Example: Restrict to non-superuser records for non-superuser admins
        if not request.user.is_superuser:
            queryset = queryset.filter(is_superuser=False)
        return queryset

    def has_delete_permission(self, request, obj=None):
        """Restrict delete permissions based on role."""
        if obj and obj.is_superuser and not request.user.is_superuser:
            return False  # Non-superusers cannot delete superusers
        return super().has_delete_permission(request, obj)

    def has_change_permission(self, request, obj=None):
        """Restrict change permissions based on role."""
        if obj and obj.is_superuser and not request.user.is_superuser:
            return False  # Non-superusers cannot edit superusers
        return super().has_change_permission(request, obj)


admin.site.register(models.User, UserAdmin)
