import { useSelector } from 'react-redux';
import { apiEditMassReports, getConfParticipants } from '../../../apirequests/apirequests';
import styles from './ColaboratorsModuleAdminPage.module.scss';
import HeadBlock from './HeadBlock/HeadBlock';
import TableModule from './TableModule/TableModule';
import { useQuery } from '@tanstack/react-query';
import { useEffect, useState } from 'react';

function ColaboratorsModuleAdminPage() {
  const conferenceid = useSelector(state => state.conferences?.data[0]?.id);
  const direction = useSelector(state => state.conferences?.data[0]?.directions);
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [shearchParam, setShearchParam] = useState('');

  const qery = useQuery({
    queryKey: ['conference/participants', conferenceid], // Уникальный ключ, зависящий от conferenceid
    queryFn: () => getConfParticipants(conferenceid), // Функция для получения данных
    enabled: !!conferenceid, // Запрос выполняется только если conferenceid существует
    staleTime: Infinity, // Запрос не будет обновляться автоматически
  });

  useEffect(() => {
    qery.refetch();
  }, []);

  useEffect(() => {
    if (qery?.data?.data) {
      const deepCopy = JSON.parse(JSON.stringify(qery.data.data.participants));
      setTableData([...deepCopy]);
      setOriginalData([...deepCopy]);
    }
  }, [qery?.data]);

  //! поиск по всем полям
  useEffect(() => {
    if (shearchParam.trim() !== '') {
      const filteredData = originalData.filter(item => {
        // Create a copy of the item without the id for searching
        const { id, ...searchableItem } = item;
        const flattenedValues = Object.values(searchableItem).flat();
        console.log('flattenedValues', flattenedValues);
        return Object.values(flattenedValues).some(value => {
          return value.trim().toString().toLowerCase().includes(shearchParam.toLowerCase().trim());
        });
      });
      setTableData(filteredData); // Set the filtered data with id
    } else {
      setTableData(originalData); // Reset to original data with id
    }
  }, [shearchParam, originalData]);

  //! сохранение данных таблицы
  const funSaveTableData = () => {
    if (originalData?.length > 0) {
      const reqData = originalData.map(item => ({
        id: item?.id,
        directionId: direction.find(dir => dir.name === item.direction)?.id,
      }));

      if (reqData && reqData.length > 0) {
        apiEditMassReports({ reportsInfo: reqData.filter(item => item.directionId) }).then(res => {
          if (res?.status === 200) {
            qery.refetch();
          } else {
            alert('Ошибка при сохранении данных');
          }
        });
      }
    }
  };

  return (
    <section className={styles.ColaboratorsModuleAdminPage}>
      <h1>Участники</h1>
      <HeadBlock
        conferenceid={conferenceid}
        shearchParam={shearchParam}
        setShearchParam={setShearchParam}
        funSaveTableData={funSaveTableData}
      />
      <TableModule
        prewData={tableData.length > 0 ? [...qery.data?.data?.participants] : []}
        tableData={tableData}
        setTableData={setTableData}
        direction={direction}
        setOriginalData={setOriginalData}
        originalData={originalData}
      />
    </section>
  );
}

export default ColaboratorsModuleAdminPage;
