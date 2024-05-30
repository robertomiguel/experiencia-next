'use client'
import { FiFilter, FiSearch } from 'react-icons/fi'
import style from './FormSearchInput.module.css'
import { Drawer } from './Drawer'
import { useAppDispatch, useAppSelector } from '@/store'
import { toogleSidesheet } from '@/store/settingsSlice'

interface FormInputProps {
    onSubmit: (text: string) => void
    defaultValue?: string
    disabled?: boolean
    placeholder?: string
    filterContent?: React.ReactNode
    filterTitle?: string
    value: string
    onChange: (t: string) => void
}

export const FormSearchInput = ({
    onSubmit,
    defaultValue,
    disabled,
    placeholder,
    filterContent,
    filterTitle,
    value,
    onChange
}: FormInputProps) => {

    const dispatch = useAppDispatch()
    const isOpen = useAppSelector(state => state.settings.openSidesheet)

    return <div className={style.formContainer}>
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
        {filterContent && <div onClick={() => dispatch(toogleSidesheet(true))} className={style.buttonFilter} ><FiFilter className='size-5' /></div>}
        {isOpen && <Drawer title={filterTitle} onClose={() => dispatch(toogleSidesheet(false))}>{filterContent}</Drawer>}
    </div>
}