import styles from "./AddOrgPeople.module.scss";
import addPhoto from "@assets/img/AdminPanel/addPhoto.svg";
import deletePhotoImg from "@assets/img/AdminPanel/delete.svg";
function AddOrgPeople() {
    return ( 
        <div className={styles.AddOrgPeople}>
            <div className={styles.AddOrgPeopleInner}>
                <div className={styles.AddOrgPeopleFile}>
                    
                </div>
                <input style={{display: "none"}} type="file" />
                <div className={styles.AddOrgPeopleInput}>
                    <label>ФИО</label>
                    <input type="text"/>
                </div>
                <div className={styles.AddOrgPeopleInput}>
                    <label>Организация</label>
                    <textarea type="text"/>
                </div>
                <div className={styles.AddOrgPeopleButton}>
                    <button className={styles.save}>Сохранить</button>
                    <button className={styles.delete}><img src={deletePhotoImg}/></button>
                </div>
            </div>
        </div>
     );
}

export default AddOrgPeople;