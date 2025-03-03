import { useEffect, useRef, useState } from "react";
import { gsap } from "gsap";
import styles from "./CardArchive.module.scss";
import notPhoto from "@assets/img/noPhotoNews.svg";
import deletePhotoImg from "@assets/img/AdminPanel/delete.svg";
import { deleteArchive, deleteOrgCommitet, updateArchive, updateOrgCommitet } from "../../../../apirequests/apirequests";
import deletePhoto2Img from "@assets/img/AdminPanel/deletePhoto.svg";
import editPhoto2Img from "@assets/img/AdminPanel/editPhoto.svg";

function CardArchive(props) {
  const textareasRef = useRef(null);
  const buttonContainerRef = useRef(null);
  const buttonDeleteRef = useRef(null);
  const defaultValue = {
    img: props?.item?.img || "",
    name: props?.item?.name || "",
    url: props?.item?.url || "",
  };

  const [dataItem, setDataItem] = useState(defaultValue);
  const [isChanged, setIsChanged] = useState(false);

  // Проверка изменений
  useEffect(() => {
    console.log("props?.item", props?.item)
    const hasChanged =
      dataItem.name !== defaultValue.name ||
      dataItem.url !== defaultValue.url ||
      dataItem.img !== defaultValue.img;
    setIsChanged(hasChanged);
  }, [dataItem, defaultValue]);

  // Анимация появления кнопок "Отменить" и "Сохранить"
  useEffect(() => {
    if (buttonContainerRef.current) {
      gsap.to(buttonContainerRef.current, {
        opacity: isChanged ? 1 : 0,
        height: isChanged ? "auto" : 0,
        duration: 0.3,
        ease: "power2.out",
        display: isChanged ? "flex" : "none",
      });
    }else{
      gsap.fromTo(buttonDeleteRef.current, {
        height: 0,
        duration: 0.3,
        ease: "power2.out",
      }, {
        height: "52px",
        duration: 0.3,
        ease: "power2.out",
      }
      );
    }
  }, [isChanged]);

  const handleEditData = (value, key) => {
    setDataItem((prev) => ({ ...prev, [key]: value }));

    if (key === "url" && textareasRef.current) {
      textareasRef.current.style.height = "auto";
      textareasRef.current.style.height = `${Math.min(textareasRef.current.scrollHeight, 135)}px`;
    }
  };

  const handleCancel = () => setDataItem(defaultValue);
  const handleSave = () => {
    console.log("dataItem", dataItem)
    dataItem.type = 0
    updateArchive(dataItem, props.item.id).then((res) => {
        if(res?.status === 200){
            props?.updateData();
        }
    })
  };
  const handleDelete = () => {
    deleteArchive(props.item.id).then((res) => {
      if(res?.status === 200){
        props?.updateData();
      }
    })
  };

  return (
    <div className={styles.CardOrganization}>
      <div className={styles.CardOrganizationInner}>
      <div className={styles.CardOrganizationInnerImg}>
        <img className={styles.Img} src={dataItem.img || notPhoto} alt={dataItem.fio} />
        <div className={styles.CardOrganizationInnerImgInput}>
            <img src={deletePhoto2Img} alt="Удалить"/>
            <img src={editPhoto2Img} alt="Редактирование"/>
        </div>
      </div>

        <div className={styles.CardOrganizationInnerInfo}>
          <label>Название альбома</label>
          <input
            value={dataItem.name}
            onChange={(e) => handleEditData(e.target.value, "name")}
          />
        </div>

        <div className={styles.CardOrganizationInnerInfo}>
          <label>Ссылка</label>
          <textarea
            ref={textareasRef}
            value={dataItem.url}
            onChange={(e) => handleEditData(e.target.value, "url")}
          />
        </div>

        {/* Если есть изменения → Отменить и Сохранить, иначе → Удалить */}
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
    </div>
  );
}

export default CardArchive;
