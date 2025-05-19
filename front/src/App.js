import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useRef, useState } from 'react';
import HomePage from './pages/HomePage/HomePage';
import DataContext from './context';
import './styles/app.scss';
import AuthPage from './pages/AuthPage/AuthPage';
import NoteFoundPage from './pages/NoteFoundPage/NoteFoundPage';
import NewsPage from './pages/NewsPage/NewsPage';
import Author from './pages/Author/Author';
import Lks from './pages/Lks/Lks';
import Participants from './pages/Participants/Participants';
import CommitteesPage from './pages/CommitteesPage/CommitteesPage';
import Profile from './modules/Profile/Profile';
import ProfileEditing from './modules/ProfileEditing/ProfileEditing';
import ChangePassword from './modules/ChangePassword/ChangePassword';
import DeleteAccount from './modules/DeleteAccount/DeleteAccount';
import ExitAccount from './modules/ExitAccount/ExitAccount';
import ArchivPhoto from './modules/ArchivPhoto/ArchivPhoto';
import CreateReport from './modules/Reports/CreateReport/CreateReport';
import DocumentsLk from './modules/Reports/DocumentsLk/DocumentsLk';
import AddCoauthor from './modules/Reports/AddCoauthor/AddCoauthor';
import ViewReports from './modules/Reports/ViewReports/ViewReports';
import EditReport from './modules/Reports/EditReport/EditReport';
import Сollections from './modules/AdminPageModule/Сollections/Сollections';
import { useDispatch, useSelector } from 'react-redux';
import { disResetUser, fetchUserData } from './store/userSlice/user.Slice';
import { disResetReports, fetchReports } from './store/reportsSlice/reportsSlice';
import AdminPage from './pages/AdminPage/AdminPage';
import ArchiveModulePage from './modules/AdminPageModule/ArchiveModulePage/ArchiveModulePage';
import ColaboratorsModuleAdminPage from './modules/AdminPageModule/ColaboratorsModuleAdminPage/ColaboratorsModuleAdminPage';
import OrgazmCommetet from './modules/AdminPageModule/OrgazmCommetet/OrgazmCommetet';
import NewsModuleAdminPage from './modules/AdminPageModule/NewsModuleAdminPage/NewsModuleAdminPage';
import ConfirenceModuleAdminPage from './modules/AdminPageModule/ConfirenceModuleAdminPage/ConfirenceModuleAdminPage';
import OrgWznosModuleAdminPage from './modules/AdminPageModule/OrgWznosModuleAdminPage/OrgWznosModuleAdminPage';
import { fetchConferences } from './store/conferencesSlice/conferences.Slice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnteringEmail from './modules/RecoverPasswordModule/EnteringEmail/EnteringEmail';
import RecoverPassword from './modules/RecoverPasswordModule/RecoverPassword/RecoverPassword';
import RecoverPasswordPage from './pages/RecoverPasswordPage/RecoverPasswordPage';
import Footer from './components/Footer/Footer';
import { useLocalStorage, useWindowWidth } from './hooks/hooks';
import Login from './modules/Login/Login';
import Register from './modules/Register/Register';
import ConfirmLogin from './modules/ConfirmLogin/ConfirmLogin';
import ProtectedRoute from './pages/ProtectedRoute/ProtectedRoute';
import LanguageSwitcher from './components/LanguageSwitcher/LanguageSwitcher';

function App() {
  const dispatch = useDispatch();
  const queryClient = new QueryClient();

  const user = useSelector(state => state.user.user.data);
  const [authPage, setAuthPage] = useState('Auth');
  const [mailValue, setMailValue] = useState('');
  const [activeModule, setActiveModule] = useState(false);
  const [selectFrameLks, setSelectFrameLks] = useState('profile');
  const [activeMenu, setActiveMenu] = useState(false);
  const [userRole, setUserRole] = useState(null);

  const funGetAllApi = () => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      //! получение данных пользователя
      dispatch(fetchUserData()); // Вызов асинхронного действия
      //! получение докладов пользователя
      dispatch(fetchReports());
    }
    //! получение всех конференций
    dispatch(fetchConferences());
  };

  const funResetAllApi = () => {
    //! чистим данные user
    dispatch(disResetUser());
    //! чистим данные докладов
    dispatch(disResetReports());
  };

  useEffect(() => {
    const userData = localStorage.getItem('userData');
    const userRole = userData && userData !== 'undefined' ? JSON.parse(userData)?.role : null;
    setUserRole(userRole);
  }, [useLocalStorage('userData'), user]);

  useEffect(() => {
    funGetAllApi();
  }, [dispatch]);

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
    funResetAllApi,
    userRole,
  };

  const footerRef = useRef(null);

  useEffect(() => {
    if (footerRef?.current) {
      const footerHeight = footerRef.current.offsetHeight;
      const mainDiv = document.getElementById('#main_inner');
      if (mainDiv) {
        mainDiv.style.minHeight = `calc(100vh - ${footerHeight}px)`;
      }
    }
  }, [footerRef, useWindowWidth()]);

  return (
    <DataContext.Provider value={context}>
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <main>
            {/* <LanguageSwitcher /> */}

            <div id="#main_inner">
              <Routes>
                <Route path="/" element={<HomePage userRole={userRole} />}></Route>
                <Route path="*" element={<NoteFoundPage />} />{' '}
                <Route path="/login/*" element={<AuthPage />}>
                  <Route
                    path="authorization"
                    element={<Login funGetAllApi={funGetAllApi} />}
                  ></Route>
                  <Route
                    path="registration"
                    element={<Register funGetAllApi={funGetAllApi} />}
                  ></Route>
                  <Route
                    path="confirmLogin"
                    element={<ConfirmLogin funGetAllApi={funGetAllApi} />}
                  ></Route>
                </Route>
                <Route path="/participants" element={<Participants userRole={userRole} />}></Route>
                <Route
                  path="/account"
                  element={
                    <ProtectedRoute element={<Lks footerRef={footerRef} userRole={userRole} />} />
                  }
                >
                  <Route path="documents" element={<ProtectedRoute element={<DocumentsLk />} />} />
                  <Route
                    path="createreport"
                    element={<ProtectedRoute element={<CreateReport />} />}
                  />
                  <Route
                    path="addcoauthor"
                    element={<ProtectedRoute element={<AddCoauthor />} />}
                  />
                  {userRole === 1 ? (
                    <Route path="profile" element={<ProtectedRoute element={<ArchivPhoto />} />} />
                  ) : (
                    <Route path="profile" element={<ProtectedRoute element={<Profile />} />} />
                  )}
                  <Route
                    path="deleteaccount"
                    element={<ProtectedRoute element={<DeleteAccount />} />}
                  />
                  <Route
                    path="exitaccount"
                    element={
                      <ProtectedRoute element={<ExitAccount funResetAllApi={funResetAllApi} />} />
                    }
                  />
                  <Route
                    path="archivephoto"
                    element={<ProtectedRoute element={<ArchivPhoto />} />}
                  />
                  <Route
                    path="settings/profile"
                    element={<ProtectedRoute element={<ProfileEditing />} />}
                  />
                  <Route
                    path="settings/changepassword"
                    element={<ProtectedRoute element={<ChangePassword />} />}
                  />
                  <Route
                    path="viewreports"
                    element={<ProtectedRoute element={<ViewReports />} />}
                  />
                  <Route path="editreport" element={<ProtectedRoute element={<EditReport />} />} />
                </Route>
                <Route path="/news" element={<NewsPage />}></Route>
                <Route path="/author" element={<Author />}></Route>
                <Route path="/recoverpassword" element={<RecoverPasswordPage />}>
                  <Route path="" element={<EnteringEmail />}></Route>
                  <Route path="checkemail" element={<RecoverPassword />}></Route>
                </Route>
                <Route path="/committee" element={<CommitteesPage />}></Route>
                {userRole === 1 && (
                  <Route path="/adminPage/*" element={<AdminPage />}>
                    <Route path="photoalbums" element={<ArchiveModulePage />} />
                    <Route path="collections" element={<Сollections />} />
                    <Route path="participants" element={<ColaboratorsModuleAdminPage />} />
                    <Route path="committee" element={<OrgazmCommetet />} />
                    <Route path="news" element={<NewsModuleAdminPage />} />
                    <Route path="conferences" element={<ConfirenceModuleAdminPage />} />
                    <Route path="payment" element={<OrgWznosModuleAdminPage />} />
                  </Route>
                )}
              </Routes>
            </div>
            <Footer footerRef={footerRef} />
          </main>
        </BrowserRouter>
      </QueryClientProvider>
    </DataContext.Provider>
  );
}

export default App;
