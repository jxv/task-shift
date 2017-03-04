var R = require('ramda');

const scoreFoci = foci => R.reduce(
    ([priority, scores], focus) => [priority + 1, R.assoc(focus, priority, scores)],
    [1, {}],
    R.reverse(foci)
)[1];

const scoreTask = (task, foci, focusScores) => ({ [task]: R.sum(R.map(focus => focusScores[focus], foci)) });

module.exports = {
    scoreFoci: scoreFoci,
    scoreTask: scoreTask
};
