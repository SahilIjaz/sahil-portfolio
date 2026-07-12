export interface ContactFormData {
  name?: string;
  email?: string;
  message?: string;
}

export const validateForm = (data: ContactFormData) => {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};
  if (!data.name) errors.name = 'Name is required';
  if (!data.email) errors.email = 'Email is required';
  return errors;
};
