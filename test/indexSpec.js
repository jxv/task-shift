const R = require('ramda');
const {
    expect
} = require('chai');
const {
    scoreFoci,
    scoreTask
} = require('../src/index.js');

describe('taskShift', () => {
    it('scoreFoci - assign values for an ordered list of priorities', () => {
        expect(
            scoreFoci(['a','b','c'])
        ).to.deep.equal(
            { a: 3, b: 2, c: 1 }
        );
    });
    it('scoreTask - singleton object of its summed focus scores', () => {
        expect(
            scoreTask('task1', ['a', 'b', 'c'], { a: 1, b: 3, c: 4, d: 5 })
        ).to.deep.equal(
            { task1: 8 }
        );
    });
});
