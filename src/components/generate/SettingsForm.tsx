'use client'

import { useEffect, useState } from "react"
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

const ageOptions = [
    {
        label: "Infante femenino",
        value: "Female infant"
    },
    {
        label: "Infante masculino",
        value: "Male infant"
    },
    {
        label: "Niña",
        value: "Girl"
    },
    {
        label: "Niño",
        value: "Boy"
    },
    {
        label: "Preadolescente femenino",
        value: "Pre-teen girl"
    },
    {
        label: "Preadolescente masculino",
        value: "Pre-teen boy"
    },
    {
        label: "Adolescente femenino",
        value: "Female teenager"
    },
    {
        label: "Adolescente masculino",
        value: "Male teenager"
    },
    {
        label: "Joven Adulta",
        value: "Young adult female"
    },
    {
        label: "Joven Adulto",
        value: "Young adult male"
    },
    {
        label: "Madura",
        value: "Mature woman"
    },
    {
        label: "Maduro",
        value: "Mature man"
    },
    {
        label: "Anciana",
        value: "Elderly woman"
    },
    {
        label: "Anciano",
        value: "Elderly man"
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


interface SettingsProps {
    generate: (prompt: string, modelId?: number) => void
    prompt: string
    model: number
}

export const SettingsForm = ({ generate, model, prompt }: SettingsProps) => {

    const dispatch = useAppDispatch()
    const imgSettings = useAppSelector(state => state.settings.image)

    const [modelValue, setModelValue] = useState<number>(imgSettings?.model || model)
    const [promptValue, setPromptValue] = useState<string>(imgSettings?.prompt || prompt || '')

    const [hairColor, setHairColor] = useState<string>(imgSettings?.hairColor || "Brown")
    const [age, setAge] = useState<string>(imgSettings?.age || "Young adult female")
    const [eyeColor, setEyeColor] = useState<string>(imgSettings?.eyeColor || "Brown")
    const [ethnicGroup, setEthnicGroup] = useState<string>(imgSettings?.ethnicGroup || "Caucasian")
    const [dancer, setDancer] = useState<string>(imgSettings?.dancer || "Ballet dancer")
    const [background, setBackground] = useState<string>(imgSettings?.background || "Stage")

    const handleCreatePrompt = (gen?: boolean) => {
        const newPrompt = `A ${age} ${ethnicGroup} ${dancer} with ${hairColor} hair and ${eyeColor} eyes in front of ${background}.`;
        setPromptValue(newPrompt)
        dispatch(setImageSettings({
            prompt: newPrompt,
            model: modelValue,
            hairColor,
            eyeColor,
            age,
            ethnicGroup,
            dancer,
            background
        }))
        if (gen) {
            generate(newPrompt, modelValue)
        }
    }

    useEffect(() => {
        if (prompt.trim() === "") handleCreatePrompt()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [prompt])

    return (
        <div className="flex flex-col gap-4" >
            <div>
                <h5>Prompt</h5>
                <textarea
                    value={promptValue}
                    onChange={e => setPromptValue(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    placeholder="Write a prompt here..."
                />
            </div>
            <div>
                <h5>Model</h5>
                <SelectModel onChange={v => setModelValue(v)} value={modelValue} />
            </div>
            <div>
                <button onClick={() => generate(promptValue, modelValue)}>Generate</button>
            </div>

            <div>
                <h5>Estilo de baile</h5>
                <Select onChange={v => setDancer(v)} value={dancer} options={dancerStyle} />
            </div>

            <div>
                <h5>Fondo</h5>
                <Select onChange={v => setBackground(v)} value={background} options={backgrounds} />
            </div>

            <div>
                <h5>Selección de color de pelo</h5>
                <Select onChange={v => setHairColor(v)} value={hairColor} options={hairColors} />
            </div>

            <div>
                <h5>Selección de color de ojos</h5>
                <Select onChange={v => setEyeColor(v)} value={eyeColor} options={eyeColors} />
            </div>

            <div>
                <h5>Edad</h5>
                <Select onChange={v => setAge(v)} value={age} options={ageOptions} />
            </div>

            <div>
                <h5>Étnia</h5>
                <Select onChange={v => setEthnicGroup(v)} value={ethnicGroup} options={ethnicGroups} />
            </div>

            <div className="flex gap-3" >
                <button onClick={() => handleCreatePrompt()} >Create prompt</button>
                <button onClick={() => handleCreatePrompt(true)} >Generate with new prompt</button>
            </div>

        </div>
    )
}