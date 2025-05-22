import styles from './Orgwznos.module.scss';
import vitalIcon from '@assets/img/UI/vitalIcon.svg';
import FileComponent from './../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import { useState } from 'react';
import { apiDeleteMulti, server, uploadPhoto } from '../../../../apirequests/apirequests';
import { useDispatch, useSelector } from 'react-redux';
import ReqError from '../../../../components/ReqError/ReqError';
import { fetchUserData } from '../../../../store/userSlice/user.Slice';
import { useTranslation } from 'react-i18next';

function Orgwznos({ user, funNal, funBeznal, funChangeFormPay }) {
  const { t } = useTranslation('profile');
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
        `${t('receipt')} ${user.name} ${user.surname} ${user.patronymic}`,
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
              text: t('errorDownload'),
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
              <h3>{t('orgVznos')}</h3>
            </div>
            <p>
              {t('message')}
              <br />
              {t('message2')}
            </p>
          </div>
        );
      }
      if (fee[0]?.sum === 0) {
        return (
          <div className={styles.orgwznos_summ}>
            <h3>{t('message3')}</h3>
          </div>
        );
      }
      if (fee[0]?.sum && fee[0]?.formPay === 'Не выбран') {
        return (
          <div className={styles.orgwznos_summ}>
            <h3>
              {t('formPay')} <span>{fee[0]?.sum + ' '}₽ </span>
            </h3>
            <h4>Выберите способ оплаты:</h4>
            <div className={styles.buttons}>
              <button onClick={funNal}>{t('nal')}</button>
              <button onClick={funBeznal}>{t('beznal')}</button>
            </div>
          </div>
        );
      }
      if (fee[0]?.sum && fee[0]?.formPay === 'Наличный') {
        return (
          <div className={styles.orgwznos_summ}>
            <h3>
              {t('formPay')} <span>{fee[0]?.sum + ' '}₽ </span>
            </h3>
            <button className={styles.btn_change} onClick={funChangeFormPay}>
              {t('changeFormPay')}
            </button>
          </div>
        );
      }
      if (fee[0]?.sum && fee[0]?.formPay === 'Безналичный') {
        return (
          <div className={styles.orgwznos_files}>
            <ReqError errors={errors} setErrors={setErrors} />
            <h3>{t('orgVznos')}</h3>
            <span>{t('message4')}</span>
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
                    fileName={`${t('agreement')} ${user.surname} ${user.name} ${user.patronymic}`}
                    icon={'pdf'}
                    text={t('uploadAgreement')}
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
                    fileName={`${t('receipt')} ${user.surname} ${user.name} ${user.patronymic}`}
                    name={'fileReceipt'}
                    icon={'pdf'}
                    text={t('uploadReceipt')}
                    idFile={user?.fee[0].receipt?.id}
                    funDeleteFile={funDeleteFile}
                  />
                </div>
              </div>
            </div>
            <button className={styles.btn_change} onClick={funChangeFormPay}>
              {t('changeFormPay')}
            </button>
          </div>
        );
      }
    }
  };

  return <div className={styles.Orgwznos}>{funGetOrgwznos()}</div>;
}

export default Orgwznos;
