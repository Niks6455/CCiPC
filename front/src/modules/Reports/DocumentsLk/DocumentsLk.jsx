import React from "react";
import styles from "./DocumentsLk.module.scss";
import { useNavigate } from "react-router-dom";
function DocumentsLk() {
  const navigate = useNavigate();
  return (
    <section className={styles.DocumentsLk}>
      <div className={styles.notDocument}>
        <div className={styles.notDocumentInner}>
          <div className={styles.notDocumentInnerImg}>
            <img src="/img/ui/document.svg" />
          </div>
          <div className={styles.notDocumentTitle}>
            <p>Создайте доклад</p>
          </div>
          <div className={styles.notDocumentSubTitle}>
            <p>У Вас пока нет зарегистрированных докладов</p>
          </div>
          <div className={styles.notDocumentButton}>
            <button onClick={() => navigate("/Lks/createreport")}>
              + Создать
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default DocumentsLk;
