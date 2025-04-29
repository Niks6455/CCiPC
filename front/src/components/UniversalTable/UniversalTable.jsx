import React, { useEffect, useRef, useState } from 'react';
import styles from './UniversalTable.module.scss';
import { useWindowWidth } from '../../hooks/hooks';
import glaz from '@assets/img/glaz.svg';
import arrowTable from '@assets/img/arrowTable.svg';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectDataParticipants } from '../../store/participantsSlice/participantsSlice';

function UniversalTable(props) {
  console.log('props', props);
  const [tableHeaderData, setTableHeaderData] = useState([]);
  const [tableBodyData, setTableBodyData] = useState([]);
  const [initialTableHeaderData, setInitialTableHeaderData] = useState([]);
  const tableRef = useRef(null);
  const windowWidth = useWindowWidth();
  const dispatch = useDispatch();
  const [activeIndex, setActiveIndex] = useState(2); // Стартовый индекс для 'Направление'

  const values =
    props.userRole === 1
      ? [
          { key: 'organization', value: 'Организация', isActive: true },
          { key: 'status', value: 'Участие', isActive: true },
          { key: 'direction', value: 'Направление', isActive: true },
          { key: 'name', value: 'Доклад', isActive: true },
        ]
      : [
          { key: 'organization', value: 'Организация', isActive: true },
          { key: 'direction', value: 'Направление', isActive: true },
          { key: 'name', value: 'Доклад', isActive: true },
        ];

  useEffect(() => {
    setInitialTableHeaderData(props?.tableHeader);
    setTableHeaderData(props?.tableHeader);
    setTableBodyData(props?.tableBody);
    checkWidth();
  }, [props?.tableHeader, props?.tableBody]);

  // Логика для переключения индекса
  const slideNext = () => {
    setActiveIndex(prevIndex => (prevIndex + 1) % values.length);
  };

  const slidePrev = () => {
    setActiveIndex(prevIndex => (prevIndex - 1 + values.length) % values.length);
  };

  const splitFio = fio => {
    if (Array.isArray(fio)) {
      return fio.map((name, index) => (
        <span key={index}>
          {name}
          <br />
        </span>
      ));
    } else {
      return fio;
    }
  };

  const getValue = (value, key, rowIndex, rowId, row) => {
    switch (key) {
      case 'fio':
        return <div>{splitFio(value)}</div>;
      case 'number':
        return rowIndex + 1;
      case 'vizion':
        return (
          <div className={styles.buttonTable}>
            <img src={glaz} onClick={() => dispatch(setSelectDataParticipants({ data: row }))} />
          </div>
        );
      default:
        return value || '___';
    }
  };

  useEffect(() => {
    // Обновляем заголовок таблицы в зависимости от активного индекса
    const updatedHeaderData = [...tableHeaderData];
    // Заменяем значение в ячейке с индексом 2
    updatedHeaderData[2] = {
      key: values[activeIndex].key,
      value: values[activeIndex].value,
      isActive: true,
    };

    setTableHeaderData(updatedHeaderData);
  }, [activeIndex, initialTableHeaderData]);

  const checkWidth = () => {
    const updatedHeaderData = [...initialTableHeaderData];
    const index = updatedHeaderData.findIndex(item => item.key === 'vizion');
    if (windowWidth <= 580) {
      updatedHeaderData.splice(2);
    }
    if (windowWidth <= 780) {
      updatedHeaderData.splice(3);

      if (index === -1) {
        updatedHeaderData.push({ key: 'vizion', value: '', isActive: true });
      }
    } else {
      if (updatedHeaderData.length <= 3 && index === -1) {
        updatedHeaderData.push({ key: 'vizion', value: '', isActive: true });
      }
    }

    setTableHeaderData(updatedHeaderData);
  };
  useEffect(() => {
    checkWidth();
  }, [windowWidth, initialTableHeaderData]);

  return (
    <div ref={tableRef} className={styles.UniversalTable}>
      <table>
        <thead>
          {tableHeaderData?.map((el, index) => (
            <th
              key={index}
              name={el.key}
              style={{
                width: index === 2 && windowWidth <= 780 && windowWidth >= 580 ? '215px' : '',
              }}
            >
              {index === 2 && windowWidth <= 780 && windowWidth >= 580 ? (
                <div className={styles.arrowTableCont}>
                  <div>
                    <img src={arrowTable} className={styles.arrowTable} onClick={slidePrev} />
                  </div>
                  <p>{el.value}</p>
                  <div>
                    <img
                      src={arrowTable}
                      className={styles.arrowTable}
                      style={{ transform: 'rotate(180deg)' }}
                      onClick={slideNext}
                    />
                  </div>
                </div>
              ) : (
                <>{el.value}</>
              )}
            </th>
          ))}
        </thead>
        <tbody>
          {tableBodyData?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {tableHeaderData.map(header => (
                <td key={header.key} name={header.key} className={header.key}>
                  {getValue(row[header.key], header.key, rowIndex, row.id, row)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {(!tableBodyData || tableBodyData.length === 0) && (
        <div colSpan={tableHeaderData.length} className={styles.tableNotData}>
          <div className={styles.text}>Нет данных</div>
        </div>
      )}
    </div>
  );
}

export default UniversalTable;
