# Copyright (C) 2018-2022 Intel Corporation
#
# SPDX-License-Identifier: MIT

from .base import *

DEBUG = False

NUCLIO['HOST'] = os.getenv('CVAT_NUCLIO_HOST', 'nuclio')

# Django-sendfile:
# https://github.com/moggers87/django-sendfile2
SENDFILE_BACKEND = 'django_sendfile.backends.nginx'
SENDFILE_URL = '/'
EMAIL_HOST = 'smtp.qq.com'
EMAIL_PORT = '587'
EMAIL_USE_SSL = True
EMAIL_HOST_USER = 'xxxx@qq.com'
EMAIL_HOST_PASSWORD = 'wwwww'
