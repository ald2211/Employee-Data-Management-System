import { Request, Response, NextFunction } from "express";
import { errorHandler } from "../utils/customError";
import { employeeDataValidationSchema } from "../utils/validator";
import Employee from "../models/employee.model";

//create Employee
export const createEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employeeId, name, email, phone, position } = req.body;

    const { error } = employeeDataValidationSchema.validate({
      name,
      email,
      phone,
      position,
      employeeId,
    });

    if (error) {
      next(errorHandler(400, error.details[0].message));
      return;
    }
    const existingConsignee = await Employee.findOne({ employeeId, email });
    if (existingConsignee) {
      next(errorHandler(400, "Employee already exists"));
      return;
    }
    const newEmployee = await Employee.create({
      employeeId,
      name,
      email,
      phone,
      position,
    });

    res.status(201).json({
      success: true,
      newEmployee,
      message: "Employee created successfully",
    });
  } catch (error: any) {
    console.log("error at creating employee:", error);
    if (error.code === 11000) {
      const duplicateField = Object.keys(error.keyPattern || {})[0]; // Get the duplicate field name

      if (duplicateField === "email") {
        next(errorHandler(400, "Email already exists."));
        return;
      } else if (duplicateField === "phone") {
        next(errorHandler(400, "Phone number already exists."));
        return;
      } else if (duplicateField === "employeeId") {
        next(errorHandler(400, "Employee id already exists."));
        return;
      }
    }
    next(errorHandler(500, "server error"));
  }
};

//get employee
export const getEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const searchTerm = req.query.search as string;
    let query = {};

    if (searchTerm && searchTerm.trim() !== "") {
      query = {
        $or: [
          { name: { $regex: searchTerm, $options: "i" } },
          { email: { $regex: searchTerm, $options: "i" } },
          { employeeId: { $regex: searchTerm, $options: "i" } },
        ],
      };
    }
    const employees = await Employee.find(query)
      .skip(skip)
      .limit(Number(limit))
      .sort({ createdAt: -1 });
    const totalCount = await Employee.countDocuments(query);
    const totalPages = Math.ceil(totalCount / limit);

    res.status(200).json({ success: true, employees, totalPages, totalCount });
  } catch (error: any) {
    console.log("error at get employees:", error);
    next(errorHandler(500, "server error"));
  }
};

//update Employee
export const updateEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { employeeId, name, email, position, phone } = req.body;
    const { id } = req.params;

    const employee = await Employee.findById(id);
    if (!employee) {
      next(errorHandler(400, "Employee not found"));
      return;
    }
    const { error } = employeeDataValidationSchema.validate({
      employeeId,
      name,
      email,
      position,
      phone,
    });

    if (error) {
      next(errorHandler(400, error.details[0].message));
      return;
    }

    const updatedEmployee = await Employee.findByIdAndUpdate(
      id,
      { employeeId, name, email, position, phone },
      { new: true } // this ensures the returned doc is the updated one
    );

    res.status(200).json({
      success: true,
      updatedEmployee,
      message: "Employee updated successfully",
    });
  } catch (error: any) {
    console.log("error at update employee:", error);
    next(errorHandler(500, "server error"));
  }
};

//delete employee
export const deleteEmployee = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const { id } = req.params;
    if (!id) {
      next(errorHandler(400, "Employee ID is required"));
      return;
    }

    const employee = await Employee.findById(id);
    if (!employee) {
      next(errorHandler(404, "Employee not found"));
      return;
    }

    await Employee.findByIdAndDelete(id);

    res
      .status(200)
      .json({ success: true, message: "Employee deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting employee:", error);
    next(errorHandler(500, "Server error"));
  }
};
