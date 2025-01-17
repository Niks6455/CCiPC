import { useState } from 'react';
import styles from './ChangeButton.module.scss';

export default function ChangeButtons({ buttonArray }) {
  const [activeButton, setActiveButton] = useState(buttonArray[0].name);
  return (
    <div className={styles.buttons}>
      {buttonArray.map((button, index) => (
        <Button
          key={index}
          {...button}
          isActive={activeButton === button.name}
          setActive={setActiveButton}
        />
      ))}
    </div>
  );
}

function Button({ isActive, Icon, setActive, name }) {
  return (
    <div
      className={`${styles.button} ${
        isActive ? styles.button_active : styles.button_passive
      }`}
      onClick={() => setActive(name)}
    >
      <span className={`${styles.button_text}`}>
        Оформление участия в конференции
      </span>
      <Icon></Icon>
    </div>
  );
}
