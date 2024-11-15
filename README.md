# Authentication API

This project provides a simple authentication system using Express, MongoDB, and Resend for email verification. It allows users to register, log in, and verify their email through a confirmation link sent to their inbox. The API is also equipped with JWT-based authorization for secure access to protected endpoints.

## Features

- User registration with email and password
- Password hashing using `bcrypt`
- Token-based email verification with expiration
- Login with email and password
- JWT-based authorization for secure route access
- MongoDB for storing user data

## Technologies Used

- **Node.js** (Express framework)
- **MongoDB** (with Mongoose)
- **bcrypt** (for hashing passwords)
- **crypto** (for generating tokens)
- **Resend** (for sending email confirmation)
- **jsonwebtoken** (for generating and verifying JWT tokens)

## Installation

Follow these steps to get the project up and running on your local machine.

### 1. Clone the repository

```
git clone https://github.com:anastasia2022be1/backend-registration.git
```

### 2. Install dependencies

Navigate to the project directory and run:

```
npm install
```

### 3. Set up environment variables

Create a .env file in the root of your project and add the following:

```
DB_URI=your_MongoDB_database_URL
RESEND_API_KEY=your_resend_api_key
EMAIL_ADDRESS=your_email_address
JWT_SECRET_KEY=your_jwt_secret_key

```

- **DB_URI** is your MongoDB database URL.
- **RESEND_API_KEY** is the API key you get from Resend.
- **EMAIL_ADDRESS** is the email address you want to use to send verification emails.
- **JWT_SECRET_KEY** is the secret key used to sign JWT tokens (for secure authentication).

### 4. Run the project

Start the server:

```
npm run dev
```

The API will be running on http://localhost:3000.

## Endpoints

### 1. POST /register

Registers a new user. The request body should contain:

```
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

This will create a new user with a hashed password.
A verification email will be sent to the provided email address.

**Response**:

- **201 Created**: User created successfully and verification email sent.
- **400 Bad Request**: Missing email or password.
- **500 Internal Server Error**: Error in processing the registration.

## 2. GET /verify/:token

Verifies the user account using a token. The token is provided in the verification email.

**Response:**

- **200 OK**: Account successfully verified.
- **400 Bad Request**: Invalid or expired token.
- **500 Internal Server Error**: Error in verification process.

### 3. POST /login

Logs in a user. The request body should contain:

```
{
  "email": "user@example.com",
  "password": "yourpassword"
}
```

This will check if the provided credentials are valid and whether the account has been verified.

**Response**:

- **200 OK**: Successful login with user details.
- **400 Bad Reques**t: Missing email or password.
- **401 Unauthorized**: Invalid login credentials.
- **403 Forbidden**: Account not verified.
- **500 Internal Server Error**: Error in login process.

### 4. GET /reports

Protected route that requires JWT authentication. This endpoint is accessible only to authenticated users. It will return a confirmation message if the user’s JWT token is valid.

**Response:**

- **200 OK**: Authorized access, returns a message.
- **401 Unauthorized**: Access denied due to missing or invalid token.

### Example Usage of Protected Route

To access the /reports endpoint, include the JWT token from the /login response in the Authorization header of your request:

```
Authorization: Bearer your_jwt_token
```

### Middleware

- **authMiddleware**: Ensures that only authenticated users (with valid JWT tokens) can access protected routes, like /reports.

## Error Handling

The API provides appropriate error messages for various situations:

- Missing required fields (email, password).
- Invalid login credentials.
- Verification errors (expired token, unverified account).
- Unauthorized access to protected routes.

## Notes

- Make sure to update the .env file with correct values for the MongoDB connection, Resend API key, and the email address for sending verification emails.
- The project uses a simple in-memory verification system. Tokens are valid for 24 hours after registration.
- This API is designed for development purposes. In production, you should consider adding additional security measures (e.g., rate limiting, better error handling, logging).

### How to Use:

1. **Register**: The user submits their email and password. If successful, a verification email is sent.
2. **Verify**: The user clicks the verification link sent to their email.
3. **Login**: The user can log in with their email and password after verification.
4. **Access Protected Routes**: Use the received JWT token to access routes like /reports.
