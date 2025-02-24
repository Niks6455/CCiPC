import { Calendar } from "primereact/calendar";
import styles from "./DateAdsess.module.scss";
import { ReactComponent as CalendarIcon } from "@assets/img/UI/calendar.svg";
import { useEffect, useRef, useState } from "react";
import { formatDateRangePrimereact } from "../../../../utils/functions/funcions";
import arrowIcon from "@assets/img/UI/arrowMini.svg";

function DateAdsess({ data, setData }) {
  const [calendarShow, setCalendarShow] = useState(false);
  const calendarRef = useRef(null);
  const [listOpen, setListOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (calendarRef.current && !calendarRef.current.contains(event.target)) {
        setCalendarShow(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Ensure the initial state is an array of Date objects for the calendar
  const [date, setDate] = useState([
    data.dateFirst
      ? new Date(data.dateFirst.split(".").reverse().join("-"))
      : null,
    data.dateSecond
      ? new Date(data.dateSecond.split(".").reverse().join("-"))
      : null,
  ]);

  useEffect(() => {
    // Update the calendar state when `data` changes
    setDate([
      data.dateFirst
        ? new Date(data.dateFirst.split(".").reverse().join("-"))
        : null,
      data.dateSecond
        ? new Date(data.dateSecond.split(".").reverse().join("-"))
        : null,
    ]);
  }, [data.dateFirst, data.dateSecond]);

  const funChangeAdress = (e) => {
    setData({ ...data, address: e.target.value });
  };

  //! Function to handle date range selection
  const funSetData = (e) => {
    let selectedDates = e.value; // Array of selected dates

    if (selectedDates && selectedDates.length > 0) {
      // Format the first date if it exists
      const formattedDateFirst = selectedDates[0]
        ? selectedDates[0].toLocaleDateString("ru-RU")
        : "";

      // Format the second date only if it exists
      const formattedDateSecond =
        selectedDates.length === 2 && selectedDates[1]
          ? selectedDates[1].toLocaleDateString("ru-RU")
          : "";

      // Update `data` with formatted dates
      setData({
        ...data,
        dateFirst: formattedDateFirst,
        dateSecond: formattedDateSecond,
      });

      // Update `date` state with Date objects
      setDate(selectedDates);
    }
  };

  const funChangedeUploading = (e) => {
    setData({ ...data, deadlineUploadingReports: e.target.value });
  };

  const funLiClick = (date) => {
    setListOpen(false);
    setData({ ...data, deadlineUploadingReports: date });
  };

  return (
    <div className={styles.DateAdsess}>
      <div className={styles.container}>
        <h3>Крайний срок загрузки докладов</h3>
        <div
          className={`${styles.input_box} ${styles.list}`}
          onClick={() => setListOpen(!listOpen)}
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
                  ? { transform: "scaleY(1)", transition: "all 0.2s ease" }
                  : { transform: "scaleY(-1)", transition: "all 0.2s ease" }
              }
            />
          </button>
          {listOpen && (
            <div className={styles.list_box}>
              {data?.stages.length === 0 ||
              data?.stages.every((item) => !item.date) ? (
                <div className={styles.list_box_empty}>
                  Добавьте этапы конференции
                </div>
              ) : (
                <ul>
                  {data?.stages
                    ?.filter((item) => item.date)
                    .map((item, index) => (
                      <li key={index} onClick={() => funLiClick(item.date)}>
                        {item.date}
                      </li>
                    ))}
                </ul>
              )}
            </div>
          )}
        </div>
      </div>
      <div className={styles.container}>
        <h3>Дата проведения</h3>
        <div
          className={styles.input_box}
          ref={calendarRef}
          onClick={() => setCalendarShow(!calendarShow)}
        >
          <button className={styles.icon}>
            <CalendarIcon />
          </button>
          <input
            type="text"
            value={formatDateRangePrimereact(date[0], date[1])}
            readOnly
          />
          {calendarShow && (
            <div className={styles.calendar_show}>
              <div className="stage_calendar">
                <Calendar
                  value={date}
                  locale="ru"
                  inline
                  showWeek
                  selectionMode="range" // Enables range selection
                  hideOnRangeSelection={false} // Keeps the calendar open after selecting a range
                  onChange={funSetData} // Handles date changes
                />
              </div>
            </div>
          )}
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
