import styles from "./AddOrgPeople.module.scss";
import addPhoto from "@assets/img/AdminPanel/addPhoto.svg";
import deletePhotoImg from "@assets/img/AdminPanel/delete.svg";
import FileComponent from "../FileComponent/FileComponent";
import borderIcon from "@assets/img/AdminPanel/borderFile.svg";
import { useEffect, useState } from "react";
function AddOrgPeople(props) {
    const [file, setFile] = useState(null);
    const [fio, setFio] = useState("");
    const [organization, setOrganization] = useState("");

    //! Обработчик выбора файла
    const handleFileChange = (file) => {
        console.log("file", file);
        setFile(file); 
    };
    useEffect(() => {
        console.log("file", file);
    },[file])
    return ( 
        <div className={styles.AddOrgPeople}>
            <div className={styles.AddOrgPeopleInner}>
            <div className={styles.addFile}>
                    <div className={styles.file_cont}>
                    {!file && <img src={borderIcon} alt="img" className={styles.border} />}
                        <div className={styles.border_inner}>
                        <FileComponent
                            data={file}
                            setData={handleFileChange}
                            typeFile={["image/png", "image/jpg", "image/jpeg"]}
                            accept={".png,.jpg"}
                            name={"pngNews"}
                            icon={"png"}
                            text={"Нажмите или перетащите</br> изображение для добавления"}
                            />
                        </div>
                    </div>
                </div>
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
                    <button className={styles.delete} onClick={() => props.closeCreateOne()}><img src={deletePhotoImg}/></button>
                </div>
            </div>
        </div>
     );
}

export default AddOrgPeople;