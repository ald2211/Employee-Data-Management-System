import * as Yup from "yup";

export const employeeDataValidationSchema = Yup.object({
  employeeId: Yup.string()
    .matches(
      /^[A-Za-z][A-Za-z0-9_-]*$/,
      "Employee ID must start with a letter and can only contain letters, numbers, underscores, or dashes"
    )
    .min(3, "Employee ID must be at least 3 characters")
    .max(20, "Employee ID must be at most 20 characters")
    .required("Employee ID is required"),

  name: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z][A-Za-z0-9_]*(?: [A-Za-z0-9_]+)*$/,
      "Name must start with a letter and can contain letters, numbers, underscores, and single spaces (no leading or multiple spaces)"
    )
    .min(3, "Must be at least 3 characters")
    .required("Employee name is required"),

  email: Yup.string()
    .email("Invalid email format")
    .required("Email is required"),

  phone: Yup.string()
    .trim()
    .matches(
      /^(?:\+?[0-9]{1,3}[- ]?)?[0-9]{10}$/,
      "Phone number must be 10 digits, with optional country code"
    )
    .required("Phone number is required"),

  position: Yup.string()
    .trim()
    .matches(
      /^[A-Za-z][A-Za-z\s/-]*$/,
      "Position must start with a letter and can only contain letters, spaces, dashes, or slashes"
    )
    .min(2, "Position must be at least 2 characters")
    .max(50, "Position must be at most 50 characters")
    .required("Position is required"),
});
