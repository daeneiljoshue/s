// Copyright (C) 2020-2022 Intel Corporation
<<<<<<< HEAD
=======
// Copyright (C) 2022-2024 CVAT.ai Corporation
>>>>>>> cvat/develop
//
// SPDX-License-Identifier: MIT

import React from 'react';
import { Link } from 'react-router-dom';
import Text from 'antd/lib/typography/Text';
import { Row, Col } from 'antd/lib/grid';

<<<<<<< HEAD
import { TasksQuery } from 'reducers';
import Empty from 'antd/lib/empty';

interface Props {
    query: TasksQuery;
}

function EmptyListComponent(props: Props): JSX.Element {
    const { query } = props;

    return (
        <div className='cvat-empty-tasks-list'>
            <Empty description={!query.filter && !query.search && !query.page ? (
                <>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Text strong>No tasks created yet ...</Text>
                        </Col>
                    </Row>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Text type='secondary'>To get started with your annotation project</Text>
                        </Col>
                    </Row>
                    <Row justify='center' align='middle'>
                        <Col>
                            <Link to='/tasks/create'>create a new task</Link>
                            <Text type='secondary'> or try to </Text>
                            <Link to='/projects/create'>create a new project</Link>
                        </Col>
                    </Row>
                </>
            ) : (<Text>No results matched your search</Text>)}
=======
import Empty from 'antd/lib/empty';

interface Props {
    notFound: boolean;
}

function EmptyListComponent(props: Props): JSX.Element {
    const { notFound } = props;

    return (
        <div className='cvat-empty-tasks-list'>
            <Empty description={notFound ?
                (<Text strong>No results matched your search...</Text>) : (
                    <>
                        <Row justify='center' align='middle'>
                            <Col>
                                <Text strong>No tasks created yet...</Text>
                            </Col>
                        </Row>
                        <Row justify='center' align='middle'>
                            <Col>
                                <Text type='secondary'>To get started with your annotation project</Text>
                            </Col>
                        </Row>
                        <Row justify='center' align='middle'>
                            <Col>
                                <Link to='/tasks/create'>create a new task</Link>
                                <Text type='secondary'> or try to </Text>
                                <Link to='/projects/create'>create a new project</Link>
                            </Col>
                        </Row>
                    </>
                )}
>>>>>>> cvat/develop
            />
        </div>
    );
}

export default React.memo(EmptyListComponent);
