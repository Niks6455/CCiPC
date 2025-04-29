import { Link, useNavigate } from 'react-router-dom';
import styles from './LeftMenuAdminPage.module.scss';
import logo from './../../../assets/img/logo.png';
import archive from './../../../assets/img/AdminPanel/archive.svg';
import colaborators from './../../../assets/img/AdminPanel/colaborators.svg';
import conference from './../../../assets/img/AdminPanel/conference.svg';
import news from './../../../assets/img/AdminPanel/news.svg';
import org from './../../../assets/img/AdminPanel/org.svg';
import orgMoney from './../../../assets/img/AdminPanel/orgMoney.svg';
function LeftMenuAdminPage() {
  const navigate = useNavigate();
  const getActiveLi = patch => {
    if (window.location.pathname === patch) {
      return styles.active;
    } else {
      return;
    }
  };
  return (
    <section className={styles.LeftMenuAdminPage}>
      <div className={styles.LeftMenuAdminPageInner}>
        <img src={logo} className={styles.LogoImg} onClick={() => navigate('/')} />
        <p className={styles.Title}>Панель администратора</p>
        <ul className={styles.LeftMenuLkList}>
          <Link to="news">
            <li className={getActiveLi('/adminPage/news')}>
              <img src={news} />
              Новости
            </li>
          </Link>
          <Link to="conferences">
            <li className={getActiveLi('/adminPage/conferences')}>
              <img src={conference} />
              Конференция
            </li>
          </Link>
          <Link to="committee">
            <li className={getActiveLi('/adminPage/committee')}>
              <img src={org} />
              Оргкомитет
            </li>
          </Link>
          <Link to="participants">
            <li className={getActiveLi('/adminPage/participants')}>
              <img src={colaborators} />
              Участники
            </li>
          </Link>
          <Link to="payment">
            <li className={getActiveLi('/adminPage/payment')}>
              <img src={orgMoney} />
              Оргвзнос
            </li>
          </Link>
          <Link to="photoalbums">
            <li className={getActiveLi('/adminPage/photoalbums')}>
              <img src={archive} />
              Архив фото
            </li>
          </Link>
          <Link to="collections">
            <li className={getActiveLi('/adminPage/collections')}>
              <img src={archive} />
              Архив сборников
            </li>
          </Link>
        </ul>
      </div>
    </section>
  );
}

export default LeftMenuAdminPage;
