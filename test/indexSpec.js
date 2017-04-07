const R = require('ramda');
const {
    expect
} = require('chai');
const {
    scoreFociLinear,
    scoreFociExpo,
    scoreFociLog,
    scoreTask,
    scoreTasks,
    scoreDeps,
    expandDeps,
    combineScores,
    invertDeps,
    prioritize,
    rank,
} = require('../src/index.js');

describe('taskShift', () => {
    it('scoreFociLinear - assign values for an ordered list of priorities', () => {
        expect(
            scoreFociLinear(['a','b','c'])
        ).to.deep.equal(
            { a: 3, b: 2, c: 1 }
        );
    });
    it('scoreFociExpo', () => {
        expect(
            scoreFociExpo(['a','b','c'])
        ).to.deep.equal(
            { a: 9, b: 4, c: 1 }
        );
    });
    it('scoreFociLogc', () => {
        expect(
            scoreFociLog(['a','b','c'])
        ).to.deep.equal(
            { a: 1.3862943611198906, b: 1.0986122886681096, c: 0.6931471805599453 }
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
    it('scoreTask - score 0 for non-existing tasks', () => {
        expect(
            scoreTask(['a','b','c'], { a: 1, c: 2 }) // b doesn't exist
        ).to.deep.equal(
            3
        );

    });
    it('scoreDeps - score the dependency task based on the list tasks which depend on it', () => {
        expect(
            scoreDeps(
                {task1: ['task2', 'task3', 'task4'], task2: ['task3'], task3: [], task4: []},
                { task1: 1, task2: 2, task3: 4, task4: 8}
            )
        ).to.deep.equal(
            { task1: [8,4,2], task2: [4], task3: [], task4: [] }
        );
    });
    it('expandDeps - expand the list of tasks which depend on the certain task', () => {
        expect(
            expandDeps({ task1: ['task2', 'task4'], task2: ['task3'], task3: ['task4'], task4: [] })
        ).to.deep.equal(
            { task1: ['task2','task4','task3'], task2: ['task3','task4'], task3: ['task4'], task4: [] }
        );
    });
    it('combineScores - combine base and dependency scores', () => {
        expect(
            combineScores(
                {task1: 5, task2: 4, task3: 2},
                {task1: [], task2: [5], task3: [5,4]}
            )
        ).to.deep.equal(
            {
                task1: {
                    score: 5,
                    base: 5,
                    deps: [],
                },
                task2: {
                    score: 9,
                    base: 4,
                    deps: [5],
                },
                task3: {
                    score: 11,
                    base: 2,
                    deps: [5,4],
                },
            }
        );
    });
    it('invert deps', () => {
        expect(invertDeps({
            a: [],
            b: ['a','c'],
            c: ['a'],
            d: ['a','c'],
        })).to.deep.equal({
            a: ['b','c','d'],
            b: [],
            c: ['b','d'],
            d: []
        });
    });
    it('prioritize', () => {
         expect(
            prioritize(
                'linear',
                ['focus1','focus2','focus3','focus4'],
                { task1: ['focus1','focus2','focus3'], task2: ['focus3','focus4'], task3: ['focus1','focus4'], task4: ['focus4'] },
                { task1: [], task2: ['task1'], task3: ['task1','task2'], task4: ['task1','task2','task3'] }
            )
       ).to.deep.equal(
            {
                task1: {
                    score: 18,
                    base: 9,
                    deps: [5, 3, 1],
                },
                task2: {
                    score: 9,
                    base: 3,
                    deps: [5, 1],
                },
                task3: {
                    score: 6,
                    base: 5,
                    deps: [1],
                },
                task4: {
                    score: 1,
                    base: 1,
                    deps: [],
                }
            }
        );

    });
    it('rank', () => {
        expect(
            rank({
                task1: {
                    score: 5,
                    base: 5,
                    deps: []
                },
                task2: {
                    score: 15,
                    base: 15,
                    deps: []
                },
                task3: {
                    score: 5,
                    base: 2,
                    deps: [2,1]
                },
                task4: {
                    score: 5,
                    base: 1,
                    deps: [2,2]
                },
                task5: {
                    score: 5,
                    base: 1,
                    deps: [3,1]
                },
            })
        ).to.deep.equal(['task2','task3','task5','task4','task1']);
    });
});
