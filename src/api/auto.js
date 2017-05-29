import core from './core';
import parallelLimit from './parallelLimit';

function parse(obj) {
  return Object.keys(obj).reduce(
    (acc, name) => {
      const entry = Array.isArray(obj[name]) ? obj[name] : [obj[name]];
      const task = entry[entry.length - 1];
      const deps = entry.slice(0, entry.length - 1);

      // Check for missing dependencies
      deps.forEach((d) => {
        if (!obj[d]) {
          throw new Error(`promiseful.auto dependent task '${d}' not found for task '${name}'`);
        } else if (d === name) {
          throw new Error(`promiseful.auto self dependent task '${d}'`);
        }
      });

      acc[name] = {
        task,
        deps,
      };

      return acc;
    },
    {
    },
  );
}

export default function auto(obj, limit = 0) {
  /* eslint-disable no-param-reassign */
  function execute(tasks, results = {}) {
    // Pick all tasks with no dependecies
    const currentTasks = Object.keys(tasks)
      .filter(m => tasks[m].deps.length === 0);

    if (currentTasks.length === 0) {
      if (Object.keys(tasks).length > 0) {
        throw new Error('promiseful.auto cyclic dependency detected.');
      }

      return core.Promise.resolve(results);
    }

    return parallelLimit(
      currentTasks.reduce((acc, t) => {
        acc.push(tasks[t].task.bind(null, results));
        return acc;
      },
      []),
      limit,
    )
    .then((res) => {
      for (let i = 0; i < currentTasks.length; i += 1) {
        results[currentTasks[i]] = res[i];
        delete tasks[currentTasks[i]];
      }

      Object.keys(tasks).forEach((m) => {
        tasks[m].deps = tasks[m].deps.filter(t => currentTasks.indexOf(t) < 0);
      });

      return execute(tasks, results);
    });
  }
  /* eslint-enable no-param-reassign */

  try {
    return execute(parse(obj));
  } catch (exp) {
    return core.Promise.reject(exp);
  }
}
