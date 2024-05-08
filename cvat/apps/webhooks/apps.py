<<<<<<< HEAD
# Copyright (C) 2022 CVAT.ai Corporation
=======
# Copyright (C) 2022-2024 CVAT.ai Corporation
>>>>>>> cvat/develop
#
# SPDX-License-Identifier: MIT

from django.apps import AppConfig


class WebhooksConfig(AppConfig):
    name = "cvat.apps.webhooks"

    def ready(self):
        from . import signals  # pylint: disable=unused-import
<<<<<<< HEAD
=======

        from cvat.apps.iam.permissions import load_app_permissions
        load_app_permissions(self)
>>>>>>> cvat/develop
