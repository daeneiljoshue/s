// Copyright (C) 2023-2024 CVAT.ai Corporation
//
// SPDX-License-Identifier: MIT

/// <reference types="cypress" />

context('Analytics pipeline', () => {
    const serverFiles = ['images/image_1.jpg', 'images/image_2.jpg', 'images/image_3.jpg'];
    const mainLabelName = 'label';
    const secondLabelName = 'secondLabel';
    const projectName = 'A project for testing performance analytics';
    const projectLabels = [
        { name: mainLabelName, attributes: [], type: 'any' },
        { name: secondLabelName, attributes: [], type: 'any' },
    ];

    const taskName = 'Annotation task for testing performance analytics';

<<<<<<< HEAD
    let projectID = null;
    let jobID = null;
    let taskID = null;
=======
    const data = {
        projectID: null,
        taskID: null,
        jobID: null,
    };
>>>>>>> cvat/develop

    const rectangles = [
        {
            points: 'By 2 Points',
            type: 'Shape',
            labelName: mainLabelName,
            firstX: 270,
            firstY: 350,
            secondX: 370,
            secondY: 450,
        },
        {
            points: 'By 2 Points',
            type: 'Shape',
            labelName: mainLabelName,
            firstX: 350,
            firstY: 450,
            secondX: 450,
            secondY: 550,
        },
        {
            points: 'By 2 Points',
            type: 'Shape',
            labelName: mainLabelName,
            firstX: 130,
            firstY: 200,
            secondX: 150,
            secondY: 250,
        },
    ];

    const cardEntryNames = ['annotation_time', 'total_object_count', 'total_annotation_speed'];
<<<<<<< HEAD
    function checkCards(notNull) {
=======
    function checkCards() {
>>>>>>> cvat/develop
        cy.get('.cvat-analytics-card')
            .should('have.length', 3)
            .each((card) => {
                cy.wrap(card)
                    .invoke('data', 'entry-name')
                    .then((val) => {
                        expect(cardEntryNames.includes(val)).to.eq(true);
<<<<<<< HEAD
                        if (notNull && ['total_object_count', 'total_annotation_speed'].includes(val)) {
=======
                        if (['total_object_count', 'total_annotation_speed'].includes(val)) {
>>>>>>> cvat/develop
                            cy.wrap(card).within(() => {
                                cy.get('.cvat-analytics-card-value').should('not.have.text', '0.0');
                            });
                        }
                    });
            });
    }

    const histogramEntryNames = ['objects', 'annotation_speed'];
    function checkHistograms() {
        cy.get('.cvat-performance-histogram-card')
            .should('have.length', 2)
            .each((card) => {
                cy.wrap(card).invoke('data', 'entry-name')
                    .then((val) => expect(histogramEntryNames.includes(val)).to.be.true);
            });
    }

<<<<<<< HEAD
    function waitForReport(authKey, rqID) {
        cy.request({
            method: 'POST',
            url: `api/analytics/reports?rq_id=${rqID}`,
            headers: {
                Authorization: `Token ${authKey}`,
            },
            body: {
                project_id: projectID,
            },
        }).then((response) => {
            if (response.status === 201) {
                return;
            }
            waitForReport(authKey, rqID);
        });
    }

=======
>>>>>>> cvat/develop
    function openAnalytics(type) {
        if (['task', 'project'].includes(type)) {
            const actionsMenu = type === 'project' ? '.cvat-project-actions-menu' : '.cvat-actions-menu';
            const actionsButton = type === 'project' ? '.cvat-project-page-actions-button' : '.cvat-task-page-actions-button';
            cy.get(actionsButton).click();
            cy.get(actionsMenu)
                .should('be.visible')
                .find('[role="menuitem"]')
                .filter(':contains("View analytics")')
                .last()
                .click();
        }
    }

    before(() => {
        cy.visit('auth/login');
        cy.login();
<<<<<<< HEAD

=======
        cy.get('.cvat-tasks-page').should('exist').and('be.visible');
    });

    beforeEach(() => {
>>>>>>> cvat/develop
        cy.headlessCreateProject({
            labels: projectLabels,
            name: projectName,
        }).then((response) => {
<<<<<<< HEAD
            projectID = response.projectID;
=======
            data.projectID = response.projectID;
>>>>>>> cvat/develop

            cy.headlessCreateTask({
                labels: [],
                name: taskName,
<<<<<<< HEAD
                project_id: projectID,
=======
                project_id: data.projectID,
>>>>>>> cvat/develop
                source_storage: { location: 'local' },
                target_storage: { location: 'local' },
            }, {
                server_files: serverFiles,
                image_quality: 70,
                use_zip_chunks: true,
                use_cache: true,
                sorting_method: 'lexicographical',
            }).then((taskResponse) => {
<<<<<<< HEAD
                taskID = taskResponse.taskID;
                [jobID] = taskResponse.jobIDs;

                cy.visit(`/tasks/${taskID}`);
=======
                data.taskID = taskResponse.taskID;
                [data.jobID] = taskResponse.jobIDs;

                cy.visit(`/tasks/${data.taskID}`);
>>>>>>> cvat/develop
                cy.get('.cvat-task-details').should('exist').and('be.visible');
            });
        });
    });

<<<<<<< HEAD
    describe('Analytics pipeline', () => {
        it('Check empty performance pages', () => {
=======
    afterEach(() => {
        if (data.projectID) {
            cy.headlessDeleteProject(data.projectID);
        }
    });

    describe('Analytics pipeline', () => {
        it('Check all performance page to be empty', () => {
            const { jobID, projectID, taskID } = data;
>>>>>>> cvat/develop
            cy.get('.cvat-job-item').contains('a', `Job #${jobID}`)
                .parents('.cvat-job-item')
                .find('.cvat-job-item-more-button')
                .click();
            cy.get('.ant-dropdown')
                .not('.ant-dropdown-hidden')
                .within(() => {
                    cy.contains('[role="menuitem"]', 'View analytics').click();
                });
<<<<<<< HEAD
            checkCards();
            checkHistograms();

            cy.visit(`/projects/${projectID}`);
            openAnalytics('project');
            checkCards();
            checkHistograms();

            cy.visit(`/tasks/${taskID}`);
            openAnalytics('task');
            checkCards();
            checkHistograms();
        });

        it('Make some actions with objects, create analytics report, check performance pages', () => {
            cy.visit(`/tasks/${taskID}`);
=======

            cy.get('.cvat-empty-performance-analytics-item').should('exist').and('be.visible');

            cy.visit(`/projects/${projectID}`);
            openAnalytics('project');
            cy.get('.cvat-empty-performance-analytics-item').should('exist').and('be.visible');

            cy.visit(`/tasks/${taskID}`);
            openAnalytics('task');
            cy.get('.cvat-empty-performance-analytics-item').should('exist').and('be.visible');
        });

        it('Make some actions with objects, create analytics report, check performance pages', () => {
            const { jobID, projectID, taskID } = data;
>>>>>>> cvat/develop
            cy.get('.cvat-job-item').contains('a', `Job #${jobID}`).click();
            cy.get('.cvat-spinner').should('not.exist');

            rectangles.forEach((rectangle, index) => {
                cy.goCheckFrameNumber(index);
                cy.createRectangle(rectangle);
            });
            cy.saveJob();

            cy.goCheckFrameNumber(0);
            cy.get('#cvat-objects-sidebar-state-item-1')
                .find('.cvat-objects-sidebar-state-item-label-selector')
                .type(`${secondLabelName}{Enter}`);
            cy.get('#cvat-objects-sidebar-state-item-1')
                .find('.cvat-objects-sidebar-state-item-label-selector')
                .trigger('mouseout');
            cy.saveJob();

            cy.goToNextFrame(1);
            cy.get('#cvat_canvas_shape_2').trigger('mousemove');
            cy.get('#cvat_canvas_shape_2').should('have.class', 'cvat_canvas_shape_activated');
            cy.get('body').type('{del}');
            cy.get('#cvat_canvas_shape_2').should('not.exist');
            cy.saveJob();

<<<<<<< HEAD
            cy.logout();
            cy.getAuthKey().then((res) => {
                const authKey = res.body.key;
                cy.request({
                    method: 'POST',
                    url: 'api/analytics/reports',
                    headers: {
                        Authorization: `Token ${authKey}`,
                    },
                    body: {
                        project_id: projectID,
                    },
                }).then((response) => {
                    const rqID = response.body.rq_id;
                    waitForReport(authKey, rqID);
                });
            });
            cy.login();
            cy.intercept('GET', '/api/analytics/reports**').as('getReport');

            cy.visit(`/projects/${projectID}`);
            openAnalytics('project');
            cy.wait('@getReport');
            checkCards(true);
=======
            cy.visit(`/projects/${projectID}`);
            openAnalytics('project');
            cy.get('.cvat-empty-performance-analytics-item').should('exist').and('be.visible').within(() => {
                cy.get('button').contains('Request').click();
            });

            checkCards();
>>>>>>> cvat/develop
            checkHistograms();

            cy.visit(`/tasks/${taskID}`);
            openAnalytics('task');
<<<<<<< HEAD
            cy.wait('@getReport');
            checkCards(true);
=======
            checkCards();
>>>>>>> cvat/develop
            checkHistograms();

            cy.visit(`/tasks/${taskID}`);
            cy.get('.cvat-job-item').contains('a', `Job #${jobID}`)
                .parents('.cvat-job-item')
                .find('.cvat-job-item-more-button')
                .click();

            cy.wait(500); // wait for animationend
            cy.get('.cvat-job-item-menu')
                .should('exist')
                .and('be.visible')
                .find('[role="menuitem"]')
                .filter(':contains("View analytics")')
                .click();
<<<<<<< HEAD
            cy.wait('@getReport');
            checkCards(true);
=======
            checkCards();
>>>>>>> cvat/develop
            checkHistograms();
        });
    });
});
