import React, { useEffect, useState } from "react";
import styles from "./DocumentsLk.module.scss";
import { useNavigate } from "react-router-dom";
import document from "./../../../assets/img/document.svg";
import plus from "./../../../assets/img/UI/plusLigth.svg";
import { useSelector } from "react-redux";

function DocumentsLk() {
  const navigate = useNavigate();
  const reports = useSelector((state) => state.reportsSlice.data);
  const [length, setLength] = useState(reports.length);
  useEffect(() => {
    setLength(reports.length);
  }, [reports]);

  return (
    <section className={styles.DocumentsLk}>
      <div className={styles.notDocument}>
        <div className={styles.notDocumentInner}>
          <div className={styles.notDocumentInnerImg}>
            <img src={document} alt="Документ" />
          </div>
          <div className={styles.notDocumentTitle}>
            <p>{length > 0 ? "Добавить доклад" : "Создайте доклад"}</p>
          </div>
          <div className={styles.notDocumentSubTitle}>
            {length === 0 && <p>У Вас пока нет зарегистрированных докладов</p>}
          </div>

          <div className={styles.notDocumentButton}>
            <button onClick={() => navigate("/account/createreport")}>
              <img src={plus} alt="+" /> <span>Создать</span>
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DocumentsLk;
