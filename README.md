# ☕ Gold Beans

> A full-stack e-commerce web application for premium coffee and coffee machines, featuring subscription plans, order management, and a dedicated admin dashboard.

---

## 🌐 Live Demo

> _Add your deployed URL here_

---

## 📖 About The Project

**Gold Beans** is a premium e-commerce platform built with the MERN stack. Customers can browse and purchase high-quality coffees and coffee machines, subscribe to recurring coffee delivery plans, and manage their profiles and order history. Admins have access to a dedicated dashboard to manage products, users, subscriptions, and orders.

### Key Features

- 🛒 Browse and purchase coffees and coffee machines
- 📦 One-time orders and recurring subscription plans
- 👤 User authentication (register, login, forgot/reset password, account activation)
- 🧑‍💼 Admin dashboard for managing products, users, orders, and subscriptions
- 🖼️ Image uploads for products and avatars
- 📧 Email notifications
- 🔐 JWT-based authentication & role-based access control

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React.js, Tailwind CSS |
| Backend | Node.js, Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT (JSON Web Tokens) |
| File Uploads | Multer |
| Email | Nodemailer |

---

## 📁 Project Structure

```
Gold-Beans
├── backend
│   └── src
│       ├── config          # Database and JWT configuration
│       ├── controllers     # Route handler logic
│       ├── middlewares     # Auth, validation, upload, error handling
│       ├── models          # Mongoose schemas
│       ├── repositories    # Database query abstraction layer
│       ├── services        # Business logic layer
│       ├── utils           # Utility helpers (email, purchase types)
│       └── validators      # Request validation schemas
│
└── frontend
    └── src
        ├── api             # Axios API instances
        ├── components      # Reusable UI components
        │   └── common      # Shared components (Navbar, Footer, Cards, etc.)
        ├── contexts        # React context (Auth, Cart, Breadcrumb)
        └── pages
            ├── admin       # Admin dashboard pages
            ├── client      # Logged-in user pages
            └── public      # Public pages (Home, Coffees, Machines, Auth)
```

---

## 🚀 Getting Started

### Prerequisites

Make sure you have the following installed:

- [Node.js](https://nodejs.org/) (v18+)
- [MongoDB](https://www.mongodb.com/) (local or Atlas)
- npm

---

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/Gold-Beans.git
cd Gold-Beans
```

---

### 2. Backend Setup

```bash
cd backend
npm install
```

Create a `.env` file in the `backend/` directory and add the following:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret
JWT_EXPIRES_IN=7d

EMAIL_HOST=smtp.your-email-provider.com
EMAIL_PORT=587
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_email_password

CLIENT_URL=http://localhost:3000
```

Start the backend server:

```bash
npm run dev
```

---

### 3. Frontend Setup

```bash
cd ../frontend
npm install
```

Create a `.env` file in the `frontend/` directory and add:

```env
REACT_APP_API_URL=http://localhost:5000/api
```

Start the frontend:

```bash
npm start
```

The app will be running at `http://localhost:3000`.

---

## 📸 Screenshots

> _Add screenshots of your app here_

| Home Page | Coffee Catalog | Admin Dashboard |
|---|---|---|
| ![Home](./screenshots/home.png) | ![Catalog](./screenshots/catalog.png) | ![Admin](./screenshots/admin.png) |

---

## 👥 Authors

> _Add your team members here_

- [@your-username](https://github.com/your-username)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

<p align="center">Made with ☕ by the Gold Beans team</p>