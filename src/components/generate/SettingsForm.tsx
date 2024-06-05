'use client'
import { Select } from "../common/Select";
import { ImageSettings } from "@/types/settings";
import { useSettingsStore } from "@/store/useSettingsStore";
import { useSchemaImageStore } from "@/store/useSchemaImageStore";

interface SettingsProps {
    generate: (prompt: string, modelId?: number) => void
}

const formFields = [
{
    value: 'model',
    list: 'modelList',
    label: 'Model',
},
{
    value: 'dancer',
    list: 'dancerStyles',
    label: 'Dancer style',
},
{
    value: 'background',
    list: 'backgrounds',
    label: 'Background',
},
{
    value: 'hairColor',
    list: 'hairColors',
    label: 'Hair color',
},
{
    value: 'hairStyle',
    list: 'hairStyles',
    label: 'Hair style',
},
{
    value: 'hairLength',
    list: 'hairLengths',
    label: 'Hair length',
},
{
    value: 'eyeColor',
    list: 'eyeColors',
    label: 'Eye color',
},
{
    value: 'gender',
    list: 'genderList',
    label: 'Gender',
},
{
    value: 'ethnicGroup',
    list: 'ethnicGroups',
    label: 'Ethnic',
}]

export const SettingsForm = ({ generate }: SettingsProps) => {

    const schemaImage = useSchemaImageStore(state => state.list)

    const formValues = useSettingsStore(state => state?.image)
    const setSettings = useSettingsStore(state => state.updateSettings)

    const updateForm = (key: string, value: string) => {
        const newFormValues = { ...formValues, [key]: value }
        const newPrompt = `A ${
            newFormValues.age}-year-old ${
            newFormValues.gender} ${
            newFormValues.ethnicGroup} ${
            newFormValues.dancer} with ${
            newFormValues.hairLength} ${
            newFormValues.hairColor} ${
            newFormValues.hairStyle} hair and ${
            newFormValues.eyeColor} eyes, standing in front of a ${
            newFormValues.background}.`;
            
        setSettings({...newFormValues, prompt: newPrompt})
    }

    const handleCreatePrompt = () => generate(formValues.prompt , formValues.model)

    return (
        <div className="flex flex-col gap-4" >

            { window.location.href.includes('prompt') &&
                <textarea
                    value={formValues.prompt}
                    onChange={e => setSettings({ ...formValues, prompt: e.target.value })}
                    placeholder="Prompt"
                    className="w-full h-20 p-2 bg-blue-100"
                />
            }

            {
                formFields.map((field, i) => (
                    <Select
                        key={i}
                        value={formValues[field.value as keyof ImageSettings]}
                        options={schemaImage[field.list as keyof typeof schemaImage]}
                        onChange={value => updateForm(field.value, value)}
                        label={field.label}
                    />
                ))
            }

            <div>
                <h5>({formValues.age}) Year-old</h5>
                <input type="range" min="1" max="100" step="1" value={formValues.age} onChange={e => updateForm('age', e.target.value )} />
            </div>

            <div className="sticky bottom-0 bg-blue-900 pb-2 pt-2" >
                <button onClick={() => handleCreatePrompt()} >Generate image</button>
            </div>

        </div>
    )
}