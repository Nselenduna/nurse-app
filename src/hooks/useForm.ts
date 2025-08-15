import { useCallback, useState } from 'react';

/**
 * Form validation function type
 */
export type Validator<T> = (values: T) => Partial<Record<keyof T, string>>;

/**
 * Form submission handler type
 */
export type SubmitHandler<T> = (values: T) => void | Promise<void>;

/**
 * Custom hook for managing form state and validation
 * 
 * @template T - Form values type
 * @param {T} initialValues - Initial form values
 * @param {Validator<T>} validate - Form validation function
 * @returns {Object} Form state and handlers
 */
export function useForm<T extends Record<string, any>>(
  initialValues: T,
  validate?: Validator<T>
) {
  const [values, setValues] = useState<T>(initialValues);
  const [errors, setErrors] = useState<Partial<Record<keyof T, string>>>({});
  const [touched, setTouched] = useState<Partial<Record<keyof T, boolean>>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  /**
   * Handles input change
   * 
   * @param {keyof T} name - Field name
   * @param {any} value - Field value
   */
  const handleChange = useCallback((name: keyof T, value: any) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
    
    // Clear error when value changes
    if (errors[name]) {
      setErrors(prevErrors => ({
        ...prevErrors,
        [name]: undefined,
      }));
    }
  }, [errors]);
  
  /**
   * Handles input blur
   * 
   * @param {keyof T} name - Field name
   */
  const handleBlur = useCallback((name: keyof T) => {
    setTouched(prevTouched => ({
      ...prevTouched,
      [name]: true,
    }));
    
    // Validate field on blur if validation function exists
    if (validate) {
      const fieldErrors = validate(values);
      setErrors(prevErrors => ({
        ...prevErrors,
        ...fieldErrors,
      }));
    }
  }, [validate, values]);
  
  /**
   * Resets the form to initial values
   */
  const resetForm = useCallback(() => {
    setValues(initialValues);
    setErrors({});
    setTouched({});
    setIsSubmitting(false);
  }, [initialValues]);
  
  /**
   * Sets form values
   * 
   * @param {T} newValues - New form values
   */
  const setFormValues = useCallback((newValues: Partial<T>) => {
    setValues(prevValues => ({
      ...prevValues,
      ...newValues,
    }));
  }, []);
  
  /**
   * Sets a specific form field value
   * 
   * @param {keyof T} name - Field name
   * @param {any} value - Field value
   */
  const setFieldValue = useCallback((name: keyof T, value: any) => {
    setValues(prevValues => ({
      ...prevValues,
      [name]: value,
    }));
  }, []);
  
  /**
   * Sets a specific form field error
   * 
   * @param {keyof T} name - Field name
   * @param {string} error - Error message
   */
  const setFieldError = useCallback((name: keyof T, error: string) => {
    setErrors(prevErrors => ({
      ...prevErrors,
      [name]: error,
    }));
  }, []);
  
  /**
   * Validates the form
   * 
   * @returns {boolean} True if the form is valid
   */
  const validateForm = useCallback(() => {
    if (!validate) {
      return true;
    }
    
    const validationErrors = validate(values);
    setErrors(validationErrors);
    
    return Object.keys(validationErrors).length === 0;
  }, [validate, values]);
  
  /**
   * Handles form submission
   * 
   * @param {SubmitHandler<T>} onSubmit - Submit handler
   * @returns {(event?: React.FormEvent) => Promise<void>} Submit function
   */
  const handleSubmit = useCallback(
    (onSubmit: SubmitHandler<T>) => async (event?: React.FormEvent) => {
      if (event) {
        event.preventDefault();
      }
      
      setIsSubmitting(true);
      
      // Mark all fields as touched
      const allTouched = Object.keys(values).reduce(
        (acc, key) => ({
          ...acc,
          [key]: true,
        }),
        {} as Record<keyof T, boolean>
      );
      setTouched(allTouched);
      
      // Validate form
      const isValid = validateForm();
      
      if (isValid) {
        try {
          await onSubmit(values);
        } catch (error) {
          console.error('Form submission error:', error);
        }
      }
      
      setIsSubmitting(false);
    },
    [validateForm, values]
  );
  
  return {
    values,
    errors,
    touched,
    isSubmitting,
    handleChange,
    handleBlur,
    handleSubmit,
    resetForm,
    setFormValues,
    setFieldValue,
    setFieldError,
    validateForm,
  };
}
