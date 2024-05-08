// Copyright (C) 2022 Intel Corporation
//
// SPDX-License-Identifier: MIT

<<<<<<< HEAD
=======
import './styles.scss';

>>>>>>> cvat/develop
import React, { useState, useEffect } from 'react';
import Tag from 'antd/lib/tag';
import { connect } from 'react-redux';
import { Action } from 'redux';
import { ThunkDispatch } from 'redux-thunk';

import {
    removeObject as removeObjectAction,
} from 'actions/annotation-actions';
import { CombinedState, ObjectType, Workspace } from 'reducers';
<<<<<<< HEAD
import { ObjectState } from 'cvat-core-wrapper';
import { filterAnnotations } from 'utils/filter-annotations';

interface StateToProps {
=======
import {
    QualityConflict, ObjectState, AnnotationConflict, getCore,
} from 'cvat-core-wrapper';
import { filterAnnotations } from 'utils/filter-annotations';

const core = getCore();

interface StateToProps {
    highlightedConflict: QualityConflict | null;
>>>>>>> cvat/develop
    states: ObjectState[];
    workspace: Workspace;
}

interface DispatchToProps {
    removeObject(objectState: any): void;
}

function mapStateToProps(state: CombinedState): StateToProps {
    const {
        annotation: {
<<<<<<< HEAD
            annotations: { states },
=======
            annotations: { highlightedConflict, states },
>>>>>>> cvat/develop
            workspace,
        },
    } = state;

<<<<<<< HEAD
    return { states, workspace };
=======
    return { highlightedConflict, states, workspace };
>>>>>>> cvat/develop
}

function mapDispatchToProps(dispatch: ThunkDispatch<CombinedState, {}, Action>): DispatchToProps {
    return {
        removeObject(objectState: ObjectState): void {
            dispatch(removeObjectAction(objectState, false));
        },
    };
}

function FrameTags(props: StateToProps & DispatchToProps): JSX.Element {
<<<<<<< HEAD
    const { states, workspace, removeObject } = props;
=======
    const {
        highlightedConflict, states, workspace, removeObject,
    } = props;
>>>>>>> cvat/develop

    const [frameTags, setFrameTags] = useState([] as ObjectState[]);

    const onRemoveState = (objectState: ObjectState): void => {
        removeObject(objectState);
    };

    useEffect(() => {
        setFrameTags(
            filterAnnotations(states, { workspace, include: [ObjectType.TAG] }),
        );
    }, [states]);

    return (
        <>
<<<<<<< HEAD
            {frameTags.map((tag: any) => (
                <Tag
                    className='cvat-frame-tag'
                    color={tag.label.color}
                    onClose={() => {
                        onRemoveState(tag);
                    }}
                    key={tag.clientID}
                    closable
                >
                    {tag.label.name}
                </Tag>
            ))}
=======
            <div>
                {frameTags
                    .filter((tag: any) => tag.source !== core.enums.Source.GT)
                    .map((tag: any) => (
                        <Tag
                            className={
                                (highlightedConflict?.annotationConflicts || []).filter((conflict: AnnotationConflict) => conflict.serverID === tag.serverID).length !== 0 ? 'cvat-frame-tag-highlighted' : 'cvat-frame-tag'
                            }
                            color={tag.label.color}
                            onClose={() => {
                                onRemoveState(tag);
                            }}
                            key={tag.clientID}
                            closable
                        >
                            {tag.label.name}
                        </Tag>
                    ))}
            </div>
            <div>
                {frameTags
                    .filter((tag: any) => tag.source === core.enums.Source.GT)
                    .map((tag: any) => (
                        <Tag
                            className={
                                (highlightedConflict?.annotationConflicts || []).filter((conflict: AnnotationConflict) => conflict.serverID === tag.serverID).length !== 0 ? 'cvat-frame-tag-highlighted' : 'cvat-frame-tag'
                            }
                            color={tag.label.color}
                            onClose={() => {
                                onRemoveState(tag);
                            }}
                            key={tag.clientID}
                        >
                            {tag.label.name}
                            {' '}
                            (GT)
                        </Tag>
                    ))}
            </div>
>>>>>>> cvat/develop
        </>
    );
}

export default connect(mapStateToProps, mapDispatchToProps)(FrameTags);
