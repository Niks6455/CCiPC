import { useEffect, useState } from "react";
import styles from "./OrgWznosModuleAdminPage.module.scss";
import lupa from "@assets/img/UI/lupa.svg";
import TableOrgWznos from "./TableOrgWznos/TableOrgWznos";
import { testData } from "./data";

function OrgWznosModuleAdminPage() {
  const [shearchParam, setShearchParam] = useState("");
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    console.log("tableData", tableData);
    console.log("originalData", originalData);
  }, [tableData]);

  useEffect(() => {
    const deepCopy = JSON.parse(JSON.stringify(testData));
    setTableData([...deepCopy]);
    setOriginalData([...deepCopy]);
  }, []);

  //! поиск по всем полям
  useEffect(() => {
    if (shearchParam.trim() !== "") {
      const filteredData = originalData.filter((item) =>
        Object.values(item).some((value) =>
          value?.toString().toLowerCase().includes(shearchParam.toLowerCase())
        )
      );
      setTableData(filteredData);
    } else {
      setTableData([...originalData]); // Сбрасываем фильтр
    }
  }, [shearchParam, originalData]);

  return (
    <section className={styles.OrgWznosModuleAdminPage}>
      <h1>Оргвзнос</h1>
      <div className={styles.head_menu}>
        <div className={styles.left_block}>
          <img src={lupa} alt="🔍" />
          <input
            value={shearchParam}
            onChange={(e) => setShearchParam(e.target.value)}
            type="text"
            placeholder="Поиск"
          />
        </div>
        <button className={styles.save}>Сохранить</button>
      </div>
      <TableOrgWznos
        prewData={[...testData]}
        tableData={tableData}
        setTableData={setTableData}
      />
    </section>
  );
}

export default OrgWznosModuleAdminPage;
