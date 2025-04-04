import styles from './Directions.module.scss';
import deleteIcon from '@assets/img/UI/x.svg';
import plusIcon from '@assets/img/UI/plus.svg';

function Directions({ data, setData }) {
  const funChangeDirection = (e, index) => {
    const directions = [...data.directions];
    directions[index] = { ...directions[index], name: e.target.value };
    setData({ ...data, directions: directions });
  };

  const funDeleteItem = (el, index) => {
    const directions = [...data.directions];
    directions.splice(index, 1);
    if (el.new) return setData({ ...data, directions: directions });
    const directionsIds = [...data.directionsIds, el.id];
    setData({ ...data, directions: directions, directionsIds });
  };

  const funAddDirection = () => {
    setData({
      ...data,
      directions: [...data.directions, { name: '', id: new Date().getTime(), new: true }],
    });
    setTimeout(() => {
      document.getElementById(`directions-textarea-${data.directions.length}`).focus();
    }, 300);
  };

  return (
    <div className={styles.Directions}>
      <h3>Направления работы конференции</h3>
      <div className={styles.container}>
        {data.directions?.map((el, index) => (
          <div key={index} className={styles.directon_box}>
            <button className={styles.delete} onClick={() => funDeleteItem(el, index)}>
              <img src={deleteIcon} alt="Удалить" />
            </button>
            <textarea
              id={`directions-textarea-${index}`}
              value={el?.name}
              onChange={e => funChangeDirection(e, index)}
            />
          </div>
        ))}
        <div className={styles.directon_box}>
          <button className={styles.add_direction} onClick={funAddDirection}>
            <img src={plusIcon} alt="+" />
            <span>Добавить направление</span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Directions;
