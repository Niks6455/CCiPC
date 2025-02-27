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
  const [tableData, setTableData] = useState([]);

  const qery = useQuery({
    queryKey: ["conference/participants", conferenceid], // Уникальный ключ, зависящий от conferenceid
    queryFn: () => getConfParticipants(conferenceid), // Функция для получения данных
    enabled: !!conferenceid, // Запрос выполняется только если conferenceid существует
  });

  useEffect(() => {
    if (qery.data && qery.data.data) setTableData(qery.data.data.participants);
    else {
      setTableData(testData);
    }
  }, [qery]);
  console.log("qery", qery);
  console.log("tableData", tableData);

  return (
    <section className={styles.ColaboratorsModuleAdminPage}>
      <h1>Участники</h1>
      <HeadBlock />
      {tableData.length > 0 && (
        <TableModule tableData={tableData} setTableData={setTableData} />
      )}
    </section>
  );
}

export default ColaboratorsModuleAdminPage;
