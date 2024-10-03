import * as Yup from 'yup';

export const loginSchema = Yup.object().shape({
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
});

export const registerSchema = Yup.object().shape({
    username: Yup.string().min(3, 'Username must be at least 3 characters').required('Username is required'),
    email: Yup.string().email('Invalid email').required('Email is required'),
    password: Yup.string().min(6, 'Password must be at least 6 characters').required('Password is required'),
    confirmPassword: Yup.string().oneOf([Yup.ref('password'), null], 'Passwords must match'),
});

export const fileUploadSchema = Yup.object().shape({
    file: Yup.mixed()
        .required('File is required')
        .test('fileFormat', 'Unsupported file format', (value) => {
            if (!value) return false;
            return ['application/pdf', 'text/plain', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'].includes(value.type);
        })
        .test('fileSize', 'File size is too large', (value) => {
            if (!value) return false;
            return value.size <= 5 * 1024 * 1024; // 5MB limit
        }),
});