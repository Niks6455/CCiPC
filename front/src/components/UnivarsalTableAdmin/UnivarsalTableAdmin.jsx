import styles from "./UnivarsalTableAdmin.module.scss";
import trashAdmin from "@assets/img/AdminPanel/trashAdmin.svg";
import editAdmin from "@assets/img/AdminPanel/editAdmin.svg";
function UnivarsalTableAdmin({ tableHeader, tableData }) {
  const getValue = (value, key, rowIndex) => {
    switch (key) {
      case "title":
        return value || "Без названия";
      case "createdAt":
        return value ? new Date(value).toLocaleDateString("ru-RU", { year: "numeric", month: "long", day: "numeric" }) : "Нет даты";
      case "actions":
        return (
          <div className={styles.actions}>
            <button className={styles.button} onClick={() => alert(`Редактировать ID: ${rowIndex + 1}`)}>
              Редактировать <img src={editAdmin} alt="edit"/>
            </button>
            <button className={styles.button} onClick={() => alert(`Удалить ID: ${rowIndex + 1}`)}>
              Удалить <img src={trashAdmin} alt="trash"/>
            </button>
          </div>
        );
      default:
        return value || "___";
    }
  };

  return (
    <div className={styles.UnivarsalTableAdmin}>
      <table>
        <thead>
          <tr>
            {tableHeader?.map((el) => (
              <th key={el.key}>{el.name}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {tableData?.map((row, rowIndex) => (
            <tr key={row.id}>
              {tableHeader.map((header) => (
                <td key={header.key} className={header.key}>
                  {getValue(row[header.key], header.key, rowIndex)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default UnivarsalTableAdmin;
