import { useTranslation } from 'react-i18next';
import arrowBely from '@assets/img/UI/arrowBely.svg';
import { useEffect, useRef, useState } from 'react';
import styles from './LanguageSwitcher.module.scss';

const LanguageSwitcher = () => {
  const [showList, setShowList] = useState(false);
  const { i18n } = useTranslation();
  const refList = useRef(null);
  const changeLanguage = lng => {
    i18n.changeLanguage(lng);
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (refList.current && !refList.current.contains(event.target)) {
        setShowList(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div ref={refList} className={styles.LanguageSwitcher}>
      <button className={styles.button_open} onClick={() => setShowList(!showList)}>
        <span>{i18n.language === 'ru' ? 'RU' : 'EN'}</span>
        <img
          style={{ transform: !showList ? 'scale(1)' : 'scale(-1)' }}
          src={arrowBely}
          alt="Открыть"
        />
      </button>
      {showList && (
        <div className={styles.list}>
          <button
            onClick={() => {
              changeLanguage('ru');
              setShowList(false);
            }}
          >
            RU
          </button>
          <button
            onClick={() => {
              changeLanguage('en');
              setShowList(false);
            }}
          >
            EN
          </button>
        </div>
      )}
    </div>
  );
};

export default LanguageSwitcher;
