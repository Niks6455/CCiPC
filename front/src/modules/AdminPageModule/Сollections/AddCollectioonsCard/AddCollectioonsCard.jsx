import { use, useRef, useState } from "react";
import styles from "./AddCollectioonsCard.module.scss"
import deletePhotoImg from "@assets/img/AdminPanel/delete.svg";
import { createArchive, getAllArchiveReport } from "../../../../apirequests/apirequests";

function AddCollectioonsCard(props) {
    const file = useRef(null);
    const fileName = "";
    const [fileData, setFileData] = useState(null);
    const [name, setName] = useState("");
    const createOrg = () =>{
        const data = {
            name: name,
            type: 1
        }
        createArchive(data).then((resp) => {
            if(resp?.status === 200){
                props.updateData();
                props.close();
                console.log(resp?.data?.reports)

            }
        })
    }
    return (
        <div className={styles.AddCollectioonsCard}>
          <div className={styles.AddCollectioonsCardInner}>
                <div className={styles.boxContainer}>
                    <label>Название</label>
                    <textarea value={name} onChange={(e) => setName(e.target.value)}/>
                </div>
                <div className={styles.boxContainer}>
                    <label>Файл сборника</label>
                    <button>Загрузите PDF-файл</button>
                </div>
                <div className={styles.AddCollectioonsCardButton}>
                    <button className={styles.save} onClick={createOrg}>
                        Сохранить
                    </button>
                    <button className={styles.delete} onClick={props.close}>
                        <img src={deletePhotoImg} alt="Удалить" />
                    </button>
                </div>
          </div>
        </div>
    );
}

export default AddCollectioonsCard;