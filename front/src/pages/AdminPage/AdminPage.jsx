import RightMenuLk from '../../modules/RightMenuLk/RightMenuLk';
import Layout from '../../ui/Layout/Layout';
import styles from './AdminPage.module.scss';
import Footer from '../../components/Footer/Footer';
import { useContext } from 'react';
import DataContext from '../../context';
import { Outlet } from 'react-router-dom';
import LeftMenuAdminPage from '../../modules/AdminPageModule/LeftMenuAdminPage/LeftMenuAdminPage';
function AdminPage() {
  const context = useContext(DataContext);
  return (
    <>
      <main className={styles.AdminPage}>
        <LeftMenuAdminPage />
        <div className={styles.AdminPageContainer}>
          <Outlet />
        </div>
        <RightMenuLk />
      </main>
      <Footer />
    </>
  );
}

export default AdminPage;
