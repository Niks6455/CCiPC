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
import { inputsData } from './data';
import cameraIcon from '@assets/img/UI/camera.svg';
import { AnimatePresence, motion } from 'framer-motion';
import redxIcon from '@assets/img/UI/redX.svg';
import { formatPhoneNumber } from '../../utils/functions/Validations';
import SuccessModal from '../../components/SuccessModal/SuccessModal';
import ModalPhoto from '../Profile/components/ModalPhoto/ModalPhoto';

function ProfileEditing() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const ref1 = useRef(null);
  const ref2 = useRef(null);
  const refList = [ref1, ref2];
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
    if (file.size > 10 * 1024 * 1024) {
      setPopUpSize(true);
    } else {
      setUserPhoto(file);
      if (file) {
        setUrlPhoto(URL.createObjectURL(file));
      }
    }
  };

  const funDeletePhoto = () => {
    setUrlPhoto(null);
    setUserPhoto(null);
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
    [
      'name',
      'surname',
      'academicTitle',
      'degree',
      'position',
      'organization',
      'email',
      'phone',
    ].forEach(field => {
      if (!formData[field]) {
        newErrors[field] = 'Поле обязательно для заполнения';
        isValid = false;
      }
    });

    // Проверка корректности Email
    if (formData.email && !/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Некорректный Email';
      isValid = false;
    }

    // Проверка номера телефона
    if (formData.phone && !/^\+7 \(\d{3}\) \d{3}-\d{2}-\d{2}$/.test(formData.phone)) {
      newErrors.phone = 'Номер должен быть в формате +7 (XXX) XXX-XX-XX';
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
        }
        if (userPhoto) {
          const file = new FormData();
          file.append('file', userPhoto);
          uploadPhoto(file, 'AVATAR');
        }
        if (deleteIdsPhoto.length > 0) {
          apiDeleteMulti({ ids: deleteIdsPhoto });
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
    setOpenPhoto(!openPhoto);
  };

  return (
    <div className={styles.ProfileEditing}>
      <SuccessModal open={modalSucces} close={setModalSucces} />
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
              <h2>Размер фотографии превышает допустимый предел в 10 Мб</h2>
              <img src={redxIcon} alt="x" />
              <button onClick={() => setPopUpSize(false)}>Назад</button>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <ModalPhoto funOpenPhotoProfile={funOpenPhoto} showProfilePhoto={openPhoto} user={user} />

      <div className={styles.head}>
        <div className={styles.profilePhoto}>
          <div className={styles.hover_bg} onClick={funOpenPhoto}>
            <img src={cameraIcon} alt="Открыть" />
          </div>
          <img
            className={styles.photo_heve}
            src={urlPhoto || profilePhoto}
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
            Загрузить новое фото
          </button>
          <button className={styles.btn2} onClick={funDeletePhoto}>
            Удалить фото
          </button>
        </div>
      </div>
      <div className={styles.container}>
        <div className={styles.boxLeft}>
          {inputsData.map(
            (item, index) =>
              index <= 5 && (
                <div className={styles.item}>
                  {item.list ? (
                    <InputList
                      name={item.title}
                      onChange={handleChange}
                      value={formData[item.title]}
                      placeholder=""
                      open={openList === item.title}
                      funOpen={funOpenList}
                      divRef={refList[index - 3]}
                      list={item.list}
                      labelText={item.name}
                      styleArrow={{ height: '54px', bottom: '25px' }}
                      listStyle={{ transform: 'translateY(calc(100% - 26px))' }}
                      inputerrorStyle={{ top: '25px' }}
                      funSelectElement={funSelectedElement}
                      error={errors[item.title]}
                    />
                  ) : (
                    <Input
                      name={item.title}
                      onChange={handleChange}
                      value={formData[item.title]}
                      placeholder=""
                      error={errors[item.title]}
                      labelText={item.name}
                      inputerrorStyle={{ top: '25px' }}
                    />
                  )}
                </div>
              ),
          )}
        </div>
        <div className={styles.boxRigth}>
          {inputsData.map(
            (item, index) =>
              index > 5 && (
                <div className={styles.item}>
                  <Input
                    disabled={item.disabled}
                    name={item.title}
                    onChange={handleChange}
                    value={formData[item.title]}
                    placeholder={''}
                    labelText={item.name}
                    error={errors[item.title]}
                    inputerrorStyle={{ top: '25px' }}
                  />
                </div>
              ),
          )}
          <button type="button" className={styles.SaveButton} onClick={handleSubmit}>
            Сохранить изменения
          </button>
          <button
            className={styles.noSaveButton}
            onClick={() => {
              context.setSelectFrameLks('profile');
              navigate('/account/profile');
            }}
          >
            Выйти без сохранения
          </button>
        </div>
      </div>
    </div>
  );
}

export default ProfileEditing;
