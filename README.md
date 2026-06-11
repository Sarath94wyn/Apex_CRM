# ApexCRM - Client Relationship Hub

ApexCRM is a Customer Relationship Management (CRM) application built using the MERN stack (MongoDB, Express.js, React, Node.js) with styling powered by Tailwind CSS v4. It features a complete authentication pipeline, request body validation middleware, database integration, and full CRUD controls to manage client leads, prospects, contacts, and customers.

---

## Features

- **User Authentication**: Secure Sign-up and Login with password hashing (`bcryptjs`) and stateless token session management (`jsonwebtoken`).
- **CRM Dashboard & Analytics**: Dynamic summary metrics detailing total customer counts, leads, prospects, and active clients.
- **Full CRUD Operations**: Scoped client management (Create, Read, Update, Delete) restricted to authenticated user records.
- **Fuzzy Search Filter**: Real-time customer search by name, email, or company.
- **Input Validation Middleware**: Strict Express validation middleware blocking invalid email strings, empty values, or weak passwords with direct 400 Bad Request responses.
- **Responsive Layout**: Designed with Tailwind CSS v4, morphing from a structured tabular format on desktop displays to a stacked card layout on mobile browsers.
- **Premium Aesthetics**: Slate-themed aesthetics featuring custom Google Fonts (Outfit & Inter), backdrop glass filters, smooth animations, and active state rings.

---

## Directory Structure

```
project-root/
│
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/
│   │   │   ├── Navbar.jsx  # Navigation bar
│   │   │   └── Layout.jsx  # Layout wrapper with gradient mesh
│   │   ├── pages/
│   │   │   ├── Login.jsx   # Login page
│   │   │   ├── Register.jsx# Registration page
│   │   │   └── Userdata.jsx# Customer Management (CRUD dashboard)
│   │   ├── App.jsx         # Router & Route guards
│   │   ├── index.css       # Tailwind configuration & global styles
│   │   └── main.jsx        # App entry point
│   ├── vite.config.js      # Vite configuration with tailwindcss plugin
│   └── package.json
│
├── server/                 # Node.js + Express Backend
│   ├── config/
│   │   └── db.js           # Mongoose DB connection
│   ├── controllers/
│   │   ├── UserController.js      # Auth controllers
│   │   └── CustomerController.js  # Customer CRUD controllers
│   ├── middleware/
│   │   ├── Auth.js         # JWT validation middleware
│   │   └── Validation.js   # Request validation middleware
│   ├── models/
│   │   ├── UserModel.js           # User Schema
│   │   └── CustomerModel.js       # Customer Schema
│   ├── routes/
│   │   ├── UserRoutes.js          # Authentication routes
│   │   └── CustomerRoutes.js      # Customer CRUD routes
│   └── app.js              # Express app main entry
│
├── .env                    # Environment variables (Port, DB, JWT)
├── package.json            # Root workspace config with helper scripts
└── README.md               # Project documentation
```

---

## Prerequisites

- **Node.js** (v18 or higher recommended)
- **MongoDB** (Running locally on `mongodb://127.0.0.1:27017` or a MongoDB Atlas URI)

---

## Installation & Setup

### 1. Configure Environment Variables
A `.env` file exists in both the root folder and the `server` directory. Review or update them with your custom parameters:
```env
PORT=5000
MONGODB_URI=mongodb://127.0.0.1:27017/crm_db
JWT_SECRET=crm_super_secret_session_token_key_987654321
```

### 2. Install Dependencies
Run the installation script from the project root to install dependencies for both the frontend client and the backend server:
```bash
npm run install-all
```

---

## Running the Application

To run the application, you can spin up the client and server servers in separate terminal sessions:

### Start the Backend Server (Port 5000)
```bash
npm run server
```
*Runs via `nodemon` for active rebuilds on file modifications.*

### Start the Frontend Dev Server (Port 5173)
```bash
npm run client
```
*Launches Vite's hot-module replacement server.*

Once both are running, navigate to `http://localhost:5173` to interact with the application.

---

## Backend API Documentation

All request bodies must be JSON formatted.

### Authentication Endpoints

#### Register User
- **URL**: `/api/users/register`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "password": "mypassword"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60c72b2f9b1d8a2a4c8e76c1",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### Login User
- **URL**: `/api/users/login`
- **Method**: `POST`
- **Headers**: `Content-Type: application/json`
- **Body**:
  ```json
  {
    "email": "john@example.com",
    "password": "mypassword"
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60c72b2f9b1d8a2a4c8e76c1",
      "name": "John Doe",
      "email": "john@example.com",
      "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
    }
  }
  ```

#### Get User Profile
- **URL**: `/api/users/profile`
- **Method**: `GET`
- **Headers**: `Authorization: Bearer <token>`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60c72b2f9b1d8a2a4c8e76c1",
      "name": "John Doe",
      "email": "john@example.com"
    }
  }
  ```

### Customer CRM Endpoints

All customer endpoints require `Authorization: Bearer <token>` in the request header.

#### Create Customer
- **URL**: `/api/customers`
- **Method**: `POST`
- **Body**:
  ```json
  {
    "name": "Jane Smith",
    "email": "jane@company.com",
    "phone": "+1 555-019-2834",
    "company": "Acme Corp",
    "status": "Lead",
    "notes": "Met at convention last week"
  }
  ```
- **Response (201 Created)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60c72b2f9b1d8a2a4c8e76c2",
      "name": "Jane Smith",
      "email": "jane@company.com",
      "phone": "+1 555-019-2834",
      "company": "Acme Corp",
      "status": "Lead",
      "notes": "Met at convention last week",
      "createdBy": "60c72b2f9b1d8a2a4c8e76c1",
      "createdAt": "2026-06-11T12:00:00.000Z",
      "updatedAt": "2026-06-11T12:00:00.000Z"
    }
  }
  ```

#### Get All Customers
- **URL**: `/api/customers`
- **Method**: `GET`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "count": 1,
    "data": [
      {
        "_id": "60c72b2f9b1d8a2a4c8e76c2",
        "name": "Jane Smith",
        ...
      }
    ]
  }
  ```

#### Update Customer
- **URL**: `/api/customers/:id`
- **Method**: `PUT`
- **Body**: (fields to update)
  ```json
  {
    "status": "Prospect",
    "notes": "Scheduled product demo call next Tuesday."
  }
  ```
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "data": {
      "_id": "60c72b2f9b1d8a2a4c8e76c2",
      "name": "Jane Smith",
      "status": "Prospect",
      "notes": "Scheduled product demo call next Tuesday.",
      ...
    }
  }
  ```

#### Delete Customer
- **URL**: `/api/customers/:id`
- **Method**: `DELETE`
- **Response (200 OK)**:
  ```json
  {
    "success": true,
    "message": "Customer deleted successfully"
  }
  ```
