const R = require('ramda');
const {
    expect
} = require('chai');
const {
    scoreFoci,
    scoreTask,
    scoreTasks
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

});
