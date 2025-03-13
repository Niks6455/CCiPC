import { useEffect, useState } from 'react';
import styles from './OrgWznosModuleAdminPage.module.scss';
import lupa from '@assets/img/UI/lupa.svg';
import TableOrgWznos from './TableOrgWznos/TableOrgWznos';
import { testData } from './data';
import { apiUpdateOrgWznos, getOrgWznos } from '../../../apirequests/apirequests';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';

function OrgWznosModuleAdminPage() {
  const conferenceid = useSelector(state => state.conferences?.data[0]?.id);
  const [shearchParam, setShearchParam] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);

  const qery = useQuery({
    queryKey: ['conference/fee', conferenceid], // Уникальный ключ, зависящий от conferenceid
    queryFn: () => getOrgWznos(conferenceid), // Функция для получения данных
    enabled: !!conferenceid, // Запрос выполняется только если conferenceid существует
    staleTime: Infinity, // Запрос не будет обновляться автоматически
  });

  console.log('qery', qery?.data?.data?.participants);

  useEffect(() => {
    console.log('tableData', tableData);
    console.log('originalData', originalData);
  }, [tableData]);

  useEffect(() => {
    const data = qery?.data?.data?.participants?.map(item => ({
      id: item.id,
      fio: item.fio || '',
      report: item.name || '',
      organization: item.organization || '',
      participationForm: item.form || '',
      participationStatus: item.participationStatus || '',
      paymentForm: item.formPay || '',
      sumOrgWznos: item.sum || 0,
      confirmation: item.status || false,
      author: item.who || '',
      contract: null,
      receipt: item.receipt || null,
    }));
    if (data && data.length > 0) {
      const deepCopy = JSON.parse(JSON.stringify(data));
      setTableData([...deepCopy]);
      setOriginalData([...deepCopy]);
    }
  }, [qery?.data?.data?.participants]);

  //! поиск по всем полям
  useEffect(() => {
    if (shearchParam.trim() !== '') {
      const filteredData = originalData.filter(item =>
        Object.values(item).some(value =>
          value?.toString().toLowerCase().includes(shearchParam.toLowerCase()),
        ),
      );
      setTableData(filteredData);
    } else {
      setTableData([...originalData]); // Сбрасываем фильтр
    }
  }, [shearchParam, originalData]);

  const funSaveData = () => {
    console.log('originalData', originalData);
    const data = originalData.map(item => ({
      id: item.id,
      sum: item.sumOrgWznos,
      status: item.confirmation,
    }));
    console.log('data', data);
    apiUpdateOrgWznos(conferenceid, { feeInfo: data }).then(res => console.log('res', res));
  };

  return (
    <section className={styles.OrgWznosModuleAdminPage}>
      <h1>Оргвзнос</h1>
      <div className={styles.head_menu}>
        <div className={styles.left_block}>
          <img src={lupa} alt="🔍" />
          <input
            value={shearchParam}
            onChange={e => setShearchParam(e.target.value)}
            type="text"
            placeholder="Поиск"
          />
        </div>
        <button className={styles.save} onClick={funSaveData}>
          Сохранить
        </button>
      </div>
      <TableOrgWznos prewData={[...testData]} tableData={tableData} setTableData={setTableData} />
    </section>
  );
}

export default OrgWznosModuleAdminPage;
