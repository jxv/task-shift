const R = require('ramda');
const {
    expect
} = require('chai');
const {
    scoreFoci,
    scoreTask,
    scoreTasks,
    scoreDeps,
    expandDeps,
    combineScores,
} = require('../src/index.js');

describe('taskShift', () => {
    it('scoreFoci - assign values for an ordered list of priorities', () => {
        expect(
            scoreFoci(['a','b','c'])
        ).to.deep.equal(
            { a: 3, b: 2, c: 1 }
        );
    });
    it('scoreTask - sum focus scores', () => {
        expect(
            scoreTask(['a','b','c'], { a: 1, b: 3, c: 4, d: 9 })
        ).to.deep.equal(
            8
        );
    });
    it('scoreTasks - score many tasks', () => {
        expect(
            scoreTasks({ task1: ['a','b','c'], task2: ['b','d'], task3: ['a','d'] }, { a: 1, b: 3, c: 4, d: 9 })
        ).to.deep.equal(
            { task1: 8, task2: 12, task3: 10 }
        );
    });
    it('scoreDeps - score the dependency task based on the list tasks which depend on it', () => {
        expect(
            scoreDeps(
                {task1: ['task2', 'task3', 'task4'], task2: ['task3'], task3: [], task4: []},
                { task1: 1, task2: 2, task3: 4, task4: 8}
            )
        ).to.deep.equal(
            { task1: 14, task2: 4, task3: 0, task4: 0 }
        );
    });
    it('expandDeps - expand the list of tasks which depend on the certain task', () => {
        expect(
            expandDeps({ task1: ['task2', 'task4'], task2: ['task3'], task3: ['task4'], task4: [] })
        ).to.deep.equal(
            { task1: ['task2','task4','task3'], task2: ['task3','task4'], task3: ['task4'], task4: [] }
        );
    });
    it('combineScores - given ordered list of foci, tasks\' related areas of foci, tasks dependencies towards other tasks', () => {
        expect(
            combineScores(
                {task1: 5, task2: 4, task3: 2},
                {task1: 0, task2: 5, task3: 9}
            )
        ).to.deep.equal(
            {
                task1: {
                    score: 5,
                    base: 5,
                    deps: 0,
                },
                task2: {
                    score: 9,
                    base: 4,
                    deps: 5,
                },
                task3: {
                    score: 11,
                    base: 2,
                    deps: 9,
                },
            }
        );
    });
});
