import { useEffect, useState } from 'react'

const MODEL_LIST = [
    { value: 1, label: "3Guofeng3_v34" },
    { value: 2, label: "absolutereality_V16" },
    { value: 3, label: "absolutereality_v181" },
    { value: 4, label: "amIReal_V41" },
    { value: 5, label: "analog-diffusion-1.0" },
    { value: 6, label: "anythingv3_0-pruned" },
    { value: 7, label: "anything-v4.5-pruned" },
    { value: 8, label: "anythingV5_PrtRE" },
    { value: 9, label: "AOM3A3_orangemixs" },
    { value: 10, label: "blazing_drive_v10g" },
    { value: 11, label: "breakdomain_I2428" },
    { value: 12, label: "breakdomain_M2150" },
    { value: 13, label: "cetusMix_Version35" },
    { value: 14, label: "childrensStories_v13D" },
    { value: 15, label: "childrensStories_v1SemiReal" },
    { value: 16, label: "childrensStories_v1ToonAnime" },
    { value: 17, label: "Counterfeit_v30" },
    { value: 18, label: "cuteyukimixAdorable_midchapter3" },
    { value: 19, label: "cyberrealistic_v33" },
    { value: 20, label: "dalcefo_v4" },
    { value: 21, label: "deliberate_v2" },
    { value: 22, label: "deliberate_v3" },
    { value: 23, label: "dreamlike-anime-1.0" },
    { value: 24, label: "dreamlike-diffusion-1.0" },
    { value: 25, label: "dreamlike-photoreal-2.0" },
    { value: 26, label: "dreamshaper_6BakedVae" },
    { value: 27, label: "dreamshaper_7" },
    { value: 28, label: "dreamshaper_8" },
    { value: 29, label: "edgeOfRealism_eorV20" },
    { value: 30, label: "EimisAnimeDiffusion_V1" },
    { value: 31, label: "elldreths-vivid-mix" },
    { value: 32, label: "epicphotogasm_xPlusPlus" },
    { value: 33, label: "epicrealism_naturalSinRC1VAE" },
    { value: 34, label: "epicrealism_pureEvolutionV3" },
    { value: 35, label: "ICantBelieveItsNotPhotography_seco" },
    { value: 36, label: "indigoFurryMix_v75Hybrid" },
    { value: 37, label: "juggernaut_aftermath" },
    { value: 38, label: "lofi_v4" },
    { value: 39, label: "lyriel_v16" },
    { value: 40, label: "majicmixRealistic_v4" },
    { value: 41, label: "mechamix_v10" },
    { value: 42, label: "meinamix_meinaV9" },
    { value: 43, label: "meinamix_meinaV11" },
    { value: 44, label: "neverendingDream_v122" },
    { value: 45, label: "openjourney_V4" },
    { value: 46, label: "pastelMixStylizedAnime_pruned_fp16" },
    { value: 47, label: "portraitplus_V1.0" },
    { value: 48, label: "protogenx34" },
    { value: 49, label: "Realistic_Vision_V1.4-pruned-fp16" },
    { value: 50, label: "Realistic_Vision_V2.0" },
    { value: 51, label: "Realistic_Vision_V4.0" },
    { value: 52, label: "Realistic_Vision_V5.0" },
    { value: 53, label: "Realistic_Vision_V5.1" },
    { value: 54, label: "redshift_diffusion-V10" },
    { value: 55, label: "revAnimated_v122" },
    { value: 56, label: "rundiffusionFX25D_v10" },
    { value: 57, label: "rundiffusionFX_v10" },
    { value: 58, label: "sdv1_4" },
    { value: 59, label: "v1-5-pruned-emaonly" },
    { value: 60, label: "v1-5-inpainting" },
    { value: 61, label: "shoninsBeautiful_v10" },
    { value: 62, label: "theallys-mix-ii-churned" },
    { value: 63, label: "timeless-1.0" },
    { value: 64, label: "toonyou_beta6" },
]

interface OptionProps {
    value: number;
    label: string;
    onClick: (value: number) => void;
}

interface SelectProps {
    children: React.ReactNode;
    isOpen: boolean;
}

interface Props {
    onChange: (v: number) => void;
    value?: number;
}

const Option: React.FC<OptionProps> = ({ value, label, onClick }) => {
    return (
        <div
            className='text-blue-950 h-6 w-full hover:cursor-pointer hover:bg-blue-400 hover:text-white pl-2 pr-2'
            id={`opt-${value}`}
            onClick={() => onClick(value)}
        >
            {label}
        </div>
    );
}

const Select: React.FC<SelectProps> = ({ children, isOpen }) => {
    if (!isOpen) return null;
    return (
        <div className='max-h-dvh absolute z-10 overflow-hidden overflow-y-scroll w-full p-2 bg-white'>
            {children}
        </div>
    );
}

export const SelectModel: React.FC<Props> = ({ onChange, value = 3 }) => {
    const [search, setSearch] = useState('');
    const [isOpen, setIsOpen] = useState(false);

    useEffect(() => {
        setSearch(MODEL_LIST.find(m => m.value === value)?.label || '');
    }, [value]);

    return (
        <div className='relative w-full sm:w-1/2 m-auto mb-3 '>
            <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                onFocus={() => setIsOpen(true)}
                onBlur={() => setTimeout(() => setIsOpen(false), 100)}
            />
            {Boolean(search.length) && <button
                type="button"
                className='w-fit max-w-3 max-h-3  bg-gray-50 text-blue-900 absolute top-2 right-2 m-0 rounded-full p-3'
                onClick={() => {
                    setSearch('');
                }}
            >
                X
            </button>}
            <Select isOpen={isOpen}>
                {MODEL_LIST.filter(model => model.label.toLowerCase().includes(search.toLowerCase())).map((model) => (
                    <Option
                        key={model.value}
                        value={model.value}
                        label={model.label}
                        onClick={(value) => {
                            onChange(value);
                            setSearch(MODEL_LIST.find(m => m.value === value)?.label || '');
                            setIsOpen(false);
                        }}
                    />
                ))}
            </Select>
        </div>
    );
}