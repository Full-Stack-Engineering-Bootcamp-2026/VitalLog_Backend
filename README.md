# VitalLog Backend

Backend service for the VitalLog Personal Health & Fitness Dashboard.

# Dependencies Used

- Node.js
- Express.js
- TypeScript
- MySQL
- TypeORM
- JWT
- Argon2
- Joi
- TypeDI
- SendGrid
- Multer
- Backblaze B2 (S3 Compatible)
- AWS SDK S3 Client
- dotenv


# Features

## Authentication & Authorization

- JWT-based authentication
- Role-based authorization
- Register/Login system
- Force password reset
- Forgot password & reset password flow
- Secure password hashing using Argon2

## Member Features

- Log health vitals
- Log fitness activities
- Automatic vital status calculation
- Automatic health flag generation
- Daily streak tracking
- Profile management
- Profile image upload using Backblaze B2
- Change password

## Staff Features

- View active members
- Access member dashboards
- Monitor member vitals
- Raise manual flags
- Resolve flags with notes
- View all flagged profiles

## Admin Features

- Manage staff accounts
- Deactivate/reactivate users
- Platform analytics
- Registration trend metrics
- Flag distribution analytics

## Additional Features

- Pagination, filtering & search
- Secure image uploads
- Pre-signed image URLs
- Modular domain-driven architecture

---

# Environment Variables

Create a `.env` file in the root directory.

env
DB_HOST=localhost
DB_PORT=3306
DB_USERNAME=admin
DB_PASSWORD=Admin@123
DB_NAME=vitallog_db

JWT_SECRET=your_jwt_secret

SENDGRID_API_KEY=your_sendgrid_api_key
SENDGRID_FROM_EMAIL=your_email

FRONTEND_URL=http://localhost:5173

B2_ENDPOINT=https://s3.us-east-005.backblazeb2.com
B2_REGION=us-east-005
B2_BUCKET_NAME=VitalLog
B2_ACCESS_KEY_ID=your_b2_access_key
B2_SECRET_ACCESS_KEY=your_b2_secret_key
