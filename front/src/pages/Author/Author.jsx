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
          {/* first */}
          {selectedButton === 'Registration' && (
            <div>
              <p>
                Для участия в конференции необходимо зарегистрироваться на
                платформе и подать заявку, заполнив регистрационную форму в
                личном кабинете. В срок до XX.XX.XX необходимо прислать заявку
                на доклад, заполнив обязательные поля, а в срок до ХХ.ХХ.ХХХХ
                загрузить статью и экспертное заключение.
              </p>
              <p>При подаче заявки прикрепляются:</p>
              <p>1) доклад, оформленный по шаблону в Word;</p>
              <p>
                2) файл с отсканированным изображением экспертного заключения о
                возможности публикации с подписью председателя экспертной
                комиссии и печатью организации.
              </p>
            </div>
          )}
          {/* second */}
          <div>{selectedButton === 'Collection' && <div>lol</div>}</div>
        </div>
      </Layout>
      <Footer />
    </main>
  );
}

export default Author;
