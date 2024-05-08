<<<<<<< HEAD
# Copyright (C) 2023 CVAT.ai Corporation
=======
# Copyright (C) 2023-2024 CVAT.ai Corporation
>>>>>>> cvat/develop
#
# SPDX-License-Identifier: MIT

from django.apps import AppConfig


class LogViewerConfig(AppConfig):
    name = 'cvat.apps.log_viewer'
<<<<<<< HEAD
=======

    def ready(self) -> None:
        from cvat.apps.iam.permissions import load_app_permissions
        load_app_permissions(self)
>>>>>>> cvat/develop
