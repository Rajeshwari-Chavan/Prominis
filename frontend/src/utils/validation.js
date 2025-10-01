// Validation utilities for forms

export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

export const validatePassword = (password) => {
  // At least 8 characters, 1 uppercase, 1 lowercase, 1 number
  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d@$!%*?&]{8,}$/
  return passwordRegex.test(password)
}

export const validatePhone = (phone) => {
  const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/
  return phoneRegex.test(phone.replace(/\s/g, ''))
}

export const validateRequired = (value) => {
  return value && value.trim().length > 0
}

export const validateMinLength = (value, minLength) => {
  return value && value.length >= minLength
}

export const validateMaxLength = (value, maxLength) => {
  return value && value.length <= maxLength
}

export const validateNumber = (value) => {
  return !isNaN(value) && !isNaN(parseFloat(value))
}

export const validatePositiveNumber = (value) => {
  return validateNumber(value) && parseFloat(value) > 0
}

export const validateFileSize = (file, maxSizeMB = 8) => {
  const maxSizeBytes = maxSizeMB * 1024 * 1024
  return file.size <= maxSizeBytes
}

export const validateFileType = (file, allowedTypes = ['image/jpeg', 'image/png', 'application/pdf']) => {
  return allowedTypes.includes(file.type)
}

// Form validation schemas
export const loginSchema = {
  email: {
    required: true,
    validator: validateEmail,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    validator: (value) => validateMinLength(value, 1),
    message: 'Password is required'
  }
}

export const registerSchema = {
  firstName: {
    required: true,
    validator: (value) => validateMinLength(value, 2),
    message: 'First name must be at least 2 characters'
  },
  lastName: {
    required: true,
    validator: (value) => validateMinLength(value, 2),
    message: 'Last name must be at least 2 characters'
  },
  email: {
    required: true,
    validator: validateEmail,
    message: 'Please enter a valid email address'
  },
  password: {
    required: true,
    validator: validatePassword,
    message: 'Password must be at least 8 characters with uppercase, lowercase, and number'
  },
  confirmPassword: {
    required: true,
    validator: (value, formData) => value === formData.password,
    message: 'Passwords do not match'
  },
  role: {
    required: true,
    validator: (value) => ['REQUESTER', 'TASKER'].includes(value),
    message: 'Please select a valid role'
  }
}

export const jobCreateSchema = {
  title: {
    required: true,
    validator: (value) => validateMinLength(value, 5),
    message: 'Title must be at least 5 characters'
  },
  description: {
    required: true,
    validator: (value) => validateMinLength(value, 20),
    message: 'Description must be at least 20 characters'
  },
  budget: {
    required: true,
    validator: validatePositiveNumber,
    message: 'Budget must be a positive number'
  },
  deadline: {
    required: true,
    validator: (value) => new Date(value) > new Date(),
    message: 'Deadline must be in the future'
  },
  skills: {
    required: true,
    validator: (value) => value && value.length > 0,
    message: 'Please select at least one skill'
  }
}

export const profileUpdateSchema = {
  firstName: {
    required: true,
    validator: (value) => validateMinLength(value, 2),
    message: 'First name must be at least 2 characters'
  },
  lastName: {
    required: true,
    validator: (value) => validateMinLength(value, 2),
    message: 'Last name must be at least 2 characters'
  },
  email: {
    required: true,
    validator: validateEmail,
    message: 'Please enter a valid email address'
  },
  phone: {
    required: false,
    validator: (value) => !value || validatePhone(value),
    message: 'Please enter a valid phone number'
  }
}

// Generic form validator
export const validateForm = (data, schema) => {
  const errors = {}
  
  for (const [field, rules] of Object.entries(schema)) {
    const value = data[field]
    
    if (rules.required && !validateRequired(value)) {
      errors[field] = `${field} is required`
      continue
    }
    
    if (value && rules.validator) {
      const isValid = rules.validator(value, data)
      if (!isValid) {
        errors[field] = rules.message
      }
    }
  }
  
  return {
    isValid: Object.keys(errors).length === 0,
    errors
  }
}

