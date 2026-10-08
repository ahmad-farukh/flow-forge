export const required = (label) => ({ required: `${label} is required.` });
export const emailRule = { required: "Email is required.", pattern: { value: /^\S+@\S+\.\S+$/, message: "Enter a valid email." } };
export const passwordRule = { required: "Password is required.", minLength: { value: 8, message: "Use at least 8 characters." } };
