import styles from "./Button.module.scss";

function Button(props) {
  return (
    <div className={styles.ButtonCont}>
      <button>{props?.text}</button>
    </div>
  );
}

export default Button;
