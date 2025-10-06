import { useCallback, useEffect, useState } from "react";
import {
  Search,
  Plus,
  ChevronLeft,
  ChevronRight,
  Edit,
  Trash2,
} from "lucide-react";
import type { EmployeeType } from "../types";
import CreateEmployeeModal from "./CreateEmployee";
import { deleteEmployee, getAllEmployees } from "../apis/api";
import { debounce } from "lodash";
import UpdateEmployeeModal from "./UpdateEmployee";
import { Success } from "../helpers/popup";
import { useConfirm } from "../hooks/useConfirm";

const EmployeeManagementSystem = () => {
  //confirm dialog
  const { confirm, ConfirmDialog } = useConfirm();
  //employee data state
  const [employees, setEmployees] = useState<EmployeeType[]>([]);

  //loading state
  const [loading, setLoading] = useState(true);

  //modal states
  const [showAddEmployeeModal, setShowAddEmployeeModal] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<EmployeeType | null>(
    null
  );

  // Filter employees based on search query
  const [searchQuery, setSearchQuery] = useState("");

  // Pagination logic
  const [currentPage, setCurrentPage] = useState(1);
  const [totalEmployees, setTotalEmployees] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const pageSize = 3;
  const startIndex = (currentPage - 1) * pageSize + 1;
  const endIndex = Math.min(currentPage * pageSize, totalEmployees);

  useEffect(() => {
    setSelectedEmployee(null); // Reset selected employee when reaching the list page
  }, [setSelectedEmployee]);

  // Function to fetch employees from backend
  const fetchEmployees = async (query = "", page = 1) => {
    setLoading(true);

    try {
      const response = await getAllEmployees(query, page);

      setEmployees(response.employees || []); // Ensure it's always an array
      setTotalPages(response.totalPages || 1); // Default to 1 if missing
      setTotalEmployees(response.totalCount || 0);
    } catch (err) {
      console.log("Failed listing employees:", err);
      setEmployees([]); // Reset employees on error
      setTotalPages(1);
      setTotalEmployees(0);
    } finally {
      setLoading(false);
    }
  };

  // Debounced function for searching
  const debouncedFetch = useCallback(
    debounce((query, page) => {
      fetchEmployees(query, page);
    }, 500),
    []
  );

  // Fetch employees on search or page change
  useEffect(() => {
    debouncedFetch(searchQuery, currentPage);
  }, [searchQuery, currentPage, debouncedFetch]);

  // Handle page change
  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  //refresh employees list
  const refreshEmployees = async (page = 1) => {
    setCurrentPage(page);
    setLoading(true);
    try {
      await fetchEmployees(searchQuery, page);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    const ok = await confirm("Are you sure you want to delete this Employee?");
    if (!ok) return;
    setLoading(true);
    try {
      const resp = await deleteEmployee(id);
      if (resp.success) {
        Success(resp.message || "Employee deleted successfully.");
        // Refetch employees for current page
        // If current page becomes empty after deletion, go to previous page
        const newTotal = totalEmployees - 1;
        const lastPage = Math.ceil(newTotal / pageSize);
        const newPage = currentPage > lastPage ? lastPage : currentPage;
        await refreshEmployees(newPage);
      } else {
        throw new Error(resp.message || "Failed to delete Employee.");
      }
    } catch (err) {
      console.log(err, "error deleting employee");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar */}
      <nav className="bg-blue-600 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-xl sm:text-2xl font-bold text-center">
            Employee Data Management System
          </h1>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Search and Create Section */}
        <div className="mb-6 flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
          {/* Search Bar */}
          <div className="relative flex-1 max-w-md">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search employees..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setCurrentPage(1);
              }}
              className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
            />
          </div>

          {/* Create Employee Button */}
          <button
            onClick={() => setShowAddEmployeeModal(true)}
            className="flex items-center cursor-pointer justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 shadow-md"
          >
            <Plus className="h-5 w-5" />
            <span>Create Employee</span>
          </button>
        </div>

        {/* Employee Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Employee ID
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden sm:table-cell">
                    Email
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider hidden md:table-cell">
                    Phone
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Position
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {loading ? (
                  <tr>
                    <td colSpan={6} className="py-20">
                      <div className="flex justify-center items-center">
                        <div className="animate-spin h-10 w-10 border-4 border-indigo-600 border-t-transparent rounded-full"></div>
                      </div>
                    </td>
                  </tr>
                ) : employees?.length > 0 ? (
                  employees.map((employee) => (
                    <tr
                      key={employee._id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-4 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {employee.employeeId}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.name}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">
                        {employee.email}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-600 hidden md:table-cell">
                        {employee.phone}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        {employee.position}
                      </td>
                      <td className="px-4 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="flex gap-2">
                          <button
                            onClick={() => setSelectedEmployee(employee)}
                            className="p-1.5 text-blue-600 cursor-pointer hover:bg-blue-50 rounded-lg transition-colors"
                            title="Edit Employee"
                          >
                            <Edit className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDeleteEmployee(employee._id || "")
                            }
                            className="p-1.5 cursor-pointer text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            title="Delete Employee"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={6}
                      className="px-4 py-8 text-center text-sm text-gray-500"
                    >
                      No employees found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
            {ConfirmDialog}
          </div>

          {/* Pagination */}
          {!loading && employees?.length > 0 && (
            <div className="bg-white px-4 py-3 border-t border-gray-200 sm:px-6">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="text-sm text-gray-700">
                  Showing <span className="font-medium">{startIndex}</span> to{" "}
                  <span className="font-medium">{endIndex}</span> of{" "}
                  <span className="font-medium">{totalEmployees}</span> results
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={currentPage === 1}
                    className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="h-5 w-5" />
                  </button>
                  <div className="flex gap-1">
                    {[...Array(totalPages)].map((_, idx) => (
                      <button
                        key={idx + 1}
                        onClick={() => handlePageChange(idx + 1)}
                        className={`px-3 py-1 cursor-pointer rounded-lg text-sm font-medium transition-colors ${
                          currentPage === idx + 1
                            ? "bg-blue-600 text-white"
                            : "bg-white border border-gray-300 text-gray-700 hover:bg-gray-50"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded-lg border cursor-pointer border-gray-300 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="h-5 w-5" />
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      {/* Modals */}
      {showAddEmployeeModal && (
        <CreateEmployeeModal
          closeModal={() => setShowAddEmployeeModal(false)}
          refreshEmployees={refreshEmployees}
        />
      )}
      {selectedEmployee && (
        <UpdateEmployeeModal
          employee={selectedEmployee}
          closeModal={() => setSelectedEmployee(null)}
          updateEmployees={setEmployees}
        />
      )}
    </div>
  );
};

export default EmployeeManagementSystem;
