'use client'
import { useState } from "react";
import { ChatQuestion } from "./ChatQuestion";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { FormSearchInput } from "../common/FormSearchInput";
import { ChatOptions } from "./ChatOptions";

export interface ChatHistory {
    role: "user" | "assistant";
    content: string;
}

export const ChatPrompt = () => {
    const [answerList, setAnswerList] = useState<string[]>([]);
    const [question, setQuestion] = useState('');
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [chatHistory, setChatHistory] = useState<ChatHistory[]>([]);
    const [chatModel, setChatModel] = useState<number | null>(4);
    const [chatRole, setChatRole] = useState<string>('');

    const sendQuestion = async () => {
        const user: ChatHistory = { role: "user", content: question };
        const res = await ChatQuestion({ chatHistory: [...chatHistory, user], model: chatModel, chatRole });
        setIsLoading(false);

        const messages: any[] = res.origen || [];
        let combinedMessage = '';

        messages.forEach(message => {
            const choices: any[] = message.choices || [];
            choices.forEach(choice => {
                if (choice.delta && choice.delta.content) {
                    combinedMessage += choice.delta.content;
                }
            });
        });

        setIsLoading(false);
        setAnswerList([combinedMessage, ...answerList]);
        setChatHistory(prev => (
            [...prev, user, { role: "assistant", content: combinedMessage }]
        ));        
    };

    const copyToClipboard = (id: string, e: any) => {
        e.preventDefault();
        const codeElement = document.getElementById(id);
        if (!codeElement) return;

        const range = document.createRange();
        range.selectNodeContents(codeElement);
        const selection = window.getSelection();

        if (!selection) return;

        if (selection.rangeCount > 0) selection.removeAllRanges();
        selection.addRange(range);

        try {
            document.execCommand('copy');
        } catch (err) {
            console.error('Error al copiar el texto: ', err);
        }

        selection.removeAllRanges();
    };

    return (
        <div className="p-2">
            <FormSearchInput
                placeholder="Escribe aquí..."
                value={question}
                onChange={(val: string) => setQuestion(val)}
                onSubmit={() => {
                    setIsLoading(true);
                    sendQuestion();
                }}
                disabled={isLoading}
                fullWidth
                filterContent={
                    <ChatOptions
                        value={{ chatModel, chatRole }}
                        onChange={(val: any) => {
                            setChatModel(val.chatModel);
                            setChatRole(val.chatRole);
                        }}
                    />
                }
                filterTitle="chat options"
            />
            <div className="flex flex-col gap-2 mt-2">
                {answerList.map((text, i) => {
                    return (
                        <div
                            key={i}
                            className="bg-[#0f1836] text-[#ffe6e6] p-5 text-lg rounded-lg"
                        >
                            <h4>ChatGPT:</h4>
                            <ReactMarkdown
                                components={{
                                    code({ node, inline, className, children, ...props }: any) {
                                        const match = /language-(\w+)/.exec(className || '');
                                        const uniqueId = `code-block-${i}-${node.position.start.line}`;
                                        return !inline && match ? (
                                            <div className="relative">
                                                <a onClick={(e) => copyToClipboard(uniqueId, e)}
                                                   className="absolute top-1 right-2 cursor-pointer text-blue-400">Copiar</a>
                                                <div id={uniqueId}>
                                                    <SyntaxHighlighter
                                                        style={atomDark}
                                                        language={match[1]}
                                                        PreTag="div"
                                                        {...props}
                                                    >
                                                        {String(children).replace(/\n$/, '')}
                                                    </SyntaxHighlighter>
                                                </div>
                                            </div>
                                        ) : (
                                            <code className={className} {...props}>
                                                {children}
                                            </code>
                                        );
                                    }
                                }}
                            >
                                {text}
                            </ReactMarkdown>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};
