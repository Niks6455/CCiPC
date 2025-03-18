import { useEffect, useState } from 'react';
import styles from './ClickerYears.module.scss';
import Calendar from './../../assets/img/Calendar.svg';
function ClickerYears(props) {
  const [activeYears, setActiveYears] = useState(2024);
  console.log(props.data);
  const [dateArray, setDateArray] = useState([]);
  useEffect(() => {
    const dateArray = props.data.map((item) => {
      return  item.createdAt.split('T')[0].split('-')[0];
    });
    setDateArray([...new Set(dateArray)]);
  }, [props.data]);

  useEffect(() => {
    console.log("dateArray", dateArray)
  }, [dateArray]);
        
  return (
    <div className={styles.ClickerYears}>
      
      {/* <div
        className={`${styles.ClickerYearsEl} ${activeYears === 2025 ? styles.Active : ''}`}
        onClick={() => setActiveYears(2025)}
      >
        2025
        <img src={Calendar} alt="Calendar" />
      </div> */}
      {dateArray.map((item) => (
        <div
          className={`${styles.ClickerYearsEl} ${activeYears === item ? styles.Active : ''}`}
          onClick={() => setActiveYears(item)}
        >
          {item}
          <img src={Calendar} alt="Calendar" />
        </div>
      ))}
    </div>
  );
}

export default ClickerYears;
