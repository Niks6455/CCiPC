import { useState } from "react";
import { directionList, tableHeader } from "../data";
import styles from "./TableModule.module.scss";
import arrowIcon from "@assets/img/UI/arrowMini.svg";
import DirectionList from "./DirectionList";

function TableModule({ tableData, setTableData }) {
  const [openDirList, setOpenDirList] = useState(null);
  const [posDirList, setPosDirList] = useState({ x: 0, y: 0 });

  //! открыть лист для изменения направления
  const funOpenDirList = (e, index) => {
    const rect = e.target.getBoundingClientRect(); // Получаем координаты элемента

    let posY = rect.top + window.scrollY; // Координата сверху элемента
    let posX = rect.right + window.scrollX + 60; // Координата справа от элемента

    // Проверяем, выходит ли блок за нижнюю границу экрана
    if (rect.bottom + 500 > window.innerHeight) {
      posY = rect.top + window.scrollY - 300; // Поднимаем блок вверх
    }

    setPosDirList({ x: posX, y: posY });
    setOpenDirList(openDirList === index ? null : index);
  };

  //! функция изменения направления
  const funSetDirection = (value, indexRow) => {
    let dat = [...tableData];
    dat[indexRow].direction = value;
    setTableData(dat);
  };

  return (
    <div className={styles.TableModule} onScroll={() => setOpenDirList(null)}>
      {openDirList !== null && (
        <DirectionList
          posDirList={posDirList}
          indexRow={openDirList}
          data={directionList}
          selected={tableData[openDirList].direction}
          funSetDirection={funSetDirection}
        />
      )}
      <table>
        <thead>
          <tr>
            {tableHeader.map((el, index) => (
              <th key={index}>{el.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData.map((row, indexRow) => (
            <tr key={indexRow}>
              <td>{indexRow + 1}</td>
              {tableHeader.slice(1).map((columnKey, indexCol) =>
                columnKey.key === "direction" ? (
                  <td
                    key={indexCol}
                    onClick={(e) => funOpenDirList(e, indexRow)}
                  >
                    <div
                      className={styles.direction_container}
                      style={{ cursor: "pointer" }}
                    >
                      <div className={styles.left_box}>
                        {row[columnKey.key]}
                      </div>
                      <div className={styles.rigth_box}>
                        <img
                          src={arrowIcon}
                          alt="⬇️"
                          className={`${
                            openDirList === indexRow ? styles.open : ""
                          }`}
                        />
                      </div>
                    </div>
                  </td>
                ) : (
                  <td key={indexCol}>{row[columnKey.key]}</td>
                )
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableModule;
