'use client'
import { FiFilter, FiSearch } from 'react-icons/fi'
import style from './FormSearchInput.module.css'
import { useState } from 'react'
import { Drawer } from './Drawer'

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

    const [isOpen, setIsOpen] = useState<boolean>(false)

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
        {filterContent && <div onClick={() => setIsOpen(true)} className={style.buttonFilter} ><FiFilter className='size-5' /></div>}
        {isOpen && <Drawer title={filterTitle} onClose={() => setIsOpen(false)}>{filterContent}</Drawer>}
    </div>
}