import Layout from '../../ui/Layout/Layout';
import styles from './Footer.module.scss';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests';
import { formatDateRangePrimereact } from '../../utils/functions/funcions';
function Footer({ footerRef }) {
  const conferense = useSelector(state => state.conferences?.data[0]);

  return (
    <footer className={styles.footer} ref={footerRef}>
      <Layout>
        <div className={styles.footerContainer}>
          <div className={styles.footerContainerLeft}>
            <div className={styles.logo}>
              {conferense?.logo?.FOOTER && (
                <img src={`${server}/${conferense?.logo?.FOOTER}`} alt="logo" />
              )}
            </div>
            <div className={styles.footerText}>
              <p>
                {conferense?.logo?.FOOTER && (
                  <img src={`${server}/${conferense?.logo?.FOOTER}`} alt="logo" />
                )}
                Всероссийская научная конференция "Системный синтез и прикладная синергетика"
              </p>
              {formatDateRangePrimereact(conferense?.date[0].value, conferense?.date[1].value) ? (
                <p>
                  {' '}
                  {formatDateRangePrimereact(conferense?.date[0].value, conferense?.date[1].value)}
                  {' года'} {conferense?.address}
                </p>
              ) : (
                <p></p>
              )}
            </div>
          </div>
          <div className={styles.footerLink}>
            <div>
              <p>Напишите нам:</p>
              <p className={styles.link}>
                e-mail: <a href="mailto:ssas@ictis.sfedu.ru">ssas@ictis.sfedu.ru</a>
              </p>
            </div>
          </div>
        </div>
      </Layout>
    </footer>
  );
}

export default Footer;
