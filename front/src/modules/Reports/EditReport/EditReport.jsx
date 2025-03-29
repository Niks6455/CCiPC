import { useEffect, useState } from 'react';
import styles from './EditReport.module.scss';
import { useSearchParams } from 'react-router-dom'; // Импортируем хук для работы с query params
import { useDispatch, useSelector } from 'react-redux';
import CreateReport from '../CreateReport/CreateReport';
import AddCoauthor from '../AddCoauthor/AddCoauthor';
import { disEditReport } from '../../../store/reportCreateSlice/reportCreateSlice';
import { useQuery } from '@tanstack/react-query';
import { apiGetReportId } from '../../../apirequests/apirequests';

function EditReport() {
  const dispatch = useDispatch();
  const [soauthorEditing, setSoauthorEditing] = useState(null);
  const [searchParams] = useSearchParams(); // Получаем query параметры
  const report = useSelector(state => state.reportsSlice.data);
  const [reportData, setReportData] = useState(null);
  const [number, setNumber] = useState('');
  const [idReport, setIdReport] = useState(null);
  const user = useSelector(state => state.user.user.data);

  const reportQery = useQuery({
    queryKey: [`${idReport}`, idReport],
    queryFn: () => apiGetReportId(idReport),
    enabled: !!idReport,
  });
  useEffect(() => {
    setReportData(reportQery?.data?.data?.report);
    const soauthor = reportQery?.data?.data?.report?.coAuthors?.find(
      soauthor => soauthor?.email === user?.email,
    );
    if (soauthor) {
      setSoauthorEditing(soauthor);
    }
  }, [reportQery]);

  console.log('soauthorEditing', soauthorEditing);

  useEffect(() => {
    const idReport = searchParams.get('idReport'); // Получаем idReport из query параметров
    if (idReport) {
      setIdReport(idReport);
    }
    setNumber(searchParams.get('number'));
  }, [searchParams, report]); // Запускаем useEffect при изменении query параметров или списка докладов

  useEffect(() => {
    if (reportData) {
      const temp = {
        id: idReport,
        status: 'save',
        number: number,
        name: reportData.name,
        directionConference: reportData?.direction?.name,
        formParticipation: reportData?.author?.form,
        participationStatus: reportData?.author?.status,
        fileArticle: reportData.reportFile,
        fileExpertOpinion: reportData.conclusion,
        comments: reportData.comment,
        organization: reportData?.author?.organization,
        coAuthorsIds: [],
        originSoauthors: reportData.coAuthors.map(soauthor => soauthor?.id),
        soauthors: reportData.coAuthors?.map(soauthor => ({
          data: {
            id: soauthor?.id,
            name: soauthor?.fio.split(' ')[1] || '',
            surname: soauthor?.fio.split(' ')[0] || '',
            patronymic: soauthor?.fio.split(' ')[2] || '',
            organization: soauthor?.organization || '',
            status: soauthor?.status || '',
            form: soauthor?.form || '',
            email: soauthor?.email || '',
            phone: soauthor?.phone || '',
            formParticipation: soauthor?.form || '',
          },
          autocompletion: 'true',
        })),
      };
      dispatch(disEditReport({ data: temp }));
    }
  }, [reportData]);

  return (
    <section className={styles.EditReport}>
      {soauthorEditing && <h2 className={styles.title}>Доклад №{number}</h2>}
      {!soauthorEditing && <CreateReport edit={true} soauthorEditing={soauthorEditing} />}
      <div className={styles.otstup}></div>
      <AddCoauthor
        edit={true}
        number={number}
        soauthorEditing={soauthorEditing}
        setSoauthorEditing={setSoauthorEditing}
      />
    </section>
  );
}

export default EditReport;
