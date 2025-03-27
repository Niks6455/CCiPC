import Header from '@components/Header/Header';
import Layout from '../../ui/Layout/Layout';
import styles from './HomePage.module.scss';
import TopMainInfo from '../../modules/TopMainInfo/TopMainInfo';
import SliderHomePageTop from '../../modules/SliderHomePageTop/SliderHomePageTop';
import SliderHomePage from '../../components/SliderHomePage/SliderHomePage';
import SliderHomePageMobile from '../../components/SliderHomePageMobile/SliderHomePageMobile';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone';
import { useSelector } from 'react-redux';
import { server } from '../../apirequests/apirequests';
import { useState } from 'react';

function HomePage({ userRole }) {
  const conference = useSelector(state => state.conferences.data[0]);
  const { topDiv, bottomDiv } = splitDirectionsEvenly(conference?.directions || []);
  const getDescription = text => {
    let newText = text
      .split('\n')
      .map(paragraph => `<p>${paragraph}</p>`)
      .join('');
    return newText;
  };

  const [style, setStyle] = useState([]);
  const [style2, setStyle2] = useState([]);

  //! обработка фото
  const handleImageLoad = (event, index, setStyle) => {
    console.log('event', event);
    const { naturalWidth, naturalHeight } = event.target;
    console.log('naturalWidth', naturalWidth);
    console.log('naturalHeight', naturalHeight);
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
    const isShortText = textMass.length <= 6;
    const wordsPerLine = isShortText ? 2 : 3;

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
      <HeaderPhone />
      <Header userRole={userRole} />
      <TopMainInfo />
      {conference && conference?.stages?.length > 0 && <SliderHomePageTop />}
      <Layout>
        <section className={styles.textSection}>
          <div className={styles.textSectionIner}>
            <div className={styles.Title}>
              <p>
                НАШИ КОНФЕРЕНЦИИ ПРОХОДЯТ
                <br /> С ПОЛЬЗОЙ НЕ ТОЛЬКО ДЛЯ <br />
                РАЗВИТИЯ, НО И ДЛЯ ЗДОРОВЬЯ!
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
                <p>НАПРАВЛЕНИЯ РАБОТЫ КОНФЕРЕНЦИИ</p>
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
              <p>Организаторы</p>
            </div>
            <div
              className={`${styles.imgSectionInner} ${conference?.organization?.length === 2 ? styles.two : ''}`}
            >
              {conference?.organization?.map((el, index) => (
                <img
                  style={style2[index]}
                  src={`${server}/${el}`}
                  alt="Organization1"
                  key={index}
                  onLoad={e => handleImageLoad(e, index, setStyle2)}
                />
              ))}
            </div>
          </section>
        )}
        {conference && conference?.partner?.length > 0 && (
          <section className={styles.imgSection}>
            <div className={styles.Title}>
              <p>Партнёры</p>
            </div>
            <div
              className={`${styles.imgSectionInner}  ${conference?.partner?.length === 2 ? styles.two : ''}`}
            >
              {conference?.partner?.map((el, index) => (
                <img
                  style={style[index]}
                  src={`${server}/${el}`}
                  alt="Organization1"
                  key={index}
                  onLoad={e => handleImageLoad(e, index, setStyle)}
                />
              ))}
            </div>
          </section>
        )}
      </Layout>
    </div>
  );
}

export default HomePage;
