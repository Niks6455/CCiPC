import styles from './Profile.module.scss';
import ProfilePictureBackground from './../../assets/img/ProfilePictureBackground.svg';
import noPhotoLk from './../../assets/img/noPhotoLk.svg';
import editPhotoLk from './../../assets/img/EditPhotoLk.png';
import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fioToString } from '../../utils/functions/funcions';
import { fetchUserData } from '../../store/userSlice/user.Slice';
import { apiUpdateUser, server } from '../../apirequests/apirequests';
import { useNavigate } from 'react-router-dom';
import ModalNal from './components/ModalNal/ModalNal';
import ModalPhoto from './components/ModalPhoto/ModalPhoto';
import Orgwznos from './components/Orgwznos/Orgwznos';
import ModalBeznal from './components/ModalBeznal/ModalBeznal';

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector(state => state.user.user.data);

  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  const [openModal, setOpenModal] = useState(false);
  const [openModalBeznal, setOpenModalBeznal] = useState(false);
  //! функция открытия фото профиля
  const funOpenPhotoProfile = () => {
    setShowProfilePhoto(!showProfilePhoto);
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  const funNal = () => {
    apiUpdateUser({ formPay: 'Наличный' }).then(res => {
      if (res?.status === 200) {
        dispatch(fetchUserData());
        setOpenModal(true);
      }
    });
  };
  const funBeznal = () => {
    setOpenModalBeznal(true);
  };

  const funChangeFormPay = () => {
    apiUpdateUser({ formPay: 'Не выбран' }).then(res => {
      if (res?.status === 200) {
        dispatch(fetchUserData());
      }
    });
  };

  return (
    <section className={styles.Profile}>
      <ModalNal openModal={openModal} setOpenModal={setOpenModal} />
      <ModalBeznal openModalBeznal={openModalBeznal} setOpenModalBeznal={setOpenModalBeznal} />
      <ModalPhoto
        funOpenPhotoProfile={funOpenPhotoProfile}
        showProfilePhoto={showProfilePhoto}
        user={user}
      />
      <div className={styles.container_head}>
        <div className={styles.profile_img_container}>
          <img src={ProfilePictureBackground} className={styles.ProfileImg} />
          <div className={styles.photo_lk}>
            <img
              src={`${server}/${user?.avatar?.url}`}
              className={styles.noPhotoLk}
              onClick={funOpenPhotoProfile}
              alt="img"
              onError={e => (e.target.src = noPhotoLk)}
            />
          </div>

          <img
            src={editPhotoLk}
            onClick={() => navigate('/account/settings/profile')}
            className={styles.editPhotoLk}
          />
        </div>
        <div className={styles.mainSection}>
          <div className={styles.mainSectionInfoPeople}>
            <p>{fioToString(user?.name, user?.surname, user?.patronymic)}</p>
            <p>
              <span>Ученое звание:</span> {user?.academicTitle || 'Отсутствует'}
            </p>
            <p>
              <span>Степень:</span> {user?.degree || 'Отсутствует'}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.containerMoreInfo}>
        <div className={styles.containerMoreInfoOne}>
          <div className={styles.info_block}>
            <p>
              <span>Организация:</span> {user?.organization || 'Отсутствует'}
            </p>
            <p>
              <span>Должность:</span> {user?.position || 'Отсутствует'}
            </p>
            <p>
              <span>Email:</span> {user?.email || 'Отсутствует'}
            </p>
            <p>
              <span>Телефон:</span> {user?.phone || 'Отсутствует'}
            </p>
          </div>
          <Orgwznos
            user={user}
            funNal={funNal}
            funBeznal={funBeznal}
            funChangeFormPay={funChangeFormPay}
          />
        </div>
        <div className={styles.containerMoreInfoSecond}>
          {user?.reports?.length > 0 ? (
            user?.reports?.map((el, index) => (
              <div key={index} className={styles.containerMoreInfoSecondText}>
                <p>Название доклада №{index + 1}:</p>
                <p>{el.name || 'Отсутствует'}</p>
              </div>
            ))
          ) : (
            <div className={styles.containerMoreInfoSecondText}>
              <p>
                Доклад №1: <span> отсутствует</span>
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default Profile;
