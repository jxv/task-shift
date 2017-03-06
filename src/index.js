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

// {Task: [Task]} -> {Task: Num} -> {Task: [Num]}
const scoreDeps = (taskDeps, taskScores) => R.map(deps => R.sort((a,b) => b - a, R.map(task => taskScores[task], deps)), taskDeps);

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

// {Task: Num} -> {Task: [Num]} -> {Task: Priority}
const combineScores = (baseScores, depScores) => R.mapObjIndexed((base, task) => {
        const deps = depScores[task] || [];
        return { base: base, score: base + R.sum(deps), deps: deps };
    },
    baseScores);

// [Focus] -> {Task: [Focus]} -> {Task: [Task]} -> {Task: Priority}
const prioritize = (foci, taskFoci, taskDeps) => {
    const baseScores = scoreTasks(taskFoci, scoreFoci(foci));
    const depScores = scoreDeps(expandDeps(taskDeps), baseScores);
    return combineScores(baseScores, depScores);
};

// {Task: Priority} -> [Task]
const rank = priorities => R.map
    (xs => xs[0],
        R.sort(([aName,a],[bName,b]) => {
            if (a.score != b.score) {
                return b.score - a.score;
            }
            if (a.deps.length != b.deps.length) {
                return b.deps.length - a.deps.length;
            }
            if (a.base != b.base) {
                return b.base - a.base;
            }
            // compare deps 
            const deps = R.zip(a.deps,  b.deps);
            for (var i in deps) {
                if (deps[i][0] != deps[i][1]) {
                    return deps[i][1] - deps[i][0];
                }
            }
            return 0;
        },
        R.toPairs(priorities)));

module.exports = {
    scoreFoci: scoreFoci,
    scoreTask: scoreTask,
    scoreTasks: scoreTasks,
    scoreDeps: scoreDeps,
    expandDeps: expandDeps,
    combineScores: combineScores,
    prioritize: prioritize,
    rank: rank,
};
