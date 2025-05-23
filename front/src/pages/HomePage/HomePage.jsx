import Layout from '../../ui/Layout/Layout';
import styles from './HomePage.module.scss';
import TopMainInfo from '../../modules/TopMainInfo/TopMainInfo';
import SliderHomePageTop from '../../modules/SliderHomePageTop/SliderHomePageTop';
import SliderHomePage from '../../components/SliderHomePage/SliderHomePage';
import SliderHomePageMobile from '../../components/SliderHomePageMobile/SliderHomePageMobile';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests';
import { useEffect, useState } from 'react';

import LoadingComponent from '../../components/LoadingComponent/LoadingComponent';
import ScrollHeader from '../../components/ScrollHeader/ScrollHeader';
import Header from '../../components/Header/Header';
import { Trans, useTranslation } from 'react-i18next';
import LanguageSwitcher from '../../components/LanguageSwitcher/LanguageSwitcher';

function HomePage({ userRole }) {
  const { t } = useTranslation('homePage');
  const conferencesStatus = useSelector(state => state.conferences.status);
  const [loading, setLoading] = useState(false);
  const conference = useSelector(state => state.conferences.data[0]);
  const { topDiv, bottomDiv } = splitDirectionsEvenly(conference?.directions || []);
  const getDescription = text => {
    let newText = text
      .split('\n')
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
    return newText;
  };

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  useEffect(() => {
    if (!conference?.data?.[0]?.id) {
      setLoading(false);
    } else {
      if (conferencesStatus === 'loading') {
        setLoading(true);
      }
    }
  }, [conferencesStatus]);

  const [style, setStyle] = useState([]);
  const [style2, setStyle2] = useState([]);

  //! обработка фото
  const handleImageLoad = (event, index, setStyle) => {
    const { naturalWidth, naturalHeight } = event.target;
    if (naturalWidth > naturalHeight * 2) {
      setStyle(prevStyle => {
        const newStyle = [...prevStyle];
        newStyle[index] = { maxWidth: '100%' };
        return newStyle;
      });
    }
  };

  const getElementName = text => {
    const textMass = text.split(' ');
    const formattedText = [];

    if (textMass.length === 1) {
      return text;
    }
    if (textMass.length === 2 && textMass[1].length > 2) {
      return textMass.map((el, index) => `<p key=${index}>${el}</p>`).join('');
    }
    if (textMass.length === 3) {
      formattedText.push(`<p key=0>${textMass[0]} ${textMass[1]}</p>`);
      formattedText.push(`<p key=1>${textMass[2]}</p>`);
      return formattedText.join('');
    }
    const chunkedText = [];
    const isShortText = textMass.length <= 5;
    const wordsPerLine = isShortText ? 2 : 100;

    for (let i = 0; i < textMass.length; i += wordsPerLine) {
      chunkedText.push(textMass.slice(i, i + wordsPerLine).join(' '));
    }
    return chunkedText.map((line, index) => `<p key=${index}>${line}</p>`).join('');
  };

  function splitDirectionsEvenly(directions) {
    const topDiv = [];
    const bottomDiv = [];
    let topHeight = 0;
    let bottomHeight = 2;
    directions.forEach(el => {
      const textLength = el.name.split(' ').length;
      if (topHeight <= bottomHeight) {
        topDiv.push(el);
        topHeight += textLength;
      } else {
        bottomDiv.push(el);
        bottomHeight += textLength;
      }
    });
    return { topDiv, bottomDiv };
  }

  return (
    <div className={styles.HomePage}>
      {/* Локализация */}
      {/* <LanguageSwitcher /> */}
      {loading && <LoadingComponent setLoading={setLoading} status={conferencesStatus} />}
      <ScrollHeader userRole={userRole} />
      <HeaderPhone />
      <Header userRole={userRole} />
      <TopMainInfo userRole={userRole} />
      {conference && conference?.stages?.length > 0 && <SliderHomePageTop />}
      <Layout>
        <section className={styles.textSection}>
          <div className={styles.textSectionIner}>
            <div className={styles.Title}>
              <p>
                <Trans
                  i18nKey="homePage:par1"
                  components={{
                    1: <br />,
                  }}
                />
              </p>
            </div>
            {conference && conference?.description && (
              <div className={styles.textSectionInerText}>
                <div
                  className={styles.text}
                  dangerouslySetInnerHTML={{ __html: getDescription(conference?.description) }}
                />
              </div>
            )}
          </div>
        </section>
        {conference?.directions?.length > 0 && (
          <section className={styles.clickerSection}>
            <div>
              <div className={styles.Title}>
                <p>{t('par2')}</p>
              </div>
              <div className={`${styles.blockTextCompetitionsInner} ${styles.pc}`}>
                {conference &&
                  conference?.directions?.map((el, index) => (
                    <div key={index} className={styles.blockTextCompetitions}>
                      <p dangerouslySetInnerHTML={{ __html: getElementName(el.name) }}></p>
                    </div>
                  ))}
              </div>
              <div className={`${styles.blockTextCompetitionsInner} ${styles.mobile}`}>
                <div className={styles.row_items}>
                  {topDiv.map((el, index) => (
                    <div key={index} className={styles.blockTextCompetitions}>
                      <p dangerouslySetInnerHTML={{ __html: getElementName(el.name) }}></p>
                    </div>
                  ))}
                </div>
                <div className={styles.row_items}>
                  {bottomDiv.map((el, index) => (
                    <div key={index} className={styles.blockTextCompetitions}>
                      <p dangerouslySetInnerHTML={{ __html: getElementName(el.name) }}></p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </section>
        )}
      </Layout>
      <SliderHomePage />
      <SliderHomePageMobile />
      <Layout>
        {conference && conference?.organization?.length > 0 && (
          <section className={`${styles.imgSection}`}>
            <div className={styles.Title}>
              <p>{t('par3')}</p>
            </div>
            <div
              className={`${styles.imgSectionInner} ${conference?.organization?.length === 2 ? styles.two : ''}`}
            >
              {conference?.organization?.map(
                (el, index) =>
                  el?.url && (
                    <img
                      style={style2[index]}
                      src={`${server}/${el.file}`}
                      onClick={() => window.open(el.url, '_blank')}
                      alt="Organization1"
                      key={index}
                      onLoad={e => handleImageLoad(e, index, setStyle2)}
                      onError={e => (e.target.style.display = 'none')}
                    />
                  ),
              )}
            </div>
          </section>
        )}
        {conference && conference?.partner?.length > 0 && (
          <section className={styles.imgSection}>
            <div className={styles.Title}>
              <p>{t('par4')}</p>
            </div>
            <div
              className={`${styles.imgSectionInner}  ${conference?.partner?.length === 2 ? styles.two : ''}`}
            >
              {conference?.partner?.map(
                (el, index) =>
                  el?.url && (
                    <img
                      style={style[index]}
                      src={`${server}/${el.file}`}
                      alt="Organization1"
                      key={index}
                      onClick={() => window.open(el.url, '_blank')}
                      onLoad={e => handleImageLoad(e, index, setStyle)}
                      onError={e => (e.target.style.display = 'none')}
                    />
                  ),
              )}
            </div>
          </section>
        )}
      </Layout>
    </div>
  );
}

export default HomePage;
