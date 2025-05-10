import { useEffect, useState } from 'react';
import styles from './OrgWznosModuleAdminPage.module.scss';
import lupa from '@assets/img/UI/lupa.svg';
import TableOrgWznos from './TableOrgWznos/TableOrgWznos';
import { apiUpdateOrgWznos, getOrgWznos } from '../../../apirequests/apirequests';
import { useQuery } from '@tanstack/react-query';
import { useSelector } from 'react-redux';
import ModalSuccessfully from '../../../components/ModalSuccessfully/ModalSuccessfully';

function OrgWznosModuleAdminPage() {
  const conferenceid = useSelector(state => state.conferences?.data[0]?.id);
  const [shearchParam, setShearchParam] = useState('');
  const [originalData, setOriginalData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [modalSucces, setModalSucces] = useState(null);

  const qery = useQuery({
    queryKey: ['conference/fee', conferenceid], // Уникальный ключ, зависящий от conferenceid
    queryFn: () => getOrgWznos(conferenceid), // Функция для получения данных
    enabled: !!conferenceid, // Запрос выполняется только если conferenceid существует
    staleTime: Infinity, // Запрос не будет обновляться автоматически
  });

  useEffect(() => {
    qery.refetch();
  }, []);

  useEffect(() => {
    const data = qery?.data?.data?.participants?.map(item => ({
      id: item.id,
      fio: item.fio || '',
      report: item.name || '',
      organization: item.organization || '',
      participationForm: item.form || '',
      participationStatus: item.participationStatus || '',
      paymentForm: item.formPay || '',
      sumOrgWznos: item.sum,
      confirmation: item.status || false,
      author: item.who || '',
      contract: item.accord || null,
      receipt: item.receipt || null,
      phone: item.phone || '',
      email: item.email || '',
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
    const data = originalData.reduce((acc, item) => {
      if (!acc.some(existingItem => existingItem.id === item.id)) {
        acc.push({
          id: item.id,
          sum: item.sumOrgWznos === '_____' ? null : item.sumOrgWznos,
          status: item.confirmation,
        });
      }
      return acc;
    }, []);
    //! отправка только тех данных которые изменились
    const qeryData = qery?.data?.data?.participants;
    const newData = data
      .map(item => {
        const qd = qeryData.find(i => i.id === item.id);
        const par = {};
        if (qd.sum !== item.sum) {
          par.sum = item.sum;
        }
        if (qd.status !== item.status) {
          par.status = item.status;
        }
        return { id: item.id, ...par };
      })
      .filter(item => Object.keys(item).length > 1);
    if (newData.length === 0) return;
    apiUpdateOrgWznos(conferenceid, { feeInfo: newData }).then(res => {
      if (res?.status === 200) {
        setModalSucces(true);
        qery.refetch();
      } else {
        setModalSucces(false);
      }
    });
  };

  return (
    <section className={styles.OrgWznosModuleAdminPage}>
      <ModalSuccessfully open={modalSucces} setOpen={setModalSucces} />

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
      <TableOrgWznos
        prewData={[...(qery?.data?.data?.participants || [])]}
        originalData={originalData}
        tableData={tableData}
        setTableData={setTableData}
        setOriginalData={setOriginalData}
      />
    </section>
  );
}

export default OrgWznosModuleAdminPage;
