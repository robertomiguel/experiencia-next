import WikiForm from "@/components/wikipedia/WikiForm";
import style from "./style.module.css";

export const WikiPage = () => {

    return (<div className={style.pageContainer} >
        <div className="w-full">
            <WikiForm />
        </div>
        <div className="mb-40 w-full text-center">
            <h4>API REST-full Wikipedia</h4>
        </div>
    </div >);
}