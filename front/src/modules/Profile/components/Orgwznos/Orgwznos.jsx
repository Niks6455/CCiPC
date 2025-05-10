import styles from './Orgwznos.module.scss';
import vitalIcon from '@assets/img/UI/vitalIcon.svg';
import FileComponent from './../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import { useState } from 'react';
import { apiDeleteMulti, server, uploadPhoto } from '../../../../apirequests/apirequests';
import { useDispatch, useSelector } from 'react-redux';
import ReqError from '../../../../components/ReqError/ReqError';
import { fetchUserData } from '../../../../store/userSlice/user.Slice';

function Orgwznos({ user, funNal, funBeznal, funChangeFormPay }) {
  const dispach = useDispatch();
  const [fileAccord, setFileAccord] = useState(null);
  const [fileReceipt, setFileReceipt] = useState(null);
  const conferenseId = useSelector(state => state.conferences?.data[0]?.id);
  const [errors, setErrors] = useState([]);

  const funDeleteFile = id => {
    apiDeleteMulti({ ids: [id] }).then(res => {
      if (res?.status === 200) {
        dispach(fetchUserData());
      }
    });
  };

  const funChangeAccord = (value, name) => {
    setErrors(prev => prev.filter(item => item.key !== name));
    if (value) {
      const renamedFile = new File(
        [value],
        `Скан квитанции ${user.name} ${user.surname} ${user.patronymic}`,
        { type: value.type },
      );
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
        if (res?.status === 200) {
          dispach(fetchUserData());
        }
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
    if (fee?.length > 0) {
      if (fee[0]?.sum === null) {
        return (
          <div className={styles.orgwznos}>
            <div className={styles.title}>
              <img src={vitalIcon} alt="❗" />
              <h3>Оргвзнос:</h3>
            </div>
            <p>
              После отправки доклада ожидайте сообщение
              <br />
              от администратора на вашу почту с информацией о дальнейших действиях.
            </p>
          </div>
        );
      }
      if (fee[0]?.sum === 0) {
        return (
          <div className={styles.orgwznos_summ}>
            <h3>Ваше участие в конференции не требует оплаты</h3>
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
                      typeof user?.fee[0]?.accord?.url === 'string' &&
                      `${server}/${user?.fee[0].accord?.url}`
                    }
                    fileSize={50}
                    data={fileAccord?.url}
                    setData={funChangeAccord}
                    typeFile={['application/pdf']}
                    itemKey={'AGREEMENT'}
                    accept={'.pdf'}
                    name={'fileAccord'}
                    fileName={`Скан договора ${user.surname} ${user.name} ${user.patronymic}`}
                    icon={'pdf'}
                    text={'Загрузите скан договора<br/>в формате PDF'}
                    idFile={user?.fee[0].accord?.id}
                    funDeleteFile={funDeleteFile}
                  />
                </div>
              </div>
              <div className={styles.file_container}>
                <div className={styles.file_box}>
                  <FileComponent
                    logoHeader={
                      typeof user?.fee[0]?.receipt?.url === 'string' &&
                      `${server}/${user?.fee[0].receipt?.url}`
                    }
                    fileSize={50}
                    data={fileReceipt?.url}
                    setData={funChangeAccord}
                    typeFile={['application/pdf']}
                    accept={'.pdf'}
                    itemKey={'RECEIPT'}
                    fileName={`Скан квитанции ${user.surname} ${user.name} ${user.patronymic}`}
                    name={'fileReceipt'}
                    icon={'pdf'}
                    text={'Загрузите скан квитанции<br/>в формате PDF'}
                    idFile={user?.fee[0].receipt?.id}
                    funDeleteFile={funDeleteFile}
                  />
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
