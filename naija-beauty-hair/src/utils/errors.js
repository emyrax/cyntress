const ERROR_MAP = {
  'permission-denied': {
    message: 'Access denied. You don\'t have permission to perform this action.',
    suggestion: 'Contact an administrator to upgrade your role.',
  },
  'unavailable': {
    message: 'Service temporarily unavailable.',
    suggestion: 'Please wait a moment and try again.',
  },
  'deadline-exceeded': {
    message: 'Request timed out.',
    suggestion: 'Check your internet connection and try again.',
  },
  'not-found': {
    message: 'The requested item was not found.',
    suggestion: 'It may have been deleted by another admin.',
  },
  'already-exists': {
    message: 'An item with this identifier already exists.',
    suggestion: 'Choose a different name or slug.',
  },
  'unauthenticated': {
    message: 'You are not logged in.',
    suggestion: 'Please sign in again.',
  },
  'network-error': {
    message: 'Network error.',
    suggestion: 'Check your internet connection and try again.',
  },
  'ai-no-key': {
    message: 'AI features are not available.',
    suggestion: 'Go to API Keys settings to add a Gemini API key.',
  },
  'ai-unavailable': {
    message: 'AI service is currently unavailable.',
    suggestion: 'Check your API key in API Keys settings or try again later.',
  },
  'ai-quota': {
    message: 'AI API quota exceeded.',
    suggestion: 'Wait a moment and try again, or upgrade your API plan.',
  },
}

export function friendlyError(err) {
  if (!err) return { message: 'An unknown error occurred.', suggestion: '' }

  const code = err.code || ''
  const msg = err.message || String(err)

  if (code.includes('permission-denied')) return ERROR_MAP['permission-denied']
  if (code.includes('unauthenticated')) return ERROR_MAP['unauthenticated']
  if (code.includes('not-found')) return ERROR_MAP['not-found']
  if (code.includes('already-exists')) return ERROR_MAP['already-exists']
  if (code.includes('deadline-exceeded')) return ERROR_MAP['deadline-exceeded']
  if (code.includes('unavailable')) return ERROR_MAP['unavailable']

  if (msg.includes('no key') || msg.includes('No Gemini')) return ERROR_MAP['ai-no-key']
  if (msg.includes('quota') || msg.includes('429') || msg.includes('QUOTA')) return ERROR_MAP['ai-quota']
  if (msg.includes('AI unavailable') || msg.includes('not available') || msg.includes('not ready')) return ERROR_MAP['ai-unavailable']

  if (msg.includes('Failed to fetch') || msg.includes('NetworkError') || msg.includes('network')) return ERROR_MAP['network-error']

  return {
    message: msg.replace(/^Error: /, '').slice(0, 200),
    suggestion: '',
  }
}
