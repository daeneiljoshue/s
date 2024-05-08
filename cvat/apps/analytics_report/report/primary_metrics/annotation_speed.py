<<<<<<< HEAD
# Copyright (C) 2023 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from dateutil import parser

import cvat.apps.dataset_manager as dm
=======
# Copyright (C) 2023-2024 CVAT.ai Corporation
#
# SPDX-License-Identifier: MIT

from copy import deepcopy
from datetime import datetime

from dateutil import parser

>>>>>>> cvat/develop
from cvat.apps.analytics_report.models import (
    BinaryOperatorType,
    GranularityChoice,
    TransformOperationType,
    ViewChoice,
)
<<<<<<< HEAD
from cvat.apps.analytics_report.report.primary_metrics.base import PrimaryMetricBase
from cvat.apps.engine.models import SourceType


class JobAnnotationSpeed(PrimaryMetricBase):
    _title = "Annotation speed (objects per hour)"
    _description = "Metric shows the annotation speed in objects per hour."
    _default_view = ViewChoice.HISTOGRAM
    _key = "annotation_speed"
    # Raw SQL queries are used to execute ClickHouse queries, as there is no ORM available here
    _query = "SELECT sum(JSONExtractUInt(payload, 'working_time')) / 1000 / 3600 as wt FROM events WHERE job_id={job_id:UInt64} AND timestamp >= {start_datetime:DateTime64} AND timestamp < {end_datetime:DateTime64}"
=======
from cvat.apps.analytics_report.report.primary_metrics.base import (
    DataExtractorBase,
    PrimaryMetricBase,
)
from cvat.apps.dataset_manager.task import merge_table_rows
from cvat.apps.engine.models import SourceType


class JobAnnotationSpeedExtractor(DataExtractorBase):
    def __init__(
        self,
        start_datetime: datetime,
        end_datetime: datetime,
        job_id: int = None,
        task_ids: list[int] = None,
    ):
        super().__init__(start_datetime, end_datetime, job_id, task_ids)

        SELECT = ["job_id", "JSONExtractUInt(payload, 'working_time') as wt", "timestamp"]
        WHERE = []

        if task_ids is not None:
            WHERE.append("task_id IN ({task_ids:Array(UInt64)})")
        elif job_id is not None:
            WHERE.append("job_id={job_id:UInt64}")

        WHERE.extend(
            [
                "wt > 0",
                "timestamp >= {start_datetime:DateTime64}",
                "timestamp < {end_datetime:DateTime64}",
            ]
        )

        # bandit false alarm
        self._query = f"SELECT {', '.join(SELECT)} FROM events WHERE {' AND '.join(WHERE)} ORDER BY timestamp"  # nosec B608


class JobAnnotationSpeed(PrimaryMetricBase):
    _key = "annotation_speed"
    _title = "Annotation speed (objects per hour)"
    _description = "Metric shows the annotation speed in objects per hour."
    _default_view = ViewChoice.HISTOGRAM
>>>>>>> cvat/develop
    _granularity = GranularityChoice.DAY
    _is_filterable_by_date = False
    _transformations = [
        {
            "name": "annotation_speed",
            TransformOperationType.BINARY: {
                "left": "object_count",
                "operator": BinaryOperatorType.DIVISION,
                "right": "working_time",
            },
        },
    ]

    def calculate(self):
<<<<<<< HEAD
        def get_tags_count(annotations):
            return sum(1 for t in annotations["tags"] if t["source"] != SourceType.FILE)

        def get_shapes_count(annotations):
            return sum(1 for s in annotations["shapes"] if s["source"] != SourceType.FILE)

        def get_track_count(annotations):
            count = 0
            for track in annotations["tracks"]:
                if track["source"] == SourceType.FILE:
                    continue
                if len(track["shapes"]) == 1:
                    count += self._db_obj.segment.stop_frame - track["shapes"][0]["frame"] + 1
=======
        def get_tags_count():
            return self._db_obj.labeledimage_set.exclude(source=SourceType.FILE).count()

        def get_shapes_count():
            return (
                self._db_obj.labeledshape_set.filter(parent=None)
                .exclude(source=SourceType.FILE)
                .count()
            )

        def get_track_count():
            db_tracks = (
                self._db_obj.labeledtrack_set.filter(parent=None)
                .exclude(source=SourceType.FILE)
                .values(
                    "id",
                    "source",
                    "trackedshape__id",
                    "trackedshape__frame",
                    "trackedshape__outside",
                )
                .order_by("id", "trackedshape__frame")
                .iterator(chunk_size=2000)
            )

            db_tracks = merge_table_rows(
                rows=db_tracks,
                keys_for_merge={
                    "shapes": [
                        "trackedshape__id",
                        "trackedshape__frame",
                        "trackedshape__outside",
                    ],
                },
                field_id="id",
            )

            count = 0
            for track in db_tracks:
                if len(track["shapes"]) == 1:
                    count += self._db_obj.segment.stop_frame - track["shapes"][0]["frame"] + 1

>>>>>>> cvat/develop
                for prev_shape, cur_shape in zip(track["shapes"], track["shapes"][1:]):
                    if prev_shape["outside"] is not True:
                        count += cur_shape["frame"] - prev_shape["frame"]

            return count

<<<<<<< HEAD
        def get_default():
            return {
                "data_series": {
                    "object_count": [],
                    "working_time": [],
                }
            }

        # Calculate object count

        annotations = dm.task.get_job_data(self._db_obj.id)
        object_count = 0
        object_count += get_tags_count(annotations)
        object_count += get_shapes_count(annotations)
        object_count += get_track_count(annotations)

        timestamp = self._get_utc_now()
        timestamp_str = timestamp.strftime("%Y-%m-%dT%H:%M:%SZ")

        report = self._db_obj.analytics_report
        if report is None:
            statistics = get_default()
        else:
            statistics = next(
                filter(lambda s: s["name"] == "annotation_speed", report.statistics), get_default()
            )

        data_series = statistics["data_series"]

        last_entry_count = 0
        start_datetime = self._db_obj.created_date
=======
        # Calculate object count
        object_count = 0
        object_count += get_tags_count()
        object_count += get_shapes_count()
        object_count += get_track_count()

        start_datetime = self._db_obj.created_date
        timestamp = self._db_obj.updated_date
        timestamp_str = timestamp.strftime("%Y-%m-%dT%H:%M:%SZ")

        report = getattr(self._db_obj, "analytics_report", None)
        data_series = self.get_empty()
        if report is not None:
            statistics = next(
                filter(lambda s: s["name"] == "annotation_speed", report.statistics), None
            )
            if statistics is not None:
                data_series = deepcopy(statistics["data_series"])

        last_entry_count = 0
>>>>>>> cvat/develop
        if data_series["object_count"]:
            last_entry = data_series["object_count"][-1]
            last_entry_timestamp = parser.parse(last_entry["datetime"])

            if last_entry_timestamp.date() == timestamp.date():
<<<<<<< HEAD
                data_series["object_count"] = data_series["object_count"][:-1]
                data_series["working_time"] = data_series["working_time"][:-1]
                if len(data_series["object_count"]):
                    last_last_entry = data_series["object_count"][-1]
                    start_datetime = parser.parse(last_last_entry["datetime"])
                    last_entry_count = last_last_entry["value"]
=======
                # remove last entry, it will be re-calculated below, because of the same date
                data_series["object_count"] = data_series["object_count"][:-1]
                data_series["working_time"] = data_series["working_time"][:-1]

                if len(data_series["object_count"]):
                    current_last_entry = data_series["object_count"][-1]
                    start_datetime = parser.parse(current_last_entry["datetime"])
                    last_entry_count = current_last_entry["value"]
>>>>>>> cvat/develop
            else:
                last_entry_count = last_entry["value"]
                start_datetime = parser.parse(last_entry["datetime"])

        data_series["object_count"].append(
            {
                "value": object_count - last_entry_count,
                "datetime": timestamp_str,
            }
        )

<<<<<<< HEAD
        # Calculate working time

        parameters = {
            "job_id": self._db_obj.id,
            "start_datetime": start_datetime,
            "end_datetime": self._get_utc_now(),
        }

        result = self._make_clickhouse_query(parameters)
        value = 0
        if (wt := next(iter(result.result_rows))[0]) is not None:
            value = wt
        data_series["working_time"].append(
            {
                "value": value,
=======
        rows = list(
            self._data_extractor.extract_for_job(
                self._db_obj.id,
            )
        )

        working_time = 0
        for row in rows:
            wt, datetime = row
            if start_datetime <= datetime < timestamp:
                working_time += wt

        data_series["working_time"].append(
            {
                "value": working_time / (1000 * 3600),
>>>>>>> cvat/develop
                "datetime": timestamp_str,
            }
        )

        return data_series

    def get_empty(self):
        return {
            "object_count": [],
            "working_time": [],
        }
