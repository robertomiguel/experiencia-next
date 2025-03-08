/* eslint-disable @next/next/no-img-element */
'use client';
import { useState, useRef, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getBase64 } from './getBase64';

interface Message {
  role: string
  content: string;
}

const Chat = () => {
  const apiKeyRef = useRef('');
  const inputRef = useRef('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = useCallback(async () => {
    if (!inputRef.current.trim() || !apiKeyRef.current.trim()) return;
    setError(null);
    const newMessage = { role: 'user', content: inputRef.current };
    const updatedMessages: any = [...messages.filter(f => f.role !== 'image'), newMessage];
    setMessages(updatedMessages);
    inputRef.current = '';
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKeyRef.current}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: updatedMessages,
          max_tokens: 100,
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error.message);
      } else if (data.choices) {
        setMessages([
          ...messages,
          newMessage,
          { role: 'assistant', content: data.choices[0].message.content }
        ]);
      }
    } catch (error) {
      setError('Error fetching AI response.');
      console.error('Error fetching AI response:', error);
    }
    setLoading(false);
  }, [messages]);  

  const generateImage = useCallback(async () => {
    if (!inputRef.current.trim() || !apiKeyRef.current.trim()) return;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKeyRef.current}`,
        },
        body: JSON.stringify({
          model: 'dall-e-2',
          prompt: inputRef.current,
          n: 1,
          size: '256x256',
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error.message);
      } else if (data.data && data.data.length > 0) {
        const base64Image = await getBase64(data.data[0].url);
        setMessages(prevMessages => [...prevMessages, { role: "image", content: base64Image }]);
      }
    } catch (error) {
      setError('Error generating image.');
      console.error('Error generating image:', error);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const renderMessageContent = (content: string) => {
    const regex = /```(\w+)?\n([\s\S]*?)```/g;
    const elements = [];
    let lastIndex = 0;
    let match;

    while ((match = regex.exec(content)) !== null) {
      if (match.index > lastIndex) {
        elements.push(<p key={lastIndex}>{content.slice(lastIndex, match.index)}</p>);
      }
      elements.push(
        <SyntaxHighlighter key={match.index} language={match[1] || 'plaintext'} style={atomDark}>
          {match[2].trim()}
        </SyntaxHighlighter>
      );
      lastIndex = regex.lastIndex;
    }
    if (lastIndex < content.length) {
      elements.push(<p key={lastIndex}>{content.slice(lastIndex)}</p>);
    }
    return elements;
  };

  return (
    <div className="flex flex-col p-4 border rounded-lg shadow-lg h-[80vh]">
      <input
        type="password"
        placeholder="API Key"
        onChange={(e) => (apiKeyRef.current = e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <div className="flex-1 overflow-y-auto border p-2 rounded bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {msg.role !== 'image' && renderMessageContent(msg.content)}
            {msg.role === 'image' && <img src={msg.content} alt="Generated" className="mx-auto" />}
          </div>
        ))}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          onChange={(e) => (inputRef.current = e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Escribe un mensaje o descripción de imagen..."
        />
        <div className="flex gap-2">
          <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded" disabled={loading}>
            {loading ? 'Enviando...' : 'Enviar'}
          </button>
          <button onClick={generateImage} className="p-2 bg-green-500 text-white rounded" disabled={loading}>
            {loading ? 'Generando...' : 'Imagen'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
