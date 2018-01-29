export const waitOnNextTick = () => new Promise(resolve => process.nextTick(() => resolve()));
