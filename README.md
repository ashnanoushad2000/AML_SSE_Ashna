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

- **GET /api/auth/session-check**
  - Check session status
  - Returns session details

- **GET /api/auth/validate**
  - Validate JWT token
  - Optionally includes user details

- **POST /api/register/check-email**
  - Check if email is already registered
  - Requires email
  - Returns email existence status

- **POST /api/register**
  - Register a new user
  - Requires email, password, and user details
  - Returns user ID upon success

- **PUT /api/profile/<user_id>/password**
  - Change user password
  - Requires current and new password

- **GET /api/auth/test**
  - Test database connection
  - Returns test user details if successful

### Media Management Endpoints

- **GET /api/media/search**
  - Search media items with optional filters (e.g., title, author, ISBN)

- **GET /api/media/categories**
  - Retrieve media categories
  - Returns categorized listings

- **POST /api/media/add**
  - Add new media items
  - Staff/Admin access only

- **GET /api/media/all**
  - Retrieve all media items
  - Returns detailed information about media

- **GET /api/media/<media_id>**
  - Retrieve a specific media item by ID

- **PUT /api/media/update/<media_id>**
  - Update a media item
  - Requires media ID and updated details

- **DELETE /api/media/delete/<media_id>**
  - Delete a media item
  - Requires media ID

- **GET /api/media/branches**
  - Retrieve all library branches

- **GET /api/media/inventory/categories**
  - Retrieve media categories available in inventory

### Loan Management Endpoints

- **GET /api/loans/user/<user_id>/active**
  - Retrieve active user loans
  - Shows loan status and details

- **GET /api/loans/user/<user_id>/all**
  - Retrieve all loans for a specific user
  - Shows loan history

- **POST /api/loans/create**
  - Create a new loan
  - Requires user and media details
  - Returns loan ID upon success

- **PUT /api/loans/<loan_id>/renew**
  - Renew a loan
  - Extends due date
  - Maximum renewals: 3

### Hold Management Endpoints

- **GET /api/holds/user/<user_id>**
  - Fetch all holds for a specific user
  - Requires valid JWT token

- **POST /api/holds/create**
  - Create a new hold
  - Requires user and media details

- **PUT /api/holds/<hold_id>/cancel**
  - Cancel a hold
  - Requires valid JWT token

- **PUT /api/holds/<hold_id>/ready**
  - Mark a hold as ready for pickup
  - Requires valid JWT token

- **PUT /api/holds/<hold_id>/fulfill**
  - Mark a hold as fulfilled
  - Requires valid JWT token

### Payment Management Endpoints

- **GET /api/payments/<user_id>**
  - Fetch payment details for a specific user
  - Includes category-wise breakdown and total

- **GET /api/deadlines/<user_id>**
  - Fetch upcoming payment deadlines for a user
  - Returns list of items with due dates and categories

- **POST /api/payments/make**
  - Mark a payment as completed for a specific user and category
  - Requires user ID and category

- **POST /api/payments/pay**
  - Process a payment and update transaction records
  - Requires user ID, amount, and payment method

### Transfer Management Endpoints

- **GET /api/transfers/getTransfers**
  - Fetch all transfers with source and destination branch names and media titles

- **PUT /api/transfers/updateStatus/<transfer_id>**
  - Update the status of a transfer
  - Handles cancellations and completions

- **GET /api/transfers/getAvailableMedia/<source_branch_id>**
  - Fetch available media items for a specific source branch

- **POST /api/transfers/initiateTransfer**
  - Initiate a new transfer
  - Requires source branch, destination branch, media ID, and quantity

- **GET /api/transfers/branches**
  - Retrieve all branches for source and destination dropdowns

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
