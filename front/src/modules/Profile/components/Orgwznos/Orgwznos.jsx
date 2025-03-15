import styles from './Orgwznos.module.scss';
import vitalIcon from '@assets/img/UI/vitalIcon.svg';
import FileComponent from './../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import { useState } from 'react';
import { server, uploadPhoto } from '../../../../apirequests/apirequests';
import loadIcon from '@assets/img/AdminPanel/greenLoad.svg';
import { useSelector } from 'react-redux';
import ReqError from '../../../../components/ReqError/ReqError';

function Orgwznos({ user, funNal, funBeznal, funChangeFormPay }) {
  const [fileAccord, setFileAccord] = useState(null);
  const [fileReceipt, setFileReceipt] = useState(null);
  const conferenseId = useSelector(state => state.conferences?.data[0]?.id);
  const [errors, setErrors] = useState([]);

  const funChangeAccord = (value, name) => {
    setErrors(prev => prev.filter(item => item.key !== name));
    if (value) {
      const renamedFile = new File(
        [value],
        `Скан квитанции ${user.name} ${user.surname} ${user.patronymic}`,
        { type: value.type },
      );
      console.log('renamedFile', renamedFile);
      if (name === 'AGREEMENT') {
        setFileAccord(renamedFile);
      }
      if (name === 'RECEIPT') {
        setFileReceipt(renamedFile);
      }
      const file = new FormData();
      file.append('file', value);
      file.append('conferenceId', conferenseId);
      uploadPhoto(file, name).then(res => {
        if (res?.status !== 200)
          setErrors(prev => [
            ...prev,
            {
              key: name,
              succes: false,
              text: 'Ошибка при загрузке договора',
            },
          ]);
      });
    }
  };

  const funGetOrgwznos = () => {
    const fee = user?.fee;
    console.log('fee', fee);
    if (fee?.length > 0) {
      if (!fee[0]?.sum || fee[0]?.sum === 0) {
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
            <button className={styles.btn_change} onClick={funChangeFormPay}>
              Сменить способ оплаты
            </button>
          </div>
        );
      }
      if (fee[0]?.sum && fee[0]?.formPay === 'Безналичный') {
        return (
          <div className={styles.orgwznos_files}>
            <ReqError errors={errors} setErrors={setErrors} />
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
                    itemKey={'AGREEMENT'}
                    accept={'.pdf'}
                    name={'fileAccord'}
                    fileName={`Скан договора ${user.surname} ${user.name} ${user.patronymic}`}
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
                    setData={funChangeAccord}
                    typeFile={['application/pdf']}
                    accept={'.pdf'}
                    itemKey={'RECEIPT'}
                    fileName={`Скан квитанции ${user.surname} ${user.name} ${user.patronymic}`}
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
