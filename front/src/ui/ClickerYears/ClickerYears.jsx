import { useEffect, useState } from 'react';
import styles from './ClickerYears.module.scss';
import Calendar from './../../assets/img/Calendar.svg';
function ClickerYears(props) {
  const [dateArray, setDateArray] = useState([]);
  useEffect(() => {
    const dateArray = props.data.map(item => {
      return item.createdAt.split('T')[0].split('-')[0];
    });
    const dates = [...new Set(dateArray)].sort((a, b) => a - b);
    setDateArray(dates);
  }, [props.data]);

  return (
    <div className={styles.ClickerYears}>
      {dateArray.map(item => (
        <div
          className={`${styles.ClickerYearsEl} ${props.activeYears === item ? styles.Active : ''}`}
          onClick={() => props.setActiveYears(item)}
        >
          {item}
          <img src={Calendar} alt="Calendar" />
        </div>
      ))}
    </div>
  );
}

export default ClickerYears;
