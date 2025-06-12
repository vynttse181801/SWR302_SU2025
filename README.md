# HIV Management System

This project consists of a frontend and backend application for managing HIV-related data and services.

## Project Structure

- `front-end/`: Contains the frontend application
- `hiv-backend/`: Contains the backend application

## Setup Instructions

### Frontend Setup
1. Navigate to the frontend directory:
```bash
cd front-end
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

### Backend Setup
1. Navigate to the backend directory:
```bash
cd hiv-backend
```

2. Install dependencies:
```bash
npm install
```

3. Start the server:
```bash
npm start
```

## Environment Variables

Make sure to set up the following environment variables:

### Frontend
Create a `.env` file in the frontend directory with:
```
VITE_API_URL=http://localhost:YOUR_BACKEND_PORT
```

### Backend
Create a `.env` file in the backend directory with:
```
PORT=YOUR_BACKEND_PORT
DATABASE_URL=YOUR_DATABASE_URL
```

## Contributing

1. Create a new branch for your feature
2. Make your changes
3. Submit a pull request

## License

This project is licensed under the MIT License. 