# Prescripto 🩺

Prescripto is a fullstack medical appointment booking application built with the **MERN stack** (MongoDB, Express.js, React, Node.js). It offers a seamless experience for patients, doctors, and administrators to manage appointments, profiles, and more.

---

## 🔍 Features

### 👤 User Panel
- Register/Login with secure JWT authentication
- Browse doctors by specialty and availability
- View doctor profiles and book appointments
- Manage personal profile and appointment history
- Cancel scheduled appointments (with slot release)

### 🩻 Doctor Panel
- Secure login
- Configure availability and working hours
- Manage booked slots
- View upcoming and past appointments
- Update profile and contact details

### 🛠 Admin Panel (in development)
- Dashboard to manage doctors and users
- View overall appointment analytics
- Toggle doctor availability

---

## 🛠 Tech Stack

- **Frontend**: React, React Router, Axios, Tailwind CSS, Toastify
- **Backend**: Node.js, Express.js, JWT Authentication, Cloudinary (for image uploads), Multer
- **Database**: MongoDB Atlas
- **Testing**: Postman (manual), Jest + Supertest (planned)
- **Deployment**: Railway

---

## 📁 Project Structure

prescripto/
├── admin/ # Admin dashboard (React)
│ ├── node_modules/
│ ├── public/
│ ├── src/
│ │ └── .env
│ ├── .gitignore
│ ├── eslint.config.js
│ ├── index.html
│ ├── package.json
│ ├── package-lock.json
│ ├── README.md
│ └── vite.config.js
├── Backend/ # Backend API (Node.js, Express)
│ ├── config/
│ ├── controllers/
│ ├── middlewares/
│ ├── models/
│ ├── routes/
│ ├── node_modules/
│ ├── .env
│ ├── .gitignore
│ ├── package.json
│ ├── package-lock.json
│ └── server.js
├── frontend/ # Main client app (React)
│ ├── components/
│ ├── pages/
│ ├── context/
│ ├── assets/
│ └── README.md

## 🚀 Getting Started

### Prerequisites
- Node.js
- MongoDB Atlas account
- Cloudinary account (for profile image uploads)

### Backend Setup

cd backend
npm install

# Create a .env file with:
# MONGODB_URL=your_mongodb_connection_string
# JWT_SECRET=your_secret_key
# CLOUDINARY_CLOUD_NAME=...
# CLOUDINARY_API_KEY=...
# CLOUDINARY_API_SECRET=...

npm run server


### Frontend Setup
cd frontend
npm install
npm start