import React, { useContext, useEffect, useRef, useState } from 'react';
import styles from './UniversalTable.module.scss';

function UniversalTable(props) {
  const [tableHeaderData, setTableHeaderData] = useState([]);
  const [tableBodyData, setTableBodyData] = useState([]);
  const tableRef = useRef(null); // Реф для таблицы

  useEffect(() => {
    setTableHeaderData(props?.tableHeader);
    setTableBodyData(props?.tableBody);
  }, [props?.tableHeader, props?.tableBody]);

  const getValue = (value, key, rowIndex, rowId, row) => {
    switch (key) {
      case 'number':
        return rowIndex + 1;
      default:
        return value || '___';
    }
  };

  return (
    <div ref={tableRef} className={styles.UniversalTable}>
      <table>
        <thead>
          {tableHeaderData?.map((el, index) => (
            <th key={index} name={el.key}>
              {el.value}
            </th>
          ))}
        </thead>
        <tbody>
          {tableBodyData?.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {tableHeaderData.map((header) => (
                <td key={header.key} name={header.key} className={header.key}>
                  {getValue(row[header.key], header.key, rowIndex, row.id, row)}
                </td>
              ))}
            </tr>
          ))}
          {tableBodyData.length === 0 && (
            <tr>
              <td colSpan={10} className={styles.tableNotData}>
                Нет данных
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default UniversalTable;
