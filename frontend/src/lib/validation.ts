export type FieldError = string | undefined;

export function validateName(value: string): FieldError {
  if (!value.trim()) return "Enter your name.";
  if (value.trim().length < 2) return "Name must be at least 2 characters.";
  return undefined;
}

export function validateEmail(value: string): FieldError {
  const v = value.trim();
  if (!v) return "Enter your email address.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v)) return "Enter a valid email address.";
  return undefined;
}

export function validatePassword(value: string): FieldError {
  if (!value) return "Enter a password.";
  if (value.length < 8) return "Use at least 8 characters.";
  if (!/[A-Za-z]/.test(value) || !/\d/.test(value)) return "Include at least one letter and one number.";
  return undefined;
}

export function validateConfirm(password: string, confirm: string): FieldError {
  if (!confirm) return "Confirm your password.";
  if (password !== confirm) return "Passwords do not match.";
  return undefined;
}

export function validateResumeFile(file: File | null, maxMb: number): FieldError {
  if (!file) return "Choose a resume file.";
  const okType = /\.(pdf|docx)$/i.test(file.name);
  if (!okType) return "Upload a PDF or DOCX file.";
  if (file.size > maxMb * 1024 * 1024) return `File must be under ${maxMb} MB.`;
  return undefined;
}
