import { useRef, useEffect } from "react";
import styles from "./TableDataAll.module.scss";
import closeBack from "@assets/img/closeBack.svg";
import gsap from "gsap";
import { useDispatch } from "react-redux";
import { clearDataParticipants } from "../../store/participantsSlice/participantsSlice";

function TableDataAll(props) {
    console.log("data", props?.data);
    const refForm = useRef(null);
    const refBackdrop = useRef(null);
    const dispatch = useDispatch();

    useEffect(() => {
        const element = refForm.current;
        const backdrop = refBackdrop.current;

        // Анимация затемнения фона
        gsap.fromTo(
            backdrop,
            { opacity: 0 },
            { opacity: 1, duration: 0.4, ease: "power2.out" }
        );

        // Анимация всплывания окна
        gsap.fromTo(
            element,
            { y: 100, opacity: 0 },
            { y: 0, opacity: 1, duration: 0.4, ease: "power2.out" }
        );

        return () => {
            gsap.to(backdrop, { opacity: 0, duration: 0.4, ease: "power2.in" });
            gsap.to(element, { y: 100, opacity: 0, duration: 0.4, ease: "power2.in" });
        };
    }, []);

    return (
        <section className={styles.TableDataAll} ref={refBackdrop}>
            <div className={styles.TableDataAllInner} ref={refForm}>
                <div className={styles.TableDataAllFirstBlock}>
                    <div className={styles.TableDataAllFIO}>
                        {props.data.fio}
                    </div>
                    <button>
                        <img
                            src={closeBack}
                            alt="Close"
                            onClick={() => {
                                dispatch(clearDataParticipants());
                            }}
                        />
                    </button>
                </div>
            </div>
        </section>
    );
}

export default TableDataAll;
