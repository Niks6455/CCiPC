import { useEffect, useState } from 'react';
import styles from './ChangeButtons.module.scss';

export default function ChangeButtons({ buttonArray, setIndex }) {
  const [activeButton, setActiveButton] = useState(0);

  useEffect(() => {
    setIndex(activeButton);
  }, [activeButton]);

  return (
    <div className={styles.buttonsContainer}>
      <div className={styles.buttons}>
        {buttonArray.map((button, index) => (
          <Button
            key={index}
            {...button}
            isActive={activeButton === index}
            setActive={() => setActiveButton(index)}
          />
        ))}
      </div>
    </div>

  );
}

function Button({ isActive, Icon, setActive, text }) {
  return (
    <div
      className={`${styles.button} ${isActive ? styles.button_active : styles.button_passive}`}
      onClick={() => setActive()}
    >
      <span className={`${styles.button_text}`}>{text}</span>
      {Icon && <Icon></Icon>}
    </div>
  );
}
