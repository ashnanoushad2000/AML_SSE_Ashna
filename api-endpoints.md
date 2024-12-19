# Advanced Media Library (AML) API Documentation

## Authentication Service (/api/v1/auth)

### Register User
**Endpoint**: POST /api/v1/auth/register  
**Description**: Creates a new user account  
**Headers**: 
- `Content-Type`: application/json

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword",
  "first_name": "John",
  "last_name": "Doe",
  "date_of_birth": "1990-01-01",
  "address": "123 Main St",
  "post_code": "12345",
  "phone": "+1234567890"
}
```

**Response**: 
- Status: 201 Created
```json
{
  "access_token": "jwt_token",
  "user_id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "user_type": "MEMBER"
}
```

### Login
**Endpoint**: POST /api/v1/auth/login  
**Description**: Authenticates a user and returns a JWT token  
**Headers**:
- `Content-Type`: application/json

**Request Body**:
```json
{
  "email": "user@example.com",
  "password": "securepassword"
}
```

**Response**:
- Status: 200 OK
```json
{
  "access_token": "jwt_token",
  "user_id": "uuid",
  "email": "user@example.com",
  "full_name": "John Doe",
  "user_type": "MEMBER"
}
```

## Media Service (/api/v1/media)

### Search Media
**Endpoint**: GET /api/v1/media/search  
**Description**: Searches for media items based on various criteria  
**Headers**:
- `Authorization`: Bearer [token]

**Query Parameters**:
- `query` (string, optional): Search text for title/author/description
- `mediaType` (string, optional): Type of media
- `branch` (string, optional): Branch ID
- `isAvailable` (boolean, optional): Availability status
- `isOnHold` (boolean, optional): Hold status

**Response**:
- Status: 200 OK
```json
[
  {
    "media_id": "uuid",
    "title": "Book Title",
    "author": "Author Name",
    "isbn": "1234567890",
    "publication_date": "2024-01-01",
    "publisher": "Publisher Name",
    "item_description": "Description"
  }
]
```

### Add Single Media
**Endpoint**: POST /api/v1/media  
**Description**: Adds a new media item to the system  
**Headers**:
- `Authorization`: Bearer [token]
- `Content-Type`: application/json

**Request Body**:
```json
{
  "title": "Book Title",
  "author": "Author Name",
  "isbn": "1234567890",
  "publication_date": "2024-01-01",
  "total_copies": 5,
  "branch_id": "uuid",
  "item_description": "Description",
  "publisher": "Publisher Name"
}
```

**Response**:
- Status: 201 Created
```json
{
  "success": true,
  "message": "Media added successfully",
  "media_id": "uuid"
}
```

## Loans Service (/api/v1/loans)

### Get User Loans
**Endpoint**: GET /api/v1/loans/user/{userId}/loans  
**Description**: Retrieves all loans for a specific user  
**Headers**:
- `Authorization`: Bearer [token]

**Response**:
- Status: 200 OK
```json
[
  {
    "loan_id": "uuid",
    "media_id": "uuid",
    "issue_date": "2024-01-01T00:00:00Z",
    "due_date": "2024-01-15T00:00:00Z",
    "status": "ACTIVE",
    "renewals_count": 0
  }
]
```

### Renew Loan
**Endpoint**: POST /api/v1/loans/loans/{loanId}/renew  
**Description**: Renews an existing loan  
**Headers**:
- `Authorization`: Bearer [token]

**Response**:
- Status: 200 OK
```json
{
  "success": true,
  "message": "Loan renewed successfully",
  "new_due_date": "2024-01-29T00:00:00Z"
}
```

### Place Hold
**Endpoint**: POST /api/v1/loans/holds  
**Description**: Places a hold on a media item  
**Headers**:
- `Authorization`: Bearer [token]
- `Content-Type`: application/json

**Request Body**:
```json
{
  "userId": "uuid",
  "mediaId": "uuid"
}
```

**Response**:
- Status: 201 Created
```json
{
  "hold_id": "uuid",
  "status": "PENDING",
  "request_date": "2024-01-01T00:00:00Z"
}
```

## Inventory Service (/api/v1/inventory)

### Get Branch Inventory
**Endpoint**: GET /api/v1/inventory/{branchId}  
**Description**: Retrieves inventory for a specific branch  
**Headers**:
- `Authorization`: Bearer [token]

**Response**:
- Status: 200 OK
```json
[
  {
    "inventory_id": "uuid",
    "media_id": "uuid",
    "total_copies": 5,
    "available_copies": 3,
    "last_updated": "2024-01-01T00:00:00Z"
  }
]
```

### Initiate Transfer
**Endpoint**: POST /api/v1/inventory/transfers  
**Description**: Initiates a transfer of media items between branches  
**Headers**:
- `Authorization`: Bearer [token]
- `Content-Type`: application/json

**Request Body**:
```json
{
  "source_branch_id": "uuid",
  "destination_branch_id": "uuid",
  "media_id": "uuid",
  "quantity": 2
}
```

**Response**:
- Status: 201 Created
```json
{
  "transfer_id": "uuid",
  "status": "PENDING",
  "initiated_at": "2024-01-01T00:00:00Z"
}
```

## Common Response Codes

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Authentication

All protected endpoints require a valid JWT token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

The token can be obtained through the login endpoint and remains valid for 1 hour as specified in the configuration.