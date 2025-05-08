import React from 'react';
import FileComponent from '../../../../components/AdminModuleComponents/FileComponent/FileComponent';
import styles from './Organizers.module.scss';
import plusIcon from '@assets/img/UI/plus.svg';
import trashIcon from '@assets/img/UI/trashBeliy.svg';
import borderFile from '@assets/img/AdminPanel/borderFile.svg';
import { server } from '../../../../apirequests/apirequests';

function Organizers({ data, setData, itemKey, name, buttonName, deleteMass, setDeleteMass }) {
  //! Add a new file
  const funChangeDataAdd = () => {
    setData({
      ...data,
      [itemKey]: [
        ...data[itemKey],
        { id: Date.now(), value: '' }, // Add a unique ID for each organizer
      ],
    });
  };

  //! Update or delete a file
  const funChangeData = (value, id) => {
    if (value === null) {
      const dat = data[itemKey].filter(organizer => organizer.id !== id);

      setDeleteMass([...deleteMass, id]);
      if (Number(id)) {
        setData({
          ...data,
          [itemKey]: dat,
        });
      } else {
        setData({
          ...data,
          [itemKey]: dat,
          deleteIds: [...data.deleteIds, id],
        });
      }
    } else {
      setData({
        ...data,
        [itemKey]: data[itemKey].map(organizer =>
          organizer.id === id ? { ...organizer, value } : organizer,
        ),
      });
    }
  };

  return (
    <div className={styles.Organizers}>
      <h3>{name}</h3>
      <div className={styles.container}>
        {data[itemKey]?.length > 0 &&
          data[itemKey].map((item, index) => (
            <div className={styles.org_container} key={item?.id}>
              <img src={borderFile} className={styles.border} />
              <div className={styles.border_inner}>
                {!item?.value && !item?.url && (
                  <button className={styles.delete} onClick={() => funChangeData(null, item?.id)}>
                    <img src={trashIcon} alt="Удалить файл" />
                  </button>
                )}

                <FileComponent
                  logoHeader={typeof item?.url === 'string' && `${server}/${item?.url}`}
                  fileSize={50}
                  data={item?.url}
                  setData={value => funChangeData(value, item?.id)}
                  typeFile={['image/png']}
                  accept={'.png'}
                  name={`${itemKey}-${item?.id}`}
                  icon={'png'}
                  itemKey={item?.url}
                  text={'Загрузите или перетащите<br/>фотографию в формате PNG'}
                  idFile={item?.id}
                  // funDeleteFile={funDeleteFile}
                />
              </div>
            </div>
          ))}
        <div className={styles.org_container}>
          <button className={styles.add_file} onClick={funChangeDataAdd}>
            <img src={plusIcon} alt="+" />
            <span>{buttonName}</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Organizers;
