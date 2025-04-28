import RightMenuLk from '../../modules/RightMenuLk/RightMenuLk';
import styles from './AdminPage.module.scss';
import { useContext } from 'react';
import DataContext from '../../context';
import { Outlet } from 'react-router-dom';
import LeftMenuAdminPage from '../../modules/AdminPageModule/LeftMenuAdminPage/LeftMenuAdminPage';
import NavBar from '../../components/NavBar/NavBar';
function AdminPage() {
  const context = useContext(DataContext);
  return (
    <>
      <main className={styles.AdminPage}>
        <NavBar admine={true} />
        <LeftMenuAdminPage />
        <div className={styles.AdminPageContainer}>
          <Outlet />
        </div>
        <RightMenuLk admine={true} />
      </main>
    </>
  );
}

export default AdminPage;
