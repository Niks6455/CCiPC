import { Calendar } from 'primereact/calendar';
import styles from './DateAdsess.module.scss';
import calendarIcon from '@assets/img/UI/calendar.svg';
import { useEffect, useRef, useState } from 'react';
import { formatDateRangePrimereact } from '../../../../utils/functions/funcions';
import arrowIcon from '@assets/img/UI/arrowMini.svg';
import { AnimatePresence, motion } from 'framer-motion';

function DateAdsess({ data, setData }) {
  const [calendarShow, setCalendarShow] = useState(false);
  const [listOpen, setListOpen] = useState(null);
  const calendarRef = useRef(null);
  const listRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = event => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarShow(false);
      }
      if (listRef.current && !listRef.current.contains(event.target)) {
        setListOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const [date, setDate] = useState([
    data?.dateFirst ? new Date(data.dateFirst.split('.').reverse().join('-')) : null,
    data?.dateSecond ? new Date(data.dateSecond.split('.').reverse().join('-')) : null,
  ]);

  useEffect(() => {
    setDate([
      data?.dateFirst ? new Date(data.dateFirst.split('.').reverse().join('-')) : null,
      data?.dateSecond ? new Date(data.dateSecond.split('.').reverse().join('-')) : null,
    ]);
  }, [data.dateFirst, data.dateSecond]);

  const funChangeAdress = e => {
    setData({ ...data, address: e.target.value });
  };

  //! Function to handle date range selection
  const funSetData = e => {
    let selectedDates = e.value;

    if (selectedDates && selectedDates.length > 0) {
      const formattedDateFirst = selectedDates[0]
        ? selectedDates[0]?.toLocaleDateString('ru-RU')
        : '';

      const formattedDateSecond =
        selectedDates.length === 2 && selectedDates[1]
          ? selectedDates[1]?.toLocaleDateString('ru-RU')
          : '';

      setData({
        ...data,
        dateFirst: formattedDateFirst,
        dateSecond: formattedDateSecond,
      });
      setDate(selectedDates);
    }
  };

  const funChangedeUploading = e => {
    setData({ ...data, deadlineUploadingReports: e.target.value });
  };

  const funLiClick = date => {
    setListOpen(false);
    setData({ ...data, deadlineUploadingReports: date });
  };

  const funOpenList = () => {
    setListOpen(!listOpen);
  };

  const funOpenCalendar = e => {
    if (e.target.nodeName === 'INPUT' || e.target.id.includes('open_calendar')) {
      setCalendarShow(!calendarShow);
    } else {
      setCalendarShow(true);
    }
  };

  return (
    <div className={styles.DateAdsess}>
      <div className={styles.container}>
        <h3>Крайний срок загрузки докладов</h3>
        <div
          className={`${styles.input_box} ${styles.list} ${listOpen ? styles.list_open_input : ''}`}
          onClick={() => funOpenList()}
          ref={listRef}
        >
          <input
            type="text"
            value={data.deadlineUploadingReports}
            onChange={funChangedeUploading}
            readOnly
          />
          <button className={styles.arrow_button}>
            <img
              src={arrowIcon}
              alt="Arrow"
              style={
                listOpen
                  ? { transform: 'scaleY(1)', transition: 'all 0.2s ease' }
                  : { transform: 'scaleY(-1)', transition: 'all 0.2s ease' }
              }
            />
          </button>
          <AnimatePresence>
            {listOpen && (
              <motion.div
                key="box"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={`${styles.list_box}`}
              >
                {data?.stages.length === 0 || data?.stages.every(item => !item.date) ? (
                  <div className={styles.list_box_empty}>Добавьте этапы конференции</div>
                ) : (
                  <ul>
                    {data?.stages
                      ?.filter(item => item.date)
                      .map((item, index) => (
                        <li key={index} onClick={() => funLiClick(item.date)}>
                          {item.date}
                        </li>
                      ))}
                  </ul>
                )}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className={styles.container}>
        <h3>Дата проведения</h3>
        <div
          className={`${styles.input_box}`}
          id="open_calendar1"
          ref={calendarRef}
          onClick={e => funOpenCalendar(e)}
          style={{ cursor: 'pointer' }}
        >
          <button className={`${styles.icon}`} id="open_calendar2">
            <img src={calendarIcon} alt="img" id="open_calendar4" />
          </button>
          <input
            id="open_calendar3"
            type="text"
            value={formatDateRangePrimereact(date[0], date[1])}
            readOnly
            style={{ cursor: 'pointer' }}
          />
          <AnimatePresence>
            {calendarShow && (
              <motion.div
                key="calendar"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className={styles.calendar_show}
              >
                <div className="stage_calendar">
                  <Calendar
                    value={date[0] ? [date[0], date[1]] : null}
                    locale="ru"
                    inline
                    showWeek
                    selectionMode="range"
                    hideOnRangeSelection={false}
                    onChange={funSetData}
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
      <div className={styles.container}>
        <h3>Место проведения</h3>
        <div className={styles.input_box}>
          <input type="text" value={data.address} onChange={funChangeAdress} />
        </div>
      </div>
    </div>
  );
}

export default DateAdsess;
