let pending = Promise.resolve();

export function enqueue(task) {
    const result = pending.then(task);

    pending = result.catch(() => {});

    return result;
}
