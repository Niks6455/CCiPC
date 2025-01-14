import styles from "./Input.module.scss";

function Input(props) {
    return (
        <div className={styles.Input}>
            {!props?.value && props?.imgSrc && <img src={props?.imgSrc} alt={props?.name} />}
            <input
                name={props?.name}
                onChange={props?.onChange}
                value={props?.value}
                placeholder={props?.placeholder}
                className={props?.error ? styles.errorInput : ""}
                type={props.type || "text"}
                style={{
                    paddingLeft: props?.imgSrc && !props?.value && "55px" ? (!props?.value ? "55px" : "") : "25px",
                }}
            />
            {props?.value && !props?.error && <div className={styles.placeholderClose}>{props?.placeholder}</div>}
            {props?.error && <div className={styles.errorText}>{props?.error}</div>}
        </div>
    );
}

export default Input;
