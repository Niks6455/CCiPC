import { BrowserRouter, Routes, Route } from 'react-router-dom';
import React, { useEffect, useState } from 'react';
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
import { useDispatch } from 'react-redux';
import { disResetUser, fetchUserData } from './store/userSlice/user.Slice';
import { disResetReports, fetchReports } from './store/reportsSlice/reportsSlice';
import AdminPage from './pages/AdminPage/AdminPage';
import ArchiveModulePage from './modules/AdminPageModule/ArchiveModulePage/ArchiveModulePage';
import ColaboratorsModuleAdminPage from './modules/AdminPageModule/ColaboratorsModuleAdminPage/ColaboratorsModuleAdminPage';
import OrgazmCommetet from './modules/AdminPageModule/OrgazmCommetet/OrgazmCommetet';
import NewsModuleAdminPage from './modules/AdminPageModule/NewsModuleAdminPage/NewsModuleAdminPage';
import ConfirenceModuleAdminPage from './modules/AdminPageModule/ConfirenceModuleAdminPage/ConfirenceModuleAdminPage';
import OrgWznosModuleAdminPage from './modules/AdminPageModule/OrgWznosModuleAdminPage/OrgWznosModuleAdminPage';
import { disResetConferences, fetchConferences } from './store/conferencesSlice/conferences.Slice';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import EnteringEmail from './modules/RecoverPasswordModule/EnteringEmail/EnteringEmail';
import RecoverPassword from './modules/RecoverPasswordModule/RecoverPassword/RecoverPassword';
import RecoverPasswordPage from './pages/RecoverPasswordPage/RecoverPasswordPage';
import { apiCreateConferences } from './apirequests/apirequests';

function App() {
  const dispatch = useDispatch();

  const queryClient = new QueryClient();

  const [authPage, setAuthPage] = useState('Auth');
  const [mailValue, setMailValue] = useState('');
  const [numberValue, setNumberValue] = useState('79805005050');
  const [activeModule, setActiveModule] = useState(false);
  const [selectFrameLks, setSelectFrameLks] = useState('profile');
  const [activeMenu, setActiveMenu] = useState(false);

  const funGetAllApi = () => {
    //! получение данных пользователя
    dispatch(fetchUserData()); // Вызов асинхронного действия
    //! получение докладов пользователя
    dispatch(fetchReports());
    //! получение всех конференций
    dispatch(fetchConferences());
  };

  const funResetAllApi = () => {
    //! чистим данные user
    dispatch(disResetUser());
    //! чистим данные докладов
    dispatch(disResetReports());
    //! чистим данные конференций
    dispatch(disResetConferences());
  };

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    console.log('accessToken', accessToken);
    if (accessToken !== null) {
      funGetAllApi();
    }
  }, [dispatch]);

  useEffect(() => {
    //! создание конференции
    const dataConferences = {
      number: 1,
      date: ['2025-03-10', '2025-05-12'],
      address: 'Таганрог',
      stages: [
        {
          name: 'Представление докладов и регистрационных форм',
          date: '2024-09-01',
        },
      ],
      description: 'Описание',
      directions: [
        '7. Проблемы математического моделирования и управления в области медицины',
        '8. Проблемы математического моделирования и управления в области медицины',
        '9. Проблемы математического моделирования и управления в области медицины',
        '10. Проблемы математического моделирования и управления в области медицины',
        '11. Проблемы математического моделирования и управления в области медицины',
        '12. Проблемы математического моделирования и управления в области медицины',
      ],
    };
    apiCreateConferences(dataConferences);
  }, []);

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
      <QueryClientProvider client={queryClient}>
        <BrowserRouter>
          <main style={{ fontFamily: 'REX' }}>
            <Routes>
              <Route path="/" element={<HomePage />}></Route>
              <Route path="*" element={<NoteFoundPage />} />{' '}
              <Route
                path="/authorization"
                element={<AuthPage funGetAllApi={funGetAllApi} />}
              ></Route>
              <Route path="/participants" element={<Participants />}></Route>
              <Route path="/account" element={<Lks />}>
                <Route path="documents" element={<DocumentsLk />}></Route>
                <Route path="createreport" element={<CreateReport />} />
                <Route path="addcoauthor" element={<AddCoauthor />} />
                <Route path="profile" element={<Profile />}></Route>
                <Route path="deleteaccount" element={<DeleteAccount />}></Route>
                <Route
                  path="exitaccount"
                  element={<ExitAccount funResetAllApi={funResetAllApi} />}
                ></Route>
                <Route path="archivephoto" element={<ArchivPhoto />}></Route>
                <Route path="settings/profile" element={<ProfileEditing />} />
                <Route path="settings/changepassword" element={<ChangePassword />} />
                <Route path="viewreports" element={<ViewReports />} />
                <Route path="editreport" element={<EditReport />} />
              </Route>
              <Route path="/news" element={<NewsPage />}></Route>
              <Route path="/author" element={<Author />}></Route>
              <Route path="/recoverpassword" element={<RecoverPasswordPage />}>
                <Route path="" element={<EnteringEmail />}></Route>
                <Route path="checkemail" element={<RecoverPassword />}></Route>
              </Route>
              <Route path="/organizationcomite" element={<CommitteesPage />}></Route>
              <Route path="/adminPage/*" element={<AdminPage />}>
                <Route path="archive" element={<ArchiveModulePage />} />
                <Route path="collections" element={<Сollections />} />
                <Route path="participants" element={<ColaboratorsModuleAdminPage />} />
                <Route path="committee" element={<OrgazmCommetet />} />
                <Route path="news" element={<NewsModuleAdminPage />} />
                <Route path="conferences" element={<ConfirenceModuleAdminPage />} />
                <Route path="registrationFee" element={<OrgWznosModuleAdminPage />} />
              </Route>
            </Routes>
          </main>
        </BrowserRouter>
      </QueryClientProvider>
    </DataContext.Provider>
  );
}

export default App;
