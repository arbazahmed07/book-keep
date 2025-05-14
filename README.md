````markdown
📚 BookKeep – MERN Application

A full-stack application built with a **React + Vite** frontend and **Node.js/Express** backend, using **MongoDB** for data storage and **Clerk** for authentication.
✨ Features

- 🔐 User authentication with **Clerk** (Google Sign-In)
- 👥 Role-based access: **Admin / Guest**
- 🧾 Form data management with **CRUD operations**
- 📱 Responsive UI with **Tailwind CSS**
- 🗃️ Persistent storage using **MongoDB**


 🚀 Setup Instructions

 🧰 Prerequisites

- Node.js (v16 or higher)
- MongoDB (local or Atlas)
- Clerk account with configured application



🖥️ Client Setup (React + Vite)

1. Navigate to the `client` directory:

   ```bash
   cd client
````

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:

   ```
   VITE_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
   VITE_API_URL=http://localhost:5000/api
   ```

4. Start the development server:

   ```bash
   npm run dev
   ```

---

 🔧 Server Setup (Node.js + Express)

1. Navigate to the `server` directory:

   ```bash
   cd server
   ```

2. Install backend dependencies:

   ```bash
   npm install
   ```

3. Create a `.env` file from `.env.example`:

   ```
   PORT=5000
   MONGODB_URI=mongodb://localhost:27017/bookkeep
   CLERK_SECRET_KEY=your_clerk_secret_key
   ```

4. Start the backend server:

   ```bash
   npm run dev
   ```

---

 🗂️ Application Structure

🖼️ Client

* Built with **React + Vite**
* Integrated **Clerk** authentication
* Clean, responsive UI using **Tailwind CSS**
* Role-based routing:

  * **Admin**: Full CRUD access to form data
  * **Guest**: Read-only access

 🛠️ Server

* RESTful API built with **Express.js**
* **MongoDB + Mongoose** for data modeling
* Clerk JWT verification middleware for protected routes
* Routes for:

  * `POST /api/forms` – Create entry
  * `GET /api/forms` – Read all entries
  * `PUT /api/forms/:id` – Update entry
  * `DELETE /api/forms/:id` – Delete entry

---

 📄 License

This project is licensed under the **MIT License**.
