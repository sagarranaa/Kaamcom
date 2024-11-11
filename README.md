# Attendance Management System

This project is an Attendance Management System built using Node.js, Express, MongoDB, and React. It includes both frontend and backend code. The system provides role-based access, where **Admins** can manage all employees' attendance and download reports, while **Employees** can check in, check out, and view their own attendance records.

---

## Table of Contents
- [Features](#features)
- [Technologies Used](#technologies-used)
- [Project Structure](#project-structure)
- [Setup and Installation](#setup-and-installation)
- [Environment Variables](#environment-variables)
- [Running the Application](#running-the-application)
- [Backend API Routes](#backend-api-routes)
- [Frontend Usage](#frontend-usage)

---

## Features

### Admin Features
- View, edit, and delete attendance records for all employees
- Search attendance records by employee email
- Download individual employee attendance reports as PDF files

### Employee Features
- Check in and check out
- View personal attendance history

---

## Technologies Used

- **Frontend**: React, Material-UI, Redux, Axios
- **Backend**: Node.js, Express, MongoDB, Mongoose, PDFKit, Moment.js
- **Authentication**: JSON Web Token (JWT)
- **Styling**: Material-UI

---

## Project Structure


### Prerequisites
- Node.js (>=14.x)
- MongoDB (local instance or MongoDB Atlas)
- Git

## Backend API Routes

### Auth Routes (`authRoutes.js`)

- **POST** `/api/auth/register`  
  - Register a new user (only for initial setup).
  
- **POST** `/api/auth/login`  
  - User login with JWT authentication.

### Attendance Routes (`attendanceRoutes.js`)

- **GET** `/api/attendance`  
  - Fetch all attendance records (Admin only).

- **POST** `/api/attendance/checkin`  
  - Check in (Employee).

- **POST** `/api/attendance/checkout`  
  - Check out (Employee).

- **PUT** `/api/attendance/:id`  
  - Update an attendance record by ID (Admin only).

- **DELETE** `/api/attendance/:id`  
  - Delete an attendance record by ID (Admin only).

- **GET** `/api/attendance/export/pdf/:employeeId?`  
  - Download a PDF of an employee’s attendance record (Admin only).  
  - `:employeeId` is optional for the Admin to specify a specific employee's record.

- **GET** `/api/attendance/export/csv`  
  - Export attendance records in CSV format.

### Middleware

- **`authMiddleware.js`**:  
  - Checks for a valid JWT token in the authorization header and verifies the user's role as either **Admin** or **Employee** to control access to specific routes.
## Running the Application

1. **Make sure MongoDB is running**  
   Ensure that MongoDB is up and running, either as a local instance or on MongoDB Atlas. Update your `MONGO_URI` in the `.env` file accordingly.

2. **Start the backend server**  
   Open a terminal, navigate to the `backend` folder, and start the backend server using `nodemon`:

   ```bash
   cd backend
   nodemon server.js

3. **Start the frontend **  
   Open a terminal, navigate to the `frontend` folder:

   ```bash
   cd frontend
   npm start


