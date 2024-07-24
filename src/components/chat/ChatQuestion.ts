'use server'
import axios from 'axios';

interface ChatProps {
  chatHistory: any[]
  model?: number | null
  chatRole: string
}

export const ChatQuestion = async ({ chatHistory, model, chatRole }: ChatProps ) => {

    const data: any = {
      chatGPTParams: {
        messages: [
          {
            role: "system",
            content: chatRole || '',
          },
          ...chatHistory,
        ],
        temperature: 0.7,
        top_p: null
      }
    };

    if (model === 4) data.chatGPTParams.model = "gpt-4o-2024-05-13";

    const config = {
      method: 'post',
      url: process.env.PRIVATE_CHAT_IA,
      headers: {
        'accept': 'text/event-stream, text/event-stream',
        'content-type': 'application/json',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
      },
      data
    };

    try {
        const res = await axios(config)

    const lines: any[] = res.data.split('\n').filter((line: any) => line.trim() !== '');
    const messages: any = [];

    lines.forEach(line => {
      try {
        const parsedLine = JSON.parse(line.replace('data: ', ''));
        messages.push(parsedLine);
      } catch {
        // Ignorar las líneas que no son JSON válidos
      }
    });

        return {
            origen: messages,
        }
    } catch (error) {
        console.error('Error:', error)
        return {
            origen: []
        }
        
    }
      
}

