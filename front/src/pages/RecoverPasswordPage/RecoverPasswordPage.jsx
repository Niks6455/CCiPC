import { Outlet } from 'react-router-dom';
import styles from './RecoverPasswordPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import { useState } from 'react';

function RecoverPasswordPage() {
  const [email, setEmail] = useState(localStorage.getItem('confirmEmail') || '');

  return (
    <div className={styles.RecoverPasswordPage}>
      <NavBar />
      <Outlet context={{ email, setEmail }} />
    </div>
  );
}

export default RecoverPasswordPage;
