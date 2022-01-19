/**
 * @desc    This file contain Success and Error response for sending to client / user
 * @author  Cristhian Manzano
 * @since   2021
 */

/**
 * @desc    Send any success response
 *
 * @param   {number} statusCode
 * @param   {string} message
 * @param   {object | array} data
 */

exports.successResponse = (statusCode, message, data) => ({
  code: statusCode,
  error: false,
  message,
  data,
});

/**
 * @desc    Send any error response
 *
 * @param   {number} statusCode
 * @param   {string} message
 */

exports.errorResponse = (statusCode, message) => ({
  code: statusCode,
  error: true,
  message,
});

/**
 * @desc    Send any validation response
 * @param   {number} statusCode
 * @param   {string} message
 * @param   {string} validationError
 */
exports.validationResponse = (statusCode, validationError) => ({
  code: statusCode,
  error: true,
  message: "validation errors",
  validationError,
});
