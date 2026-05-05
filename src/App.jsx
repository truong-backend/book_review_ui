// src/App.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useAuth } from "./Context/AuthContext";

// Pages
import HomePage from "./page/HomePage";
import BooksPage from "./page/BooksPage";
import BookDetailPage from "./page/BookDetailPage";
import BookFormPage from "./page/BookFormPage";
import LoginPage from "./page/LoginPage";
import RegisterPage from "./page/RegisterPage";
import ProfilePage from "./page/ProfilePage";
import NotFoundPage from "./page/NotFoundPage";

function App() {
  const { user } = useAuth();

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/books" element={<BooksPage />} />
        <Route path="/books/:id" element={<BookDetailPage />} />

        {/* Auth Routes */}
        <Route
          path="/login"
          element={!user ? <LoginPage /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!user ? <RegisterPage /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        <Route
          path="/books/new"
          element={user ? <BookFormPage /> : <Navigate to="/login" />}
        />
        <Route
          path="/books/:id/edit"
          element={user ? <BookFormPage /> : <Navigate to="/login" />}
        />
        <Route path="/profile/:id" element={<ProfilePage />} />

        {/* Error Pages */}
        <Route path="/503" element={<NotFoundPage serviceDown={true} />} />
        <Route path="/404" element={<NotFoundPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>
    </>
  );
}

export default App;