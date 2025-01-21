import { dataDicument } from "./testData";
import React from "react";
import styles from "./DocumentsLk.module.scss";
import union from "./../../assets/img//Union.svg";
import edit from "./../../assets/img//edit.svg";
import trash from "./../../assets/img//trash.svg";
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
                                        <img src={union}/>
                                    </div>
                                    <div className={styles.DocumentLkContText}>
                                        <p>{item.title}</p>
                                    </div>
                                </div>
                                <div className={styles.DocumentLkContEdit}>
                                    <img src={edit}/>
                                    <img src={trash}/>
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