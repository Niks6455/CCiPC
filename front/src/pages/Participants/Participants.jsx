import Footer from '../../components/Footer/Footer';
import { tableData, tableHead } from './data.js';
import UniversalTable from '../../components/UniversalTable/UniversalTable';
import Layout from '../../ui/Layout/Layout';
import styles from './Participants.module.scss';
import { useEffect, useState } from 'react';
import NavBar from '../../components/NavBar/NavBar.jsx';
import Search from '../../assets/img/search.svg';
import { useSelector } from 'react-redux';
import TableDataAll from '../../components/TableDataAll/TableDataAll.jsx';
import { getConferencesParticipants } from '../../apirequests/apirequests.js';
import HeaderPhone from '../../components/HeaderPhone/HeaderPhone.jsx';
function Participants() {
  const [filter, setFilter] = useState('');
  const [filteredTable, setFilteredTable] = useState([]);
  const store = useSelector(state => state.participants);
  const [defaultData, setDefaultData] = useState([]);
  const conferenceId = useSelector(state => state?.conferences?.data[0]?.id);
  useEffect(() => {
    if (!conferenceId) {
      return;
    }
    getConferencesParticipants(conferenceId).then(res => {
      if (res.status === 200) {
        setDefaultData(res.data.participants);
        setFilteredTable(res.data.participants);
        console.log('defaultData', res.data.participants);
      }
    });
  }, []);
  const searchInData = (data, searchText) => {
    return data.filter(item =>
      Object.values(item).some(
        value =>
          typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  };

  useEffect(() => {
    setFilteredTable(searchInData(defaultData, filter));
  }, [filter]);

  useEffect(() => {
    console.log('store.selectParticipantsData', store.selectParticipantsData);
  }, [store.selectParticipantsData]);
  return (
    <>
      <NavBar />
      <HeaderPhone />
      <main className={styles.Participants}>
        <div className={styles.ParticipantsInner}>
          <div className={styles.Title}>
            <h2>УЧАСТНИКИ КОНФЕРЕНЦИИ</h2>
          </div>
          <div className={styles.inputComponentInner}>
            <div className={styles.inputComponentInnerContainer}>
              <div className={styles.inputComponentInnerContainerInner}>
                <img src={Search} />
                <input
                  className={styles.inputComponent}
                  placeholder="Поиск"
                  onChange={e => setFilter(e.target.value)}
                  value={filter}
                />
              </div>
            </div>
            <UniversalTable tableHeader={tableHead} tableBody={filteredTable} />
          </div>
        </div>
      </main>
      {store.selectParticipantsData && <TableDataAll data={store.selectParticipantsData} />}
    </>
  );
}

export default Participants;
