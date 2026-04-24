'use strict';

/**
 * Plain language error messages for end users.
 * Replaces technical jargon with clear, actionable guidance.
 */

function getErrorMessage(error, context = {}) {
  if (!error) return 'Something went wrong. Please try again.';

  const message = String(error.message || error).toLowerCase();
  const code = error.code || '';

  // Network errors
  if (message.includes('econnrefused') || message.includes('enotfound')) {
    return 'Could not reach YouTube. Check your internet connection and try again.';
  }

  if (message.includes('timeout') || message.includes('etimedout')) {
    return 'The request took too long. This might be a temporary network issue. Try again in a moment.';
  }

  if (message.includes('http 429') || message.includes('rate limit')) {
    return 'Too many requests to YouTube. Wait a few minutes and try again.';
  }

  if (message.includes('http 404')) {
    return 'This video could not be found. It may have been deleted or the link might be incorrect.';
  }

  if (message.includes('http 403')) {
    return 'Access denied. This video might be private or restricted.';
  }

  // URL parsing errors
  if (message.includes('invalid url') || message.includes('malformed')) {
    return 'The video link does not appear to be valid. Check the URL and try again.';
  }

  if (message.includes('cannot read property') || message.includes('cannot parse')) {
    return 'There was a problem reading the video information. Try the link again or use a different video.';
  }

  // File system errors
  if (code === 'ENOENT') {
    return 'A required file or folder could not be found. This might indicate a setup issue.';
  }

  if (code === 'EACCES' || code === 'EPERM') {
    return 'Permission denied. Check that you have access to the vault folder.';
  }

  if (code === 'EISDIR') {
    return 'A path points to a folder instead of a file. This is usually a configuration issue.';
  }

  // JSON/parsing errors
  if (message.includes('json') || message.includes('unexpected token')) {
    return 'There was a problem reading configuration or data files. Try removing the file and letting it be recreated.';
  }

  // Generic fallback
  return 'Something went wrong. Check the logs for more information or try again.';
}

function formatErrorForUser(error, context = {}) {
  const message = getErrorMessage(error, context);

  // Format: What happened — Why it happened — How to fix
  let fullMessage = message;

  if (context.action) {
    fullMessage = `Failed to ${context.action} — ${message}`;
  }

  if (context.recovery) {
    fullMessage += ` You can try: ${context.recovery}`;
  }

  return fullMessage;
}

function logErrorPlainLanguage(logger, title, error, context = {}) {
  const message = formatErrorForUser(error, context);
  logger.error(title, message);

  // Log technical details separately (for debugging)
  // This goes to console/log file but NOT shown to user
  if (context.debug) {
    const stack = error.stack || String(error);
    logger.log('DEBUG', 'ERROR_DETAILS', title, stack);
  }
}

module.exports = {
  getErrorMessage,
  formatErrorForUser,
  logErrorPlainLanguage,
  // Common recovery suggestions
  recovery: {
    network: 'Check your internet connection, then try again',
    url: 'Verify the video URL is correct',
    permissions: 'Check vault folder permissions',
    retry: 'Wait a moment and try again',
    report: 'Contact support with the error details'
  }
};
