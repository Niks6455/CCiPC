import React from 'react';
import styles from './PopUpContainer.module.scss';
function PopUpContainer({ children }) {
  return <section className={styles.PopUpContainer}>{children}</section>;
}

export default PopUpContainer;
