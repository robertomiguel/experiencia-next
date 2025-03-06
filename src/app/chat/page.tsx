'use client';

import { useState, useRef, useCallback, useEffect } from 'react';

const Chat = () => {
  const [apiKey, setApiKey] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string }[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const sendMessage = useCallback(async () => {
    if (!input.trim() || !apiKey.trim()) return;

    const newMessage = { role: 'user', content: input };
    const updatedMessages: any = [...messages, newMessage];
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
      if (data.choices) {
        setMessages([...updatedMessages, { role: 'assistant', content: data.choices[0].message.content }]);
      }
    } catch (error) {
      console.error('Error fetching AI response:', error);
    }
    setLoading(false);
  }, [input, messages, apiKey]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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
          <div key={index} className={`mb-2 p-2 rounded ${msg.role === 'user' ? 'bg-blue-200' : 'bg-gray-200'}`}>{msg.content}</div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <div className="mt-2 flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          className="flex-1 p-2 border rounded"
          placeholder="Escribe un mensaje..."
        />
        <button onClick={sendMessage} className="p-2 bg-blue-500 text-white rounded" disabled={loading}>
          {loading ? 'Enviando...' : 'Enviar'}
        </button>
      </div>
    </div>
  );
};

export default Chat;
