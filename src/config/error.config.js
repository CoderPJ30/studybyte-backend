const ERRORS = {
  DEFAULT_ERROR: {
    CODE: 0,
    MESSAGE: "Internal server error. Please try again later.",
    HTTP_CODE: 500,
  },
  DATA_NOT_FOUND: {
    CODE: 1,
    MESSAGE: "Requested data not found.",
    HTTP_CODE: 404,
  },
  ALREADY_EXISTS: {
    CODE: 2,
    MESSAGE: "Resource already exists.",
    HTTP_CODE: 409,
  },
  SERVER_ERROR: {
    CODE: 3,
    MESSAGE: "Server encountered an error. Please try again later.",
    HTTP_CODE: 500,
  },
  USER_NOT_EXISTS: {
    CODE: 4,
    MESSAGE: "User does not exist.",
    HTTP_CODE: 404,
  },
  INVALID_CREDENTIALS: {
    CODE: 9,
    MESSAGE: "Invalid credentials provided.",
    HTTP_CODE: 400,
  },
  UNAUTHORIZED: {
    CODE: 10,
    MESSAGE: "Unauthorized access.",
    HTTP_CODE: 401,
  },
  TOKEN_MISSING: {
    CODE: 11,
    MESSAGE: "Authorization token is missing.",
    HTTP_CODE: 401,
  },
  INVALID_TOKEN: {
    CODE: 13,
    MESSAGE: "Invalid authentication token.",
    HTTP_CODE: 401,
  },
  FORBIDDEN: {
    CODE: 14,
    MESSAGE: "You do not have permission to access this resource.",
    HTTP_CODE: 403,
  },
  BAD_REQUEST: {
    CODE: 15,
    MESSAGE: "Invalid request data. Please check your input.",
    HTTP_CODE: 400,
  },
  RESOURCE_LIMIT_EXCEEDED: {
    CODE: 16,
    MESSAGE: "Resource limit exceeded. Try again later.",
    HTTP_CODE: 429,
  },
  SERVICE_UNAVAILABLE: {
    CODE: 17,
    MESSAGE: "Service is temporarily unavailable. Please try again later.",
    HTTP_CODE: 503,
  },
  TOKEN_EXPIRED: {
    CODE: 18,
    DEFAULT_MESSAGE: 'Token has expired.',
    HTTP_CODE: 401
  }
};

export default ERRORS;
