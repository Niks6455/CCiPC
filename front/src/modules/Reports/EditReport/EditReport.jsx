import { useEffect, useState } from 'react';
import styles from './EditReport.module.scss';
import { useNavigate, useSearchParams } from "react-router-dom"; // Импортируем хук для работы с query params
import { useSelector } from 'react-redux';

function EditReport() {
    const [searchParams] = useSearchParams(); // Получаем query параметры
    const report = useSelector((state) => state.reportsSlice.data);
    const [reportData, setReportData] = useState(null);
    
    useEffect(() => {
        const idReport = searchParams.get("idReport"); // Получаем idReport из query параметров
        if (idReport && report.length > 0) {
            setReportData(report.find((item) => item.id === idReport));
        }
    }, [searchParams, report]); // Запускаем useEffect при изменении query параметров или списка докладов
    
    useEffect(() => {
            console.log("reportData", reportData)
    },[reportData])

    return ( 
        <section className={styles.EditReport}>
            EditReport
        </section>
     );
}

export default EditReport;