import { dataDicument } from "./testData";
import React from "react";
import styles from "./DocumentsLk.module.scss";
function DocumentsLk() {
    return ( 
        <section className={styles.DocumentsLk}>
            {dataDicument.length > 0 ? (
                <>
                <p className={styles.Title}>Зарегистрированные доклады:</p>
                    {
                        dataDicument.map((item) => (
                            <div key={item.id}  className={styles.DocumentLkCont}>
                                <div className={styles.DocumentLkContOne}>
                                    <div>
                                        <img src="/img/Union.svg"/>
                                    </div>
                                    <div className={styles.DocumentLkContText}>
                                        <p>{item.title}</p>
                                    </div>
                                </div>
                                <div className={styles.DocumentLkContEdit}>
                                    <img src="/img/edit.svg"/>
                                    <img src="/img/trash.svg"/>
                                </div>
                               
                            </div>
                        ))
                    }
                <div className={styles.addDocument}>
                    <button>Добавить доклад + </button>
                </div>
                </>
            ):(
                <div className={styles.notDocument}>
                    <div className={styles.notDocumentInner}>
                        <div className={styles.notDocumentInnerImg}>
                            <img src="/img/ui/document.svg"/>
                        </div>
                        <div className={styles.notDocumentTitle}>
                            <p>Создайте доклад</p>
                        </div>
                        <div className={styles.notDocumentSubTitle}>
                            <p>У Вас пока нет зарегистрированных докладов</p>
                        </div>
                        <div className={styles.notDocumentButton}>
                            <button>+ Создать</button>
                        </div>
                    </div>

                </div>
            )
            
            }
        </section>
     );
}

export default DocumentsLk;