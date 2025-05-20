import { useState } from 'react';
import styles from './AuthorCollection.module.scss';
import FolderIcon from '../../assets/img/UI/Folder.svg';
import { server } from '../../apirequests/apirequests';
import ErrorModal from '../ErrorModal/ErrorModal';
import { useTranslation } from 'react-i18next';

export default function AuthorCollection({ children, link }) {
  const { i18n } = useTranslation();
  const [noFile, setNoFile] = useState(false);

  const clickLink = () => {
    setNoFile(true);
  };

  const handleClick = e => {
    if (!link?.url) {
      e.preventDefault(); // Prevents the default link action
      clickLink(); // Calls the function if there is no URL
    }
  };

  return (
    <div className={styles.collection_element}>
      <img src={FolderIcon} alt="FolderIcon" />
      <a
        href={link?.url ? `${server}/${link?.url}` : '#'} // Fallback URL
        onClick={handleClick} // Use new handler
        target="_blank"
        rel="noreferrer"
        className={styles.collection_element_text}
      >
        {children}
      </a>
      <ErrorModal
        open={noFile}
        close={setNoFile}
        title={
          i18n.language === 'ru'
            ? 'Приносим свои извинения, сборник временно недоступен.'
            : 'Sorry, the collection is temporarily unavailable.'
        }
      />
    </div>
  );
}
