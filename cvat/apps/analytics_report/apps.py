<<<<<<< HEAD
# Copyright (C) 2023 CVAT.ai Corporation
=======
# Copyright (C) 2023-2024 CVAT.ai Corporation
>>>>>>> cvat/develop
#
# SPDX-License-Identifier: MIT

from django.apps import AppConfig


class EventsConfig(AppConfig):
    name = "cvat.apps.analytics_report"

    def ready(self):
<<<<<<< HEAD
        from django.conf import settings

        from . import default_settings

        for key in dir(default_settings):
            if key.isupper() and not hasattr(settings, key):
                setattr(settings, key, getattr(default_settings, key))

        from . import signals  # pylint: disable=unused-import
=======
        from cvat.apps.iam.permissions import load_app_permissions

        load_app_permissions(self)
>>>>>>> cvat/develop
