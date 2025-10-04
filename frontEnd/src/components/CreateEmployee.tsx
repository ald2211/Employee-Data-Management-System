import { useFormik } from "formik";
import { Success } from "../helpers/popup";
import { X } from "lucide-react";
import { employeeDataValidationSchema } from "../schemas";
import type { EmployeeType } from "../types";
import { createNewEmployee } from "../apis/api";

interface CreateEmployeeModalProps {
  closeModal: () => void;
  updateEmployees: (
    callback: (prevUsers: EmployeeType[]) => EmployeeType[]
  ) => void;
}

const CreateEmployeeModal: React.FC<CreateEmployeeModalProps> = ({
  closeModal,
  updateEmployees,
}) => {
  const formik = useFormik({
    initialValues: {
      employeeId: "",
      name: "",
      email: "",
      phone: "",
      position: "",
    },
    validationSchema: employeeDataValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      try {
        setSubmitting(true);

        const resp = await createNewEmployee(values);
        if (resp.success) {
          updateEmployees((prev) => [resp?.newEmployee, ...prev]);
          closeModal();
          Success(resp?.message);
        }
      } catch (error) {
        console.error("Error adding Employee:", error);
      } finally {
        setSubmitting(false);
      }
    },
  });

  return (
    <div className="fixed inset-0 modal_bg bg-opacity-50 flex justify-center items-center p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-2xl relative">
        {/* Close Button */}
        <button
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 cursor-pointer"
          onClick={closeModal}
        >
          <X className="text-2xl" />
        </button>

        <h2 className="text-2xl font-semibold mb-5 text-center">
          New Employee
        </h2>

        <form onSubmit={formik.handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <input
                name="employeeId"
                placeholder="Employee ID"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded w-full focus:outline-blue-400"
              />
              {formik.touched.employeeId && formik.errors.employeeId && (
                <p className="text-red-500 text-sm">
                  {formik.errors.employeeId}
                </p>
              )}
            </div>
            <div>
              <input
                name="name"
                placeholder="Name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded w-full focus:outline-blue-400"
              />
              {formik.touched.name && formik.errors.name && (
                <p className="text-red-500 text-sm">{formik.errors.name}</p>
              )}
            </div>
            <div>
              <input
                type="text"
                name="phone"
                placeholder="Phone"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded w-full focus:outline-blue-400"
              />
              {formik.touched.phone && formik.errors.phone && (
                <p className="text-red-500 text-sm">{formik.errors.phone}</p>
              )}
            </div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="Email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded w-full focus:outline-blue-400"
              />
              {formik.touched.email && formik.errors.email && (
                <p className="text-red-500 text-sm">{formik.errors.email}</p>
              )}
            </div>
            <div>
              <input
                type="position"
                name="position"
                placeholder="Position"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                className="border p-3 rounded w-full focus:outline-blue-400"
              />
              {formik.touched.position && formik.errors.position && (
                <p className="text-red-500 text-sm">{formik.errors.position}</p>
              )}
            </div>
            
          </div>

          {/* Buttons */}
          <div className="flex justify-end gap-3 mt-5">
            <button
              type="submit"
              disabled={formik.isSubmitting}
              className={`px-4 py-2 rounded-md shadow-md transition cursor-pointer ${
                formik.isSubmitting
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 text-white"
              }`}
            >
              {formik.isSubmitting ? "Creating..." : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateEmployeeModal;
