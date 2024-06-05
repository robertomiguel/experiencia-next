'use client'
import { useEffect, useRef, useState } from 'react'
import style from './select.module.css'
import { FiRefreshCcw } from 'react-icons/fi';

interface OptionProps {
    value: any;
    label: any;
    onClick: (value: any) => void;
    isSelected?: boolean;
}

interface SelectProps {
    children: React.ReactNode;
}

interface Props {
    onChange: (v: any) => void;
    value?: any;
    options: { value: any, label: any }[]
    defaultValue?: any;
    showReset?: boolean;
    label?: string;
}

const Option = ({ value, label, onClick, isSelected }: OptionProps) => {
    const optionRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (isSelected && optionRef.current) {
            optionRef.current.scrollIntoView({ behavior: "instant", block: "nearest", inline: "nearest" });
        }
    }, [isSelected]);

    return (
        <div
            ref={optionRef}
            className={style.option + (isSelected ? ' ' + style.optionSelected : '')}
            onClick={() => onClick(value)}
        >
            {label}
        </div>
    );
}

const SelectList = ({ children }: SelectProps) => {
    return (
        <div className={style.select}>
            {children}
        </div>
    );
}

export const Select = ({ onChange, value, options = [], showReset, defaultValue, label }: Props) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSearch(options.find(m => m.value === value)?.label || '');
    }, [value, options]);

    const getLabelByValue = (value: any) => options.find(m => m.value === value)?.label || '';

    const removeAccent = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    const filteredList = options.filter(f => removeAccent(`${f.label}`).includes(removeAccent(search)));

    return (
        <div className='relative w-full m-auto mb-3 '>
            {label && <h5>{label}</h5>}
            <input
                type="text"
                value={isOpen ? search : getLabelByValue(value)}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => {
                    setIsOpen(true)
                    setSearch('')
                }}
                onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            />
            {!isOpen && showReset && <button
                type="button"
                className={style.resetButton}
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(defaultValue);
                }}
            >
                <FiRefreshCcw />
            </button>
            }
            {isOpen && <SelectList>
                {filteredList.map((model) => (
                    <Option
                        key={model.value}
                        isSelected={model.value === value}
                        value={model.value}
                        label={model.label}
                        onClick={(val) => {
                            onChange(val);
                            setSearch(options.find(m => m.value === value)?.label || '');
                            setIsOpen(false);
                        }}
                    />
                ))}
            </SelectList>}
        </div>
    );
}