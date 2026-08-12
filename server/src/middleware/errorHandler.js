import { ApiError } from '../utils/ApiError.js';

// Catches any route that doesn't match, before the error handler below.
export function notFound(req, res) {
  res.status(404).json({ errors: [{ msg: `Route ${req.method} ${req.originalUrl} not found.` }] });
}

// Express recognizes an error-handling middleware by its 4 arguments.
// Any `next(err)` call in the app, or a thrown error inside an async
// route wrapped with asyncHandler, ends up here.
// eslint-disable-next-line no-unused-vars
export function errorHandler(err, req, res, next) {
  if (err instanceof ApiError) {
    return res.status(err.statusCode).json({ errors: [{ msg: err.message }] });
  }

  // Sequelize's own validation/constraint errors (e.g. a bad foreign key)
  if (err.name === 'SequelizeValidationError' || err.name === 'SequelizeUniqueConstraintError') {
    const errors = err.errors?.map((e) => ({ msg: e.message, path: e.path })) || [{ msg: err.message }];
    return res.status(400).json({ errors });
  }

  if (err.name === 'SequelizeForeignKeyConstraintError') {
    return res.status(409).json({ errors: [{ msg: 'This action violates a data relationship (e.g. supplier still has products).' }] });
  }

  console.error(err);
  res.status(500).json({ errors: [{ msg: 'Something went wrong on the server.' }] });
}

export default errorHandler;
