import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { KidModeProvider } from "./context/KidModeContext";
import { ThemeProvider } from "./context/ThemeContext";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Layout from "./components/layout/Layout";

import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import Dashboard from "./pages/Dashboard";
import Lessons from "./pages/Lessons.jsx";
import Flashcards from "./pages/Flashcards.jsx";
import Game from "./pages/Game.jsx";
import Leaderboard from "./pages/Leaderboard.jsx";
import SpeakingPractice from "./pages/SpeakingPractice.jsx";
import AITutor from "./pages/AITutor.jsx";
import Achievements from "./pages/Achievements.jsx";
import Alphabet from "./pages/Alphabet.jsx";
import AlphabetQuiz from "./pages/AlphabetQuiz";

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <KidModeProvider>
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
            <Route path="game" element={<Game />} />
            <Route path="leaderboard" element={<Leaderboard />} />
            <Route path="speaking" element={<SpeakingPractice />} />
            <Route path="ai" element={<AITutor />} />
            <Route path="achievements" element={<Achievements />} />
            <Route path="alphabet" element={<Alphabet />} />
            <Route path="quiz" element={<AlphabetQuiz />} />
          </Route>

          {/* 404 */}
          <Route path="*" element={<Navigate to="/" />} />

        </Routes>
          </BrowserRouter>
        </KidModeProvider>
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;