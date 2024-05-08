<<<<<<< HEAD
# Copyright (C) 2023 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from .models import Organization
from django.contrib import admin

class OrganizationAdmin(admin.ModelAdmin):
    model = Organization
    search_fields = ('slug', 'type')
    list_display = ('id', 'slug', 'name')

=======
# Copyright (C) 2023-2024 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from .models import Organization, Membership
from django.contrib import admin

class MembershipInline(admin.TabularInline):
    model = Membership
    extra = 0

    radio_fields = {
        'role': admin.VERTICAL,
    }

    autocomplete_fields = ('user', )

class OrganizationAdmin(admin.ModelAdmin):
    search_fields = ('slug', 'name', 'owner__username')
    list_display = ('id', 'slug', 'name')

    autocomplete_fields = ('owner', )

    inlines = [
        MembershipInline
    ]

>>>>>>> cvat/develop
admin.site.register(Organization, OrganizationAdmin)
