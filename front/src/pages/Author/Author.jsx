import { useEffect, useState } from 'react';
import Layout from '../../ui/Layout/Layout';
import styles from './Author.module.scss';
import AuthorCollection from '../../components/AuthorCollection/AuthorCollection';
import { Link } from 'react-router-dom';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Book from '../../assets/img/Book.svg';
import Cap from '../../assets/img/Cap.svg';
import { getAllArchiveReport } from '../../apirequests/apirequests.js';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests.js';
import { Trans, useTranslation } from 'react-i18next';

function Author({ userRole }) {
  const { t } = useTranslation('author');
  const [selectedButton, setSelectedButton] = useState('Registration');
  const [data, setData] = useState([]);
  const conference = useSelector(state => state?.conferences?.data[0]);
  useEffect(() => {
    getAllArchiveReport().then(res => setData(res?.data?.archives || []));
  }, [selectedButton]);
  //! функция скачивания шаблока
  const funDownloadShablon = async () => {
    try {
      const response = await fetch(`${server}/${conference?.files?.SAMPLE[0]?.url}`);
      if (!response.ok) throw new Error('Ошибка загрузки файла');
      const blob = await response.blob();
      const name = conference?.files?.SAMPLE[0]?.name;
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = name || 'default_filename.docx'; // Файл точно сохранится с этим именем
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
          <h1 className={styles.h1}>{t('title')}</h1>
          <div className={styles.buttons}>
            <div
              className={`${styles.button} ${
                selectedButton === 'Registration' ? styles.button_active : styles.button_passive
              }`}
              onClick={() => setSelectedButton('Registration')}
            >
              <span className={`${styles.button_text}`}>{t('buttonLeft')}</span>
              <img src={Cap} alt="Cap"></img>
            </div>
            <div
              className={`${styles.button} ${
                selectedButton === 'Collection' ? styles.button_active : styles.button_passive
              }`}
              onClick={() => setSelectedButton('Collection')}
            >
              <span>{t('buttonRight')}</span>
              <img src={Book} alt="Book"></img>
            </div>
          </div>
          {selectedButton === 'Registration' && (
            <div className={styles.registration}>
              <p className={styles.registration_text_1}>
                <Trans
                  i18nKey="registration_info"
                  components={{
                    1: <Link className={styles.green_link} to="/login/authorization" />,
                    3: <span className={styles.bold} />,
                    5: <Link className={styles.green_link} to="/account/profile" />,
                  }}
                />

                <Trans i18nKey="deadline" values={{ date: conference?.dedlineReport2 }} />
              </p>
              <p className={styles.registration_text_2}>
                <span className={styles.bold}>{t('attach_title')}</span>
              </p>
              <p className={styles.registration_text_3}>
                <Trans
                  i18nKey="attach_1"
                  components={{
                    1: (
                      <a
                        onClick={funDownloadShablon}
                        target="_blank"
                        className={styles.green_link}
                      />
                    ),
                  }}
                />
              </p>
              <p className={styles.registration_text_4}>{t('attach_2')}</p>
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
