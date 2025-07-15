export function cn(...inputs: (string | undefined | null | false)[]): string {
  return inputs.filter(Boolean).join(' ');
}

export function formatTimestamp(date: Date): string {
  return date.toLocaleTimeString('en-US', {
    hour12: true,
    hour: 'numeric',
    minute: '2-digit',
  });
}

export function validateMessage(message: string): {
  isValid: boolean;
  error?: string;
} {
  if (!message.trim()) {
    return { isValid: false, error: 'Message cannot be empty' };
  }
  
  if (message.length > 500) {
    return { isValid: false, error: 'Message too long (max 500 characters)' };
  }
  
  return { isValid: true };
}