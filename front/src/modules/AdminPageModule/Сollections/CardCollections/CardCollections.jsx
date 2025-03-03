import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./CardCollections.module.scss";
import { updateArchive, deleteArchive, uploadPhoto } from "../../../../apirequests/apirequests";
import deletePhotoImg from "@assets/img/AdminPanel/delete.svg";

function CardCollections(props) {
    const fileInputRef = useRef(null);
    const buttonContainerRef = useRef(null);
    const buttonDeleteRef = useRef(null);

    const defaultValue = {
        name: props?.item?.name || "",
        file: props?.item?.file || null,
    };

    const [dataItem, setDataItem] = useState(defaultValue);
    const [isChanged, setIsChanged] = useState(false);

    useEffect(() => {
        const hasChanged = dataItem.name !== defaultValue.name || dataItem.file !== defaultValue.file;
        setIsChanged(hasChanged);
    }, [dataItem, defaultValue]);

    useEffect(() => {
        if (buttonContainerRef.current) {
            gsap.to(buttonContainerRef.current, {
                opacity: isChanged ? 1 : 0,
                height: isChanged ? "auto" : 0,
                duration: 0.3,
                ease: "power2.out",
                display: isChanged ? "flex" : "none",
            });
        } else {
            gsap.fromTo(buttonDeleteRef.current, { height: 0 }, { height: "52px", duration: 0.3, ease: "power2.out" });
        }
    }, [isChanged]);

    const handleEditData = (value, key) => {
        setDataItem((prev) => ({ ...prev, [key]: value }));
    };

    const handleFileUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setDataItem((prev) => ({ ...prev, file }));
        }
    };

    const handleCancel = () => setDataItem(defaultValue);
    const handleSave = () => {
        const data = {
            name: dataItem.name,
            type: 1
        }
      
        updateArchive(data, props.item.id).then((res) => {
            if (res?.status === 200) {
                if (dataItem?.file) {
                    const formData = new FormData();
                    formData.append("file", dataItem.file);
                    formData.append("reportId", props?.item?.id);
                    uploadPhoto(formData, "REPORT")
                }
            }
            props?.updateData();
        });
    };

    const handleDelete = () => {
        deleteArchive(props.item.id).then((res) => {
            if (res?.status === 200) {
                props?.updateData();
            }
        });
    };

    return (
        <div className={styles.CardCollections} key={props?.item?.id}>
            <div className={styles.boxContainer}>
                <label>Название</label>
                <textarea value={dataItem.name} onChange={(e) => handleEditData(e.target.value, "name")} />
            </div>
            <div className={styles.boxContainer}>
                <label>Файл сборника</label>
                <button onClick={() => fileInputRef.current.click()} style={{ color: !dataItem.file ? "#b32020" : "#58B191" }}>{dataItem.file ? dataItem.file.name : "Загрузите PDF-файл"}</button>
                <input type="file" ref={fileInputRef} style={{ display: "none" }} onChange={handleFileUpload} accept=".pdf" />
            </div>
            {isChanged ? (
                <div className={styles.buttonContainer} ref={buttonContainerRef}>
                    <button className={styles.cancel} onClick={handleCancel}>Отмена</button>
                    <button className={styles.save} onClick={handleSave}>Сохранить</button>
                </div>
            ) : (
                <button className={styles.delete} onClick={handleDelete} ref={buttonDeleteRef}>
                    Удалить <img src={deletePhotoImg} alt="Удалить" />
                </button>
            )}
        </div>
    );
}

export default CardCollections;
