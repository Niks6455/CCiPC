import { tableHeader } from "../data";
import styles from "./TableOrgWznos.module.scss";
import paymentFormICon from "@assets/img/AdminPanel/paymentForm.svg";
import paymentForm1ICon from "@assets/img/AdminPanel/paymentForm1.svg";
import paymentForm2ICon from "@assets/img/AdminPanel/paymentForm2.svg";
import galkaCircle from "@assets/img/AdminPanel/galkaCircle.svg";
import xGreen from "@assets/img/AdminPanel/xGreen.svg";
import galkaBelay from "@assets/img/UI/galkaBelay.svg";

import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";

function TableOrgWznos({ prewData, tableData, setTableData }) {
  const [contractListShow, setContractListShow] = useState(null);
  const [inputSumEdit, setInputSumEdit] = useState(null);
  const refContractList = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        refContractList.current &&
        !refContractList.current.contains(event.target)
      ) {
        console.log("ref");
        setContractListShow(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const funChangeContractListShow = (e, index) => {
    if (e.target.id === "contractList") return;
    if (contractListShow === index) {
      setContractListShow(null);
    } else {
      setContractListShow(index);
    }
  };

  const funChangeSumm = (e, index) => {
    let newData = [...tableData];
    let val = e.target.value.replace(/[^0-9]/g, "");
    if (val <= 99999) {
      newData[index].sumOrgWznos = Number(val);
      setTableData(newData);
    }
  };

  const funChangeConfirmation = (indexRow) => {
    let newData = [...tableData];
    newData[indexRow].confirmation = !newData[indexRow].confirmation;
    setTableData(newData);
  };

  //! функция форматирования строк в таблице
  const funGetTdValue = (row, indexRow, columnKey, indexCol) => {
    if (columnKey.key === "fio") {
      return (
        <td name={columnKey.key} key={indexCol}>
          {row[columnKey.key]} <br /> {row.author}
        </td>
      );
    }
    if (columnKey.key === "paymentForm") {
      let docLoad = 0; // колличество загруженных документов
      if (row.contract) {
        docLoad += 1;
      }
      if (row.receipt) {
        docLoad += 1;
      }
      return (
        <td name={columnKey.key} key={indexCol}>
          <div
            className={styles.payment_container}
            onClick={(e) => funChangeContractListShow(e, indexRow)}
            ref={contractListShow === indexRow ? refContractList : null}
          >
            {row[columnKey.key] === "Безналичный расчёт" && (
              <>
                {docLoad === 0 && <img src={paymentFormICon} alt="📃" />}
                {docLoad === 1 && <img src={paymentForm1ICon} alt="📃" />}
                {docLoad === 2 && <img src={paymentForm2ICon} alt="📃" />}
              </>
            )}

            <span>{row[columnKey.key]}</span>
            {row[columnKey.key] === "Безналичный расчёт" && (
              <AnimatePresence>
                {contractListShow === indexRow && (
                  <motion.div
                    className={styles.contract_list}
                    initial={{ height: 0 }}
                    animate={{ height: "auto" }}
                    exit={{ height: 0 }}
                    id="contractList"
                  >
                    <a
                      href={row.contract}
                      target="_blank"
                      className={styles.box}
                      id="contractList"
                    >
                      {row.contract ? (
                        <img src={galkaCircle} alt="✅" id="contractList" />
                      ) : (
                        <img src={xGreen} alt="❌" id="contractList" />
                      )}
                      <span target="_blank" id="contractList">
                        Договор
                      </span>
                    </a>
                    <a
                      href={row.receipt}
                      target="_blank"
                      className={styles.box}
                      id="contractList"
                    >
                      {row.receipt ? (
                        <img src={galkaCircle} alt="✅" id="contractList" />
                      ) : (
                        <img src={xGreen} alt="❌" id="contractList" />
                      )}
                      <span id="contractList">Квитанция</span>
                    </a>
                  </motion.div>
                )}
              </AnimatePresence>
            )}
          </div>
        </td>
      );
    }
    if (columnKey.key === "sumOrgWznos") {
      let inpValue = row[columnKey.key];
      if (inputSumEdit === indexRow) {
        inpValue = inpValue.toString().replace(/[^0-9]/g, "");
      } else {
        inpValue = inpValue + " ₽";
      }
      return (
        <td name={columnKey.key} key={indexCol}>
          <div className={styles.sum_container}>
            <input
              className={
                prewData[indexRow].sumOrgWznos ===
                tableData[indexRow].sumOrgWznos
                  ? ""
                  : styles.edit_data
              }
              type="text"
              value={inpValue}
              onFocus={() => setInputSumEdit(indexRow)}
              onBlur={() => setInputSumEdit(null)}
              onChange={(event) => funChangeSumm(event, indexRow)}
            />
          </div>
        </td>
      );
    }

    if (columnKey.key === "confirmation") {
      return (
        <td
          name={columnKey.key}
          key={indexCol}
          className={styles.confirmation_container}
        >
          <div className={styles.check_box}>
            <input
              className={styles.confirmation}
              type="checkbox"
              checked={row[columnKey.key]}
              onChange={() => funChangeConfirmation(indexRow)}
            />
            <img
              onClick={() => funChangeConfirmation(indexRow)}
              className={styles.check_icon}
              src={galkaBelay}
              alt="✔️"
            />
          </div>
        </td>
      );
    }

    return (
      <td name={columnKey.key} key={indexCol}>
        {row[columnKey.key]}
      </td>
    );
  };

  return (
    <div className={styles.TableOrgWznos}>
      <table>
        <thead>
          <tr>
            {tableHeader.map((el, index) => (
              <th name={el.key} key={index}>
                {el.name}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((row, indexRow) => (
            <tr key={indexRow}>
              <td name="number">{indexRow + 1}</td>
              {tableHeader
                .slice(1)
                .map((columnKey, indexCol) =>
                  funGetTdValue(row, indexRow, columnKey, indexCol)
                )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default TableOrgWznos;
