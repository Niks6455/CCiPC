import Layout from '../../ui/Layout/Layout';
import styles from './Footer.module.scss';
import footerLogo from '../../assets/img/FooterText.svg';
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
              <img
                src={`${server}/${conferense?.logo?.FOOTER}` || footerLogo}
                alt="logo"
                onError={e => (e.target.src = footerLogo)}
              />
            </div>
            <div className={styles.footerText}>
              <p>
                <img
                  src={`${server}/${conferense?.logo?.FOOTER}` || footerLogo}
                  alt="logo"
                  onError={e => (e.target.src = footerLogo)}
                />
                Всероссийская научная конференция "Системный синтез и прикладная синергетика"
              </p>
              <p>
                {' '}
                {formatDateRangePrimereact(conferense?.date[0].value, conferense?.date[1].value)}
                {' года'} {conferense?.address}
              </p>
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
