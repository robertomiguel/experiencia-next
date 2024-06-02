'use client'

import { useState } from "react"
import { SelectModel } from "./SelectModel"
import { Select } from "../common/Select";
import { useAppDispatch, useAppSelector } from "@/store";
import { setImageSettings } from "@/store/settingsSlice";

/* TODO: Mover a la DB las opciones */

const hairColors = [
    {
        label: "Negro",
        value: "Black",
    },
    {
        label: "Castaño Oscuro",
        value: "Dark Brown",
    },
    {
        label: "Castaño",
        value: "Brown",
    },
    {
        label: "Rubio Oscuro",
        value: "Dark Blonde",
    },
    {
        label: "Rubio",
        value: "Blonde",
    },
    {
        label: "Rubio Platino",
        value: "Platinum Blonde",
    },
    {
        label: "Pelirrojo",
        value: "Redhead",
    },
    {
        label: "Gris",
        value: "Gray",
    },
];

const hairStyles = [
    {
        label: "Liso",
        value: "Straight"
    },
    {
        label: "Ondulado",
        value: "Wavy"
    },
    {
        label: "Rizado",
        value: "Curly"
    },
    {
        label: "Afro",
        value: "Afro"
    },
    {
        label: "Rastas",
        value: "Dreadlocks"
    },
    {
        label: "Trenzas",
        value: "Braids"
    },
    {
        label: "Cola de caballo",
        value: "Ponytail"
    },
    {
        label: "Moño",
        value: "Bun"
    },
];

const hairLengths = [
    {
        label: "Corto",
        value: "Short"
    },
    {
        label: "Mediano",
        value: "Medium"
    },
    {
        label: "Largo",
        value: "Long"
    },
    {
        label: "Calvo",
        value: "Bald"
    },
];

const eyeColors = [
    {
        label: "Marrón",
        value: "Brown"
    },
    {
        label: "Negro",
        value: "Black"
    },
    {
        label: "Azul",
        value: "Blue"
    },
    {
        label: "Verde",
        value: "Green"
    },
    {
        label: "Gris",
        value: "Gray"
    },
    {
        label: "Avellana",
        value: "Hazel"
    },
    {
        label: 'Claros',
        value: 'Light'
    },
];

const ethnicGroups = [
    {
        label: "Caucásico",
        value: "Caucasian"
    },
    {
        label: "Mongoloide",
        value: "Mongoloid"
    },
    {
        label: "Asiático",
        value: "Asian"
    },
    {
        label: "Negroide",
        value: "Negroid"
    },
    {
        label: "Africano",
        value: "African"
    },
    {
        label: "Amerindio",
        value: "Amerindian"
    },
    {
        label: "Nativo Americano",
        value: "Native American"
    },
    {
        label: "Australoide",
        value: "Australoid"
    },
    {
        label: "Indígenas de América Latina",
        value: "Indigenous Peoples of Latin America"
    },
    {
        label: "Árabe",
        value: "Arab"
    },
    {
        label: "Medio Oriental",
        value: "Middle Eastern"
    },
    {
        label: "Hindú",
        value: "Hindu"
    },
    {
        label: "del subcontinente indio",
        value: "from the Indian subcontinent"
    },
    {
        label: "Europeo del Este",
        value: "Eastern European"
    },
    {
        label: "Sureste Asiático",
        value: "Southeast Asian"
    }
];

const dancerStyle = [
    {
        label: "Clásica",
        value: "Classical dancer"
    },
    {
        label: "Contemporánea",
        value: "Contemporary dancer"
    },
    {
        label: "Ballet",
        value: "Ballet dancer"
    },
    {
        label: "Danza moderna",
        value: "Modern dance dancer"
    },
    {
        label: "Salsa",
        value: "Salsa dancer"
    },
    {
        label: "Flamenco",
        value: "Flamenco dancer"
    },
    {
        label: "Hip-hop",
        value: "Hip-hop dancer"
    },
    {
        label: "Danza del vientre",
        value: "Belly dancer"
    },
    {
        label: "Tango",
        value: "Tango dancer"
    },
    {
        label: "Jazz",
        value: "Jazz dancer"
    },
    {
        label: "Tap",
        value: "Tap dancer"
    },
    {
        label: "Breakdance",
        value: "Breakdancer"
    },
    {
        label: "Folklórica",
        value: "Folk dancer"
    },
    {
        label: "Danza irlandesa",
        value: "Irish dance dancer"
    }
];

const backgrounds = [
    {
        label: "Escenario",
        value: "Stage"
    },
    {
        label: "Telón de fondo blanco",
        value: "White backdrop"
    },
    {
        label: "Telón de fondo negro",
        value: "Black backdrop"
    },
    {
        label: "Ciudad urbana",
        value: "Urban city"
    },
    {
        label: "Naturaleza",
        value: "Nature"
    },
    {
        label: "Playa",
        value: "Beach"
    },
    {
        label: "Estudio de danza",
        value: "Dance studio"
    },
    {
        label: "Ciudad nocturna",
        value: "Night city"
    }
];

const genderList = [
    {
        label: 'Femenino',
        value: 'female',
    },
    {
        label: 'Masculino',
        value: 'male',
    },
    {
        label: 'No binario',
        value: 'no binary',
    }
]


interface SettingsProps {
    generate: (prompt: string, modelId?: number) => void
}

export const SettingsForm = ({ generate }: SettingsProps) => {

    const dispatch = useAppDispatch()
    const imgSettings = useAppSelector(state => state.settings.image)

    const [modelValue, setModelValue] = useState<number>(imgSettings?.model || 3)

    const [hairColor, setHairColor] = useState<string>(imgSettings?.hairColor || "Brown")
    const [gender, setGender] = useState(imgSettings?.gender || 'female')
    const [age, setAge] = useState<number>(imgSettings?.age || 20)
    const [eyeColor, setEyeColor] = useState<string>(imgSettings?.eyeColor || "Brown")
    const [ethnicGroup, setEthnicGroup] = useState<string>(imgSettings?.ethnicGroup || "Caucasian")
    const [dancer, setDancer] = useState<string>(imgSettings?.dancer || "Ballet dancer")
    const [background, setBackground] = useState<string>(imgSettings?.background || "Stage")
    const [hairStyle, setHairStyle] = useState<string>(imgSettings?.hairStyle || "Straight")
    const [hairLength, setHairLength] = useState<string>(imgSettings?.hairLength || "Medium")

    const handleCreatePrompt = () => {
        
        const newPrompt = `A ${age}-year-old ${gender} ${ethnicGroup} dancer with ${hairLength} ${hairColor} ${hairStyle} hair and ${eyeColor} eyes, standing in front of a ${background}.`;

        dispatch(setImageSettings({
            prompt: newPrompt,
            model: modelValue,
            hairColor,
            hairLength,
            hairStyle,
            eyeColor,
            age,
            gender,
            ethnicGroup,
            dancer,
            background
        }))
        generate(newPrompt, modelValue)
    }

    return (
        <div className="flex flex-col gap-4" >
            <div>
                <h5>Model engine</h5>
                <SelectModel onChange={v => setModelValue(v)} value={modelValue} />
            </div>

            <div>
                <h5>Dance style</h5>
                <Select onChange={v => setDancer(v)} value={dancer} options={dancerStyle} />
            </div>

            <div>
                <h5>Background</h5>
                <Select onChange={v => setBackground(v)} value={background} options={backgrounds} />
            </div>

            <div>
                <h5>Hair color</h5>
                <Select onChange={v => setHairColor(v)} value={hairColor} options={hairColors} />
            </div>

            <div>
                <h5>Hair style</h5>
                <Select onChange={v => setHairStyle(v)} value={hairStyle} options={hairStyles} />
            </div>

            <div>
                <h5>Hair length</h5>
                <Select onChange={v => setHairLength(v)} value={hairLength} options={hairLengths} />
            </div>

            <div>
                <h5>Eyes color</h5>
                <Select onChange={v => setEyeColor(v)} value={eyeColor} options={eyeColors} />
            </div>

            <div>
                <h5>Gender</h5>
                <Select onChange={v => setGender(v)} value={gender} options={genderList} />
            </div>

            <div>
                <h5>({age}) Year-old</h5>
                <input type="range" min="1" max="100" step="1" value={age} onChange={e => setAge(parseInt(e.target.value))} />
            </div>

            <div>
                <h5>Ethnic</h5>
                <Select onChange={v => setEthnicGroup(v)} value={ethnicGroup} options={ethnicGroups} />
            </div>

            <div className="flex gap-3" >
                <button onClick={() => handleCreatePrompt()} >Generate image</button>
            </div>

        </div>
    )
}