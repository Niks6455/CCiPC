import { useNavigate } from 'react-router-dom';
import styles from './NoteFoundPage.module.scss';
import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import HeaderSecond from '../../components/HeaderSecond/HeaderSecond';
import NoteFound from './../../assets/img/NoteFound.png';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import NavBar from '../../components/NavBar/NavBar';
function NoteFoundPage() {
  const navigate = useNavigate();
  return (
    <>
      <NavBar />
      <HeaderPhone />
      <section className={styles.NoteFoundPage}>
        <div>
          <div>
            <div className={styles.Title}>
              <p>Страница не найдена</p>
            </div>
          </div>
            <div className={styles.NoteFoundPageText}>
              <div className={styles.NoteFoundPageTextContainer}>
                <div className={styles.NoteFoundPageTextContainerTitle}>
                  <p>404</p>
                </div>
                <p>
                  Кажется, что-то пошло не так! Страница, которую вы запрашиваете, не существует.
                  Возможно, она была удалена, или вы набрали неверный адрес. Перейдите на нашу{' '}
                  <span onClick={() => navigate('/')}>главную страницу</span> и попробуйте
                  найти необходимую вам информацию там.
                </p>
                <button onClick={() => navigate('/')}>Перейти на главную</button>
              </div>
              <div className={styles.imgCont}>
                <img src={NoteFound} alt="NoteFound" />
              </div>
            </div>
        </div>
      </section>
    </>
  );
}

export default NoteFoundPage;
