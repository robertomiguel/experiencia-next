'use client'
import { FiFilter, FiSearch } from 'react-icons/fi'
import style from './FormSearchInput.module.css'
import { Drawer } from './Drawer'
import { useSettingsStore } from '@/store/useSettingsStore'

interface FormInputProps {
    onSubmit: (text: string) => void
    defaultValue?: string
    disabled?: boolean
    placeholder?: string
    filterContent?: React.ReactNode
    filterTitle?: string
    value: string
    onChange: (t: string) => void
    fullWidth?: boolean
}

export const FormSearchInput = ({
    onSubmit,
    defaultValue,
    disabled,
    placeholder,
    filterContent,
    filterTitle,
    value,
    onChange,
    fullWidth,
}: FormInputProps) => {

    const isOpen = useSettingsStore(state => state.openSidesheet)
    const toogleSidesheet = useSettingsStore(state => state.toogleSidesheet)

    return <div className={style.formContainer + (fullWidth ? ' w-full' : ' sm:w-1/2')}>
        <form
            className={style.form}
            onSubmit={e => {
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
            </div>
        </form>
        {filterContent &&
            <div
                onClick={() => toogleSidesheet(true)}
                className={style.buttonFilter}
            >
                <FiFilter className='size-5' />
            </div>}
        {isOpen &&
            <Drawer
                title={filterTitle}
                onClose={() => toogleSidesheet(false)}
            >
                {filterContent}
            </Drawer>}
    </div>
}