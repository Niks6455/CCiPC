import styles from "./TableModule.module.scss";

function DirectionList({
  posDirList,
  data,
  selected,
  funSetDirection,
  indexRow,
}) {
  return (
    <div
      className={styles.DirectionList}
      style={{
        top: posDirList.y,
        left: posDirList.x,
      }}
    >
      <ul>
        {data?.map((el, index) => (
          <li
            className={selected === el ? styles.selected : ""}
            key={index}
            onClick={() => funSetDirection(el, indexRow)}
          >
            {el}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default DirectionList;
