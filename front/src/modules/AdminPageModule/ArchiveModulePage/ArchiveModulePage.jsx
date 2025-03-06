import React, { useEffect, useState } from 'react';
import styles from './ArchiveModulePage.module.scss';
import plusLigthImg from '@assets/img/UI/plusLigth.svg';
import AddArchive from '../../../components/AdminModuleComponents/AddArchive/AddArchive';
import { getAllArchivePhoto } from '../../../apirequests/apirequests';
import CardArchive from './CardArchive/CardArchive';

function ArchiveModulePage() {
  const [addAlbom, setAddAlbom] = useState(false);
  const [dataAlbom, setDataAlbom] = useState([]);

  useEffect(() => {
    updateData();
  }, []);

  const updateData = () => {
    getAllArchivePhoto().then(resp => {
      setDataAlbom(resp?.data?.archives || []);
    });
  };

  return (
    <section className={styles.ArchiveModulePage}>
      <p className={styles.title}>Архив фото</p>
      <div className={styles.ArchiveModuleTitle}>
        <div>
          <p className={styles.subtitle}>Фотоальбомы конференций</p>
        </div>
        <div>
          <button onClick={() => setAddAlbom(true)} className={styles.ButtonAdd}>
            <img src={plusLigthImg} alt="Добавить" />
            Добавить Альбом
          </button>
        </div>
      </div>
      <div className={styles.orgCargCont}>
        <div className={styles.orgCargContCards}>
          {addAlbom && <AddArchive updateData={updateData} close={() => setAddAlbom(false)} />}
          {dataAlbom?.map(item => (
            <CardArchive key={item.id} item={item} updateData={updateData} />
          ))}
        </div>
      </div>
    </section>
  );
}

export default ArchiveModulePage;
