import { useEffect, useRef, useState } from 'react';
import { tableHeader } from '../data';
import styles from './TableModule.module.scss';
import arrowIcon from '@assets/img/UI/arrowMini.svg';
import DirectionList from './DirectionList';
import { AnimatePresence } from 'framer-motion';
import trash from '@assets/img/UI/trash.svg';
import ModalDeleteReportAdmin from '../../../../components/ModalDeleteReportAdmin/ModalDeleteReportAdmin';

function TableModule({
  prewData,
  tableData,
  setTableData,
  direction,
  setOriginalData,
  originalData,
}) {
  const [openDirList, setOpenDirList] = useState(null);
  const [posDirList, setPosDirList] = useState({ x: 0, y: 0 });
  const listRef = useRef(null);
  const listModalRef = useRef(null);
  const [modalDelete, setModalDelete] = useState(false);

  //! открыть лист для изменения направления
  const funOpenDirList = (e, index) => {
    e.stopPropagation();
    const clickX = e.clientX;
    const clickY = e.clientY;
    let posY = clickY + 20;
    let posX = clickX + 50;
    if (posY + 300 > window.innerHeight) {
      posY = window.innerHeight - 300;
    }
    setPosDirList({ x: posX, y: posY });
    setOpenDirList(prev => (prev === index ? null : index));
  };

  useEffect(() => {
    const handleClickOutside = event => {
      if (
        listRef.current &&
        !listRef.current.contains(event.target) &&
        listModalRef.current &&
        !listModalRef.current.contains(event.target)
      ) {
        setOpenDirList(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  //! функция изменения направления
  const funSetDirection = (value, indexRow) => {
    let dat = [...tableData];
    dat[indexRow].direction = value.name;
    setTableData(dat);
  };

  const getTdData = (key, row) => {
    if (key === 'fio') {
      return row[key].map((el, index) => <p key={index}>{el}</p>);
    }
    if (key === 'action') {
      return (
        <button
          className={styles.trash}
          onClick={() => {
            setModalDelete(row);
          }}
          title="Удалить доклад"
        >
          <img src={trash} alt="Удалить" />
        </button>
      );
    }

    return row[key];
  };

  //! закрываетм лист при скролле страницы
  useEffect(() => {
    const handleScroll = () => {
      setOpenDirList(null);
    };
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <>
      <ModalDeleteReportAdmin
        data={modalDelete}
        setData={setModalDelete}
        setOriginalData={setOriginalData}
        originalData={originalData}
      />
      <div className={styles.TableModule} onScroll={() => setOpenDirList(null)}>
        <AnimatePresence>
          {openDirList !== null && (
            <DirectionList
              listModalRef={listModalRef}
              posDirList={posDirList}
              indexRow={openDirList}
              data={direction}
              selected={tableData?.[openDirList]?.direction}
              funSetDirection={funSetDirection}
            />
          )}
        </AnimatePresence>
        <table>
          <thead>
            <tr>
              {tableHeader.map((el, index) => (
                <th key={index}>{el.name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tableData?.map((row, indexRow) => (
              <tr key={indexRow}>
                <td>{indexRow + 1}</td>
                {tableHeader.slice(1).map((columnKey, indexCol) =>
                  columnKey.key === 'direction' ? (
                    <td
                      ref={openDirList === indexRow ? listRef : null}
                      key={indexCol}
                      onClick={e => funOpenDirList(e, indexRow)}
                      style={{ cursor: 'pointer' }}
                      className={
                        prewData.find(el => el.id === row.id)?.direction !== row.direction
                          ? styles.editData
                          : ''
                      }
                    >
                      <div className={styles.direction_container}>
                        <div className={styles.left_box}>{row[columnKey.key]}</div>
                        <div className={styles.rigth_box}>
                          <img
                            src={arrowIcon}
                            alt="⬇️"
                            className={`${openDirList === indexRow ? styles.open : ''}`}
                          />
                        </div>
                      </div>
                    </td>
                  ) : (
                    <td key={indexCol}>{getTdData(columnKey.key, row)}</td>
                  ),
                )}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default TableModule;
