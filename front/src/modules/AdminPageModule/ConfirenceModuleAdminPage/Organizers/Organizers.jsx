import React, { useEffect } from 'react';
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
      // Remove the organizer with the matching ID
      setDeleteMass([...deleteMass, id]);
      setData({
        ...data,
        [itemKey]: data[itemKey].filter(organizer => organizer !== id),
      });
    } else {
      // Update the value of the organizer with the matching ID
      setData({
        ...data,
        [itemKey]: data[itemKey].map(organizer =>
          organizer === id ? { ...organizer, value } : organizer,
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
            <div className={styles.org_container} key={index}>
              <img src={borderFile} className={styles.border} />
              <div className={styles.border_inner}>
                {!item && (
                  <button className={styles.delete} onClick={() => funChangeData(null, item)}>
                    <img src={trashIcon} alt="Удалить файл" />
                  </button>
                )}

                <FileComponent
                  logoHeader={typeof item === 'string' && `${server}/${item}`}
                  fileSize={50}
                  data={item}
                  setData={value => funChangeData(value, item)}
                  typeFile={['image/png']}
                  accept={'.png'}
                  name={`${itemKey}-${index}`}
                  icon={'png'}
                  itemKey={item}
                  text={'Загрузите или перетащите<br/>фотографию в формате PNG'}
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
