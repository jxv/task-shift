var R = require('ramda');

// [Focus] -> {Focus: Num}
const scoreFoci = foci => R.reduce(
    ([priority, scores], focus) => [priority + 1, R.assoc(focus, priority, scores)],
    [1, {}],
    R.reverse(foci)
)[1];

// [Focus] -> {Focus: Num} -> Num
const scoreTask = (foci, focusScores) => R.sum(R.map(focus => focusScores[focus], foci));

// {Task: [Focus]} -> [Focus] -> {Focus: Num} -> {Task: Num}
const scoreTasks = (tasks, focusScores) => R.mergeAll(R.mapObjIndexed(foci => scoreTask(foci, focusScores), tasks));

// {Task: [Task]} -> {Task: Num} -> {Task: Num}
const scoreDeps = (taskDeps, taskScores) => R.map(deps => R.sum(R.map(task => taskScores[task], deps)), taskDeps);

module.exports = {
    scoreFoci: scoreFoci,
    scoreTask: scoreTask,
    scoreTasks: scoreTasks,
    scoreDeps: scoreDeps,
};
