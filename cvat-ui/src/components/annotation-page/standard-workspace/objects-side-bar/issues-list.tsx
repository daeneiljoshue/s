// Copyright (C) 2020-2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Icon, {
    LeftOutlined, RightOutlined, EyeInvisibleFilled, EyeOutlined,
    CheckCircleFilled, CheckCircleOutlined,
} from '@ant-design/icons';
import { Row, Col } from 'antd/lib/grid';
import Text from 'antd/lib/typography/Text';

import { activateObject, changeFrameAsync } from 'actions/annotation-actions';
import { reviewActions } from 'actions/review-actions';
import CVATTooltip from 'components/common/cvat-tooltip';
import { CombinedState } from 'reducers';
import moment from 'moment';
import Paragraph from 'antd/lib/typography/Paragraph';
import { ConflictImportance, QualityConflict } from 'cvat-core-wrapper';
import { changeShowGroundTruth } from 'actions/settings-actions';
import { ShowGroundTruthIcon } from 'icons';

export default function LabelsListComponent(): JSX.Element {
    const dispatch = useDispatch();
    const frame = useSelector((state: CombinedState): number => state.annotation.player.frame.number);
    const frameIssues = useSelector((state: CombinedState): any[] => state.review.frameIssues);
    const frameConflicts = useSelector((state: CombinedState) => state.review.frameConflicts);
    const showGroundTruth = useSelector((state: CombinedState) => state.settings.shapes.showGroundTruth);
    const issues = useSelector((state: CombinedState): any[] => state.review.issues);
    const conflicts = useSelector((state: CombinedState) => state.review.conflicts);
    const issuesHidden = useSelector((state: CombinedState): any => state.review.issuesHidden);
    const issuesResolvedHidden = useSelector((state: CombinedState): any => state.review.issuesResolvedHidden);
    const objectStates = useSelector((state: CombinedState) => state.annotation.annotations.states);
    let frames = issues.map((issue: any): number => issue.frame).sort((a: number, b: number) => +a - +b);
    if (showGroundTruth) {
        const conflictFrames = conflicts
            .map((issue: any): number => issue.frame).sort((a: number, b: number) => +a - +b);
        frames = [...new Set([...frames, ...conflictFrames])];
    }
    const nearestLeft = frames.filter((_frame: number): boolean => _frame < frame).reverse()[0];
    const dynamicLeftProps: any = Number.isInteger(nearestLeft) ?
        {
            onClick: () => dispatch(changeFrameAsync(nearestLeft)),
        } :
        {
            style: {
                pointerEvents: 'none',
                opacity: 0.5,
            },
        };

    const nearestRight = frames.filter((_frame: number): boolean => _frame > frame)[0];
    const dynamicRightProps: any = Number.isInteger(nearestRight) ?
        {
            onClick: () => dispatch(changeFrameAsync(nearestRight)),
        } :
        {
            style: {
                pointerEvents: 'none',
                opacity: 0.5,
            },
        };

    return (
        <>
            <div className='cvat-objects-sidebar-issues-list-header'>
                <Row justify='start' align='middle'>
                    <Col>
                        <CVATTooltip title='Find the previous frame with issues'>
                            <LeftOutlined className='cvat-issues-sidebar-previous-frame' {...dynamicLeftProps} />
                        </CVATTooltip>
                    </Col>
                    <Col offset={1}>
                        <CVATTooltip title='Find the next frame with issues'>
                            <RightOutlined className='cvat-issues-sidebar-next-frame' {...dynamicRightProps} />
                        </CVATTooltip>
                    </Col>
                    <Col offset={2}>
                        <CVATTooltip title='Show/hide all issues'>
                            {issuesHidden ? (
                                <EyeInvisibleFilled
                                    className='cvat-issues-sidebar-hidden-issues'
                                    onClick={() => dispatch(reviewActions.switchIssuesHiddenFlag(false))}
                                />
                            ) : (
                                <EyeOutlined
                                    className='cvat-issues-sidebar-shown-issues'
                                    onClick={() => dispatch(reviewActions.switchIssuesHiddenFlag(true))}
                                />
                            )}
                        </CVATTooltip>
                    </Col>
                    <Col offset={2}>
                        <CVATTooltip title='Show/hide resolved issues'>
                            { issuesResolvedHidden ? (
                                <CheckCircleFilled
                                    className='cvat-issues-sidebar-hidden-resolved-status'
                                    onClick={() => dispatch(reviewActions.switchIssuesHiddenResolvedFlag(false))}
                                />
                            ) : (
                                <CheckCircleOutlined
                                    className='cvat-issues-sidebar-hidden-resolved-status'
                                    onClick={() => dispatch(reviewActions.switchIssuesHiddenResolvedFlag(true))}
                                />

                            )}
                        </CVATTooltip>
                    </Col>
                    <Col offset={2}>
                        <CVATTooltip title='Show Ground truth annotations and conflicts'>
                            <Icon
                                className={
                                    `cvat-objects-sidebar-show-ground-truth ${showGroundTruth ? 'cvat-objects-sidebar-show-ground-truth-active' : ''}`
                                }
                                component={ShowGroundTruthIcon}
                                onClick={() => dispatch(changeShowGroundTruth(!showGroundTruth))}
                            />
                        </CVATTooltip>
                    </Col>
                </Row>
            </div>
            <div className='cvat-objects-sidebar-issues-list'>
                {frameIssues.map(
                    (frameIssue: any): JSX.Element => (
                        <div
                            key={frameIssue.id}
                            id={`cvat-objects-sidebar-issue-item-${frameIssue.id}`}
                            className={
                                `cvat-objects-sidebar-issue-item ${frameIssue.resolved ? 'cvat-objects-sidebar-issue-resolved' : ''}`
                            }
                            onMouseEnter={() => {
                                const element = window.document.getElementById(
                                    `cvat_canvas_issue_region_${frameIssue.id}`,
                                );
                                if (element) {
                                    element.setAttribute('fill', 'url(#cvat_issue_region_pattern_2)');
                                }
                                dispatch(activateObject(null, null, null));
                            }}
                            onMouseLeave={() => {
                                const element = window.document.getElementById(
                                    `cvat_canvas_issue_region_${frameIssue.id}`,
                                );
                                if (element) {
                                    element.setAttribute('fill', 'url(#cvat_issue_region_pattern_1)');
                                }
                            }}
                        >
                            <Row>
                                <Text strong>{`#${frameIssue.id} • Issue`}</Text>
                            </Row>
                            <Row>
                                <Paragraph ellipsis={{ rows: 2 }}>
                                    {frameIssue.comments[0]?.message ? frameIssue.comments[0]?.message : ''}
                                </Paragraph>
                                <Text />
                            </Row>
                            <Row>
                                <Text>{moment(frameIssue.createdDate).fromNow()}</Text>
                            </Row>
                        </div>
                    ),
                )}
                {showGroundTruth && frameConflicts.map(
                    (frameConflict: QualityConflict): JSX.Element => (
                        <div
                            key={frameConflict.id}
                            id={`cvat-objects-sidebar-conflict-item-${frameConflict.id}`}
                            className={
                                `${frameConflict.importance === ConflictImportance.WARNING ?
                                    'cvat-objects-sidebar-warning-item' : 'cvat-objects-sidebar-conflict-item'}`
                            }
                            onMouseEnter={() => {
                                const serverID = frameConflict.annotationConflicts[0].objId;
                                const objectState = objectStates.find((state) => state.serverID === serverID);
                                dispatch(activateObject(objectState.clientID, null, null));
                            }}
                        >
                            <Row>
                                <Text strong>
                                    {`#${frameConflict.id} • ${frameConflict.importance === ConflictImportance.WARNING ?
                                        'Warning' : 'Conflict'}`}
                                </Text>
                            </Row>
                            <Row>
                                <Paragraph ellipsis={{ rows: 2 }}>
                                    {frameConflict.description}
                                </Paragraph>
                                <Text />
                            </Row>
                        </div>
                    ),
                )}
            </div>
        </>
    );
}
