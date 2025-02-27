import { useSelector } from "react-redux";
import { getConfParticipants } from "../../../apirequests/apirequests";
import styles from "./ColaboratorsModuleAdminPage.module.scss";
import HeadBlock from "./HeadBlock/HeadBlock";
import TableModule from "./TableModule/TableModule";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { testData } from "./data";

function ColaboratorsModuleAdminPage() {
  const conferenceid = useSelector((state) => state.conferences?.data[0]?.id);
  const direction = useSelector(
    (state) => state.conferences?.data[0]?.directions
  );
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [shearchParam, setShearchParam] = useState("");

  const qery = useQuery({
    queryKey: ["conference/participants", conferenceid], // Уникальный ключ, зависящий от conferenceid
    queryFn: () => getConfParticipants(conferenceid), // Функция для получения данных
    enabled: !!conferenceid, // Запрос выполняется только если conferenceid существует
  });

  useEffect(() => {
    // if (qery.data && qery.data.data) setTableData(qery.data.data.participants);
    const deepCopy = JSON.parse(JSON.stringify(testData));
    console.log("deepCopy", deepCopy);
    setTableData([...deepCopy]);
    setOriginalData([...deepCopy]);
  }, []);

  //! поиск по всем полям
  useEffect(() => {
    if (shearchParam.trim() !== "") {
      const filteredData = originalData.filter((item) =>
        Object.values(item).some((value) =>
          value.toString().toLowerCase().includes(shearchParam.toLowerCase())
        )
      );
      setTableData(filteredData);
    } else {
      setTableData([...originalData]); // Сбрасываем фильтр
    }
  }, [shearchParam, originalData]);

  return (
    <section className={styles.ColaboratorsModuleAdminPage}>
      <h1>Участники</h1>
      <HeadBlock
        shearchParam={shearchParam}
        setShearchParam={setShearchParam}
      />
      <TableModule
        prewData={[...testData]}
        tableData={tableData}
        setTableData={setTableData}
        direction={direction}
      />
    </section>
  );
}

export default ColaboratorsModuleAdminPage;
