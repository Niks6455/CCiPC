import { useState } from 'react';
import styles from './AuthorCollection.module.scss';
import FolderIcon from '../../assets/img/UI/Folder.svg';
import { server } from '../../apirequests/apirequests';
import ErrorModal from '../ErrorModal/ErrorModal';

export default function AuthorCollection({ children, link }) {
  const [isActive, setActive] = useState(false);
  const [noFile, setNoFile] = useState(false);

  const clickLink = () => {
    setNoFile(true);
  };

  const handleClick = (e) => {
    if (!link?.url) {
      e.preventDefault(); // Prevents the default link action
      clickLink(); // Calls the function if there is no URL
    }
  };

  return (
    <div
      className={styles.collection_element}
      onMouseEnter={() => setActive(true)}
      onMouseLeave={() => setActive(false)}
    >
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
      <ErrorModal open={noFile} close={setNoFile} title={"Приносим свои извинения, сборник временно недоступен."}/>
    </div>
  );
}
