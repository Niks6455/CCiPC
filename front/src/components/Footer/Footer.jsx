import Layout from '../../ui/Layout/Layout';
import styles from './Footer.module.scss';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests';
import { formatDateRangePrimereact } from '../../utils/functions/funcions';
import { useTranslation } from 'react-i18next';
import userManualDocument from '@assets/docs/user_manual.pdf';

function Footer({ footerRef }) {
  const { t } = useTranslation('footer');
  const { i18n } = useTranslation();
  const lang = i18n.language;

  const conferense = useSelector(state => state.conferences?.data[0]);

  return (
    <footer className={styles.footer} ref={footerRef}>
      <Layout>
        <div className={styles.footerContainer}>
          <div className={styles.footerContainerLeft}>
            <div className={styles.logo}>
              {conferense?.files?.FOOTER?.[0].url && (
                <img src={`${server}/${conferense?.files?.FOOTER?.[0].url}`} alt="logo" />
              )}
            </div>
            <div className={styles.footerText}>
              <p>
                {conferense?.files?.FOOTER?.[0].url && (
                  <img src={`${server}/${conferense?.files?.FOOTER?.[0].url}`} alt="logo" />
                )}
                {t('title')}
              </p>
              {formatDateRangePrimereact(
                conferense?.date[0].value,
                conferense?.date[1].value,
                lang,
              ) ? (
                <p>
                  {' '}
                  {formatDateRangePrimereact(
                    conferense?.date[0].value,
                    conferense?.date[1].value,
                    lang,
                  )}
                  {t('year')} {conferense?.address}
                </p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className={styles.footerLink}>
            <div>
              <p>{t('message')}</p>
              <p className={styles.link}>
                e-mail: <a href="mailto:ssas@ictis.sfedu.ru">ssas@ictis.sfedu.ru</a>
              </p>
            </div>
          </div>
        </div>
        <div className={styles.doc_container}>
          <span>Сайт разработан Центром исследований и разработки ИКТИБ</span>
          <a target="_blank" href={userManualDocument}>
            Ознакомиться с руководством пользователя
          </a>
        </div>
      </Layout>
    </footer>
  );
}

export default Footer;
