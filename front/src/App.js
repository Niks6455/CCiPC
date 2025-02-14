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
import Profile from "./modules/Profile/Profile";
import ProfileEditing from "./modules/ProfileEditing/ProfileEditing";
import ChangePassword from "./modules/ChangePassword/ChangePassword";
import RecoverPassword from "./pages/RecoverPassword/RecoverPassword";
import DeleteAccount from "./modules/DeleteAccount/DeleteAccount";
import ExitAccount from "./modules/ExitAccount/ExitAccount";
import ArchivPhoto from "./modules/ArchivPhoto/ArchivPhoto";
import CreateReport from "./modules/Reports/CreateReport/CreateReport";
import DocumentsLk from "./modules/Reports/DocumentsLk/DocumentsLk";
import AddCoauthor from "./modules/Reports/AddCoauthor/AddCoauthor";
import ViewReports from "./modules/Reports/ViewReports/ViewReports";
import EditReport from "./modules/Reports/EditReport/EditReport";
import AdminPage from "./pages/AdminPage/AdminPage";
function App() {
  const [authPage, setAuthPage] = useState("Auth");
  const [mailValue, setMailValue] = useState("");
  const [numberValue, setNumberValue] = useState("79805005050");
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
    numberValue,
    setNumberValue,
  };

  return (
    <DataContext.Provider value={context}>
      <BrowserRouter>
        <main style={{ fontFamily: "REX" }}>
          <Routes>
            <Route path="/authorization" element={<AuthPage />}></Route>
            <Route path="/participants" element={<Participants />}></Route>
            <Route path="/account" element={<Lks />}>
              <Route path="documents" element={<DocumentsLk />}></Route>
              <Route path="createreport" element={<CreateReport />} />
              <Route path="addcoauthor" element={<AddCoauthor />} />
              <Route path="profile" element={<Profile />}></Route>
              <Route path="deleteaccount" element={<DeleteAccount />}></Route>
              <Route path="exitaccount" element={<ExitAccount />}></Route>
              <Route path="archivephoto" element={<ArchivPhoto />}></Route>
              <Route path="settings/profile" element={<ProfileEditing />} />
              <Route
                path="settings/changepassword"
                element={<ChangePassword />}
              />
              <Route path="viewreports" element={<ViewReports />} />
              <Route path="editreport" element={<EditReport />} />
            </Route>
            <Route path="/news" element={<NewsPage />}></Route>
            <Route path="/author" element={<Author />}></Route>
            <Route
              path="/recoverpassword"
              element={<RecoverPassword />}
            ></Route>
            <Route
              path="/organizationcomite"
              element={<CommitteesPage />}
            ></Route>
            <Route path="/" element={<HomePage />}></Route>
            <Route path="*" element={<NoteFoundPage />} />{" "}
            <Route path="/AdminPage/*" element={<AdminPage />}>

            </Route>
            
          </Routes>
        </main>
      </BrowserRouter>
    </DataContext.Provider>
  );
}

export default App;
