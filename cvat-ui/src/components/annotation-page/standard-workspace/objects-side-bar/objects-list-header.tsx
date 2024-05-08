// Copyright (C) 2020-2022 Intel Corporation
// Copyright (C) 2024 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

import React from 'react';
import Icon, {
    CaretDownOutlined,
    CaretUpFilled,
    EyeInvisibleFilled,
    EyeOutlined,
    LockFilled,
    UnlockOutlined,
} from '@ant-design/icons';
import { Col, Row } from 'antd/lib/grid';
<<<<<<< HEAD
=======
import Text from 'antd/lib/typography/Text';
>>>>>>> cvat/develop

import StatesOrderingSelector from 'components/annotation-page/standard-workspace/objects-side-bar/states-ordering-selector';
import CVATTooltip from 'components/common/cvat-tooltip';
import { StatesOrdering, Workspace } from 'reducers';
import { ShowGroundTruthIcon } from 'icons';

interface Props {
    workspace: Workspace;
    readonly: boolean;
    statesHidden: boolean;
    statesLocked: boolean;
    statesCollapsed: boolean;
    statesOrdering: StatesOrdering;
    switchLockAllShortcut: string;
    switchHiddenAllShortcut: string;
    showGroundTruth: boolean;
<<<<<<< HEAD
=======
    count: number;
>>>>>>> cvat/develop
    changeStatesOrdering(value: StatesOrdering): void;
    lockAllStates(): void;
    unlockAllStates(): void;
    collapseAllStates(): void;
    expandAllStates(): void;
    hideAllStates(): void;
    showAllStates(): void;
    changeShowGroundTruth(): void;
}

function LockAllSwitcher(props: Props): JSX.Element {
    const {
        statesLocked, switchLockAllShortcut, unlockAllStates, lockAllStates,
    } = props;
    return (
<<<<<<< HEAD
        <Col span={2}>
=======
        <Col span={3}>
>>>>>>> cvat/develop
            <CVATTooltip title={`Switch lock property for all ${switchLockAllShortcut}`}>
                {statesLocked ? <LockFilled onClick={unlockAllStates} /> : <UnlockOutlined onClick={lockAllStates} />}
            </CVATTooltip>
        </Col>
    );
}

function HideAllSwitcher(props: Props): JSX.Element {
    const {
        statesHidden, switchHiddenAllShortcut, showAllStates, hideAllStates,
    } = props;
    return (
<<<<<<< HEAD
        <Col span={2}>
=======
        <Col span={3}>
>>>>>>> cvat/develop
            <CVATTooltip title={`Switch hidden property for all ${switchHiddenAllShortcut}`}>
                {statesHidden ? (
                    <EyeInvisibleFilled onClick={showAllStates} />
                ) : (
                    <EyeOutlined onClick={hideAllStates} />
                )}
            </CVATTooltip>
        </Col>
    );
}

function GTSwitcher(props: Props): JSX.Element {
    const {
        showGroundTruth, changeShowGroundTruth,
    } = props;
    return (
<<<<<<< HEAD
        <Col>
=======
        <Col span={3}>
>>>>>>> cvat/develop
            <CVATTooltip title='Show Ground truth annotations and conflicts'>
                <Icon
                    className={
                        `cvat-objects-sidebar-show-ground-truth ${showGroundTruth ? 'cvat-objects-sidebar-show-ground-truth-active' : ''}`
                    }
                    component={ShowGroundTruthIcon}
                    onClick={changeShowGroundTruth}
                />
            </CVATTooltip>
        </Col>
    );
}

function CollapseAllSwitcher(props: Props): JSX.Element {
    const { statesCollapsed, expandAllStates, collapseAllStates } = props;
    return (
<<<<<<< HEAD
        <Col>
=======
        <Col span={3}>
>>>>>>> cvat/develop
            <CVATTooltip title='Expand/collapse all'>
                {statesCollapsed ? (
                    <CaretDownOutlined onClick={expandAllStates} />
                ) : (
                    <CaretUpFilled onClick={collapseAllStates} />
                )}
            </CVATTooltip>
        </Col>
    );
}

function ObjectListHeader(props: Props): JSX.Element {
    const {
<<<<<<< HEAD
        workspace, readonly, statesOrdering, changeStatesOrdering,
=======
        workspace, readonly, statesOrdering, count, changeStatesOrdering,
>>>>>>> cvat/develop
    } = props;

    return (
        <div className='cvat-objects-sidebar-states-header'>
            <Row justify='space-between' align='middle'>
<<<<<<< HEAD
                {!readonly && <LockAllSwitcher {...props} />}
                <HideAllSwitcher {...props} />
                { workspace === Workspace.REVIEW && (
                    <GTSwitcher {...props} />
                )}
                <CollapseAllSwitcher {...props} />
                <StatesOrderingSelector statesOrdering={statesOrdering} changeStatesOrdering={changeStatesOrdering} />
=======
                <Col span={24}>
                    <Text>{`Items: ${count}`}</Text>
                    <StatesOrderingSelector
                        statesOrdering={statesOrdering}
                        changeStatesOrdering={changeStatesOrdering}
                    />
                </Col>
                <Col span={24}>
                    <Row justify='space-around' align='middle'>
                        {!readonly && <LockAllSwitcher {...props} />}
                        <HideAllSwitcher {...props} />
                        { workspace === Workspace.REVIEW && (
                            <GTSwitcher {...props} />
                        )}
                        <CollapseAllSwitcher {...props} />
                    </Row>
                </Col>
>>>>>>> cvat/develop
            </Row>
        </div>
    );
}

export default React.memo(ObjectListHeader);
