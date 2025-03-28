import ERRORS from '../config/error.config.js';

const successResponse = ({ res, data = undefined, message, token = undefined }) => {
  if (data?.fileStream) {
    res.setHeader('Content-Type', 'application/pdf');
    return data.fileStream.pipe(res);
  }

  res.status(200).json({
    status: 200,
    message,
    data,
    token
  });
}

const errorResponse = (req, res, err) => {
  console.error(`[${req.method}] ${req.originalUrl} - Error:`, err);

  let error = ERRORS[err.type] || ERRORS["DEFAULT_ERROR"];

  res.status(error.HTTP_CODE).json({
    status: error.HTTP_CODE || 500,
    code: error.CODE,
    message: err.customMessage || error.MESSAGE,
  });
}

export { successResponse, errorResponse };