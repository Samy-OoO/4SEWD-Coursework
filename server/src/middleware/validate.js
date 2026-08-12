import { validationResult } from 'express-validator';

// Runs after a validation-rule array. If any rule failed, respond 400 with
// every error found; otherwise hand off to the next handler in the chain.
export function validate(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
}

export default validate;
