/**
 * BatchLoader - A generic utility to solve N+1 query problems.
 * Inspired by Facebook's DataLoader.
 * 
 * Usage:
 * const loader = new BatchLoader(async (keys) => {
 *   const results = await fetchBatch(keys);
 *   return keys.map(key => results.find(r => r.id === key) || null);
 * });
 * 
 * loader.load(1).then(data => ...)
 * loader.load(2).then(data => ...)
 * // fetchBatch([1, 2]) will be called once in the next microtask.
 */
export class BatchLoader {
    /**
     * @param {Function} batchLoadFn - A function that accepts an array of keys and returns a Promise that resolves to an array of values.
     * The array of values must be the same length as the array of keys, and each value must correspond to the key at the same index.
     */
    constructor(batchLoadFn) {
        if (typeof batchLoadFn !== 'function') {
            throw new Error('BatchLoader must be constructed with a function.');
        }
        this.batchLoadFn = batchLoadFn;
        this.queue = [];
        this.dispatchPromise = null;
    }

    /**
     * Loads a key, returning a Promise for the value represented by that key.
     * @param {any} key 
     */
    load(key) {
        return new Promise((resolve, reject) => {
            this.queue.push({ key, resolve, reject });

            // Schedule dispatch if not already scheduled
            if (!this.dispatchPromise) {
                this.dispatchPromise = Promise.resolve().then(() => this.dispatchQueue());
            }
        });
    }

    /**
     * Dispatches the current queue to the batch function.
     */
    async dispatchQueue() {
        // 1. Capture and clear the queue
        const currentQueue = this.queue;
        this.queue = [];
        this.dispatchPromise = null;

        if (currentQueue.length === 0) return;

        // 2. Extract keys
        const keys = currentQueue.map(item => item.key);

        try {
            // 3. Execute batch load
            const values = await this.batchLoadFn(keys);

            // 4. Validate result
            if (!Array.isArray(values)) {
                throw new Error('BatchLoader: batch function must return an array of values.');
            }
            if (values.length !== keys.length) {
                throw new Error(
                    `BatchLoader: batch function returned ${values.length} results, but ${keys.length} keys were requested.`
                );
            }

            // 5. Resolve/Reject individual promises
            currentQueue.forEach((item, index) => {
                const value = values[index];
                if (value instanceof Error) {
                    item.reject(value);
                } else {
                    item.resolve(value);
                }
            });
        } catch (error) {
            // If the batch fails, reject all promises in this batch
            currentQueue.forEach(item => item.reject(error));
        }
    }

    /**
     * Clears all cache (if caching is implemented) or pending requests.
     * Current implementation is a request-scoped loader without long-term caching,
     * so this primarily ensures no pending dispatch remains effectively valid if we wanted to support cancellation (not implemented yet).
     */
    clearAll() {
        this.queue = [];
        // Note: We cannot cancel the microtask promise, but queue empty check handles it.
    }
}
