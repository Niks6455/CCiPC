import React, { useEffect, useState } from 'react';
import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import styles from './Author.module.scss';
import AuthorCollection from '../../components/AuthorCollection/AuthorCollection';
import { dataLink } from './data.js';
import { Link } from 'react-router-dom';
import HeaderSecond from '../../components/HeaderSecond/HeaderSecond';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Book from '../../assets/img/Book.svg';
import Cap from '../../assets/img/Cap.svg';
import { getAllArchiveReport } from '../../apirequests/apirequests.js';
function Author() {
  const [selectedButton, setSelectedButton] = useState('Registration');
  const [data, setData] = useState([]);

  useEffect(() => {
    getAllArchiveReport().then(res => setData(res?.data?.archives || []));
    console.log('data', data);
  }, [selectedButton]);

  return (
    <main>
      <NavBar />
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
                <Link className={styles.green_link} to="/authorization">
                  зарегистрироваться
                </Link>
                <span className={styles.bold}> на платформе и подать заявку</span>,
                заполнив регистрационную форму в{' '}
                <Link className={styles.green_link} to="/account">
                  {' '}
                  личном кабинете
                </Link>
                . В срок до XX.XX.XX необходимо прислать заявку на доклад, заполнив обязательные
                поля, а в срок до ХХ.ХХ.ХХХХ загрузить статью и экспертное заключение.
              </p>
              <p className={styles.registration_text_2}>
                <span className={styles.bold}>При подаче заявки прикрепляются:</span>
              </p>
              <p className={styles.registration_text_3}>
                1) доклад, оформленный по{' '}
                <a href="#" target="_blank" className={styles.green_link}>
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
      <Footer />
    </main>
  );
}

export default Author;
