import styles from "./Profile.module.scss";
import ProfilePictureBackground from "./../../assets/img/ProfilePictureBackground.svg";
import noPhotoLk from "./../../assets/img/noPhotoLk.svg";
import editPhotoLk from "./../../assets/img/EditPhotoLk.png";
import { ReactComponent as Close } from "./../../assets/img/UI/bigX.svg";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fioToString } from "../../utils/functions/funcions";
import { fetchUserData } from "../../store/userSlice/user.Slice";
import { server } from "../../apirequests/apirequests";
import { useNavigate } from "react-router-dom";
function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state) => state.user.user.data);
  const [showProfilePhoto, setShowProfilePhoto] = useState(false);
  //! функция открытия фото профиля
  const funOpenPhotoProfile = () => {
    setShowProfilePhoto(!showProfilePhoto);
  };

  useEffect(() => {
    dispatch(fetchUserData());
  }, []);

  return (
    <section className={styles.Profile}>
      {showProfilePhoto && (
        <>
          <div className={styles.bacgraund}></div>
          <div className={styles.ProfilePhotoShow}>
            <img
              className={styles.ProfileImg}
              src={`${server}/${user?.avatar}`}
              alt="img"
              onError={(e) => (e.target.src = noPhotoLk)}
            />
            {/* <img
              onClick={funOpenPhotoProfile}
              className={styles.close}
              src={close}
              alt="img"
            /> */}
            <Close onClick={funOpenPhotoProfile} className={styles.close} />
          </div>
        </>
      )}
      <div className={styles.profile_img_container}>
        <img src={ProfilePictureBackground} className={styles.ProfileImg} />
        <div className={styles.photo_lk}>
          <img
            src={`${server}/${user?.avatar}`}
            className={styles.noPhotoLk}
            onClick={funOpenPhotoProfile}
            alt="img"
            onError={(e) => (e.target.src = noPhotoLk)}
          />
        </div>

        <img
          src={editPhotoLk}
          onClick={() => navigate("/account/settings/profile")}
          className={styles.editPhotoLk}
        />
      </div>
      <div className={styles.mainSection}>
        <div className={styles.mainSectionInfoPeople}>
          <p>{fioToString(user?.name, user?.surname, user?.patronymic)}</p>
          <p>
            <span>Ученое звание:</span> {user?.academicTitle || "Отсутствует"}
          </p>
          <p>
            <span>Степень:</span> {user?.degree || "Отсутствует"}
          </p>
        </div>
      </div>
      <div className={styles.containerMoreInfo}>
        <div className={styles.containerMoreInfoOne}>
          <p>
            <span>Организация:</span> {user?.organization || "Отсутствует"}
          </p>
          <p>
            <span>Должность:</span> {user?.position || "Отсутствует"}
          </p>
          <p>
            <span>Email:</span> {user?.email || "Отсутствует"}
          </p>
          <p>
            <span>Телефон:</span> {user?.phone || "Отсутствует"}
          </p>
          {/* <p>
            <span>Направление конференции:</span> Отсутствует
          </p> */}
        </div>
        <div className={styles.containerMoreInfoSecond}>
          {user?.reports?.length > 0 ? (
            user?.reports?.map((el, index) => (
              <div key={index} className={styles.containerMoreInfoSecondText}>
                <p>Название доклада №{index + 1}:</p>
                <p>{el.name || "Отсутствует"}</p>
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
