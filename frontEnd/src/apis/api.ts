import { Failed } from "../helpers/popup";
import axios, { AxiosError } from "axios";
import type { EmployeeType } from "../types";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL as string,
});

//create new employee
export const createNewEmployee = async (values: EmployeeType) => {
  try {
    const response = await api.post(`/v1/employee`, values);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("add employee Error:", error);
      Failed(error.response?.data?.message || "Failed to create Employee");
    } else {
      console.error("Unexpected Error:", error);
      Failed("An unexpected error occurred.");
    }
  }
};

//update employee
export const updateEmployee = async (
  values: EmployeeType,
  id: string | undefined
) => {
  try {
    const response = await api.put(`/v1/employee/${id}`, values);
    if (response.data.success) return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("update employee details Error:", error);
      Failed(error.response?.data?.message || "Failed to update Employee");
    } else {
      console.error("Unexpected Error:", error);
      Failed("An unexpected error occurred.");
    }
  }
};

//get all employees
export const getAllEmployees = async (
  search: string = "",
  page: number = 1,
  limit: number = 3
) => {
  try {
    const response = await api.get(`/v1/employee`, {
      params: {
        page,
        limit,
        search: search || undefined,
      },
    });
    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("fetch all employees Error:", error);
      Failed(error.response?.data?.message || "Failed to fetch Employees data");
    } else {
      console.error("Unexpected Error:", error);
      Failed("An unexpected error occurred.");
    }
  }
};

//delete employee
export const deleteEmployee = async (id: string) => {
  try {
    const response = await api.delete(`/v1/employee/${id}`);

    return response.data;
  } catch (error: unknown) {
    if (error instanceof AxiosError) {
      console.error("delete employee Error:", error);
      Failed(error.response?.data?.message || "Failed to delete Employee");
    } else {
      console.error("Unexpected Error:", error);
      Failed("An unexpected error occurred.");
    }
  }
};
