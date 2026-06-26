# ✂️ CutPro – Premium Salon Appointment & Queue Management System

A full-stack MERN application that modernizes salon operations by enabling customers to book appointments online, select preferred barbers and services, manage queues in real time, and allowing barbers to efficiently organize their schedules and appointments.

---

## 📌 Overview

CutPro is a complete salon management platform built using the MERN stack. It provides an intuitive booking experience for customers while giving barbers and administrators powerful tools to manage appointments, availability, services, and live queues.

This project demonstrates real-world business logic including appointment scheduling, dynamic slot generation, queue management, working day configuration, leave management, blocked slots, reviews, authentication, and role-based dashboards.

---

# ✨ Features

## 👤 Customer

- Register & Login
- JWT Authentication
- Refresh Token Authentication
- Browse Services
- Select Preferred Barber
- Dynamic Appointment Booking
- Smart Time Slot Selection
- Multi-Service Booking
- Queue Check-In
- Live Queue Status
- Queue Position
- Estimated Wait Time
- Appointment History
- Submit Reviews

---

## 💈 Barber

- Barber Dashboard
- Manage Today's Appointments
- Queue Management
- Serve Next Customer
- Working Days Management
- Working Hours Management
- Leave Management
- Block Time Slots
- View Completed Appointments
- Dashboard Statistics

---

## 👨‍💼 Admin

- Manage Services
- Manage Barbers
- Manage Customers
- Approve Reviews
- Dashboard Overview

---

## 📅 Smart Appointment System

- Dynamic Slot Generation
- Multi-Service Duration Calculation
- Weekly Working Days
- Leave Management
- Blocked Slots
- Smart Available Slot Detection
- Fully Booked Slot Detection

---

## 🚶 Queue Management

- Customer Check-In
- Automatic Queue Number Generation
- Current Serving Customer
- Next Customer System
- Live Queue Preview
- Queue Analytics
- Dynamic Estimated Wait Time
- Queue Insights

---

## ⭐ Reviews

- Customer Reviews
- Rating Statistics
- Average Rating
- Admin Approval System

---

## 🔐 Authentication & Security

- JWT Authentication
- Refresh Tokens
- Protected Routes
- Role Based Authorization
- Password Hashing using bcrypt

---

# 🛠 Tech Stack

## Frontend

- React.js
- TypeScript
- React Router
- Tailwind CSS
- Axios
- Lucide Icons

---

## Backend

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- Cookie Parser
- Multer

---

## Database

- MongoDB Atlas / MongoDB

---

# 📂 Project Structure

```
CutPro
│
├── client
│   ├── src
│   │   ├── components
│   │   ├── pages
│   │   ├── lib
│   │   ├── hooks
│   │   ├── context
│   │   └── assets
│
├── server
│   ├── src
│   │   ├── controllers
│   │   ├── models
│   │   ├── routes
│   │   ├── middleware
│   │   ├── utils
│   │   └── config
│
└── README.md
```

---

# 🧠 Business Logic Highlights

### Smart Appointment Scheduling

Appointments are generated dynamically based on:

- Working Days
- Working Hours
- Slot Duration
- Barber Leaves
- Blocked Time Slots
- Existing Bookings
- Total Duration of Selected Services

---

### Queue Management

Each customer receives:

- Queue Number
- Queue Position
- Live Serving Status
- Estimated Waiting Time

The system automatically promotes the next waiting customer once the current service is completed.

---

### Availability Management

Barbers can configure:

- Weekly Working Days
- Start Time
- End Time
- Slot Duration
- Leave Dates
- Block Specific Time Slots

---

# 📷 Screenshots

> Add screenshots after deployment.

Examples:

- Home Page
- Booking Page
- Customer Dashboard
- Barber Dashboard
- Queue Page
- Availability Management
- Reviews
- Appointment Summary

---

# 🚀 Installation

## Clone Repository

```bash
git clone https://github.com/YourUsername/CutPro.git
```

---

## Backend

```bash
cd server
npm install
npm run dev
```

---

## Frontend

```bash
cd client
npm install
npm run dev
```

---

# 🔑 Environment Variables

Create a `.env` file inside the server folder.

```env
PORT=5000

MONGODB_URI=your_mongodb_connection

ACCESS_TOKEN_SECRET=your_secret

REFRESH_TOKEN_SECRET=your_secret

ACCESS_TOKEN_EXPIRY=1d

REFRESH_TOKEN_EXPIRY=7d

CLIENT_URL=http://localhost:5173
```

---

# 📖 API Modules

### Authentication

- Register
- Login
- Logout
- Refresh Token

### Users

- Customer
- Barber
- Admin

### Services

- CRUD Operations

### Appointments

- Create Appointment
- Get Appointments
- Update Appointment
- Cancel Appointment

### Queue

- Check In
- Current Serving
- Next Customer
- Queue Status
- Queue Analytics

### Availability

- Working Days
- Working Hours
- Leave
- Blocked Slots

### Reviews

- Submit Review
- Rating Statistics
- Approval

---

# 🎯 Learning Outcomes

This project demonstrates practical implementation of:

- REST APIs
- Authentication & Authorization
- Role Based Access Control
- MongoDB Relationships
- Dynamic Scheduling Algorithms
- Queue Management
- Business Rule Validation
- Dashboard Development
- React Component Architecture
- Full Stack MERN Development

---

# 🔮 Future Enhancements

- Razorpay Payment Integration
- Socket.IO Real-Time Updates
- Email Notifications
- Google Calendar Integration
- AI-Based Service Recommendations
- Analytics Dashboard
- PDF Invoice Generation

---

# 👨‍💻 Author

**Atharva Doiphode**

B.Tech Information Technology

VIIT Pune

GitHub:
https://github.com/AtharvDoiphode

---

# ⭐ Support

If you found this project helpful, consider giving it a ⭐ on GitHub.

It helps others discover the project and motivates future improvements.
