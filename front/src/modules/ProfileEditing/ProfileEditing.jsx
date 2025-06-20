import styles from './ProfileEditing.module.scss';
import profilePhoto from './../../assets/img/noPhotoLk.svg';
import Input from '../../ui/Input/Input';
import InputList from '../../ui/InputList/InputList';
import { useContext, useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import DataContext from '../../context';
import { useDispatch, useSelector } from 'react-redux';
import { apiDeleteMulti, apiUpdateUser, server, uploadPhoto } from '../../apirequests/apirequests';
import { disEditUser, setEditUser } from '../../store/userSlice/user.Slice';
import { getInputsData, useErrorMessages } from './data';
import cameraIcon from '@assets/img/UI/camera.svg';
import { AnimatePresence, motion } from 'framer-motion';
import redxIcon from '@assets/img/UI/redX.svg';
import { formatPhoneNumber, validateLength } from '../../utils/functions/Validations';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import ModalPhoto from '../Profile/components/ModalPhoto/ModalPhoto';
import 'react-image-crop/dist/ReactCrop.css';
import ImageCropper from '../../components/ImageCropper/ImageCropper';
import ErrorModal from '../../components/ErrorModal/ErrorModal';
import { useTranslation } from 'react-i18next';

function ProfileEditing() {
  const isMicrosoft = useSelector(state => state.user.user.data?.isMicrosoft);
  const { t } = useTranslation('profileEditing');

  const [inputsData, setInputsData] = useState([]);

  useEffect(() => {
    if (isMicrosoft !== undefined) {
      const data = getInputsData(t, isMicrosoft);
      setInputsData(data);
    }
  }, [isMicrosoft, t]);

  const errorsNames = useErrorMessages(t);

  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const ref3 = useRef(null);
  const refList = [ref1, ref2, ref3];
  const fileInputRef = useRef(null);
  const [openPhoto, setOpenPhoto] = useState(false);
  const [openList, setOpenList] = useState('');
  const context = useContext(DataContext);
  const formData = useSelector(state => state.user.editUser.data);
  const user = useSelector(state => state.user.user.data);
  const [userPhoto, setUserPhoto] = useState(null);
  const [urlPhoto, setUrlPhoto] = useState(null);
  const [popUpSize, setPopUpSize] = useState(false);
  const [modalSucces, setModalSucces] = useState(null);
  const [deleteIdsPhoto, setDeleteIdsPhoto] = useState([]);
  const [origPhoto, setOrigPhoto] = useState(null);
  const [editPhoto, setEditPhoto] = useState(false);
  const [modalError, setModalError] = useState(null);

  useEffect(() => {
    setUrlPhoto(`${server}/${user?.avatar?.url}`);
  }, [user?.avatar]);

  useEffect(() => {
    dispatch(disEditUser());
  }, [user]);

  const [errors, setErrors] = useState({
    name: '',
    patronymic: '',
    academicTitle: '',
    degree: '',
    position: '',
    organization: '',
    email: '',
    number: '',
  });

  //! загрузка фото
  const funUploadPhoto = () => {
    fileInputRef.current.click();
  };

  const handleFileUpload = file => {
    if (file?.size > 10 * 1024 * 1024) {
      setPopUpSize(true);
    } else {
      if (file) {
        setOrigPhoto(file);
        setUserPhoto(file);
        setEditPhoto(true);
        setUrlPhoto(URL.createObjectURL(file));
      }
    }
  };

  const funDeletePhoto = () => {
    setUrlPhoto(null);
    setUserPhoto(null);
    setEditPhoto(false);
    setOrigPhoto(null);
    fileInputRef.current.value = null;

    dispatch(setEditUser({ key: 'avatar', value: null }));
    setDeleteIdsPhoto([user?.avatar?.id]);
  };

  const funSelectedElement = (key, value) => {
    //! проверка что такой ключь есть в formData
    if (!formData.hasOwnProperty(key)) {
      return;
    }
    setErrors({ ...errors, [key]: '' });
    // setFormData({ ...formData, [key]: value });
    dispatch(setEditUser({ key, value }));
  };

  const validate = () => {
    let isValid = true;
    const newErrors = {};

    // Проверка обязательных полей
    ['name', 'surname', 'academicTitle', 'degree', 'organization', 'email', 'phone'].forEach(
      field => {
        if (!formData[field]) {
          newErrors[field] = t('requiredField');
          isValid = false;
        }
      },
    );

    // Проверка корректности Email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = t('invalidEmail');
      isValid = false;
    }

    // Проверка номера телефона
    if (formData.phone && !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      newErrors.phone = t('invalidPhone');
      isValid = false;
    }

    if (!validateLength(formData.position, 0, 200)) {
      newErrors.position = 'Не более 200 символов!';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleChange = e => {
    const { name, value } = e.target;

    // Если поле "phone", форматируем номер телефона
    const formattedValue = name === 'phone' ? formatPhoneNumber(value) : value;

    // setFormData({ ...formData, [name]: formattedValue });
    dispatch(setEditUser({ key: name, value: formattedValue }));

    // Очистка ошибки при изменении значения
    setErrors({ ...errors, [name]: '' });
  };

  const funOpenList = param => {
    if (param === openList) {
      setOpenList('');
    } else {
      setOpenList(param);
    }
  };

  const handleSubmit = () => {
    if (validate()) {
      apiUpdateUser({ ...formData, phone: `+${formData.phone.replace(/\D/g, '')}` }).then(res => {
        if (res?.status === 200) {
          setModalSucces(true);
          if (userPhoto) {
            const file = new FormData();
            file.append('file', userPhoto);
            uploadPhoto(file, 'AVATAR');
          }
          if (deleteIdsPhoto.length > 0) {
            apiDeleteMulti({ ids: deleteIdsPhoto });
          }
        } else {
          errorsNames.forEach(item => {
            if (res?.response?.data?.message?.includes(item.key)) {
              setModalError(item.error);
            }
          });
        }
      });
    }
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (refList.every(item => item.current && !item.current.contains(event.target))) {
        funOpenList('');
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const funOpenPhoto = () => {
    if (origPhoto) {
      setEditPhoto(!editPhoto);
    } else {
      setOpenPhoto(!openPhoto);
    }
  };

  const funEditPhoto = file => {
    if (file) {
      setUserPhoto(file);
      setUrlPhoto(URL.createObjectURL(file));
      setEditPhoto(false);
    }
  };

  return (
    <div className={styles.ProfileEditing}>
      <ImageCropper
        editPhoto={editPhoto}
        setEditPhoto={setEditPhoto}
        urlPhoto={origPhoto ? URL.createObjectURL(origPhoto) : urlPhoto}
        funEditPhoto={funEditPhoto}
      />
      <SuccessModal open={modalSucces} close={setModalSucces} />
      <ErrorModal open={modalError} close={setModalError} title={modalError} />
      <AnimatePresence>
        {popUpSize && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={styles.bacgraund}
            ></motion.div>
            <motion.div
              className={styles.popUp}
              initial={{
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0)',
              }}
              animate={{
                opacity: 1,
                transform: 'translate(-50%, -50%) scale(1)',
              }}
              exit={{
                opacity: 0,
                transform: 'translate(-50%, -50%) scale(0)',
              }}
            >
              <h2>{t('photoTooLarge')}</h2>
              <img src={redxIcon} alt="x" />
              <button onClick={() => setPopUpSize(false)}>{t('back')}</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ModalPhoto
        funOpenPhotoProfile={funOpenPhoto}
        showProfilePhoto={openPhoto}
        user={user}
        urlPhoto={urlPhoto}
      />

      <div className={styles.head}>
        <div className={styles.profilePhoto}>
          {urlPhoto && origPhoto && (
            <div className={styles.hover_bg} onClick={funOpenPhoto}>
              <img src={cameraIcon} alt="Открыть" />
            </div>
          )}

          <img
            className={styles.photo_heve}
            src={urlPhoto || profilePhoto}
            onClick={funOpenPhoto}
            onError={e => (e.target.src = profilePhoto)}
            alt="img"
          />
        </div>
        <input
          accept="image/*"
          ref={fileInputRef}
          type="file"
          style={{ display: 'none' }}
          onChange={e => handleFileUpload(e.target.files[0])}
        />
        <div className={styles.buttons}>
          <button className={styles.btn1} onClick={funUploadPhoto}>
            {t('uploadPhoto')}
          </button>
          <button className={styles.btn2} onClick={funDeletePhoto}>
            {t('deletePhoto')}
          </button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.boxLeft}>
          {inputsData.map(
            (item, index) =>
              index <= 5 && (
                <div className={styles.item}>
                  <Input
                    name={item.title}
                    onChange={handleChange}
                    value={formData[item.title]}
                    placeholder=""
                    error={errors[item.title]}
                    labelText={item.name}
                    readOnly={item.readOnly}
                    labelLock={item.readOnly}
                  />
                </div>
              ),
          )}
        </div>
        <div className={styles.boxRigth}>
          {inputsData.map(
            (item, index) =>
              index > 5 &&
              (item?.title === 'position' ? (
                <div className={styles.item}>
                  <Input
                    name={item.title}
                    onChange={handleChange}
                    value={formData[item.title]}
                    placeholder=""
                    error={errors[item.title]}
                    labelText={item.name}
                    readOnly={item.readOnly}
                  />
                </div>
              ) : (
                <div className={styles.item}>
                  <InputList
                    name={item.title}
                    onChange={handleChange}
                    value={formData[item.title]}
                    placeholder=""
                    open={openList === item.title}
                    funOpen={funOpenList}
                    divRef={refList[index - 6]}
                    list={item.list}
                    labelText={item.name}
                    funSelectElement={funSelectedElement}
                    error={errors[item.title]}
                  />
                </div>
              )),
          )}
          <button type="button" className={styles.SaveButton} onClick={handleSubmit}>
            {t('saveChanges')}
          </button>
          <button
            className={styles.noSaveButton}
            onClick={() => {
              context.setSelectFrameLks('profile');
              navigate('/account/profile');
            }}
          >
            {t('exitWithoutSaving')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditing;
