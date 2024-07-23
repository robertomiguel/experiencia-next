import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect, useRef, useState } from "react";

interface ChatProps {
    onChange: (params: any) => void
    value: any
}

export const ChatOptions = ({ onChange, value }: ChatProps) => {
    const textareaRef = useRef<HTMLTextAreaElement>(null);
    const [chatModel, setChatModel] = useState<number | null>(value.chatModel);
    const [chatRole, setChatRole] = useState<string>(value.chatRole);

    const toogleSidesheet = useSettingsStore(state => state.toogleSidesheet)

    const adjustTextareaHeight = () => {
        const textarea = textareaRef.current;
        if (textarea) {
            textarea.style.height = 'auto';
            const newHeight = Math.min(textarea.scrollHeight, 500);
            textarea.style.height = `${newHeight}px`;
        }
    };

    const handleSave = () => {
        onChange({ chatModel, chatRole })
        toogleSidesheet(false)
    }

    useEffect(() => {
        adjustTextareaHeight();
    }, [chatRole]);

    return (
        <div className="flex flex-col gap-4">
            <div className="flex flex-col bg-blue-800 gap-2 rounded-e-lg text-center p-4">
                <label>Versión de chat</label>
                <div className="flex flex-row">
                    <div className="flex flex-row gap-2 w-1/2 text-nowrap justify-center items-center">
                        <div>
                            <input
                                type="radio"
                                id="chat1"
                                name="chat"
                                value="1"
                                checked={chatModel === 1}
                                onChange={() => setChatModel(1)}
                            />
                            <label htmlFor="chat1">GPT 3</label>
                        </div>
                    </div>
                    <div className="flex flex-row gap-2 w-1/2 text-nowrap justify-center items-center">
                        <div>
                            <input
                                type="radio"
                                id="chat2"
                                name="chat"
                                value="4"
                                checked={chatModel === 4}
                                onChange={() => setChatModel(4)}
                            />
                            <label htmlFor="chat2">GPT 4</label>
                        </div>
                    </div>
                </div>
            </div>
            <div className="flex flex-col bg-blue-800 gap-2 rounded-e-lg text-center p-4">
                <label>Chat personality</label>
                <textarea
                    ref={textareaRef}
                    value={chatRole}
                    onChange={(e) => {
                        setChatRole(e.target.value);
                        adjustTextareaHeight();
                    }}
                    className="w-full p-2 border rounded h-auto resize-none overflow-auto"
                    style={{ maxHeight: '500px' }}
                />
            </div>
            <div>
                <button onClick={handleSave} >
                    Save
                </button>
            </div>
        </div>
    );
}