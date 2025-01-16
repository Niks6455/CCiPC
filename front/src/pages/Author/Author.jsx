import React, { useState } from 'react';
import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import styles from './Author.module.scss';
function Author() {
  const [selectedButton, setSelectedButton] = useState('Registration');

  return (
    <main>
      <Layout>
        <div className={styles.author}>
          <h1 className={styles.h1}>заявка на участие</h1>
          <div className={styles.buttons}>
            <div
              className={`${styles.button} ${
                selectedButton === 'Registration'
                  ? styles.button_active
                  : styles.button_passive
              }`}
              onClick={() => setSelectedButton('Registration')}
            >
              <span className={`${styles.button_text}`}>
                Оформление участия в конференции
              </span>
              <span className={styles.cap_active}></span>
            </div>
            <div
              className={`${styles.button} ${
                selectedButton === 'Collection'
                  ? styles.button_active
                  : styles.button_passive
              }`}
              onClick={() => setSelectedButton('Collection')}
            >
              <span>Сборники прошлых лет</span>
              <span className={styles.book_active}></span>
            </div>
          </div>
          {selectedButton === 'Registration' && (
            <div className={styles.registration}>
              <p className={styles.registration_text_1}>
                Для участия в конференции необходимо{' '}
                <a className={styles.green_link} href="#link">
                  зарегистрироваться
                </a>
                <span className={styles.bold}>
                  {' '}
                  на платформе и подать заявку
                </span>
                , заполнив регистрационную форму в{' '}
                <a className={styles.green_link} href="#link">
                  {' '}
                  личном кабинете
                </a>
                . В срок до XX.XX.XX необходимо прислать заявку на доклад,
                заполнив обязательные поля, а в срок до ХХ.ХХ.ХХХХ загрузить
                статью и экспертное заключение.
              </p>
              <p className={styles.registration_text_2}>
                <span className={styles.bold}>
                  При подаче заявки прикрепляются:
                </span>
              </p>
              <p className={styles.registration_text_3}>
                1) доклад, оформленный по{' '}
                <a href="#link" className={styles.green_link}>
                  шаблону
                </a>{' '}
                в Word;
              </p>
              <p className={styles.registration_text_4}>
                2) файл с отсканированным изображением экспертного заключения о
                возможности публикации с подписью председателя экспертной
                комиссии и печатью организации.
              </p>
            </div>
          )}
          <div>{selectedButton === 'Collection' && <div>lol</div>}</div>
        </div>
      </Layout>
      <Footer />
    </main>
  );
}

export default Author;
