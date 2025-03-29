import RightMenuLk from '../../modules/RightMenuLk/RightMenuLk';
import styles from './Lks.module.scss';
import LeftMenuLk from '../../modules/LeftMenuLK/LeftMenuLK';
import { Outlet } from 'react-router-dom';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
function Lks(props) {
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
