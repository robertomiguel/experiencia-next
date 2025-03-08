/* eslint-disable @next/next/no-img-element */
'use client';

import { useState, useRef, useCallback, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const Chat = () => {
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !apiKey.trim()) return;
    setError(null);
    const newMessage = { role: 'user', content: input };
    const updatedMessages = [...messages, newMessage];
    setMessages(updatedMessages);
    setInput('');
    setLoading(true);

    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
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
        setMessages([...updatedMessages, { role: 'assistant', content: data.choices[0].message.content }]);
      }
    } catch (error) {
      setError('Error fetching AI response.');
      console.error('Error fetching AI response:', error);
    }
    setLoading(false);
  }, [input, messages, apiKey]);

  const generateImage = useCallback(async () => {
    if (!input.trim() || !apiKey.trim()) return;
    setLoading(true);
    setImageUrl(null);
    setError(null);

    try {
      const response = await fetch('https://api.openai.com/v1/images/generations', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'dall-e-2',
          prompt: input,
          n: 1,
          size: '256x256',
        }),
      });

      const data = await response.json();
      if (data.error) {
        setError(data.error.message);
      } else if (data.data && data.data.length > 0) {
        setImageUrl(data.data[0].url);
      }
    } catch (error) {
      setError('Error generating image.');
      console.error('Error generating image:', error);
    }
    setLoading(false);
  }, [input, apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, imageUrl]);

  const renderMessageContent = (content: string) => {
    const parts = content.split(/(```[a-zA-Z]*\n?|```)/g);
    return parts.map((part, index) => {
      if (part.startsWith('```')) return null;
      if (parts[index - 1]?.startsWith('```')) {
        return (
          <SyntaxHighlighter key={index} language="javascript" style={atomDark}>
            {part.trim()}
          </SyntaxHighlighter>
        );
      }
      return <p key={index}>{part}</p>;
    });
  };

  return (
    <div className="flex flex-col max-w-xl mx-auto p-4 border rounded-lg shadow-lg h-[80vh]">
      <input
        type="password"
        placeholder="API Key"
        value={apiKey}
        onChange={(e) => setApiKey(e.target.value)}
        className="mb-2 p-2 border rounded w-full"
      />
      <div className="flex-1 overflow-y-auto border p-2 rounded bg-gray-50">
        {messages.map((msg, index) => (
          <div key={index} className={`mb-2 p-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>
            {renderMessageContent(msg.content)}
          </div>
        ))}
        {imageUrl && <img src={imageUrl} alt="Generated" className="mt-2 mx-auto" />}
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Escribe un mensaje o descripción de imagen..."
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
        <button onClick={generateImage} className="p-2 bg-green-500 text-white rounded" disabled={loading}>
          {loading ? 'Generando...' : 'Imagen'}
        </button>
      </div>
    </div>
  );
};

export default Chat;
