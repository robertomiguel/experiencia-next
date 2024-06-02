'use client'
import { useState } from "react"
import { Select } from "../common/Select";
import { useAppDispatch, useAppSelector } from "@/store";
import { setImageSettings } from "@/store/settingsSlice";

interface SettingsProps {
    generate: (prompt: string, modelId?: number) => void
}

export const SettingsForm = ({ generate }: SettingsProps) => {

    const dispatch = useAppDispatch()
    const imgSettings = useAppSelector(state => state.settings.image)
    const schemaImage = useAppSelector(state => state.schemaImage)

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
                <Select onChange={v => setModelValue(v)} value={modelValue} options={schemaImage.modelList} />
            </div>

            <div>
                <h5>Dance style</h5>
                <Select onChange={v => setDancer(v)} value={dancer} options={schemaImage.dancerStyles} />
            </div>

            <div>
                <h5>Background</h5>
                <Select onChange={v => setBackground(v)} value={background} options={schemaImage.backgrounds} />
            </div>

            <div>
                <h5>Hair color</h5>
                <Select onChange={v => setHairColor(v)} value={hairColor} options={schemaImage.hairColors} />
            </div>

            <div>
                <h5>Hair style</h5>
                <Select onChange={v => setHairStyle(v)} value={hairStyle} options={schemaImage.hairStyles} />
            </div>

            <div>
                <h5>Hair length</h5>
                <Select onChange={v => setHairLength(v)} value={hairLength} options={schemaImage.hairLengths} />
            </div>

            <div>
                <h5>Eyes color</h5>
                <Select onChange={v => setEyeColor(v)} value={eyeColor} options={schemaImage.eyeColors} />
            </div>

            <div>
                <h5>Gender</h5>
                <Select onChange={v => setGender(v)} value={gender} options={schemaImage.genderList} />
            </div>

            <div>
                <h5>({age}) Year-old</h5>
                <input type="range" min="1" max="100" step="1" value={age} onChange={e => setAge(parseInt(e.target.value))} />
            </div>

            <div>
                <h5>Ethnic</h5>
                <Select onChange={v => setEthnicGroup(v)} value={ethnicGroup} options={schemaImage.ethnicGroups} />
            </div>

            <div className="flex gap-3" >
                <button onClick={() => handleCreatePrompt()} >Generate image</button>
            </div>

        </div>
    )
}