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
        label: "Negro Corto",
        value: "Short Black",
    },
    {
        label: "Negro Largo",
        value: "Long Black",
    },
    {
        label: "Castaño Oscuro",
        value: "Dark Brown",
    },
    {
        label: "Castaño Oscuro Corto",
        value: "Short Dark Brown",
    },
    {
        label: "Castaño Oscuro Largo",
        value: "Long Dark Brown",
    },
    {
        label: "Castaño",
        value: "Brown",
    },
    {
        label: "Castaño Corto",
        value: "Short Brown",
    },
    {
        label: "Castaño Largo",
        value: "Long Brown",
    },
    {
        label: "Rubio Oscuro",
        value: "Dark Blonde",
    },
    {
        label: "Rubio Oscuro Corto",
        value: "Short Dark Blonde",
    },
    {
        label: "Rubio Oscuro Largo",
        value: "Long Dark Blonde",
    },
    {
        label: "Rubio",
        value: "Blonde",
    },
    {
        label: "Rubio Corto",
        value: "Short Blonde",
    },
    {
        label: "Rubio Largo",
        value: "Long Blonde",
    },
    {
        label: "Rubio Platino",
        value: "Platinum Blonde",
    },
    {
        label: "Rubio Platino Corto",
        value: "Short Platinum Blonde",
    },
    {
        label: "Rubio Platino Largo",
        value: "Long Platinum Blonde",
    },
    {
        label: "Pelirrojo",
        value: "Redhead",
    },
    {
        label: "Pelirrojo Corto",
        value: "Short Redhead",
    },
    {
        label: "Pelirrojo Largo",
        value: "Long Redhead",
    },
    {
        label: "Gris",
        value: "Gray",
    },
    {
        label: "Gris Corto",
        value: "Short Gray",
    },
    {
        label: "Gris Largo",
        value: "Long Gray",
    },
    {
        label: "Sin Pelo",
        value: "Bald"
    }
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

const genderLiat = [
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

    const handleCreatePrompt = () => {
        let genderType = ''

        if ( age < 5 ) genderType = 'infant'
        if ( age >= 5 && age < 10 ) genderType = 'child'
        if ( age >= 10 && age < 13 ) genderType = 'pre-teen'
        if ( age >= 13 && age < 18 ) genderType = 'teenager'
        if ( age >= 18 && age < 30 ) genderType = 'young adult'
        if ( age >= 30 && age < 60 ) genderType = 'adult'
        if ( age >= 60 ) genderType = 'elderly'
        

        const newPrompt = `A ${age} year-old ${genderType} ${gender} ${ethnicGroup} ${dancer} with ${hairColor} hair and ${eyeColor} eyes in front of ${background}.`;
        dispatch(setImageSettings({
            prompt: newPrompt,
            model: modelValue,
            hairColor,
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
                <h5>Eyes color</h5>
                <Select onChange={v => setEyeColor(v)} value={eyeColor} options={eyeColors} />
            </div>

            <div>
                <h5>Gender</h5>
                <Select onChange={v => setGender(v)} value={gender} options={genderLiat} />
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