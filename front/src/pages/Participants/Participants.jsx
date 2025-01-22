import Footer from '../../components/Footer/Footer';
import { tableData, tableHead } from './data.js';
import UniversalTable from '../../components/UniversalTable/UniversalTable';
import Layout from '../../ui/Layout/Layout';
import styles from './Participants.module.scss';
import { useEffect, useState } from 'react';
function Participants() {
  const [filter, setFilter] = useState('');
  const [filteredTable, setFilteredTable] = useState(tableData);

  const searchInData = (data, searchText) => {
    return data.filter((item) =>
      Object.values(item).some(
        (value) =>
          typeof value === 'string' &&
          value.toLowerCase().includes(searchText.toLowerCase())
      )
    );
  };

  useEffect(() => {
    setFilteredTable(searchInData(tableData, filter));
  }, [filter]);

  return (
    <>
      <main className={styles.Participants}>
        <Layout>
          <div className={styles.ParticipantsInner}>
            <div className={styles.Title}>
              <p>Участники конференции</p>
            </div>
            <div className={styles.inputComponentInner}>
              <div className={styles.inputComponentInnerContainer}>
                <img src="/img/search.svg" />
                <input
                  className={styles.inputComponent}
                  placeholder="Поиск"
                  onChange={(e) => setFilter(e.target.value)}
                  value={filter}
                />
              </div>

              <UniversalTable
                tableHeader={tableHead}
                tableBody={filteredTable}
              />
            </div>
          </div>
        </Layout>
      </main>
      <Footer />
    </>
  );
}

export default Participants;
