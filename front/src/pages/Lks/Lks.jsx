import RightMenuLk from '../../modules/RightMenuLk/RightMenuLk';
import styles from './Lks.module.scss';
import LeftMenuLk from '../../modules/LeftMenuLK/LeftMenuLK';
import { Outlet, useNavigate } from 'react-router-dom';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { useEffect } from 'react';
function Lks(props) {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken === null) {
      navigate('/');
    }
  }, []);
  return (
    <>
      <main className={styles.Lks}>
        <LeftMenuLk />
        <div className={styles.LksContainer}>
          <Outlet />
        </div>
        <RightMenuLk userRole={props.userRole} />
        <HeaderPhone />
      </main>
    </>
  );
}

export default Lks;
