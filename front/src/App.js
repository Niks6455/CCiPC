import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "./pages/HomePage/HomePage";
import DataContext from "./context";
import "./styles/app.css";
import AuthPage from "./pages/AuthPage/AuthPage";
import NoteFoundPage from "./pages/NoteFoundPage/NoteFoundPage";
function App() {

  const [authPage, setAuthPage] = useState("Auth");
  const [mailValue, setMailValue] = useState("test@sfedu.ru");
  const context = {
    setAuthPage,
    authPage,
    setMailValue,
    mailValue
  };


  return (
    <DataContext.Provider
  value={context}
  >
    <BrowserRouter>
      <main style={{ fontFamily: "REX" }}>
        <Routes>
          <Route path="/" element={<AuthPage />}></Route>
          <Route path="/HomePage" element={<HomePage />}></Route>
          <Route path="*" element={<NoteFoundPage />} /> {/* Добавление 404 страницы */}

        </Routes>
      </main>
    </BrowserRouter>
  </DataContext.Provider>
  );
}

export default App;
