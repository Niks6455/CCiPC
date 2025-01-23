import { BrowserRouter, Routes, Route } from "react-router-dom";
import React, { useState } from "react";
import HomePage from "./pages/HomePage/HomePage";
import DataContext from "./context";
import "./styles/app.css";
import AuthPage from "./pages/AuthPage/AuthPage";
import NoteFoundPage from "./pages/NoteFoundPage/NoteFoundPage";
import NewsPage from "./pages/NewsPage/NewsPage";
import Author from "./pages/Author/Author";
import Lks from "./pages/Lks/Lks";
import Participants from "./pages/Participants/Participants";
import CommitteesPage from "./pages/CommitteesPage/CommitteesPage";
import DocumentsLk from "./modules/DocumentsLk/DocumentsLk";
import Profile from "./modules/Profile/Profile";
import ProfileEditing from "./modules/ProfileEditing/ProfileEditing";
import ChangePassword from "./modules/ChangePassword/ChangePassword";
function App() {
  const [authPage, setAuthPage] = useState("Auth");
  const [mailValue, setMailValue] = useState("test@sfedu.ru");
  const [activeModule, setActiveModule] = useState(false);
  const [selectFrameLks, setSelectFrameLks] = useState("profile");
  const [activeMenu, setActiveMenu] = useState(false);

  const context = {
    setAuthPage,
    authPage,
    setMailValue,
    mailValue,
    activeModule,
    setActiveModule,
    selectFrameLks,
    setSelectFrameLks,
    activeMenu,
    setActiveMenu,
  };

  return (
    <DataContext.Provider value={context}>
      <BrowserRouter>
        <main style={{ fontFamily: "REX" }}>
          <Routes>
            <Route path="/AuthPage" element={<AuthPage />}></Route>
            <Route path="/Participants" element={<Participants />}></Route>
            <Route path="/Lks" element={<Lks />}>
              <Route path="documents" element={<DocumentsLk />}></Route>
              <Route path="profile" element={<Profile />}></Route>
              <Route path="settings/profile" element={<ProfileEditing />} />
              <Route
                path="settings/changepassword"
                element={<ChangePassword />}
              />
            </Route>
            <Route path="/NewsPage" element={<NewsPage />}></Route>
            <Route path="/Author" element={<Author />}></Route>
            <Route
              path="/OrganizationComite"
              element={<CommitteesPage />}
            ></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="*" element={<NoteFoundPage />} />{" "}
            {/* Добавление 404 страницы */}
          </Routes>
        </main>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
