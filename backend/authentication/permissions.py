"""
NutriGrad-MatriCare - Role-Based Access Control Permissions.
"""

from rest_framework import permissions


class IsAdminRole(permissions.BasePermission):
    """Allows access only to users with the ADMIN role or superusers."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role == 'ADMIN' or request.user.is_superuser)
        )


class IsDoctorOrAdmin(permissions.BasePermission):
    """Allows access to Doctors and Admins."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in ['DOCTOR', 'ADMIN'] or request.user.is_superuser)
        )


class IsClinicianOrAbove(permissions.BasePermission):
    """Allows access to any authenticated clinician, doctor, or admin."""
    def has_permission(self, request, view):
        return bool(
            request.user and
            request.user.is_authenticated and
            (request.user.role in ['CLINICIAN', 'DOCTOR', 'ADMIN'] or request.user.is_superuser)
        )


class IsDoctorOrReadOnly(permissions.BasePermission):
    """Allows safe methods (GET, HEAD, OPTIONS) for all authenticated, modifications for Doctors/Admins."""
    def has_permission(self, request, view):
        if not (request.user and request.user.is_authenticated):
            return False
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user.role in ['DOCTOR', 'ADMIN'] or request.user.is_superuser
