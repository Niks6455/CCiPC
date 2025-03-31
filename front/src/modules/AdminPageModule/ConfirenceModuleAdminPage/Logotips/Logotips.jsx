import styles from './Logotips.module.scss';
import FileComponent from '../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import borderIcon from '@assets/img/AdminPanel/border2.svg';
import { server } from '../../../../apirequests/apirequests';

function Logotips({ data, setData }) {
  //! функция изменения данных по файлу header
  const funChangeDataHeader = value => {
    setData({ ...data, logoHeader: value });
  };

  //! функция изменения данных по файлу footer
  const funChangeDataFooter = value => {
    setData({ ...data, logoFooter: value });
  };

  const funDeleteFile = id => {
    setData({ ...data, deleteIds: [...data.deleteIds, id] });
  };

  return (
    <div className={styles.Logotips}>
      {/* Логотип хедера */}
      <div className={styles.left_block}>
        <h3>Логотип (хедер)</h3>
        <div className={styles.file_cont}>
          <img src={borderIcon} alt="img" className={styles.border} />
          <div className={styles.border_inner}>
            <FileComponent
              logoHeader={
                typeof data.logoHeader?.url === 'string' && `${server}/${data.logoHeader?.url}`
              }
              fileSize={50}
              data={data.logoHeader?.url}
              setData={funChangeDataHeader}
              typeFile={['image/png']}
              accept={'.png'}
              name={'logoHeader'}
              icon={'png'}
              text={'Загрузите или перетащите<br/>фотографию в формате PNG'}
              idFile={data.logoHeader?.id}
              funDeleteFile={funDeleteFile}
            />
          </div>
        </div>
      </div>

      {/* Логотип футера */}
      <div className={styles.rigth_block}>
        <h3>Логотип (футер)</h3>
        <div className={styles.file_cont}>
          <img src={borderIcon} alt="img" className={styles.border} />
          <div className={styles.border_inner}>
            <FileComponent
              logoHeader={
                typeof data.logoFooter?.url === 'string' && `${server}/${data.logoFooter?.url}`
              }
              fileSize={50}
              data={data.logoFooter?.url}
              setData={funChangeDataFooter}
              typeFile={['image/png']}
              accept={'.png'}
              name={'logoFooter'}
              icon={'png'}
              text={'Загрузите или перетащите<br/>фотографию в формате PNG'}
              idFile={data.logoFooter?.id}
              funDeleteFile={funDeleteFile}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Logotips;
