import styles from './UnivarsalTableAdmin.module.scss';
import trashAdmin from '@assets/img/AdminPanel/trashAdmin.svg';
import editAdmin from '@assets/img/AdminPanel/editAdmin.svg';
import { deleteNews } from '../../apirequests/apirequests';
import { useDispatch } from 'react-redux';
import { setSelectNewsData } from '../../store/newsSlice/newsSlice';
function UnivarsalTableAdmin({ tableHeader, tableData, updateNewsData, editClicker }) {
  const getValue = (value, key, rowIndex, row) => {
    switch (key) {
      case 'number':
      case 'id':
        return rowIndex + 1;
      case 'title':
        return value || 'Без названия';
      case 'createdAt':
        return value
          ? new Date(value).toLocaleDateString('ru-RU', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          : 'Нет даты';
      case 'actions':
        return (
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => editNewsfuncData(row.id)}>
              Редактировать <img src={editAdmin} alt="edit" />
            </button>
            <button className={styles.button} onClick={() => deleteNewsfunc(row.id)}>
              Удалить <img src={trashAdmin} alt="trash" />
            </button>
          </div>
        );
      default:
        return value || '___';
    }
  };

  const dispatch = useDispatch();

  const deleteNewsfunc = id => {
    deleteNews(id).then(resp => {
      updateNewsData();
    });
  };

  const editNewsfuncData = id => {
    dispatch(setSelectNewsData({ id: id }));
    editClicker();
  };

  return (
    <div className={styles.UnivarsalTableAdmin}>
      <table>
        <thead>
          <tr>
            {tableHeader?.map(el => (
              <th key={el.key}>{el.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((row, rowIndex) => (
            <tr key={row.id}>
              {tableHeader.map(header => (
                <td key={header.key} className={header.key}>
                  {getValue(row[header.key], header.key, rowIndex, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UnivarsalTableAdmin;
