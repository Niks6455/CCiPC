import Button from '../../ui/Button/Button';
import Layout from '../../ui/Layout/Layout';
import styles from './TopMainInfo.module.scss';
// import Bg from '@assets/img/Bg.png';
import Bg from '@assets/img/BgTaganrog.jpg';

import rect from '../../assets/img/rect.svg';
import React, { useContext, useEffect, useRef, useState } from 'react';
import DataContext from '../../context';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { formatDateRangePrimereact } from '../../utils/functions/funcions';
import { server } from '../../apirequests/apirequests';
import { AnimatePresence, motion } from 'framer-motion';
import { Trans, useTranslation } from 'react-i18next';
import guideIcon from '@assets/img/UI/guide.svg';
import userManualDocument from '@assets/docs/user_manual.pdf';

function TopMainInfo({ userRole }) {
  const { t } = useTranslation('homePage');
  const conference = useSelector(state => state?.conferences?.data[0]);
  const userData = useSelector(state => state.user.user.data);
  const arrowRef = useRef(null); // Реф для стрелки
  const navigate = useNavigate();
  const [arrowColor, setArrowColor] = useState(styles.greenArrow); // Начальный стиль стрелки
  const context = useContext(DataContext);
  const [isVisible, setIsVisible] = useState(false);

  const funClickRequest = () => {
    if (userRole === 1) {
      navigate('/account/profile');
    } else {
      if (!userData.email) {
        navigate('/login/authorization');
      } else {
        navigate('/account/documents');
      }
    }
  };

  const handleScroll = () => {
    if (window.scrollY > 300) {
      setIsVisible(true);
    } else {
      setIsVisible(false);
    }
  };
  useEffect(() => {
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

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
                <button
                  className={styles.guide}
                  onClick={() => window.open(userManualDocument, '_blank')}
                >
                  <img src={guideIcon} alt="guideIcon" /> <span>Руководство пользователя</span>
                </button>
                <div className={styles.mainTopList}>
                  <ul>
                    {conference?.files?.PROGRAM?.[0]?.url && (
                      <li>
                        <a
                          target="_blank"
                          href={
                            conference?.files?.PROGRAM
                              ? `${server}/${conference?.files?.PROGRAM[0]?.url}`
                              : '#'
                          }
                          rel="noreferrer"
                        >
                          <Trans
                            i18nKey={'homePage:par26'}
                            components={{
                              1: <br />,
                            }}
                          />
                        </a>
                        <a
                          target="_blank"
                          href={
                            conference?.files?.PROGRAM
                              ? `${server}/${conference?.files?.PROGRAM[0]?.url}`
                              : '#'
                          }
                          className={styles.clicker}
                          rel="noreferrer"
                        ></a>
                      </li>
                    )}
                    {conference?.files?.LETTER?.[0]?.url && (
                      <li>
                        <a
                          target="_blank"
                          href={
                            conference?.files?.LETTER
                              ? `${server}/${conference?.files?.LETTER[0]?.url}`
                              : '#'
                          }
                          rel="noreferrer"
                        >
                          <Trans
                            i18nKey={'homePage:par27'}
                            components={{
                              1: <br />,
                            }}
                          />
                        </a>
                        <a
                          target="_blank"
                          href={
                            conference?.files?.LETTER
                              ? `${server}/${conference?.files?.LETTER[0]?.url}`
                              : '#'
                          }
                          className={styles.clicker}
                          rel="noreferrer"
                        ></a>
                      </li>
                    )}
                    {conference?.files?.COLLECTION?.[0]?.url && (
                      <li>
                        <a
                          target="_blank"
                          href={
                            conference?.files?.COLLECTION
                              ? `${server}/${conference?.files?.COLLECTION[0]?.url}`
                              : '#'
                          }
                          rel="noreferrer"
                        >
                          <Trans
                            i18nKey={'homePage:par28'}
                            components={{
                              1: <br />,
                            }}
                          />
                        </a>
                        <a
                          target="_blank"
                          href={
                            conference?.files?.COLLECTION
                              ? `${server}/${conference?.files?.COLLECTION[0]?.url}`
                              : '#'
                          }
                          className={styles.clicker}
                          rel="noreferrer"
                        ></a>
                      </li>
                    )}
                  </ul>
                </div>
              </Layout>
            </div>
          </div>
          <div className={styles.buttonClicker}>
            <div className={styles.buttonClickerInner}>
              <img className={styles.leftBot} src={rect} alt="Background" />
              <Button text={t('par29')} funClick={funClickRequest} />
              <img className={styles.leftTop} src={rect} alt="Background" />
            </div>
          </div>
        </main>
        {!context.activeMenu && (
          <div className={styles.arrowTop}>
            <AnimatePresence>
              {isVisible && (
                <motion.a
                  // href="#top"
                  onClick={() => {
                    window.scrollTo(0, 0);
                  }}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                >
                  <div ref={arrowRef} className={`${styles.imgArrowTop} ${arrowColor}`}></div>
                </motion.a>
              )}
            </AnimatePresence>
          </div>
        )}
      </div>
      <div className={styles.TopMainInfoMobile_comtainer}>
        <Button text={'Подать заявку'} funClick={funClickRequest} />
        <div className={styles.programm_container}>
          {conference?.files?.PROGRAM?.[0]?.url && (
            <div className={styles.item}>
              <a
                target="_blank"
                href={
                  conference?.files?.PROGRAM
                    ? `${server}/${conference?.files?.PROGRAM[0]?.url}`
                    : '#'
                }
                rel="noreferrer"
              >
                {t('par30')}
              </a>
              <a
                target="_blank"
                href={
                  conference?.files?.PROGRAM
                    ? `${server}/${conference?.files?.PROGRAM[0]?.url}`
                    : '#'
                }
                className={styles.clicker}
                rel="noreferrer"
              ></a>
            </div>
          )}

          {conference?.files?.LETTER?.[0]?.url && (
            <div className={styles.item}>
              <a
                target="_blank"
                href={
                  conference?.files?.LETTER ? `${server}/${conference?.files?.LETTER[0]?.url}` : '#'
                }
                rel="noreferrer"
              >
                {t('par31')}
              </a>
              <a
                target="_blank"
                href={
                  conference?.files?.LETTER ? `${server}/${conference?.files?.LETTER[0]?.url}` : '#'
                }
                className={styles.clicker}
                rel="noreferrer"
              ></a>
            </div>
          )}

          {conference?.files?.COLLECTION?.[0]?.url && (
            <div className={styles.item}>
              <a
                target="_blank"
                href={
                  conference?.files?.COLLECTION
                    ? `${server}/${conference?.files?.COLLECTION[0]?.url}`
                    : '#'
                }
                rel="noreferrer"
              >
                {t('par32')}
              </a>
              <a
                target="_blank"
                href={
                  conference?.files?.COLLECTION
                    ? `${server}/${conference?.files?.COLLECTION[0]?.url}`
                    : '#'
                }
                className={styles.clicker}
                rel="noreferrer"
              ></a>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default TopMainInfo;
