# DeepSeek Chat

A modern Progressive Web App (PWA) chat interface for interacting with the Deepseek Coder model through Ollama. Features real-time streaming responses, chat history persistence with MongoDB, and a beautiful responsive UI.

## Features

- 🚀 Real-time streaming responses from Ollama
- 💾 Chat history persistence using MongoDB
- 🎨 Modern, responsive UI with dark mode support
- ✨ Code syntax highlighting with VSCode-like theme
- 📱 PWA features (installable, offline support)
- 📝 Full Markdown support in messages
- 🔄 Context-aware conversations (maintains context of last 5 messages)

## Prerequisites

Before running the application, make sure you have the following installed:

1. **Node.js** (v18 or later)
2. **MongoDB** (running locally or accessible via URI)
3. **Ollama** with the deepseek-coder model installed

### Installing Ollama and the Deepseek Model

1. Install Ollama from [ollama.ai](https://ollama.ai)
2. Pull the Deepseek Coder model:
   ```bash
   ollama pull deepseek-coder
   ```

## Setup

1. Clone the repository:

   ```bash
   git clone <repository-url>
   cd deepseek-chat
   ```

2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `.env.local` file in the root directory:
   ```env
   MONGODB_URI=mongodb://localhost:27017/deepseek-chat
   OLLAMA_API_URL=http://localhost:11434/api/chat
   OLLAMA_MODEL=deepseek-coder:latest
   ```

## Running the Application

1. Start MongoDB if running locally:

   ```bash
   mongod
   ```

2. Start Ollama:

   ```bash
   ollama serve
   ```

3. Start the development server with HTTPS (required for PWA features):

   ```bash
   npm run dev:https
   ```

4. Open your browser and navigate to `https://localhost:3000`
   - Accept the self-signed certificate warning (development only)
   - For production, use a proper SSL certificate

## Usage

1. Type your message in the input field at the bottom of the chat
2. Press Enter or click the send button to send your message
3. The AI will respond in real-time with streaming text
4. Code blocks will be automatically formatted with syntax highlighting
5. Your chat history will be preserved across sessions

### Markdown Support

The chat supports full Markdown syntax:

- Code blocks with syntax highlighting (use triple backticks)
- Lists (ordered and unordered)
- Headers
- Bold and italic text
- Links
- And more!

Example:
\```python
def hello_world():
print("Hello, World!")
\```

## Development

### Project Structure

```
deepseek-chat/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   └── chat/
│   │   │       └── route.ts    # API endpoint for chat
│   │   └── page.tsx            # Main page component
│   ├── components/
│   │   └── chat/
│   │       ├── ChatContainer.tsx  # Main chat container
│   │       ├── ChatInput.tsx      # Message input component
│   │       └── Message.tsx        # Message display component
│   └── lib/
│       ├── db/
│       │   └── mongoose.ts     # Database connection
│       └── models/
│           └── Chat.ts         # MongoDB chat model
└── .env.local                  # Environment variables
```

### Key Technologies

- Next.js 14 (App Router)
- TypeScript
- MongoDB with Mongoose
- TailwindCSS
- React Markdown
- Syntax Highlighting (react-syntax-highlighter)

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Troubleshooting

### Common Issues

1. **MongoDB Connection Error**

   - Ensure MongoDB is running locally
   - Check your MONGODB_URI in .env.local
   - Verify network connectivity

2. **Ollama API Error**

   - Ensure Ollama is running (`ollama serve`)
   - Verify the deepseek-coder model is installed
   - Check OLLAMA_API_URL in .env.local

3. **HTTPS Certificate Error**
   - Development: Accept the self-signed certificate
   - Production: Use a valid SSL certificate

For additional help, please open an issue in the repository.
