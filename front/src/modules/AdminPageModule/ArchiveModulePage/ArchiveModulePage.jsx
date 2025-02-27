import React, { useState } from 'react';
import styles from "./ArchiveModulePage.module.scss";
import plusLigthImg from "@assets/img/UI/plusLigth.svg";
import AddArchive from '../../../components/AdminModuleComponents/AddArchive/AddArchive';

function ArchiveModulePage() {
    const [addAlbom, setAddAlbom] = useState(false);
    return ( 
        <section className={styles.ArchiveModulePage}>
            <p className={styles.title}>Архив фото</p>
           <div className={styles.ArchiveModuleTitle}>
                <div>
                    <p className={styles.subtitle}>Фотоальбомы конференций</p>
                </div>
                <div>
                    <button onClick={() => setAddAlbom(true)} className={styles.ButtonAdd}><img src={plusLigthImg} />Добавить Альбом</button>
                </div>
           </div>
           <div>
           {addAlbom && <AddArchive close={()=> setAddAlbom(false)}/>}

           </div>
        </section>
     );
}

export default ArchiveModulePage;