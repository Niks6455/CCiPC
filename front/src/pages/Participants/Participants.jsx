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
function Participants() {
  const [filter, setFilter] = useState('');
  const [filteredTable, setFilteredTable] = useState(tableData);
  const store = (useSelector((state) => state.participants));

  const searchInData = (data, searchText) => {
    return data.filter(item =>
      Object.values(item).some(
        value =>
          typeof value === 'string' && value.toLowerCase().includes(searchText.toLowerCase()),
      ),
    );
  };

  useEffect(() => {
    setFilteredTable(searchInData(tableData, filter));
  }, [filter]);

  useEffect(()=>{
    console.log("store.selectParticipantsData", store.selectParticipantsData)
  },[store.selectParticipantsData])
  return (
    <>
      <NavBar />
      <main className={styles.Participants}>
        <div className={styles.ParticipantsInner}>
          <div className={styles.Title}>
            <p>Участники конференции</p>
          </div>
          <div className={styles.inputComponentInner}>
            <div className={styles.inputComponentInnerContainer}>
              <img src={Search} />
              <input
                className={styles.inputComponent}
                placeholder="Поиск"
                onChange={e => setFilter(e.target.value)}
                value={filter}
              />
            </div>
            <UniversalTable tableHeader={tableHead} tableBody={filteredTable} />
          </div>
        </div>
      </main>
        {store.selectParticipantsData && <TableDataAll data={store.selectParticipantsData}/>}
      <Footer />
    </>
  );
}

export default Participants;
