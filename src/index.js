var R = require('ramda');

// [Focus] -> {Focus: Num}
const scoreFoci = foci => R.reduce(
    ([priority, scores], focus) => [priority + 1, R.assoc(focus, priority, scores)],
    [1, {}],
    R.reverse(foci)
)[1];

// [Focus] -> {Focus: Num} -> Num
const scoreTask = (foci, focusScores) => R.sum(R.map(focus => focusScores[focus], foci));

// {Task: [Focus]} -> {Focus: Num} -> {Task: Num}
const scoreTasks = (tasks, focusScores) => R.mergeAll(R.mapObjIndexed(foci => scoreTask(foci, focusScores), tasks));

// {Task: [Task]} -> {Task: Num} -> {Task: Num}
const scoreDeps = (taskDeps, taskScores) => R.map(deps => R.sum(R.map(task => taskScores[task], deps)), taskDeps);

// {Task: [Task]} -> {Task: [Task]}
const expandDeps = taskDeps => R.map(initDeps => {
    var frontier = initDeps;
    var deps = [];
    while (frontier.length) {
        var dep = frontier.shift();
        deps.push(dep);
        for (var i in taskDeps) {
            deps = R.concat(deps, taskDeps[i]);
        }
    }
    return R.uniq(deps);
}, taskDeps);

// {Task: Num} -> {Task: Num} -> {Task: Priority}
const combineScores = (baseScores, depScores) => R.mapObjIndexed((base, task) => {
        const deps = depScores[task] || 0;
        return { base: base, score: base + deps, deps: deps };
    },
    baseScores);

module.exports = {
    scoreFoci: scoreFoci,
    scoreTask: scoreTask,
    scoreTasks: scoreTasks,
    scoreDeps: scoreDeps,
    expandDeps: expandDeps,
    combineScores: combineScores,
};
