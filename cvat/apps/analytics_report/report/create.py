<<<<<<< HEAD
# Copyright (C) 2023 CVAT.ai Corporation
=======
# Copyright (C) 2023-2024 CVAT.ai Corporation
>>>>>>> cvat/develop
#
# SPDX-License-Identifier: MIT

from datetime import datetime, timedelta
from typing import Union
<<<<<<< HEAD
from uuid import uuid4
=======
>>>>>>> cvat/develop

import django_rq
from django.conf import settings
from django.core.exceptions import ObjectDoesNotExist
from django.db import transaction
from django.utils import timezone

from cvat.apps.analytics_report.models import AnalyticsReport
from cvat.apps.analytics_report.report.derived_metrics import (
<<<<<<< HEAD
=======
    DerivedMetricBase,
>>>>>>> cvat/develop
    JobTotalAnnotationSpeed,
    JobTotalObjectCount,
    ProjectAnnotationSpeed,
    ProjectAnnotationTime,
    ProjectObjects,
    ProjectTotalAnnotationSpeed,
    ProjectTotalObjectCount,
    TaskAnnotationSpeed,
    TaskAnnotationTime,
    TaskObjects,
    TaskTotalAnnotationSpeed,
    TaskTotalObjectCount,
)
from cvat.apps.analytics_report.report.primary_metrics import (
    JobAnnotationSpeed,
<<<<<<< HEAD
    JobAnnotationTime,
    JobObjects,
)
from cvat.apps.engine.models import Job, Project, Task
from cvat.utils.background_jobs import schedule_job_with_throttling
=======
    JobAnnotationSpeedExtractor,
    JobAnnotationTime,
    JobAnnotationTimeExtractor,
    JobObjects,
    JobObjectsExtractor,
    PrimaryMetricBase,
)
from cvat.apps.engine.models import Job, Project, Task
>>>>>>> cvat/develop


def get_empty_report():
    metrics = [
        JobObjects(None),
        JobAnnotationSpeed(None),
        JobAnnotationTime(None),
<<<<<<< HEAD
        JobTotalObjectCount(None, []),
        JobTotalAnnotationSpeed(None, []),
=======
        JobTotalObjectCount(None),
        JobTotalAnnotationSpeed(None),
>>>>>>> cvat/develop
    ]

    statistics = [AnalyticsReportUpdateManager._get_empty_statistics_entry(dm) for dm in metrics]

    db_report = AnalyticsReport(statistics=statistics, created_date=datetime.now(timezone.utc))
    return db_report


class AnalyticsReportUpdateManager:
<<<<<<< HEAD
    _QUEUE_JOB_PREFIX_TASK = "update-analytics-report-task-"
    _QUEUE_JOB_PREFIX_PROJECT = "update-analytics-report-project-"
    _RQ_CUSTOM_ANALYTICS_CHECK_JOB_TYPE = "custom_analytics_check"
    _JOB_RESULT_TTL = 120

    @classmethod
    def _get_analytics_check_job_delay(cls) -> timedelta:
        return timedelta(seconds=settings.ANALYTICS_CHECK_JOB_DELAY)

    def _get_scheduler(self):
        return django_rq.get_scheduler(settings.CVAT_QUEUES.ANALYTICS_REPORTS.value)
=======
    _QUEUE_JOB_PREFIX_TASK = "analytics:calculate-report-task-"
    _QUEUE_JOB_PREFIX_PROJECT = "analytics:calculate-report-project-"
    _QUEUE_JOB_PREFIX_JOB = "analytics:calculate-report-job-"
>>>>>>> cvat/develop

    def _get_queue(self):
        return django_rq.get_queue(settings.CVAT_QUEUES.ANALYTICS_REPORTS.value)

    def _make_queue_job_id_base(self, obj) -> str:
        if isinstance(obj, Task):
            return f"{self._QUEUE_JOB_PREFIX_TASK}{obj.id}"
<<<<<<< HEAD
        else:
            return f"{self._QUEUE_JOB_PREFIX_PROJECT}{obj.id}"

    def _make_custom_analytics_check_job_id(self) -> str:
        return uuid4().hex
=======
        elif isinstance(obj, Project):
            return f"{self._QUEUE_JOB_PREFIX_PROJECT}{obj.id}"
        elif isinstance(obj, Job):
            return f"{self._QUEUE_JOB_PREFIX_JOB}{obj.id}"
>>>>>>> cvat/develop

    @classmethod
    def _get_last_report_time(cls, obj):
        try:
            report = obj.analytics_report
            if report:
                return report.created_date
        except ObjectDoesNotExist:
            return None

<<<<<<< HEAD
    class AnalyticsReportsNotAvailable(Exception):
        pass

    def schedule_analytics_report_autoupdate_job(self, *, job=None, task=None, project=None):
        assert sum(map(bool, (job, task, project))) == 1, "Expected only 1 argument"

        now = timezone.now()
        delay = self._get_analytics_check_job_delay()
        next_job_time = now.utcnow() + delay

        target_obj = None
        cvat_project_id = None
        cvat_task_id = None
        if job is not None:
            if job.segment.task.project:
                target_obj = job.segment.task.project
                cvat_project_id = target_obj.id
            else:
                target_obj = job.segment.task
                cvat_task_id = target_obj.id
        elif task is not None:
            if task.project:
                target_obj = task.project
                cvat_project_id = target_obj.id
            else:
                target_obj = task
                cvat_task_id = target_obj.id
        elif project is not None:
            target_obj = project
            cvat_project_id = project.id

        schedule_job_with_throttling(
            settings.CVAT_QUEUES.ANALYTICS_REPORTS.value,
            self._make_queue_job_id_base(target_obj),
            next_job_time,
            self._check_analytics_report,
            cvat_task_id=cvat_task_id,
            cvat_project_id=cvat_project_id,
        )

    def schedule_analytics_check_job(self, *, job=None, task=None, project=None, user_id):
        rq_id = self._make_custom_analytics_check_job_id()

        queue = self._get_queue()
=======
    def schedule_analytics_check_job(self, *, job=None, task=None, project=None, user_id):
        rq_id = self._make_queue_job_id_base(job or task or project)

        queue = self._get_queue()
        existing_job = self.get_analytics_check_job(rq_id)

        if existing_job:
            if existing_job.get_status() in ["queued", "started", "deferred", "scheduled"]:
                return rq_id
            existing_job.delete()

>>>>>>> cvat/develop
        queue.enqueue(
            self._check_analytics_report,
            cvat_job_id=job.id if job is not None else None,
            cvat_task_id=task.id if task is not None else None,
            cvat_project_id=project.id if project is not None else None,
            job_id=rq_id,
<<<<<<< HEAD
            meta={"user_id": user_id, "job_type": self._RQ_CUSTOM_ANALYTICS_CHECK_JOB_TYPE},
            result_ttl=self._JOB_RESULT_TTL,
            failure_ttl=self._JOB_RESULT_TTL,
=======
            meta={"user_id": user_id},
>>>>>>> cvat/develop
        )

        return rq_id

    def get_analytics_check_job(self, rq_id: str):
        queue = self._get_queue()
        rq_job = queue.fetch_job(rq_id)
<<<<<<< HEAD

        if rq_job and not self.is_custom_analytics_check_job(rq_job):
            rq_job = None

        return rq_job

    def is_custom_analytics_check_job(self, rq_job) -> bool:
        return rq_job.meta.get("job_type") == self._RQ_CUSTOM_ANALYTICS_CHECK_JOB_TYPE

=======
        return rq_job

>>>>>>> cvat/develop
    @staticmethod
    def _get_analytics_report(db_obj: Union[Job, Task, Project]) -> AnalyticsReport:
        db_report = getattr(db_obj, "analytics_report", None)
        if db_report is None:
            db_report = AnalyticsReport(statistics=[])

            if isinstance(db_obj, Job):
                db_report.job_id = db_obj.id
            elif isinstance(db_obj, Task):
                db_report.task_id = db_obj.id
            elif isinstance(db_obj, Project):
                db_report.project_id = db_obj.id

            db_obj.analytics_report = db_report

        return db_report

    @classmethod
    def _check_analytics_report(
        cls, *, cvat_job_id: int = None, cvat_task_id: int = None, cvat_project_id: int = None
    ) -> bool:
<<<<<<< HEAD
        if cvat_job_id is not None:
            queryset = Job.objects.select_related("analytics_report")
            with transaction.atomic():
                # The Job could have been deleted during scheduling
                try:
                    db_job = queryset.get(pk=cvat_job_id)
                except Job.DoesNotExist:
                    return False

                db_report = cls._get_analytics_report(db_job)

            db_report = cls()._compute_report_for_job(db_job=db_job, db_report=db_report)

            with transaction.atomic():
                # The job could have been deleted during processing
                try:
                    actual_job = queryset.get(pk=db_job.id)
                except Job.DoesNotExist:
                    return False

                actual_report = getattr(actual_job, "analytics_report", None)
                actual_created_date = (
                    getattr(actual_report, "created_date", None)
                    if actual_report is not None
                    else None
                )
                # The report has been updated during processing
                if db_report.created_date != actual_created_date:
                    return False

                db_report.save()
            return True

        elif cvat_task_id is not None:
            queryset = Task.objects.select_related("analytics_report").prefetch_related(
                "segment_set__job_set"
            )
            with transaction.atomic():
                try:
                    db_task = queryset.get(pk=cvat_task_id)
                except Task.DoesNotExist:
                    return False

            db_report = cls._get_analytics_report(db_task)
            db_report, job_reports = cls()._compute_report_for_task(
                db_task=db_task, db_report=db_report
            )

            with transaction.atomic():
                # The task could have been deleted during processing
                try:
                    actual_task = queryset.get(pk=cvat_task_id)
                except Task.DoesNotExist:
                    return False

                actual_report = getattr(actual_task, "analytics_report", None)
                actual_created_date = (
                    actual_report.created_date if actual_report is not None else None
                )
                # The report has been updated during processing
                if db_report.created_date != actual_created_date:
                    return False

                actual_job_report_created_dates = {}
                for db_segment in db_task.segment_set.all():
                    for db_job in db_segment.job_set.all():
                        ar = getattr(db_job, "analytics_report", None)
                        acd = ar.created_date if ar is not None else None
                        actual_job_report_created_dates[db_job.id] = acd

                for jr in job_reports:
                    if jr.created_date != actual_job_report_created_dates[jr.job_id]:
                        return False

                db_report.save()
                for jr in job_reports:
                    jr.save()
            return True

        elif cvat_project_id is not None:
            queryset = Project.objects.select_related("analytics_report").prefetch_related(
                "tasks__segment_set__job_set"
            )
            with transaction.atomic():
                try:
                    db_project = queryset.get(pk=cvat_project_id)
                except Project.DoesNotExist:
                    return False

            db_report = cls._get_analytics_report(db_project)
            db_report, task_reports, job_reports = cls()._compute_report_for_project(
                db_project=db_project, db_report=db_report
            )

            with transaction.atomic():
                # The Project could have been deleted during processing
                try:
                    actual_project = queryset.get(pk=cvat_project_id)
                except Project.DoesNotExist:
                    return False

                actual_report = getattr(actual_project, "analytics_report", None)
                actual_created_date = (
                    actual_report.created_date if actual_report is not None else None
                )
                # The report has been updated during processing
                if db_report.created_date != actual_created_date:
                    return False

                actual_job_report_created_dates = {}
                actual_tasks_report_created_dates = {}
                for db_task in db_project.tasks.all():
                    task_ar = getattr(db_task, "analytics_report", None)
                    task_ar_created_date = task_ar.created_date if task_ar else None
                    actual_tasks_report_created_dates[db_task.id] = task_ar_created_date
=======
        try:
            if cvat_job_id is not None:
                queryset = Job.objects.select_related("analytics_report")
                db_job = queryset.get(pk=cvat_job_id)

                start_timestamp = db_job.created_date
                end_timestamp = db_job.updated_date + timedelta(seconds=1)

                db_report = cls._get_analytics_report(db_job)
                primary_metric_extractors = dict(
                    (
                        (
                            JobObjects.key(),
                            JobObjectsExtractor(start_timestamp, end_timestamp, cvat_job_id),
                        ),
                        (
                            JobAnnotationSpeed.key(),
                            JobAnnotationSpeedExtractor(
                                start_timestamp, end_timestamp, cvat_job_id
                            ),
                        ),
                        (
                            JobAnnotationTime.key(),
                            JobAnnotationTimeExtractor(start_timestamp, end_timestamp, cvat_job_id),
                        ),
                    )
                )
                db_report = cls()._compute_report_for_job(
                    db_job, db_report, primary_metric_extractors
                )

                with transaction.atomic():
                    actual_job = queryset.get(pk=db_job.id)
                    actual_report = getattr(actual_job, "analytics_report", None)
                    actual_created_date = getattr(actual_report, "created_date", None)
                    # The report has been updated during processing
                    if db_report.created_date != actual_created_date:
                        return False
                    db_report.save()
                return True
            elif cvat_task_id is not None:
                queryset = Task.objects.select_related("analytics_report").prefetch_related(
                    "segment_set__job_set"
                )
                db_task = queryset.get(pk=cvat_task_id)
                db_report = cls._get_analytics_report(db_task)

                start_timestamp = db_task.created_date
                end_timestamp = db_task.updated_date + timedelta(seconds=1)

                primary_metric_extractors = dict(
                    (
                        (
                            JobObjects.key(),
                            JobObjectsExtractor(
                                start_timestamp, end_timestamp, task_ids=[cvat_task_id]
                            ),
                        ),
                        (
                            JobAnnotationSpeed.key(),
                            JobAnnotationSpeedExtractor(
                                start_timestamp, end_timestamp, task_ids=[cvat_task_id]
                            ),
                        ),
                        (
                            JobAnnotationTime.key(),
                            JobAnnotationTimeExtractor(
                                start_timestamp, end_timestamp, task_ids=[cvat_task_id]
                            ),
                        ),
                    )
                )
                db_report, job_reports = cls()._compute_report_for_task(
                    db_task, db_report, primary_metric_extractors
                )

                with transaction.atomic():
                    actual_task = queryset.get(pk=cvat_task_id)
                    actual_report = getattr(actual_task, "analytics_report", None)
                    actual_created_date = getattr(actual_report, "created_date", None)
                    # The report has been updated during processing
                    if db_report.created_date != actual_created_date:
                        return False

                    actual_job_report_created_dates = {}
>>>>>>> cvat/develop
                    for db_segment in db_task.segment_set.all():
                        for db_job in db_segment.job_set.all():
                            ar = getattr(db_job, "analytics_report", None)
                            acd = ar.created_date if ar is not None else None
                            actual_job_report_created_dates[db_job.id] = acd

<<<<<<< HEAD
                for tr in task_reports:
                    if tr.created_date != actual_tasks_report_created_dates[tr.task_id]:
                        return False

                for jr in job_reports:
                    if jr.created_date != actual_job_report_created_dates[jr.job_id]:
                        return False

                db_report.save()
                for tr in task_reports:
                    tr.save()

                for jr in job_reports:
                    jr.save()
            return True
=======
                    for jr in job_reports:
                        if jr.created_date != actual_job_report_created_dates[jr.job_id]:
                            return False

                    db_report.save()
                    for jr in job_reports:
                        jr.save()
                return True

            elif cvat_project_id is not None:
                queryset = Project.objects.select_related("analytics_report").prefetch_related(
                    "tasks__segment_set__job_set"
                )

                db_project = queryset.get(pk=cvat_project_id)
                db_report = cls._get_analytics_report(db_project)

                tasks_data = db_project.tasks.values("id", "created_date", "updated_date")
                start_timestamp = (
                    min(item["created_date"] for item in tasks_data)
                    if len(tasks_data)
                    else db_project.created_date
                )
                end_timestamp = (
                    max(item["updated_date"] for item in tasks_data)
                    if len(tasks_data)
                    else db_project.updated_date
                ) + timedelta(seconds=1)
                task_ids = [item["id"] for item in tasks_data]

                primary_metric_extractors = dict(
                    (
                        (
                            JobObjects.key(),
                            JobObjectsExtractor(start_timestamp, end_timestamp, task_ids=task_ids),
                        ),
                        (
                            JobAnnotationSpeed.key(),
                            JobAnnotationSpeedExtractor(
                                start_timestamp, end_timestamp, task_ids=task_ids
                            ),
                        ),
                        (
                            JobAnnotationTime.key(),
                            JobAnnotationTimeExtractor(
                                start_timestamp, end_timestamp, task_ids=task_ids
                            ),
                        ),
                    )
                )
                db_report, task_reports, job_reports = cls()._compute_report_for_project(
                    db_project, db_report, primary_metric_extractors
                )

                with transaction.atomic():
                    actual_project = queryset.get(pk=cvat_project_id)
                    actual_report = getattr(actual_project, "analytics_report", None)
                    actual_created_date = getattr(actual_report, "created_date", None)
                    # The report has been updated during processing
                    if db_report.created_date != actual_created_date:
                        return False

                    actual_job_report_created_dates = {}
                    actual_tasks_report_created_dates = {}
                    for db_task in db_project.tasks.all():
                        task_ar = getattr(db_task, "analytics_report", None)
                        task_ar_created_date = task_ar.created_date if task_ar else None
                        actual_tasks_report_created_dates[db_task.id] = task_ar_created_date
                        for db_segment in db_task.segment_set.all():
                            for db_job in db_segment.job_set.all():
                                ar = getattr(db_job, "analytics_report", None)
                                acd = ar.created_date if ar is not None else None
                                actual_job_report_created_dates[db_job.id] = acd

                    for tr in task_reports:
                        if tr.created_date != actual_tasks_report_created_dates[tr.task_id]:
                            return False

                    for jr in job_reports:
                        if jr.created_date != actual_job_report_created_dates[jr.job_id]:
                            return False

                    db_report.save()
                    for tr in task_reports:
                        tr.save()

                    for jr in job_reports:
                        jr.save()
                return True
        except ObjectDoesNotExist:
            # The resource may have been deleted while rq job was queued
            return False
>>>>>>> cvat/develop

    @staticmethod
    def _get_statistics_entry_props(statistics_object):
        return {
            "name": statistics_object.key(),
            "title": statistics_object.title(),
            "description": statistics_object.description(),
            "granularity": statistics_object.granularity(),
            "default_view": statistics_object.default_view(),
            "transformations": statistics_object.transformations(),
            "is_filterable_by_date": statistics_object.is_filterable_by_date(),
        }

    @staticmethod
<<<<<<< HEAD
    def _get_statistics_entry(statistics_object):
=======
    def _get_statistics_entry(statistics_object: PrimaryMetricBase | DerivedMetricBase):
>>>>>>> cvat/develop
        return {
            **AnalyticsReportUpdateManager._get_statistics_entry_props(statistics_object),
            **{"data_series": statistics_object.calculate()},
        }

    @staticmethod
<<<<<<< HEAD
    def _get_empty_statistics_entry(statistics_object):
=======
    def _get_empty_statistics_entry(statistics_object: PrimaryMetricBase | DerivedMetricBase):
>>>>>>> cvat/develop
        return {
            **AnalyticsReportUpdateManager._get_statistics_entry_props(statistics_object),
            **{"data_series": statistics_object.get_empty()},
        }

    @staticmethod
    def _get_metric_by_key(key, statistics):
        return next(filter(lambda s: s["name"] == key, statistics))

<<<<<<< HEAD
    def _compute_report_for_job(self, db_job: Job, db_report: AnalyticsReport) -> AnalyticsReport:
        # recalculate the report if there is no report or the existing one is outdated
        if db_report.created_date is None or db_report.created_date < db_job.updated_date:
            primary_metrics = [
                JobObjects(db_job),
                JobAnnotationSpeed(db_job),
                JobAnnotationTime(db_job),
=======
    def _compute_report_for_job(
        self,
        db_job: Job,
        db_report: AnalyticsReport,
        data_extractors: dict,
    ) -> AnalyticsReport:
        # recalculate the report if there is no report or the existing one is outdated
        if db_report.created_date is None or db_report.created_date < db_job.updated_date:
            primary_metrics = [
                JobObjects(db_job, data_extractor=data_extractors.get(JobObjects.key())),
                JobAnnotationSpeed(
                    db_job, data_extractor=data_extractors.get(JobAnnotationSpeed.key())
                ),
                JobAnnotationTime(
                    db_job, data_extractor=data_extractors.get(JobAnnotationTime.key())
                ),
>>>>>>> cvat/develop
            ]

            primary_statistics = {
                pm.key(): self._get_statistics_entry(pm) for pm in primary_metrics
            }

            derived_metrics = [
                JobTotalObjectCount(
<<<<<<< HEAD
                    db_job, primary_statistics=primary_statistics[JobAnnotationSpeed.key()]
                ),
                JobTotalAnnotationSpeed(
                    db_job, primary_statistics=primary_statistics[JobAnnotationSpeed.key()]
=======
                    db_job,
                    data_extractor=None,
                    primary_statistics=primary_statistics[JobAnnotationSpeed.key()],
                ),
                JobTotalAnnotationSpeed(
                    db_job,
                    data_extractor=None,
                    primary_statistics=primary_statistics[JobAnnotationSpeed.key()],
>>>>>>> cvat/develop
                ),
            ]

            derived_statistics = {
                dm.key(): self._get_statistics_entry(dm) for dm in derived_metrics
            }

            db_report.statistics = [primary_statistics[pm.key()] for pm in primary_metrics]
            db_report.statistics.extend(derived_statistics[dm.key()] for dm in derived_metrics)

        return db_report

    def _compute_report_for_task(
        self,
        db_task: Task,
        db_report: AnalyticsReport,
<<<<<<< HEAD
=======
        data_extractors: dict,
>>>>>>> cvat/develop
    ) -> tuple[AnalyticsReport, list[AnalyticsReport]]:
        job_reports = []
        for db_segment in db_task.segment_set.all():
            for db_job in db_segment.job_set.all():
                job_report = self._get_analytics_report(db_job)
                job_reports.append(
<<<<<<< HEAD
                    self._compute_report_for_job(db_job=db_job, db_report=job_report)
=======
                    self._compute_report_for_job(db_job, job_report, data_extractors)
>>>>>>> cvat/develop
                )
        # recalculate the report if there is no report or the existing one is outdated
        if db_report.created_date is None or db_report.created_date < db_task.updated_date:
            derived_metrics = [
                TaskObjects(
                    db_task,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobObjects.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
                TaskAnnotationSpeed(
                    db_task,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobAnnotationSpeed.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
                TaskAnnotationTime(
                    db_task,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobAnnotationTime.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
                TaskTotalObjectCount(
                    db_task,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobAnnotationSpeed.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
                TaskTotalAnnotationSpeed(
                    db_task,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobAnnotationSpeed.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
            ]

            statistics = [self._get_statistics_entry(dm) for dm in derived_metrics]
            db_report.statistics = statistics

        return db_report, job_reports

    def _compute_report_for_project(
<<<<<<< HEAD
        self, db_project: Project, db_report: AnalyticsReport
=======
        self,
        db_project: Project,
        db_report: AnalyticsReport,
        data_extractors: dict,
>>>>>>> cvat/develop
    ) -> tuple[AnalyticsReport, list[AnalyticsReport], list[AnalyticsReport]]:
        job_reports = []
        task_reports = []
        for db_task in db_project.tasks.all():
            db_task_report = self._get_analytics_report(db_task)
<<<<<<< HEAD
            tr, jrs = self._compute_report_for_task(db_task, db_task_report)
=======
            tr, jrs = self._compute_report_for_task(db_task, db_task_report, data_extractors)
>>>>>>> cvat/develop
            task_reports.append(tr)
            job_reports.extend(jrs)
        # recalculate the report if there is no report or the existing one is outdated
        if db_report.created_date is None or db_report.created_date < db_project.updated_date:
            derived_metrics = [
                ProjectObjects(
                    db_project,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobObjects.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
                ProjectAnnotationSpeed(
                    db_project,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobAnnotationSpeed.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
                ProjectAnnotationTime(
                    db_project,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobAnnotationTime.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
                ProjectTotalObjectCount(
                    db_project,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobAnnotationSpeed.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
                ProjectTotalAnnotationSpeed(
                    db_project,
<<<<<<< HEAD
                    [
=======
                    data_extractor=None,
                    primary_statistics=[
>>>>>>> cvat/develop
                        self._get_metric_by_key(JobAnnotationSpeed.key(), jr.statistics)
                        for jr in job_reports
                    ],
                ),
            ]

            statistics = [self._get_statistics_entry(dm) for dm in derived_metrics]
            db_report.statistics = statistics

        return db_report, task_reports, job_reports

    def _get_current_job(self):
        from rq import get_current_job

        return get_current_job()
