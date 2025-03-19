import { Outlet } from 'react-router-dom';
import styles from './RecoverPasswordPage.module.scss';
import Footer from '../../components/Footer/Footer';
import NavBar from '../../components/NavBar/NavBar';
import { useState } from 'react';

function RecoverPasswordPage() {
  const [email, setEmail] = useState('');

  return (
    <div className={styles.RecoverPasswordPage}>
      <NavBar />
      <Outlet context={{ email, setEmail }} />
    </div>
  );
}

export default RecoverPasswordPage;
