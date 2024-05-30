import { useEffect, useRef, useState } from 'react'
import style from './selectModel.module.css'
import { FiRefreshCcw } from 'react-icons/fi';

const MODEL_LIST = [
    { value: 1, label: "Viento antiguo" },
    { value: 2, label: "Realidad absoluta 1" },
    { value: 3, label: "Realidad absoluta 2" },
    { value: 4, label: "¿Soy real?" },
    { value: 5, label: "Difusión analógica" },
    { value: 6, label: "Cualquier cosa 1" },
    { value: 7, label: "Cualquier cosa 2" },
    { value: 8, label: "Cualquier cosa 3" },
    { value: 9, label: "AOM mezcla naranja" },
    { value: 10, label: "Conducción ardiente" },
    { value: 11, label: "Romper dominio 1" },
    { value: 12, label: "Romper dominio 2" },
    { value: 13, label: "Mezcla de Cetus Versión" },
    { value: 14, label: "Cuentos infantiles 1" },
    { value: 15, label: "Cuentos infantiles 2 Semirreal" },
    { value: 16, label: "Cuentos infantiles 3 ToonAnime" },
    { value: 17, label: "Falsificación" },
    { value: 18, label: "Mezcla Linda Yuki Adorable medio capítulo 3" },
    { value: 19, label: "Ciberrealismo" },
    { value: 20, label: "Dalcefo" },
    { value: 21, label: "Deliberado 1" },
    { value: 22, label: "Deliberado 2" },
    { value: 23, label: "Anime de ensueño" },
    { value: 24, label: "Difusión onírica 1" },
    { value: 25, label: "Fotoreal onírico 2" },
    { value: 26, label: "Moldeador de Sueños 1 VAE Cocido" },
    { value: 27, label: "Moldeador de Sueños 2" },
    { value: 28, label: "Moldeador de Sueños 3" },
    { value: 29, label: "Borde del realismo Eor" },
    { value: 30, label: "Difusión anime de Eimis" },
    { value: 31, label: "Mezcla vívida de elldreth" },
    { value: 32, label: "Epico fotogasmico XP++" },
    { value: 33, label: "Realismo épico Natural" },
    { value: 34, label: "Realismo épico Evolución pura" },
    { value: 35, label: "No puedo creer que no sea fotografía Seco" },
    { value: 36, label: "Mezcla peluda de indigo Híbrido" },
    { value: 37, label: "Juggernaut Después del desastre" },
    { value: 38, label: "Lofi" },
    { value: 39, label: "Lyriel" },
    { value: 40, label: "Mezcla mágica realista" },
    { value: 41, label: "Mezcla de Mecha" },
    { value: 42, label: "Meinamix Meina 1" },
    { value: 43, label: "Meinamix Meina 2" },
    { value: 44, label: "Sueño interminable" },
    { value: 45, label: "Viaje abierto" },
    { value: 46, label: "Mezcla de pastel anime estilizada podada" },
    { value: 47, label: "Retrato plus" },
    { value: 48, label: "Protogen" },
    { value: 49, label: "Visión realista 1" },
    { value: 50, label: "Visión realista 2" },
    { value: 51, label: "Visión realista 3" },
    { value: 52, label: "Visión realista 4" },
    { value: 53, label: "Visión realista 5" },
    { value: 54, label: "Difusión de cambio de color" },
    { value: 55, label: "Rev animado" },
    { value: 56, label: "Run Diffusion FX 1" },
    { value: 57, label: "Run Diffusion FX 2" },
    { value: 58, label: "SDV" },
    { value: 59, label: "Ema Solo" },
    { value: 60, label: "El enmascarado" },
    { value: 61, label: "Shonins hermosa" },
    { value: 62, label: "La mezcla de los aliados II" },
    { value: 63, label: "Atemporal" },
    { value: 64, label: "Tú beta" },
];


interface OptionProps {
    value: number;
    label: string;
    onClick: (value: number) => void;
    isSelected?: boolean;
}

interface SelectProps {
    children: React.ReactNode;
}

interface Props {
    onChange: (v: number) => void;
    value?: number;
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

const Select = ({ children }: SelectProps) => {
    return (
        <div className={style.select}>
            {children}
        </div>
    );
}

export const SelectModel = ({ onChange, value = 3 }: Props) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSearch(MODEL_LIST.find(m => m.value === value)?.label || '');
    }, [value]);

    const getLabelByValue = (value: number) => MODEL_LIST.find(m => m.value === value)?.label || '';

    const removeAccent = (str: string) => str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").toLowerCase()

    const filteredList = MODEL_LIST.filter(f => removeAccent(`${f.label}`).includes(removeAccent(search)));

    return (
        <div className='relative w-full m-auto mb-3 '>
            <h4>Model</h4>
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
            {!isOpen && <button
                type="button"
                className={style.resetButton}
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    onChange(3);
                }}
            >
                <FiRefreshCcw />
            </button>
            }
            {isOpen && <Select>
                {filteredList.map((model) => (
                    <Option
                        key={model.value}
                        isSelected={model.value === value}
                        value={model.value}
                        label={model.label}
                        onClick={(val) => {
                            onChange(val);
                            setSearch(MODEL_LIST.find(m => m.value === value)?.label || '');
                            setIsOpen(false);
                        }}
                    />
                ))}
            </Select>}
        </div>
    );
}