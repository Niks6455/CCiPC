import RightMenuLk from '../../modules/RightMenuLk/RightMenuLk';
import styles from './Lks.module.scss';
import LeftMenuLk from '../../modules/LeftMenuLK/LeftMenuLK';
import { Outlet } from 'react-router-dom';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import NavBar from '../../components/NavBar/NavBar';
function Lks(props) {
  return (
    <>
      <main className={styles.Lks}>
        <NavBar userRole={props.userRole} />
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
