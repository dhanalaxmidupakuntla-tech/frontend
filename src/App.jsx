import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";

import Layout from "./components/layout/Layout";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons";
import Flashcards from "./pages/Flashcards";
import Leaderboard from "./pages/Leaderboard.jsx";
import SpeakingPractice from "./pages/SpeakingPractice";
import AITutor from "./pages/AITutor";
import Achievements from "./pages/Achievements";

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>

          {/* Public Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Layout Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="lessons" element={<Lessons />} />
            <Route path="flashcards" element={<Flashcards />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="speaking" element={<SpeakingPractice />} />
            <Route path="ai" element={<AITutor />} />
            <Route path="achievements" element={<Achievements />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;