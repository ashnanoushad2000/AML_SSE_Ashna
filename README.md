# Advanced Media Library (AML)

Advanced Media Library (AML) is a comprehensive library management system built with Angular and Flask, designed to streamline library operations and enhance user experience.

---

## Table of Contents
1. [Overview](#overview)
2. [Features](#features)
3. [Technology Stack](#technology-stack)
4. [System Requirements](#system-requirements)
5. [Setup Instructions](#setup-instructions)
   - [Backend Setup](#backend-setup)
   - [Frontend Setup](#frontend-setup)
6. [Project Structure](#project-structure)
7. [API Documentation](#api-documentation)
8. [Contributing Guidelines](#contributing-guidelines)
9. [Support Information](#support-information)

---

## Overview

The Advanced Media Library (AML) is a comprehensive library management system developed by **SAAD Group 16**. This system integrates modern web technologies with robust backend services to provide an efficient library management solution.

---

## Features

### User Authentication & Authorization
- Member registration and login functionality
- Staff and admin access levels
- Secure session management with JWT
- Role-based access control

### Media Management
- Comprehensive media catalog system
- Advanced search functionality with filters
- Real-time inventory tracking across branches
- Inter-branch media transfer system

### Member Services
- Book reservation system
- Hold requests management
- Online loan tracking and management
- Active loan monitoring
- Integrated fine payment system

### Staff Features
- Complete inventory management
- Media transfer handling
- Member account management
- Fine and payment processing

---

## Technology Stack

### Frontend Technologies
- Angular (v17)
- TailwindCSS for styling
- TypeScript
- ShadcnUI Components

### Backend Technologies
- Flask (Python)
- MySQL Database
- SQLAlchemy ORM
- JWT Authentication System

---

## System Requirements
- Node.js (Latest LTS Version)
- Python 3.8 or higher
- MySQL Server
- pip (Python Package Manager)
- Angular CLI

---

## Setup Instructions

### Backend Setup

1. Navigate to the backend directory:
   ```bash
   cd backend
   ```

2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # For Windows: venv\Scripts\activate
   ```

3. Install required dependencies:
   ```bash
   pip install -r requirements.txt
   ```

4. Configure the database:
   - Create the following MySQL databases:
     - `auth_db`
     - `loan_db`
     - `media_db`
     - `inventory_db`
     - `payment_db`
   - Import provided database dumps.
   - Update database credentials in `config.py`.

5. Launch the Flask server:
   ```bash
   python run.py
   ```

### Frontend Setup

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install node dependencies:
   ```bash
   npm install
   ```

3. Configure environment settings:
   - Verify API endpoints in `environment.ts`.

4. Launch the development server:
   ```bash
   ng serve
   ```

5. Access the application at: [http://localhost:4200](http://localhost:4200)

---

## Project Structure

```
Advanced-Media-Library/
├── backend/
│   ├── app/
│   │   ├── models/
│   │   ├── routes/
│   │   └── __init__.py
│   ├── config.py
│   └── requirements.txt
└── frontend/
    ├── src/
    │   ├── app/
    │   │   ├── components/
    │   │   ├── services/
    │   │   └── Route-Guards/
    │   └── environments/
    ├── angular.json
    └── package.json
```

---

## API Documentation

### Authentication Endpoints

- **POST /api/auth/login**
  - User login endpoint
  - Requires email and password
  - Returns JWT token

- **POST /api/auth/register**
  - New user registration
  - Requires user details
  - Returns confirmation

- **POST /api/auth/logout**
  - User logout endpoint
  - Invalidates current session

### Media Management Endpoints

- **GET /api/media/search**
  - Search media items
  - Supports multiple filters

- **GET /api/media/categories**
  - Retrieve media categories
  - Returns categorized listings

- **POST /api/media/add**
  - Add new media items
  - Staff/Admin access only

### Loan Management Endpoints

- **GET /api/loans/user/:id/active**
  - Retrieve active user loans
  - Shows loan status and details

- **POST /api/loans/create**
  - Create new loan record
  - Requires media and user ID

### Hold Management Endpoints

- **GET /api/holds/user/:id**
  - Retrieve user hold requests
  - Shows hold status

- **POST /api/holds/create**
  - Create new hold request
  - Requires media and user ID

- **PUT /api/holds/:id/cancel**
  - Cancel existing hold
  - Updates hold status

### Inventory Management Endpoints

- **GET /api/transfers/getTransfers**
  - Retrieve transfer records
  - Shows transfer status

- **POST /api/transfers/initiateTransfer**
  - Start new transfer
  - Requires source and destination

- **PUT /api/transfers/updateStatus/:id**
  - Update transfer status
  - Modifies transfer record

---

## Contributing Guidelines

1. Fork the repository.
2. Create a feature branch.
3. Submit a pull request with a detailed description.
4. Follow coding standards.
5. Include test coverage.
6. Update documentation as needed.

---

## Support Information

For technical support:
- Raise an issue in the repository.
- Contact the development team.
- Check documentation resources.

---

For additional information or clarification, please contact the **SAAD Group 16** development team.
