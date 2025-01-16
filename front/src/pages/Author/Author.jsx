import React, { useState } from 'react';
import Layout from '../../ui/Layout/Layout';
import Footer from '../../components/Footer/Footer';
import styles from './Author.module.scss';
import AuthorCollection from '../../components/AuthorCollection/AuthorCollection';
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
              <img src="/img/Cap.svg" alt="Cap"></img>
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
              <img src="/img/Book.svg" alt="Book"></img>
            </div>
          </div>
          {selectedButton === 'Registration' && (
            <div className={styles.registration}>
              <p className={styles.registration_text_1}>
                Для участия в конференции необходимо{' '}
                <a className={styles.green_link} href="#link" target="_blank">
                  зарегистрироваться
                </a>
                <span className={styles.bold}>
                  {' '}
                  на платформе и подать заявку
                </span>
                , заполнив регистрационную форму в{' '}
                <a className={styles.green_link} href="#link" target="_blank">
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
                <a href="#link" target="_blank" className={styles.green_link}>
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
          {selectedButton === 'Collection' && (
            <div className={styles.collection}>
              {[
                { num: 'IV', year: 2011 },
                { num: 'VII', year: 2015 },
                { num: 'VIII', year: 2017 },
                { num: 'IX', year: 2019 },
                { num: 'X', year: 2021 },
                { num: 'XI', year: 2022 },
              ].map((param) => (
                <AuthorCollection>
                  Сборник научных трудов {param.num} Международной научной
                  конференции "Системный синтез и прикладная синергетика" (ССПС-
                  {param.year})
                </AuthorCollection>
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
