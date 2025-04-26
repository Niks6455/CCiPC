import { useEffect, useState } from 'react';
import styles from './Сollections.module.scss';
import { getAllArchiveReport } from '../../../apirequests/apirequests';
import CardCollections from './CardCollections/CardCollections';
import plusLigthImg from '@assets/img/UI/plusLigth.svg';
import AddCollectioonsCard from './AddCollectioonsCard/AddCollectioonsCard';
import CircleLoader from '../../../components/CircleLoader/CircleLoader';

function Сollections() {
  const [dataReports, setDataReports] = useState([]);
  const [addnewReport, setAddnewReport] = useState(false);
  const [loader, setLoader] = useState(false);
  useEffect(() => {
    updateData();
  }, []);

  const updateData = async () => {
    setLoader(true);
    getAllArchiveReport().then(resp => {
      if(resp?.status === 200){
        setDataReports(resp?.data?.archives || []);
        setLoader(false);
      }
    })
  };


  return (
    <div className={styles.Сollections}>
      <p className={styles.title}>Архив сборников</p>
      {
        !loader ? (
          <div className={styles.СollectionsInner}>
          <div>
            <div className={styles.ButtonAddContainer}>
              <button onClick={() => setAddnewReport(true)} className={styles.ButtonAdd}>
                <img src={plusLigthImg} alt="Добавить" />
                Добавить сборник
              </button>
            </div>
          </div>
          <div className={styles.orgCargCont}>
            <div className={styles.orgCargContCards}>
              {addnewReport && (
                <AddCollectioonsCard updateData={updateData} close={() => setAddnewReport(false)} />
              )}
              {dataReports?.map(item => (
                <CardCollections item={item} updateData={updateData} />
              ))}
            </div>
          </div>
        </div>
        ) : (
          <div>
            <CircleLoader/>
          </div>
        )
      }
    </div>
  );
}

export default Сollections;
