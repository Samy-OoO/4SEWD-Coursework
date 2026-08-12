// Wraps an async route/controller so a rejected promise is forwarded to
// next(err) automatically, instead of every function needing its own
// try/catch around every await.
export function asyncHandler(fn) {
  return function wrapped(req, res, next) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

export default asyncHandler;
