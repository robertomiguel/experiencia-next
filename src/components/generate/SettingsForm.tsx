'use client'

import { useState } from "react"
import { SelectModel } from "./SelectModel"


interface SettingsProps {
    generate: (prompt: string, modelId?: number) => void
    prompt: string
    model: number
}

export const SettingsForm = ({ generate, model, prompt }: SettingsProps) => {

    const [modelValue, setModelValue] = useState<number>(model)
    const [promptValue, setPromptValue] = useState<string>(prompt)

    return (
        <div className="flex flex-col gap-4" >
            <div>
                <h4>Prompt</h4>
                <textarea
                    value={promptValue}
                    onChange={e => setPromptValue(e.target.value)}
                    maxLength={1000}
                    rows={5}
                    placeholder="Write a prompt here..."
                />
            </div>
            <div>
                <h4>Model</h4>
                <SelectModel onChange={v => setModelValue(v)} value={modelValue} />
            </div>
            <div>
                <button onClick={() => generate(promptValue, modelValue)}>Generate</button>
            </div>
        </div>
    )
}