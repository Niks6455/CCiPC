import Layout from '../../ui/Layout/Layout';
import styles from './AuthPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import { Outlet } from 'react-router-dom';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
function AuthPage() {
  return (
    <>
      <main className={styles.AuthPage}>
        <NavBar />
        <HeaderPhone />
        <Layout>
          <Outlet />
        </Layout>
      </main>
    </>
  );
}

export default AuthPage;
