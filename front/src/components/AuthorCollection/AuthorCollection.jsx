import { useState } from 'react';
import styles from './AuthorCollection.module.scss';
import FolderIcon from '../../assets/img/UI/Folder.svg';
import { server } from '../../apirequests/apirequests';
export default function AuthorCollection({ children, link }) {
  const [isActive, setActive] = useState(false);
  return (
    <div
      className={styles.collection_element}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
      <img src={FolderIcon} alt="FolderIcon" />
      <a
        href={`${server}/${link?.url}`}
        target="_blank"
        rel="noreferrer"
        className={`${styles.collection_element_text} ${isActive && styles.active_text}`}
      >
        {children}
      </a>
    </div>
  );
}
