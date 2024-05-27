import { FiFilter, FiSearch } from 'react-icons/fi'
import style from './FormSearchInput.module.css'

interface FormInputProps {
    onSubmit: (text: string) => void
    defaultValue?: string
    disabled?: boolean
    placeholder?: string
    filterContent?: React.ReactNode
}

export const FormSearchInput = ({ onSubmit, defaultValue, disabled, placeholder, filterContent }: FormInputProps) => {

    return <div className={style.formContainer}>
        <form onSubmit={e => {
            e.preventDefault()
            const formData = new FormData(e.target as HTMLFormElement)
            const text = formData.get('q') as string
            onSubmit(text)
        }} >
            <div className={style.formContent} >
                <input
                    disabled={disabled}
                    className={style.formInput}
                    id='q'
                    name='q'
                    defaultValue={defaultValue}
                    autoComplete="none"
                    placeholder={placeholder}
                />
                <button disabled={disabled} type="submit" className={style.searchButton} >
                    <FiSearch />
                </button>
                {filterContent && <div className={style.buttonFilter} ><FiFilter className='size-5' /></div>}
            </div>
        </form>
    </div>
}