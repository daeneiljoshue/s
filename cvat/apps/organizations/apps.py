<<<<<<< HEAD
=======
# Copyright (C) 2021 Intel Corporation
# Copyright (C) 2024 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

>>>>>>> cvat/develop
from django.apps import AppConfig

class OrganizationsConfig(AppConfig):
    name = 'cvat.apps.organizations'
<<<<<<< HEAD
=======

    def ready(self) -> None:
        from cvat.apps.iam.permissions import load_app_permissions
        load_app_permissions(self)
>>>>>>> cvat/develop
