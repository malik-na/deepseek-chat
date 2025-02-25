import dbConnect from '@/lib/db/mongoose';
import { Chat, IMessage } from '@/lib/models/Chat';
import { NextRequest } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { chatId, message } = await req.json();

    if (!message) {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Connect to MongoDB
    try {
      await dbConnect();
    } catch (error) {
      console.error('MongoDB Connection Error:', error);
      return new Response(JSON.stringify({ error: 'Database connection failed' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Get or create chat
    let chat;
    try {
      chat = chatId ? await Chat.findById(chatId) : new Chat();
      
      if (!chat) {
        chat = new Chat();
      }
    } catch (error) {
      console.error('Chat Creation Error:', error);
      return new Response(JSON.stringify({ error: 'Failed to create or retrieve chat' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // Add user message to chat history
    const userMessage: IMessage = {
      role: 'user',
      content: message,
      timestamp: new Date()
    };
    chat.messages.push(userMessage);

    // Prepare context for Ollama (last 5 messages)
    const contextMessages = chat.messages.slice(-5);
    
    // Stream the response
    const encoder = new TextEncoder();
    const stream = new TransformStream();
    const writer = stream.writable.getWriter();

    // Start streaming response
    const ollamaUrl = process.env.OLLAMA_API_URL || 'http://localhost:11434/api/chat';
    let response;
    try {
      response = await fetch(ollamaUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model: process.env.OLLAMA_MODEL || 'deepseek-coder:latest',
          messages: contextMessages.map((msg: IMessage) => ({
            role: msg.role,
            content: msg.content
          })),
          stream: true,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Ollama API Error:', {
          status: response.status,
          statusText: response.statusText,
          error: errorText
        });
        throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
      }
    } catch (error) {
      console.error('Ollama Request Error:', error);
      return new Response(JSON.stringify({ 
        error: 'Failed to connect to Ollama API',
        details: error instanceof Error ? error.message : 'Unknown error'
      }), {
        status: 502,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let assistantMessage = '';
    const reader = response.body?.getReader();

    // Create response stream
    (async () => {
      try {
        if (!reader) throw new Error('No reader available');

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = new TextDecoder().decode(value);
          const lines = chunk.split('\n').filter(Boolean);

          for (const line of lines) {
            try {
              const json = JSON.parse(line);
              if (json.message?.content) {
                assistantMessage += json.message.content;
                await writer.write(encoder.encode(json.message.content));
              }
            } catch (e) {
              console.error('Error parsing JSON:', e);
            }
          }
        }
      } catch (error) {
        console.error('Stream Processing Error:', error);
      } finally {
        try {
          // Save assistant's message to chat history
          if (assistantMessage) {
            chat.messages.push({
              role: 'assistant',
              content: assistantMessage,
              timestamp: new Date()
            });
            await chat.save();
          }
        } catch (error) {
          console.error('Chat Save Error:', error);
        }
        
        await writer.close();
      }
    })();

    return new Response(stream.readable, {
      headers: {
        'Content-Type': 'text/plain',
      },
    });
  } catch (error) {
    console.error('Chat API Error:', error);
    return new Response(JSON.stringify({ 
      error: 'Internal Server Error',
      details: error instanceof Error ? error.message : 'Unknown error'
    }), {
      status: 500,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
} 