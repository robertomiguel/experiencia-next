import { FiFilter, FiSearch } from 'react-icons/fi'
import style from './FormSearchInput.module.css'

interface FormInputProps {
    onSubmit: (text: string) => void
    defaultValue?: string
    disabled?: boolean
    placeholder?: string
    filterContent?: React.ReactNode
    value: string
    onChange: (t: string) => void
}

export const FormSearchInput = ({ onSubmit, defaultValue, disabled, placeholder, filterContent, value, onChange }: FormInputProps) => {

    return <div className={style.formContainer}>
        <form onSubmit={e => {
            e.preventDefault()
            onSubmit(value)
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
                    value={value}
                    onChange={e => onChange(e.target.value)}
                />
                <button disabled={disabled} type="submit" className={style.searchButton} >
                    <FiSearch />
                </button>
                {filterContent && <div className={style.buttonFilter} ><FiFilter className='size-5' /></div>}
            </div>
        </form>
    </div>
}