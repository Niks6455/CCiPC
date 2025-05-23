import { useEffect, useRef, useState } from 'react';
import styles from './StagesConference.module.scss';
import CalendarIcon from '@assets/img/UI/calendar.svg';
import { ReactComponent as Delete } from '@assets/img/UI/x.svg';
import Plus from '@assets/img/UI/plus.svg';
import { Calendar } from 'primereact/calendar';
import 'primereact/resources/themes/saga-blue/theme.css';
import './../style.css';

function StagesConference({ data, setData, validateError, setValidateError }) {
  const [editItemIndex, setEditItemIndex] = useState(null);
  const [isEditing, setIsEditing] = useState(false); // состояние для отслеживания редактирования инпута чтобы не происходило сортировки
  const calendarRef = useRef(null);

  //! добавить пустой этап
  const funAddStage = () => {
    const stage = [...data?.stages, { date: '', name: '' }];
    setData({ ...data, stages: stage });
  };

  //! удалить этап по индексу
  const funDeleteStage = index => {
    const stage = [...data?.stages];
    if (data.deadlineUploadingReports === stage[index]?.date) {
      stage.splice(index, 1);
      setData({ ...data, deadlineUploadingReports: '', stages: stage });
    } else {
      stage.splice(index, 1);
      setData({ ...data, stages: stage });
    }
  };

  //! открытие календаря
  const funClickCalendar = index => {
    if (index === editItemIndex) {
      setEditItemIndex(null);
    } else {
      setEditItemIndex(index);
    }
  };

  //! изменение даты в этапе конференции
  const funSetData = (index, e) => {
    const stage = [...data?.stages];
    const date = new Date(e.target.value).toLocaleDateString('ru-RU');
    stage[index].date = date;
    setData({ ...data, stages: stage });
    setEditItemIndex(null);
  };

  //! изменение название этапа конференции
  const funSetStagesName = (index, e) => {
    const stage = [...data?.stages];
    if (e.target.value.length > 120) return;
    stage[index].name = e.target.value;
    setData({ ...data, stages: stage });
  };

  //! закрытие календаря приклике вне него
  useEffect(() => {
    const handleClickOutside = event => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setEditItemIndex(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const onFocusInput = e => {
    setIsEditing(true);
    e.target.placeholder = '';
  };

  const onBlurInput = e => {
    setIsEditing(false);
    e.target.placeholder = 'Название этапа';
  };

  return (
    <div className={styles.StagesConference}>
      <h3 className={styles.stages_conference_title}>Этапы конференции</h3>
      <div className={styles.stages_conference_block}>
        <ul>
          {(isEditing
            ? data?.stages
            : data?.stages?.sort((a, b) => {
                if (!a.date && !b.date) return 0; // Оба элемента без даты
                if (!a.date) return 1; // Элемент `a` без даты, переместить его вниз
                if (!b.date) return -1; // Элемент `b` без даты, переместить его вниз
                if (!a.name && !b.name) return 0;
                if (!a.name) return 1;
                if (!b.name) return -1;
                const parseDate = dateString => {
                  const [day, month, year] = dateString.split('.').map(Number);
                  return new Date(year, month - 1, day); // Month is 0-indexed
                };

                const dateA = parseDate(a.date);
                const dateB = parseDate(b.date);
                return dateA - dateB; // Compare dates
                // return a?.date?.localeCompare(b.date); // Сравнение по дате
              })
          )?.map((item, index) => (
            <li key={index}>
              <div className={styles.left_block} ref={index === editItemIndex ? calendarRef : null}>
                <div className={styles.calendar}>
                  <button
                    className={styles.button_calendar}
                    onClick={() => funClickCalendar(index)}
                  >
                    <img src={CalendarIcon} alt="img" />
                  </button>
                  {editItemIndex === index && (
                    <div className={styles.calendar_show}>
                      <div className="stage_calendar">
                        <Calendar
                          locale="ru"
                          inline
                          showWeek
                          onChange={e => funSetData(index, e)}
                        />
                      </div>
                    </div>
                  )}
                </div>

                <div className={styles.date} onClick={() => funClickCalendar(index)}>
                  <span className={`${item.date ? '' : styles.edit}`}>
                    {item.date || 'дд.мм.гггг'}
                  </span>
                </div>
                <div className={styles.point}></div>
                <div className={`${styles.info}`}>
                  <input
                    onFocus={onFocusInput} // Устанавливаем режим редактирования
                    onBlur={onBlurInput} // Выключаем режим редактирования
                    type="text"
                    placeholder="Название этапа"
                    className={`${item.name ? '' : styles.edit}`}
                    value={item.name}
                    onChange={e => funSetStagesName(index, e)}
                  />
                </div>
              </div>
              <div className={styles.right_block}>
                <button onClick={() => funDeleteStage(index)}>
                  <Delete />
                </button>
              </div>
            </li>
          ))}
        </ul>
        <div className={styles.add_stage}>
          <button onClick={funAddStage}>
            <img src={Plus} alt="img" />
            <span>Добавить этап</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default StagesConference;
