import mongoose, { Document, Schema } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface IChat extends Document {
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
}

const messageSchema = new Schema<IMessage>({
  role: { type: String, required: true, enum: ['user', 'assistant'] },
  content: { type: String, required: true },
  timestamp: { type: Date, required: true, default: Date.now }
});

const chatSchema = new Schema<IChat>({
  messages: [messageSchema],
}, {
  timestamps: true
});

// Check if the model is already defined to prevent OverwriteModelError
export const Chat = mongoose.models.Chat || mongoose.model<IChat>('Chat', chatSchema); 