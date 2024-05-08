// Copyright (C) 2023-2024 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import './styles.scss';

import React, { useCallback, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router';
import { Link } from 'react-router-dom';
import { Row, Col } from 'antd/lib/grid';
import Tabs from 'antd/lib/tabs';
import Title from 'antd/lib/typography/Title';
import notification from 'antd/lib/notification';
import { useIsMounted } from 'utils/hooks';
import { Project, Task } from 'reducers';
<<<<<<< HEAD
import { AnalyticsReport, Job, getCore } from 'cvat-core-wrapper';
=======
import {
    AnalyticsReport, Job, RQStatus, getCore,
} from 'cvat-core-wrapper';
>>>>>>> cvat/develop
import moment from 'moment';
import CVATLoadingSpinner from 'components/common/loading-spinner';
import GoBackButton from 'components/common/go-back-button';
import AnalyticsOverview, { DateIntervals } from './analytics-performance';
import TaskQualityComponent from './task-quality/task-quality-component';

const core = getCore();

enum AnalyticsTabs {
    OVERVIEW = 'overview',
    QUALITY = 'quality',
}

function getTabFromHash(): AnalyticsTabs {
    const tab = window.location.hash.slice(1) as AnalyticsTabs;
    return Object.values(AnalyticsTabs).includes(tab) ? tab : AnalyticsTabs.OVERVIEW;
}

function handleTimePeriod(interval: DateIntervals): [string, string] {
    const now = moment.utc();
    switch (interval) {
        case DateIntervals.LAST_WEEK: {
            return [now.format(), now.subtract(7, 'd').format()];
        }
        case DateIntervals.LAST_MONTH: {
            return [now.format(), now.subtract(30, 'd').format()];
        }
        case DateIntervals.LAST_QUARTER: {
            return [now.format(), now.subtract(90, 'd').format()];
        }
        case DateIntervals.LAST_YEAR: {
            return [now.format(), now.subtract(365, 'd').format()];
        }
        default: {
            throw Error(`Date interval is not supported: ${interval}`);
        }
    }
}

<<<<<<< HEAD
=======
function readInstanceType(location: ReturnType<typeof useLocation>): InstanceType {
    if (location.pathname.includes('projects')) {
        return 'project';
    }
    if (location.pathname.includes('jobs')) {
        return 'job';
    }
    return 'task';
}

function readInstanceId(type: InstanceType): number {
    if (type === 'project') {
        return +useParams<{ pid: string }>().pid;
    }
    if (type === 'job') {
        return +useParams<{ jid: string }>().jid;
    }
    return +useParams<{ tid: string }>().tid;
}

>>>>>>> cvat/develop
type InstanceType = 'project' | 'task' | 'job';

function AnalyticsPage(): JSX.Element {
    const location = useLocation();

<<<<<<< HEAD
    const requestedInstanceType: InstanceType = (() => {
        if (location.pathname.includes('projects')) {
            return 'project';
        }
        if (location.pathname.includes('jobs')) {
            return 'job';
        }
        return 'task';
    })();

    const requestedInstanceID: number = (() => {
        if (requestedInstanceType === 'project') {
            return +useParams<{ pid: string }>().pid;
        }
        if (requestedInstanceType === 'job') {
            return +useParams<{ jid: string }>().jid;
        }
        return +useParams<{ tid: string }>().tid;
    })();

    const [activeTab, setTab] = useState(getTabFromHash());

=======
    const requestedInstanceType: InstanceType = readInstanceType(location);
    const requestedInstanceID = readInstanceId(requestedInstanceType);

    const [activeTab, setTab] = useState(getTabFromHash());
>>>>>>> cvat/develop
    const [instanceType, setInstanceType] = useState<InstanceType | null>(null);
    const [instance, setInstance] = useState<Project | Task | Job | null>(null);
    const [analyticsReport, setAnalyticsReport] = useState<AnalyticsReport | null>(null);
    const [timePeriod, setTimePeriod] = useState<DateIntervals>(DateIntervals.LAST_WEEK);
<<<<<<< HEAD
    const [fetching, setFetching] = useState(true);
    const isMounted = useIsMounted();

    const receiveInstance = (type: InstanceType, id: number): Promise<Task[] | Job[] | Project[]> => {
        if (type === 'project') {
            return core.projects.get({ id });
        }

        if (type === 'task') {
            return core.tasks.get({ id });
        }

        return core.jobs.get({ jobID: id });
    };

    const receiveReport = (timeInterval: DateIntervals, type: InstanceType, id: number): Promise<AnalyticsReport> => {
        const [endDate, startDate] = handleTimePeriod(timeInterval);
        if (type === 'project') {
            return core.analytics.performance.reports({
                projectID: id,
                endDate,
                startDate,
            });
        }

        if (type === 'task') {
            return core.analytics.performance.reports({
                taskID: id,
                endDate,
                startDate,
            });
        }

        return core.analytics.performance.reports({
            jobID: id,
            endDate,
            startDate,
        });
    };

    useEffect(() => {
        setFetching(true);

        if (Number.isInteger(requestedInstanceID) && ['project', 'task', 'job'].includes(requestedInstanceType)) {
            Promise.all([
                receiveInstance(requestedInstanceType, requestedInstanceID),
                receiveReport(timePeriod, requestedInstanceType, requestedInstanceID),
            ])
                .then(([instanceResponse, report]) => {
                    const receivedInstance: Task | Project | Job = instanceResponse[0];
                    if (receivedInstance && isMounted()) {
                        setInstance(receivedInstance);
                        setInstanceType(requestedInstanceType);
                    }
                    if (report && isMounted()) {
                        setAnalyticsReport(report);
                    }
                })
                .catch((error: Error) => {
                    notification.error({
                        message: 'Could not receive requested resources',
                        description: `${error.toString()}`,
                    });
                })
                .finally(() => {
                    if (isMounted()) {
                        setFetching(false);
                    }
                });
=======
    const [reportRefreshingStatus, setReportRefreshingStatus] = useState<string | null>(null);
    const [fetching, setFetching] = useState(true);
    const isMounted = useIsMounted();

    const receiveInstance = async (type: InstanceType, id: number): Promise<void> => {
        let receivedInstance: Task | Project | Job | null = null;

        try {
            switch (type) {
                case 'project': {
                    [receivedInstance] = await core.projects.get({ id });
                    break;
                }
                case 'task': {
                    [receivedInstance] = await core.tasks.get({ id });
                    break;
                }
                case 'job': {
                    [receivedInstance] = await core.jobs.get({ jobID: id });
                    break;
                }
                default:
                    return;
            }

            if (isMounted()) {
                setInstance(receivedInstance);
                setInstanceType(type);
            }
        } catch (error: unknown) {
            notification.error({
                message: `Could not receive requested ${type}`,
                description: `${error instanceof Error ? error.message : ''}`,
            });
        }
    };

    const receiveReport = async (timeInterval: DateIntervals, type: InstanceType, id: number): Promise<void> => {
        const [endDate, startDate] = handleTimePeriod(timeInterval);
        let report: AnalyticsReport | null = null;

        try {
            const body = { endDate, startDate };
            switch (type) {
                case 'project': {
                    report = await core.analytics.performance.reports({ ...body, projectID: id });
                    break;
                }
                case 'task': {
                    report = await core.analytics.performance.reports({ ...body, taskID: id });
                    break;
                }
                case 'job': {
                    report = await core.analytics.performance.reports({ ...body, jobID: id });
                    break;
                }
                default:
                    return;
            }

            if (isMounted()) {
                setAnalyticsReport(report);
            }
        } catch (error: unknown) {
            notification.error({
                message: 'Could not receive requested report',
                description: `${error instanceof Error ? error.message : ''}`,
            });
        }
    };

    useEffect(() => {
        if (Number.isInteger(requestedInstanceID) && ['project', 'task', 'job'].includes(requestedInstanceType)) {
            setFetching(true);
            Promise.all([
                receiveInstance(requestedInstanceType, requestedInstanceID),
                receiveReport(timePeriod, requestedInstanceType, requestedInstanceID),
            ]).finally(() => {
                if (isMounted()) {
                    setFetching(false);
                }
            });
>>>>>>> cvat/develop
        } else {
            notification.error({
                message: 'Could not load this page',
                description: `Not valid resource ${requestedInstanceType} #${requestedInstanceID}`,
            });
        }

        return () => {
            if (isMounted()) {
                setInstance(null);
                setAnalyticsReport(null);
            }
        };
    }, [requestedInstanceType, requestedInstanceID, timePeriod]);

<<<<<<< HEAD
=======
    useEffect(() => {
        window.addEventListener('hashchange', () => {
            const hash = getTabFromHash();
            setTab(hash);
        });
    }, []);

    useEffect(() => {
        window.location.hash = activeTab;
    }, [activeTab]);

    const onCreateReport = useCallback(() => {
        const onUpdate = (status: RQStatus, progress: number, message: string): void => {
            setReportRefreshingStatus(message);
        };

        const body = {
            ...(requestedInstanceType === 'project' ? { projectID: requestedInstanceID } : {}),
            ...(requestedInstanceType === 'task' ? { taskID: requestedInstanceID } : {}),
            ...(requestedInstanceType === 'job' ? { jobID: requestedInstanceID } : {}),
        };

        core.analytics.performance.calculate(body, onUpdate).then(() => {
            receiveReport(timePeriod, requestedInstanceType, requestedInstanceID);
        }).finally(() => {
            setReportRefreshingStatus(null);
        }).catch((error: unknown) => {
            if (isMounted()) {
                notification.error({
                    message: 'Error occurred during requesting performance report',
                    description: error instanceof Error ? error.message : '',
                });
            }
        });
    }, [requestedInstanceType, requestedInstanceID, timePeriod]);

>>>>>>> cvat/develop
    const onJobUpdate = useCallback((job: Job): void => {
        setFetching(true);

        job.save()
            .catch((error: Error) => {
                notification.error({
                    message: 'Could not update the job',
                    description: error.toString(),
                });
            })
            .finally(() => {
                if (isMounted()) {
                    setFetching(false);
                }
            });
    }, []);

<<<<<<< HEAD
    useEffect(() => {
        window.addEventListener('hashchange', () => {
            const hash = getTabFromHash();
            setTab(hash);
        });
    }, []);

    const onTabKeyChange = (key: string): void => {
        setTab(key as AnalyticsTabs);
    };

    useEffect(() => {
        window.location.hash = activeTab;
    }, [activeTab]);
=======
    const onTabKeyChange = useCallback((key: string): void => {
        setTab(key as AnalyticsTabs);
    }, []);
>>>>>>> cvat/develop

    let backNavigation: JSX.Element | null = null;
    let title: JSX.Element | null = null;
    let tabs: JSX.Element | null = null;
    if (instanceType && instance) {
        backNavigation = (
            <Col span={22} xl={18} xxl={14} className='cvat-task-top-bar'>
                <GoBackButton />
            </Col>
        );

        let analyticsFor: JSX.Element | null = <Link to={`/projects/${instance.id}`}>{`Project #${instance.id}`}</Link>;
        if (instanceType === 'task') {
            analyticsFor = <Link to={`/tasks/${instance.id}`}>{`Task #${instance.id}`}</Link>;
        } else if (instanceType === 'job') {
            analyticsFor = <Link to={`/tasks/${instance.taskId}/jobs/${instance.id}`}>{`Job #${instance.id}`}</Link>;
        }
        title = (
            <Col>
                <Title level={4} className='cvat-text-color'>
                    Analytics for
                    {' '}
                    {analyticsFor}
                </Title>
            </Col>
        );

        tabs = (
            <Tabs
                type='card'
                activeKey={activeTab}
                defaultActiveKey={AnalyticsTabs.OVERVIEW}
                onChange={onTabKeyChange}
                className='cvat-task-analytics-tabs'
            >
                <Tabs.TabPane tab='Performance' key={AnalyticsTabs.OVERVIEW}>
                    <AnalyticsOverview
                        report={analyticsReport}
                        timePeriod={timePeriod}
<<<<<<< HEAD
                        onTimePeriodChange={setTimePeriod}
=======
                        reportRefreshingStatus={reportRefreshingStatus}
                        onTimePeriodChange={setTimePeriod}
                        onCreateReport={onCreateReport}
>>>>>>> cvat/develop
                    />
                </Tabs.TabPane>
                {instanceType === 'task' && (
                    <Tabs.TabPane tab='Quality' key={AnalyticsTabs.QUALITY}>
                        <TaskQualityComponent task={instance} onJobUpdate={onJobUpdate} />
                    </Tabs.TabPane>
                )}
            </Tabs>
        );
    }

    return (
        <div className='cvat-analytics-page'>
            {fetching ? (
                <div className='cvat-analytics-loading'>
                    <CVATLoadingSpinner />
                </div>
            ) : (
                <Row justify='center' align='top' className='cvat-analytics-wrapper'>
                    {backNavigation}
                    <Col span={22} xl={18} xxl={14} className='cvat-analytics-inner'>
                        {title}
                        {tabs}
                    </Col>
                </Row>
            )}
        </div>
    );
}

export default React.memo(AnalyticsPage);
