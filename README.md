# TaskCollab

A full-stack task collaboration application with a React frontend and Node.js/Express backend.

## Structure

- `client/` - React + TypeScript + Vite frontend application
- `server/` - Node.js/Express backend API

## Client

The client is a React application built with TypeScript and Vite. See the [client README](client/README.md) for detailed setup and configuration instructions.

## Server

The server is a Node.js/Express API with MongoDB database integration.

### Setup

1. Navigate to the server directory:
   ```bash
   cd server
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Create a `.env` file based on the example below:
   ```env
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/taskcollab
   JWT_SECRET=your_jwt_secret_here
   NODE_ENV=development
   ```

4. Start the development server:
   ```bash
   npm run dev
   ```

### Available Scripts

- `npm run dev` - Start server with nodemon for development
- `npm start` - Start server in production mode
- `npm run lint` - Run ESLint for code quality
- `npm test` - Run Jest tests

### API Endpoints

- `POST /api/users/register` - Register a new user
- `POST /api/users/login` - Login user
- `GET /api/users/profile` - Get user profile (protected)
- `PUT /api/users/profile` - Update user profile (protected)
- `GET /api/tasks` - Get all tasks for the user (protected)
- `POST /api/tasks` - Create a new task (protected)
- `PUT /api/tasks/:id` - Update a task (protected)
- `DELETE /api/tasks/:id` - Delete a task (protected)

## Technologies

### Frontend
- React 18
- TypeScript
- Vite
- Zustand (state management)
- React Router DOM
- Axios (HTTP client)
- Tailwind CSS (styling)
- Zod (validation)

### Backend
- Node.js
- Express.js
- MongoDB with Mongoose
- JWT (authentication)
- bcryptjs (password hashing)
- Validator (input validation)
- Helmet (security headers)
- Cors (CORS middleware)
- Morgan (HTTP request logging)
- Rate-limiter-flexible (rate limiting)
- Jest (testing)
- ESLint (linting)

## Development

To run both client and server concurrently during development:

1. Start the server (in one terminal):
   ```bash
   cd server && npm run dev
   ```

2. Start the client (in another terminal):
   ```bash
   cd client && npm run dev
   ```

The client will be available at `http://localhost:5173` and the server at `http://localhost:5000`.

## Environment Variables

### Server (.env)
- `PORT` - Port for the server to listen on (default: 5000)
- `MONGODB_URI` - MongoDB connection string
- `JWT_SECRET` - Secret for signing JWT tokens
- `NODE_ENV` - Environment (development/production)

### Client (.env.vite)
- `VITE_API_URL` - Base URL for the API (default: http://localhost:5000/api)

## License

MIT