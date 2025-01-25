import { useSettingsStore } from "@/store/useSettingsStore";
import { useEffect, useRef, useState } from "react";

interface ChatProps {
  onChange: (params: any) => void;
  value: any;
}

export const ChatOptions = ({ onChange, value }: ChatProps) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const [chatRole, setChatRole] = useState<string>(value.chatRole);

  const toogleSidesheet = useSettingsStore((state) => state.toogleSidesheet);

  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = "auto";
      const newHeight = Math.min(textarea.scrollHeight, 500);
      textarea.style.height = `${newHeight}px`;
    }
  };

  const handleSave = () => {
    onChange({ chatRole });
    toogleSidesheet(false);
  };

  useEffect(() => {
    adjustTextareaHeight();
  }, [chatRole]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col bg-blue-800 gap-2 rounded-e-lg text-center p-4">
        <div>Chat personality</div>
        <textarea
          ref={textareaRef}
          value={chatRole}
          onChange={(e) => {
            setChatRole(e.target.value);
            adjustTextareaHeight();
          }}
          className="w-full p-2 border rounded h-auto resize-none overflow-auto"
          style={{ maxHeight: "500px" }}
        />
      </div>
      <div>
        <button onClick={handleSave}>Save</button>
      </div>
    </div>
  );
};
