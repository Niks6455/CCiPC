import React, { useEffect, useState } from 'react';
import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import styles from './Author.module.scss';
import AuthorCollection from '../../components/AuthorCollection/AuthorCollection';
import { dataLink } from './data.js';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Book from '../../assets/img/Book.svg';
import Cap from '../../assets/img/Cap.svg';
import { getAllArchiveReport } from '../../apirequests/apirequests.js';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests.js';
import { decodeFileName } from '../../utils/functions/funcions.js';
function Author({ userRole }) {
  const [selectedButton, setSelectedButton] = useState('Registration');
  const [data, setData] = useState([]);
  const conference = useSelector(state => state?.conferences?.data[0]);
  useEffect(() => {
    getAllArchiveReport().then(res => setData(res?.data?.archives || []));
  }, [selectedButton]);

  //! функция скачивания шаблока
  const funDownloadShablon = async () => {
    try {
      const response = await fetch(`${server}/${conference?.documents?.SAMPLE}`);
      if (!response.ok) throw new Error('Ошибка загрузки файла');
      const blob = await response.blob();
      console.log('conference?.documents', conference?.documents)
      const name = decodeFileName(conference?.documents?.SAMPLE?.name?.split('\\').pop());
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = name || 'default_filename.ext'; // Файл точно сохранится с этим именем
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(link.href); // Освобождаем память
    } catch (error) {
      console.error('Ошибка загрузки файла:', error);
    }
  };

  return (
    <main>
      <NavBar userRole={userRole} />
      <HeaderPhone />
      <Layout>
        <div className={styles.author}>
          <h1 className={styles.h1}>заявка на участие</h1>
          <div className={styles.buttons}>
            <div
              className={`${styles.button} ${
                selectedButton === 'Registration' ? styles.button_active : styles.button_passive
              }`}
              onClick={() => setSelectedButton('Registration')}
            >
              <span className={`${styles.button_text}`}>Оформление участия в конференции</span>
              <img src={Cap} alt="Cap"></img>
            </div>
            <div
              className={`${styles.button} ${
                selectedButton === 'Collection' ? styles.button_active : styles.button_passive
              }`}
              onClick={() => setSelectedButton('Collection')}
            >
              <span>Сборники прошлых лет</span>
              <img src={Book} alt="Book"></img>
            </div>
          </div>
          {selectedButton === 'Registration' && (
            <div className={styles.registration}>
              <p className={styles.registration_text_1}>
                Для участия в конференции необходимо{' '}
                <Link className={styles.green_link} to="/login/authorization">
                  зарегистрироваться
                </Link>
                <span className={styles.bold}> на платформе и подать заявку</span>,
                заполнив регистрационную форму в{' '}
                <Link className={styles.green_link} to="/account/profile">
                  {' '}
                  личном кабинете
                </Link>
                . В срок до {conference?.dedlineReport1 || 'XXXX-XX-XX'} необходимо прислать заявку
                на доклад, заполнив обязательные поля, а в срок до{' '}
                {conference?.dedlineReport2 || 'XXXX-XX-XX'} загрузить статью и экспертное
                заключение.
              </p>
              <p className={styles.registration_text_2}>
                <span className={styles.bold}>При подаче заявки прикрепляются:</span>
              </p>
              <p className={styles.registration_text_3}>
                1) доклад, оформленный по{' '}
                <a onClick={() => funDownloadShablon} target="_blank" className={styles.green_link}>
                  шаблону
                </a>{' '}
                в Word;
              </p>
              <p className={styles.registration_text_4}>
                2) файл с отсканированным изображением экспертного заключения о возможности
                публикации с подписью председателя экспертной комиссии и печатью организации.
              </p>
            </div>
          )}
          {selectedButton === 'Collection' && (
            <div className={styles.collection}>
              {data.map(param => (
                <AuthorCollection link={param.file}>{param.name}</AuthorCollection>
              ))}
            </div>
          )}
        </div>
      </Layout>
    </main>
  );
}

export default Author;
