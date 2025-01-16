import { useState } from 'react';
import styles from './AuthorCollection.module.scss';
import { ReactComponent as FolderIcon } from '../../assets/img/UI/Folder.svg';

export default function AuthorCollection({ children }) {
  const [isActive, setActive] = useState(false);

  return (
    <div
      className={styles.collection_element}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <FolderIcon stroke={isActive ? '#005935' : '#333333'}></FolderIcon>
      <a
        href="#link"
        className={`${styles.collection_element_text} ${
          isActive && styles.active_text
        }`}
      >
        {children}
      </a>
    </div>
  );
}
