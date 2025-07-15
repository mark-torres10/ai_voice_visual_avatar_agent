/**
 * Video Generation Request Validation Middleware
 */

export const validateVideoRequest = (req, res, next) => {
  const { script, audioUrl, presenterId } = req.body;
  const errors = [];

  // Validate script
  if (!script) {
    errors.push('script is required');
  } else if (typeof script !== 'string') {
    errors.push('script must be a string');
  } else if (script.length === 0) {
    errors.push('script cannot be empty');
  } else if (script.length > 1000) {
    errors.push('script must be less than 1000 characters');
  }

  // Validate audioUrl
  if (!audioUrl) {
    errors.push('audioUrl is required');
  } else if (typeof audioUrl !== 'string') {
    errors.push('audioUrl must be a string');
  } else if (!isValidUrl(audioUrl)) {
    errors.push('audioUrl must be a valid HTTP/HTTPS URL');
  }

  // Validate optional presenterId
  if (presenterId && typeof presenterId !== 'string') {
    errors.push('presenterId must be a string');
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Request validation failed',
        details: errors
      }
    });
  }

  next();
};

export const validateAudioUrl = (url) => {
  try {
    const parsedUrl = new URL(url);
    return ['http:', 'https:'].includes(parsedUrl.protocol);
  } catch {
    return false;
  }
};

export const isValidUrl = (string) => {
  try {
    const url = new URL(string);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch (_) {
    return false;
  }
};

export const sanitizeScript = (script) => {
  if (!script) return '';
  
  // Remove potentially harmful characters
  return script
    .replace(/[<>]/g, '') // Remove HTML tags
    .replace(/[^\w\s.,!?'-]/g, '') // Keep only alphanumeric, spaces, and basic punctuation
    .trim()
    .substring(0, 1000); // Ensure max length
};

export default {
  validateVideoRequest,
  validateAudioUrl,
  isValidUrl,
  sanitizeScript
};