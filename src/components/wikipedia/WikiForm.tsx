import { redirect } from "next/navigation";
import { FiSearch } from "react-icons/fi";
import style from "./style.module.css";

export default function WikiForm({ q }: { q?: string }) {

    async function searchAction(formData: FormData) {
        'use server'
        const query = formData.get('q');
        redirect(`/wiki/${query}`);
    }

    return (
        <div className={style.formContainer}>
            <form action={searchAction} >
                <div className={style.formContent} >
                    <input
                        className={style.formInput}
                        id='q'
                        name='q'
                        defaultValue={q}
                        autoComplete="none"
                        placeholder="Search on wikipedia..."
                    />
                    <button type="submit" className="w-fit hover:bg-blue-200 bg-gray-50 text-blue-900 absolute right-0 m-0 rounded-full p-3 " >
                        <FiSearch />
                    </button>
                </div>
            </form>
        </div>
    );
}