# Society Management System Backend

This is the backend API for the Society Management System, built with Express, TypeScript, and MongoDB.

## Features

- Admin and Tenant authentication
- Society management
- Tenant management
- Notice system
- Role-based access control

## Prerequisites

- Node.js >= 18.0.0
- MongoDB
- TypeScript

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file in the root directory:
```env
MONGODB_URI=mongodb://localhost:27017/rental-app
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
PORT=3000
```

3. Development:
```bash
npm run dev
```

4. Production build:
```bash
npm run build
npm start
```

## API Endpoints

### Auth
- `POST /api/admin/signup` - Admin signup
- `POST /api/admin/login` - Admin login
- `POST /api/tenant/login` - Tenant login

### Society Management (Admin only)
- `POST /api/admin/society` - Create society
- `GET /api/admin/society` - Get society details

### Tenant Management (Admin only)
- `POST /api/admin/tenants` - Create tenant
- `GET /api/admin/tenants` - List all tenants

### Notices
- `POST /api/notices` - Create notice (Admin only)
- `GET /api/notices/admin` - Get admin notices
- `GET /api/notices/tenant` - Get tenant notices

## Deployment

The backend is ready to be deployed on platforms like Render or Railway:

1. Set up environment variables on your hosting platform:
   - `MONGODB_URI` - Your MongoDB connection string
   - `JWT_SECRET` - Your JWT secret key
   - `PORT` - Port number (usually set by the platform)

2. Deploy using the platform's Git integration or CLI tools.

3. The build command is automatically set to run on deployment via the `postinstall` script.

## Development Notes

- TypeScript source files are in the `src` directory
- Built files will be in the `dist` directory
- API is CORS-enabled for frontend integration
- JWT authentication is required for protected routes
- Development mode includes fallback data for testing 