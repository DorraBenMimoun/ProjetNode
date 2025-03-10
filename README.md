# Task4You

**Task4You** is a simple and collaborative project management application that allows users to create and manage tasks within projects, collaborate with team members, leave comments on tasks, and see real-time updates using WebSockets.

## 🚀 Features

- ✅ **Task Management**: Create, edit, and manage tasks within projects.
- 💬 **Comments**: Leave comments on tasks for better collaboration.
- 🤝 **Collaboration**: Invite and work with other users on shared projects.
- 🔔 **Real-Time Updates**: Task updates and comments are broadcast instantly using WebSockets.
- 📅 **Checklist Support**: Manage sub-tasks with checklists inside tasks.

---

## 📁 Project Structure

```
Task4You/
├── backend/      # Node.js backend (API & WebSocket)
└── frontend/     # Angular frontend (UI & client-side logic)
```

---

## ⚙️ Installation & Setup

### 1. Clone the repository

```bash
git clone https://github.com/DorraBenMimoun/ProjetNode
cd Task4You
```

---

### 2. Backend Setup (Node.js)

Navigate to the backend folder:

```bash
cd backend
```

Install dependencies:

```bash
npm install
```

Start the backend server:

```bash
node index.js
```

By default, the backend runs on `http://localhost:9091/`.

---

### 3. Frontend Setup (Angular)

Navigate to the frontend folder:

```bash
cd ../frontend
```

Install dependencies:

```bash
npm install
```

Run the Angular app:

```bash
ng serve
```

By default, the frontend runs on `http://localhost:4200/`.

---

## ✅ Usage

- Access the frontend via `http://localhost:4200/`.
- Register or log in to your account.
- Create a new project and start adding tasks.
- Collaborate with team members in real-time.
- Leave comments and checklists on tasks.

---

## 💻 Technologies Used

- **Frontend**: Angular, TypeScript, HTML, CSS
- **Backend**: Node.js, Express.js, Socket.io (for WebSockets)
- **Database**: MongoDB

---

## 📡 Real-Time Features

Thanks to **WebSockets (Socket.io)**, all task updates, status changes, and comments are shared instantly with all connected users, ensuring seamless collaboration.

---

## 🤝 Contributing

Feel free to submit issues, fork the repository, and open pull requests. Contributions are always welcome!

---

## 📜 License

This project is licensed under the [MIT License](LICENSE).
