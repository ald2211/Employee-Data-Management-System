# Employee Data Management Platform

### Data Management Application

**Due to free plan some time it will take little more time to load**

[**Live Application Link**](https://employee-data-management-system.onrender.com/)

A simple full-stack CRUD (Create, Read, Update, Delete) application to manage a list of employees with features like search and pagination.

## Table of Contents

- [Overview](#overview)
- [Features and Functionalities](#features-and-functionalities)
  - [Employee Management](#1-employee-management)
  - [Search and Filtering](#2-search-and-filtering)
  - [Pagination](#3-pagination)
- [Technologies Used](#technologies-used)
- [Design Choices & Assumptions](#design-choices-&-assumptions)
- [Installation](#installation)
  - [Clone the Repository](#1-clone-the-repository)
  - [Install Dependencies](#2-install-dependencies)
  - [Testing and Run the Application](#3-run-the-application)
- [API Endpoints](#api-endpoints)
  - [Employee Management](#employee-management)
- [Usage](#usage)
- [Live Link](#live-link)
- [Contact](#contact)


## Overview

**The Employee Data Management Platform** is a user-friendly application that allows users to easily manage employee records through features like adding, editing, deleting, and viewing employees. Users can search employees by name, navigate through records with pagination, and efficiently organize employee information.

## Features and Functionalities

### 1. Employee Management

- **Add Employee**:  
  Users can add new employee records with details such as **employeeId**, **name**, **email**, **phone**, and **position** using a form built with Formik for form handling and Yup for validation.

- **View Employees**:  
  All employees are displayed in a table or list with **pagination** for easy navigation.

- **Edit Employee**:  
  Users can update employee details using an edit form or modal.

- **Delete Employee**:  
  Users can remove employee records from the system.

### 2. Search and Filtering

- **Debounced Search**:  
  Users can search employees by name with a debounce function to optimize performance and reduce unnecessary API calls.

- **Filter Results**:  
  Search results update dynamically, displaying only the matching employees.

### 3. Pagination

- **Page Navigation**:  
  Employees are displayed across multiple pages for better readability, allowing users to navigate easily between pages.


## Technologies Used

- **Frontend**: ReactJS with Typescript
- **Backend**: Node.js with Express.js with Typescript
- **Database**: MongoDB
- 
## Design Choices & Assumptions

-Form Handling & Validation: **Formik** & **Yup**
-Confirmation Modal: Custom reusable **useConfirm hook**
-Advanced Search: **Debouncing** to reduce API calls
-Pagination: For large datasets
-Backend Validation & Security: **Joi** for request validation & **Helmet** for security headers
-Frontend-Backend Integration: Frontend build served as static files from the backend
-Employee Data: employeeId, name, email, phone, position
-API Design: RESTful APIs

## Installation

Follow these steps to set up the application locally.

### 1. Clone the Repository

```bash

# Clone the repository
git clone https://github.com/ald2211/Employee-Data-Management-System.git
cd EmployeeDataManagement

```

### 2. Install dependencies

## Backend
npm install

## Frontend
cd frontEnd
npm install

### 3. Set up environment variables

Create a `.env` file in the root folder with the following content:

- **MONGO_URI**: Your MongoDB Atlas URI
- **PORT**: 3000
- **FRONTEND_URL** = http://localhost:5173 [your vite running port.]
- **VITE_BACKEND_URL** = http://localhost:3000/api [your server running port.]



### 4. Test and Run the application

>root folder
npm test
npm run build
npm start

## API Endpoints

### Employee Management
- **Fetch Employees**: `GET /api/v1/employee`  
- **Add Employee**: `POST /api/v1/employee`  
- **Update Employee**: `PUT /api/v1/employee/:id`  
- **Delete Employee**: `DELETE /api/v1/employee/:id`  

## Usage

1. **Add Employee**:  
   - Use the form to add a new employee with employeeId, name, email, phone, and position.

2. **View Employees**:  
   - All employees are displayed in a paginated table.  
   - Use the search bar to find employees by name (debounced search).

3. **Edit Employee**:  
   - Click the "Edit" button next to an employee to update their details via a form or modal.

4. **Delete Employee**:  
   - Click the "Delete" button to remove an employee from the list.

5. **Search Employees**:  
   - Type a name in the search bar to filter employees dynamically.

6. **Pagination**:  
   - Navigate between pages to view more employees if the list is long.



## Live Link

You can access the live version of the application at [Live Application Link](https://employee-data-management-system.onrender.com/)


## Contact

For any inquiries or support, feel free to reach out via email:

**Email**: [afnadca2@gmail.com](mailto:afnadca2@gmail.com)

