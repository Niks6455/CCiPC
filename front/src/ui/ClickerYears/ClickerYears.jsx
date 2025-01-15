import styles from "./ClickerYears.module.scss";

function ClickerYears() {
    return ( 
        <div className={styles.ClickerYears}>
            <div className={styles.ClickerYearsEl}>2023<img src="/img/Calendar.svg"/></div>
            <div className={styles.ClickerYearsEl}>2024<img src="/img/Calendar.svg"/></div>
            <div className={styles.ClickerYearsEl}>2025<img src="/img/Calendar.svg"/></div>
        </div>
     );
}

export default ClickerYears;