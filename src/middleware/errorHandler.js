import createHttpError from 'http-errors';

export const errorHandler = (err, req, res, next) => {
  console.error('Error:', err.message);

  // якщо помилка — http-errors
  if (createHttpError.isHttpError(err)) {
    return res.status(err.status).json({
      message: err.message,
    });
  }

  // else internal server error (500)
  return res.status(500).json({
    message: 'Internal server error',
  });
};
