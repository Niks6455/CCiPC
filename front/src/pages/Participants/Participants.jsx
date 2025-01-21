import Footer from '../../components/Footer/Footer';
import { tableData, tableHead } from './data.js';
import UniversalTable from '../../components/UniversalTable/UniversalTable';
import Layout from '../../ui/Layout/Layout';
import styles from './Participants.module.scss';
import { useEffect, useState } from 'react';
function Participants() {
  const [filter, setFilter] = useState('');
  const [filteredTable, setFilteredTable] = useState(tableData);

  /**
   * Searches for a string in the table data
   * @param {Object[]} data - table data
   * @param {string} searchText - string to search for
   * @returns {Object[]} filtered table data
   */
  const searchInData = (data, searchText) => {
    // Filter the table data based on the search string
    // Iterate over each item in the data array
    return data.filter((item) =>
      // Iterate over each value in the item object
      Object.values(item).some(
        (value) =>
          // Check if the value is a string and if it includes the search string
          // Use the includes() method to check if the search string is present
          // Use the toLowerCase() method to make the search case-insensitive
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
