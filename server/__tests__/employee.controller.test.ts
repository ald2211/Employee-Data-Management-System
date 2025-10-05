import {
  createEmployee,
  getEmployee,
  updateEmployee,
  deleteEmployee,
} from "../controllers/employee.controller";
import Employee from "../models/employee.model";
import { errorHandler } from "../utils/customError";
import { employeeDataValidationSchema } from "../utils/validator";
import { Request, Response, NextFunction } from "express";

// mock Mongoose model
jest.mock("../models/employee.model");
jest.mock("../utils/validator");
jest.mock("../utils/customError");

const mockRequest = (body = {}, query = {}, params = {}) =>
  ({ body, query, params } as unknown as Request);

const mockResponse = () => {
  const res = {} as Response;
  res.status = jest.fn().mockReturnValue(res);
  res.json = jest.fn().mockReturnValue(res);
  return res;
};

const mockNext = jest.fn() as unknown as NextFunction;

describe("createEmployee controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return validation error if schema fails", async () => {
    (employeeDataValidationSchema.validate as jest.Mock).mockReturnValue({
      error: { details: [{ message: "Invalid data" }] },
    });

    const req = mockRequest({ name: "" });
    const res = mockResponse();

    await createEmployee(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(400, "Invalid data");
  });

  it("should return error if employee already exists", async () => {
    (employeeDataValidationSchema.validate as jest.Mock).mockReturnValue({
      error: null,
    });
    (Employee.findOne as jest.Mock).mockResolvedValue({ _id: "123" });

    const req = mockRequest({ employeeId: "E1", email: "test@example.com" });
    const res = mockResponse();

    await createEmployee(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(400, "Employee already exists");
  });

  it("should create new employee successfully", async () => {
    (employeeDataValidationSchema.validate as jest.Mock).mockReturnValue({
      error: null,
    });
    (Employee.findOne as jest.Mock).mockResolvedValue(null);
    (Employee.create as jest.Mock).mockResolvedValue({
      employeeId: "E1",
      name: "John",
    });

    const req = mockRequest({
      employeeId: "E1",
      name: "John",
      email: "john@example.com",
      phone: "12345",
      position: "Developer",
    });
    const res = mockResponse();

    await createEmployee(req, res, mockNext);

    expect(res.status).toHaveBeenCalledWith(201);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Employee created successfully",
      })
    );
  });
});

describe("getEmployee controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should fetch employees successfully without search term", async () => {
    (Employee.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([{ name: "John Doe" }]),
    });
    (Employee.countDocuments as jest.Mock).mockResolvedValue(1);

    const req = mockRequest({}, { page: "1", limit: "10" });

    const res = mockResponse();

    await getEmployee(req, res, mockNext);

    expect(Employee.find).toHaveBeenCalledWith({});
    expect(Employee.countDocuments).toHaveBeenCalledWith({});
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        employees: [{ name: "John Doe" }],
        totalPages: 1,
        totalCount: 1,
      })
    );
  });

  it("should build query correctly when search term provided", async () => {
    (Employee.find as jest.Mock).mockReturnValue({
      skip: jest.fn().mockReturnThis(),
      limit: jest.fn().mockReturnThis(),
      sort: jest.fn().mockResolvedValue([]),
    });
    (Employee.countDocuments as jest.Mock).mockResolvedValue(0);

    const req = mockRequest({}, { search: "john" });
    const res = mockResponse();

    await getEmployee(req, res, mockNext);

    expect(Employee.find).toHaveBeenCalledWith(
      expect.objectContaining({
        $or: expect.any(Array),
      })
    );
    expect(res.status).toHaveBeenCalledWith(200);
  });

  // it("should call errorHandler if an exception occurs", async () => {
  //   (Employee.find as jest.Mock).mockRejectedValueOnce(new Error("DB failed"));

  //   const req = mockRequest();
  //   const res = mockResponse();

  //   await getEmployee(req, res, mockNext);

  //   expect(mockNext).toHaveBeenCalledWith(errorHandler(500, "server error"));

  // });
});

describe("updateEmployee controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call errorHandler if employee not found", async () => {
    (Employee.findById as jest.Mock).mockResolvedValue(null);

    const req = mockRequest(
      { employeeId: "E1", name: "John" },
      {},
      { id: "123" }
    );
    const res = mockResponse();

    await updateEmployee(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(400, "Employee not found");
  });

  it("should call errorHandler if validation fails", async () => {
    (Employee.findById as jest.Mock).mockResolvedValue({ _id: "123" });
    (employeeDataValidationSchema.validate as jest.Mock).mockReturnValue({
      error: { details: [{ message: "Invalid input" }] },
    });

    const req = mockRequest({ employeeId: "", name: "" }, {}, { id: "123" });
    const res = mockResponse();

    await updateEmployee(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(400, "Invalid input");
  });

  it("should update employee successfully", async () => {
    (Employee.findById as jest.Mock).mockResolvedValue({ _id: "123" });
    (employeeDataValidationSchema.validate as jest.Mock).mockReturnValue({
      error: null,
    });
    (Employee.findByIdAndUpdate as jest.Mock).mockResolvedValue({
      _id: "123",
      employeeId: "E1",
      name: "Updated John",
    });

    const req = mockRequest(
      {
        employeeId: "E1",
        name: "Updated John",
        email: "john@example.com",
        position: "Dev",
        phone: "12345",
      },
      {},
      { id: "123" }
    );
    const res = mockResponse();

    await updateEmployee(req, res, mockNext);

    expect(Employee.findByIdAndUpdate).toHaveBeenCalledWith(
      "123",
      expect.objectContaining({ name: "Updated John" }),
      { new: true }
    );
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Employee updated successfully",
      })
    );
  });

  it("should handle unexpected error gracefully", async () => {
    (Employee.findById as jest.Mock).mockRejectedValueOnce(
      new Error("DB failed")
    );

    const req = mockRequest({}, {}, { id: "123" });
    const res = mockResponse();

    await deleteEmployee(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(errorHandler(500, "server error"));
    expect(errorHandler).toHaveBeenCalledWith(500, "Server error");
  });
});

describe("deleteEmployee controller", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call errorHandler if no ID is provided", async () => {
    const req = mockRequest({}, {}, {});
    const res = mockResponse();

    await deleteEmployee(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(400, "Employee ID is required");
  });

  it("should call errorHandler if employee not found", async () => {
    (Employee.findById as jest.Mock).mockResolvedValue(null);

    const req = mockRequest({}, {}, { id: "123" });
    const res = mockResponse();

    await deleteEmployee(req, res, mockNext);

    expect(mockNext).toHaveBeenCalled();
    expect(errorHandler).toHaveBeenCalledWith(404, "Employee not found");
  });

  it("should delete employee successfully", async () => {
    (Employee.findById as jest.Mock).mockResolvedValue({ _id: "123" });
    (Employee.findByIdAndDelete as jest.Mock).mockResolvedValue({});

    const req = mockRequest({}, {}, { id: "123" });
    const res = mockResponse();

    await deleteEmployee(req, res, mockNext);

    expect(Employee.findByIdAndDelete).toHaveBeenCalledWith("123");
    expect(res.status).toHaveBeenCalledWith(200);
    expect(res.json).toHaveBeenCalledWith(
      expect.objectContaining({
        success: true,
        message: "Employee deleted successfully",
      })
    );
  });

  it("should handle unexpected error gracefully", async () => {
    (Employee.findById as jest.Mock).mockRejectedValueOnce(
      new Error("DB failed")
    );

    const req = mockRequest({}, {}, { id: "123" });
    const res = mockResponse();

    await deleteEmployee(req, res, mockNext);

    expect(mockNext).toHaveBeenCalledWith(errorHandler(500, "server error"));
    expect(errorHandler).toHaveBeenCalledWith(500, "Server error");
  });
});
