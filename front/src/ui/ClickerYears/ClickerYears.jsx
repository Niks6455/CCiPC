import { useState } from "react";
import styles from "./ClickerYears.module.scss";

function ClickerYears() {
    const [activeYears, setActiveYears] = useState(2024);

    return (
        <div className={styles.ClickerYears}>
            <div 
                className={`${styles.ClickerYearsEl} ${activeYears === 2023 ? styles.Active : ""}`}
                onClick={() => setActiveYears(2023)}
            >
                2023<img src="/img/Calendar.svg" alt="Calendar"/>
            </div>
            <div 
                className={`${styles.ClickerYearsEl} ${activeYears === 2024 ? styles.Active : ""}`}
                onClick={() => setActiveYears(2024)}
            >
                2024<img src="/img/Calendar.svg" alt="Calendar"/>
            </div>
            <div 
                className={`${styles.ClickerYearsEl} ${activeYears === 2025 ? styles.Active : ""}`}
                onClick={() => setActiveYears(2025)}
            >
                2025<img src="/img/Calendar.svg" alt="Calendar"/>
            </div>
        </div>
    );
}

export default ClickerYears;
