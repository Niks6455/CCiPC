import styles from './Orgwznos.module.scss';
import vitalIcon from '@assets/img/UI/vitalIcon.svg';
import FileComponent from './../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import { useState } from 'react';
import { server } from '../../../../apirequests/apirequests';
import loadIcon from '@assets/img/AdminPanel/load.svg';

function Orgwznos({ user, funNal, funBeznal, funChangeFormPay }) {
  const [fileAccord, setFileAccord] = useState(null);
  const [fileReceipt, setFileReceipt] = useState(null);

  const funChangeAccord = value => {
    setFileAccord(value);
  };

  const funChangeReceipt = value => {
    setFileReceipt(value);
  };

  const funGetOrgwznos = () => {
    const fee = user?.fee;
    console.log('fee', fee);
    if (fee?.length > 0) {
      if (!fee[0]?.sum && fee[0]?.formPay === 'Не выбран') {
        return (
          <div className={styles.orgwznos}>
            <div className={styles.title}>
              <img src={vitalIcon} alt="❗" />
              <h3>Оргвзнос:</h3>
            </div>
            <p>
              После отправки доклада, ожидайте сообщение
              <br />
              от администатора на вашей почте, с информацией о дальнейших действиях
            </p>
          </div>
        );
      }

      if (fee[0]?.sum && fee[0]?.formPay === 'Не выбран') {
        return (
          <div className={styles.orgwznos_summ}>
            <h3>
              Счет для оплаты оргвзноса: <span>{fee[0]?.sum + ' '}₽ </span>
            </h3>
            <div className={styles.buttons}>
              <button onClick={funNal}>Наличный расчёт</button>
              <button onClick={funBeznal}>Безналичный расчёт</button>
            </div>
          </div>
        );
      }
      if (fee[0]?.sum && fee[0]?.formPay === 'Наличный') {
        return (
          <div className={styles.orgwznos_summ}>
            <h3>
              Счет для оплаты оргвзноса: <span>{fee[0]?.sum + ' '}₽ </span>
            </h3>
            <button className={styles.btn_change}>Сменить способ оплаты</button>
          </div>
        );
      }
      if (fee[0]?.sum && fee[0]?.formPay === 'Безналичный') {
        return (
          <div className={styles.orgwznos_files}>
            <h3>Оргвзнос:</h3>
            <span>Прикрепите подписанный скан договора и скан квитанции</span>
            <div className={styles.files}>
              <div className={styles.file_container}>
                <div className={styles.file_box}>
                  <FileComponent
                    logoHeader={
                      typeof user?.fee[0]?.accord === 'string' && `${server}/${user?.fee[0].accord}`
                    }
                    fileSize={50}
                    data={fileAccord}
                    setData={funChangeAccord}
                    typeFile={['application/pdf']}
                    accept={'.pdf'}
                    name={'fileAccord'}
                    icon={'pdf'}
                    text={'Загрузите скан договора<br/>в формате PDF'}
                  />
                </div>
                <div className={styles.shablon}>
                  <button>
                    <span>Шаблон</span>
                    <img src={loadIcon} alt="Скачать" />
                  </button>
                </div>
              </div>
              <div className={styles.file_container}>
                <div className={styles.file_box}>
                  <FileComponent
                    logoHeader={
                      typeof user?.fee[0]?.receipt === 'string' &&
                      `${server}/${user?.fee[0].receipt}`
                    }
                    fileSize={50}
                    data={fileReceipt}
                    setData={funChangeReceipt}
                    typeFile={['application/pdf']}
                    accept={'.pdf'}
                    name={'fileReceipt'}
                    icon={'pdf'}
                    text={'Загрузите скан квитанции<br/>в формате PDF'}
                  />
                </div>
                <div className={styles.shablon}>
                  <button>
                    <span>Шаблон</span>
                    <img src={loadIcon} alt="Скачать" />
                  </button>
                </div>
              </div>
            </div>
            <button className={styles.btn_change} onClick={funChangeFormPay}>
              Сменить способ оплаты
            </button>
          </div>
        );
      }
    }
  };
  return <div className={styles.Orgwznos}>{funGetOrgwznos()}</div>;
}

export default Orgwznos;
