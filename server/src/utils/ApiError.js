// A small typed error so services can say exactly what HTTP status a
// failure should map to, instead of every controller guessing.
export class ApiError extends Error {
  constructor(statusCode, message) {
    super(message);
    this.statusCode = statusCode;
  }
}

export default ApiError;
