import { useContext } from "react";
import DataContext from "../../context";
import Header from "../../components/Header/Header";
import Layout from "../../ui/Layout/Layout";
import styles from "./HomePage.module.scss";
import TopMainInfo from "../../modules/TopMainInfo/TopMainInfo";
function HomePage() {
    const context = useContext(DataContext);
    console.log("context", context)
    return ( 
        <div>
            <Header/>
            <TopMainInfo/>
        </div>

     );
}

export default HomePage;