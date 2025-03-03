import { useEffect, useState } from "react";
import styles from "./Сollections.module.scss"
import { getAllArchiveReport } from "../../../apirequests/apirequests";
import CardCollections from "./CardCollections/CardCollections";
import plusLigthImg from "@assets/img/UI/plusLigth.svg";
import AddCollectioonsCard from "./AddCollectioonsCard/AddCollectioonsCard";

function Сollections() {
    const [dataReports, setDataReports] = useState([]);
    const [addnewReport, setAddnewReport] = useState(false);
    useEffect(() => {   
        updateData();
    }, []);

    const updateData = () => {
        getAllArchiveReport().then((resp) => {
            setDataReports(resp?.data?.archives || []);
            console.log('dataReports', resp?.data?.archives)
        })
    }
    return (
        <div className={styles.Сollections}>
            <p className={styles.title}>Архив сборников</p>
                <div className={styles.СollectionsInner}>
            <div>
                <div className={styles.ButtonAddContainer}>
                    <button onClick={() => setAddnewReport(true)} className={styles.ButtonAdd}>
                        <img src={plusLigthImg} alt="Добавить" />Добавить архив
                    </button>
                </div>
            
            </div>
            <div className={styles.orgCargCont}>
                <div className={styles.orgCargContCards}>
                    {addnewReport && <AddCollectioonsCard updateData={updateData} close={() => setAddnewReport(false)} />}
                    {dataReports?.map((item, index) => (
                        <CardCollections item={item} updateData={updateData} key={index} />
                    ))}
                </div>
            </div>
               
            </div>
        </div>
    );
}

export default Сollections;