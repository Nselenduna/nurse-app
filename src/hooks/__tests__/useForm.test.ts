import { act, renderHook } from '@testing-library/react-hooks';
import { useForm } from '../useForm';

describe('useForm', () => {
  // Test form values type
  interface TestForm {
    name: string;
    email: string;
    age: number;
  }
  
  // Initial values for tests
  const initialValues: TestForm = {
    name: '',
    email: '',
    age: 0,
  };
  
  // Sample validation function
  const validate = (values: TestForm) => {
    const errors: Partial<Record<keyof TestForm, string>> = {};
    
    if (!values.name) {
      errors.name = 'Name is required';
    }
    
    if (!values.email) {
      errors.email = 'Email is required';
    } else if (!values.email.includes('@')) {
      errors.email = 'Email is invalid';
    }
    
    if (values.age < 18) {
      errors.age = 'Must be at least 18';
    }
    
    return errors;
  };
  
  it('should initialize with initial values', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
    expect(result.current.isSubmitting).toBe(false);
  });
  
  it('should update values with handleChange', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.handleChange('name', 'John Doe');
    });
    
    expect(result.current.values.name).toBe('John Doe');
  });
  
  it('should mark fields as touched with handleBlur', () => {
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    act(() => {
      result.current.handleBlur('name');
    });
    
    expect(result.current.touched.name).toBe(true);
    expect(result.current.errors.name).toBe('Name is required');
  });
  
  it('should validate fields on blur', () => {
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    act(() => {
      result.current.handleChange('email', 'invalid-email');
      result.current.handleBlur('email');
    });
    
    expect(result.current.errors.email).toBe('Email is invalid');
  });
  
  it('should reset form to initial values', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.handleChange('name', 'John Doe');
      result.current.handleChange('email', 'john@example.com');
      result.current.handleChange('age', 25);
      result.current.setFieldError('name', 'Test error');
      
      result.current.resetForm();
    });
    
    expect(result.current.values).toEqual(initialValues);
    expect(result.current.errors).toEqual({});
    expect(result.current.touched).toEqual({});
  });
  
  it('should set form values', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.setFormValues({
        name: 'John Doe',
        email: 'john@example.com',
      });
    });
    
    expect(result.current.values).toEqual({
      name: 'John Doe',
      email: 'john@example.com',
      age: 0,
    });
  });
  
  it('should set field value', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.setFieldValue('age', 25);
    });
    
    expect(result.current.values.age).toBe(25);
  });
  
  it('should set field error', () => {
    const { result } = renderHook(() => useForm(initialValues));
    
    act(() => {
      result.current.setFieldError('name', 'Custom error');
    });
    
    expect(result.current.errors.name).toBe('Custom error');
  });
  
  it('should validate the form', () => {
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    let isValid;
    act(() => {
      isValid = result.current.validateForm();
    });
    
    expect(isValid).toBe(false);
    expect(result.current.errors.name).toBe('Name is required');
    expect(result.current.errors.email).toBe('Email is required');
    expect(result.current.errors.age).toBe('Must be at least 18');
    
    act(() => {
      result.current.setFormValues({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      });
      isValid = result.current.validateForm();
    });
    
    expect(isValid).toBe(true);
    expect(result.current.errors).toEqual({});
  });
  
  it('should handle form submission', async () => {
    const onSubmit = jest.fn();
    const { result } = renderHook(() => useForm(initialValues, validate));
    
    // Try submitting with invalid form
    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });
    
    // Form should be marked as touched but onSubmit should not be called
    expect(result.current.touched).toEqual({
      name: true,
      email: true,
      age: true,
    });
    expect(onSubmit).not.toHaveBeenCalled();
    
    // Update form with valid values
    act(() => {
      result.current.setFormValues({
        name: 'John Doe',
        email: 'john@example.com',
        age: 25,
      });
    });
    
    // Submit again
    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });
    
    // onSubmit should be called with form values
    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    });
  });
  
  it('should handle submission errors', async () => {
    const consoleErrorSpy = jest.spyOn(console, 'error').mockImplementation();
    const error = new Error('Submission failed');
    const onSubmit = jest.fn().mockRejectedValue(error);
    
    const { result } = renderHook(() => useForm({
      name: 'John Doe',
      email: 'john@example.com',
      age: 25,
    }));
    
    await act(async () => {
      await result.current.handleSubmit(onSubmit)();
    });
    
    expect(onSubmit).toHaveBeenCalled();
    expect(consoleErrorSpy).toHaveBeenCalledWith('Form submission error:', error);
    expect(result.current.isSubmitting).toBe(false);
    
    consoleErrorSpy.mockRestore();
  });
});
