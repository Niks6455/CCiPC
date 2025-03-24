import Button from '../../ui/Button/Button';
import Layout from '../../ui/Layout/Layout';
import styles from './TopMainInfo.module.scss';
import Bg from '../../assets/img/Bg.jpeg';
import rect from '../../assets/img/rect.svg';
import React, { useContext, useEffect, useRef, useState } from 'react';
import DataContext from '../../context';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDateRangePrimereact } from '../../utils/functions/funcions';
import { server } from '../../apirequests/apirequests';

function TopMainInfo() {
  const conference = useSelector(state => state.conferences.data[0]);
  const userData = useSelector(state => state.user.user.data);
  const arrowRef = useRef(null); // Реф для стрелки
  const navigate = useNavigate();
  const [arrowColor, setArrowColor] = useState(styles.greenArrow); // Начальный стиль стрелки
  const context = useContext(DataContext);

  const funClickRequest = () => {
    const assetsToken = localStorage.getItem('accessToken');
    if (assetsToken === null || !userData) {
      navigate('/authorization');
    } else {
      navigate('/account/documents');
    }
  };

  return (
    <>
      <div className={styles.topContainer}>
        <div className={styles.TopHeader}>
          <img src={Bg} alt="Background" />
        </div>
        <main>
          <div className={styles.mainTopTextContainer}>
            <div className={styles.mainTopText}>
              <Layout>
                <div className={styles.mainTopDate}>
                  {formatDateRangePrimereact(
                    conference?.date[0].value,
                    conference?.date[1].value,
                  ) ? (
                    <p>
                      {formatDateRangePrimereact(
                        conference?.date[0].value,
                        conference?.date[1].value,
                      )}
                      {' года'}
                      <br /> {conference?.address}
                    </p>
                  ) : (
                    <p></p>
                  )}
                </div>
                <div className={styles.mainTopList}>
                  <ul>
                    <li>
                      <a
                        target="_blank"
                        href={`${server}/${conference?.documents?.PROGRAM}`}
                        rel="noreferrer"
                      >
                        Программа <br /> конференции
                      </a>
                      <a
                        target="_blank"
                        href={`${server}/${conference?.documents?.PROGRAM}`}
                        className={styles.clicker}
                        rel="noreferrer"
                      ></a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        href={`${server}/${conference?.documents?.LETTER}`}
                        rel="noreferrer"
                      >
                        Информационное <br /> письмо
                      </a>
                      <a
                        target="_blank"
                        href={`${server}/${conference?.documents?.LETTER}`}
                        className={styles.clicker}
                        rel="noreferrer"
                      ></a>
                    </li>
                    <li>
                      <a
                        target="_blank"
                        href={`${server}/${conference?.documents?.COLLECTION}`}
                        rel="noreferrer"
                      >
                        Сборник <br /> научных трудов
                      </a>
                      <a
                        target="_blank"
                        href={`${server}/${conference?.documents?.COLLECTION}`}
                        className={styles.clicker}
                        rel="noreferrer"
                      ></a>
                    </li>
                  </ul>
                </div>
              </Layout>
            </div>
          </div>
          <div className={styles.buttonClicker}>
            <div className={styles.buttonClickerInner}>
              <img className={styles.leftBot} src={rect} alt="Background" />
              <Button text={'Подать заявку'} funClick={funClickRequest} />
              <img className={styles.leftTop} src={rect} alt="Background" />
            </div>
          </div>
        </main>
        {!context.activeMenu && (
          <div className={styles.arrowTop}>
            <a href="#top">
              <div ref={arrowRef} className={`${styles.imgArrowTop} ${arrowColor}`}></div>
            </a>
          </div>
        )}
      </div>
      <div className={styles.TopMainInfoMobile_comtainer}>
        <Button text={'Подать заявку'} funClick={funClickRequest} />
        <div className={styles.programm_container}>
          <div className={styles.item}>
            <a
              target="_blank"
              href="https://webictis.sfedu.ru/ssas/Program2024.pdf"
              rel="noreferrer"
            >
              Программа конференции
            </a>
            <a
              target="_blank"
              href="https://webictis.sfedu.ru/ssas/Program2024.pdf"
              className={styles.clicker}
              rel="noreferrer"
            ></a>
          </div>
          <div className={styles.item}>
            <a target="_blank" href="#" rel="noreferrer">
              Информационное письмо
            </a>
            <a target="_blank" href="#" className={styles.clicker} rel="noreferrer"></a>
          </div>
          <div className={styles.item}>
            <a target="_blank" href="https://webictis.sfedu.ru/ssas/SSAS_2022.pdf" rel="noreferrer">
              Сборник научных трудов
            </a>
            <a
              target="_blank"
              href="https://webictis.sfedu.ru/ssas/SSAS_2022.pdf"
              className={styles.clicker}
              rel="noreferrer"
            ></a>
          </div>
        </div>
      </div>
    </>
  );
}

export default TopMainInfo;
