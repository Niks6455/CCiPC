import { Outlet } from 'react-router-dom';
import styles from './RecoverPasswordPage.module.scss';
import NavBar from '../../components/NavBar/NavBar';
import { useState } from 'react';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';

function RecoverPasswordPage() {
  const [email, setEmail] = useState('');

  return (
    <div className={styles.RecoverPasswordPage}>
      <NavBar login={true} />
      <HeaderPhone login={true} />
      <Outlet context={{ email, setEmail }} />
    </div>
  );
}

export default RecoverPasswordPage;
