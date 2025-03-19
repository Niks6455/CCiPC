import { useState, useRef, useEffect } from 'react';
import styles from './AboutConference.module.scss';

function AboutConference({ data, setData }) {
  const textareaRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({ visible: false });
  const funChangeAbout = e => {
    setData({ ...data, aboutConference: e.target.value });
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (textareaRef.current && !textareaRef.current.contains(event.target)) {
        setContextMenu(false);
        handleContextMenu(event);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Показать контекстное меню, если есть выделенный текст
  const handleContextMenu = e => {
    e.preventDefault();
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start !== end) {
      setContextMenu({ visible: true });
    } else {
      setContextMenu({ visible: false }); // Скрыть меню, если нет выделения
    }
  };

  // Скрыть контекстное меню
  const closeContextMenu = () => {
    setContextMenu({ visible: false });
  };

  // Добавить <b>...</b> вокруг выделенного текста
  const funMake = (action, name) => {
    const textarea = textareaRef.current;
    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    if (start === end) return; // Если ничего не выделено, ничего не делать
    const text = data.aboutConference;
    const selectedText = text.substring(start, end);
    const newText =
      text.substring(0, start) +
      `<${action} ${name ? `name="${name}"` : ''}>${selectedText}</${action}>` +
      text.substring(end);
    setData({ ...data, aboutConference: newText });
    closeContextMenu();
  };

  // Добавить класс с линией зленой вокруг выделенного текста

  // Перехват клавиши Tab для добавления отступа
  const handleTab = e => {
    if (e.key === 'Tab') {
      e.preventDefault(); // Предотвращаем стандартное поведение Tab (переход фокуса)
      const textarea = textareaRef.current;
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      // Вставляем &emsp; (или символ табуляции \t) в позицию курсора
      const text = data.aboutConference;
      const newText = text.substring(0, start) + '&emsp;' + text.substring(end);
      setData({ ...data, aboutConference: newText });
      // Ставим курсор после вставленного отступа
      textarea.selectionStart = textarea.selectionEnd = start + '&emsp;'.length;
    }
  };

  return (
    <div className={styles.AboutConference} onClick={closeContextMenu}>
      <div className={styles.head}>
        <h3>О конференции</h3>
        <div className={styles.editing}>
          <ul className={styles.contextMenu}>
            <li onClick={() => funMake('b')}>Выделить жирным</li>
            <li onClick={() => funMake('div', 'line')}>Выделить линией</li>
          </ul>
        </div>
      </div>

      <textarea
        ref={textareaRef}
        value={data.aboutConference}
        onChange={funChangeAbout}
        onMouseEnter={handleContextMenu}
        onKeyDown={handleTab} // Перехватываем нажатие Tab
      />
    </div>
  );
}

export default AboutConference;
