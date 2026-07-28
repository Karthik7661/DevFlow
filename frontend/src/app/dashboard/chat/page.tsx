'use client';

import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send, Hash } from 'lucide-react';

export default function ChatPage() {
  const { messages, loading, fetchMessages, sendMessage } = useChatStore();
  const { activeWorkspaceId } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (activeWorkspaceId) {
      fetchMessages();
      // Set up a simple polling interval for new messages (e.g., every 5 seconds)
      const interval = setInterval(() => {
        fetchMessages();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [activeWorkspaceId, fetchMessages]);

  useEffect(() => {
    // Scroll to bottom when new messages arrive
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      await sendMessage(content);
      setContent('');
    } catch (error) {
      console.error('Failed to send message', error);
    } finally {
      setSending(false);
    }
  };

  if (!activeWorkspaceId) {
    return <div className="flex h-full items-center justify-center text-muted-foreground p-8">Loading workspace...</div>;
  }

  return (
    <div className="flex flex-col h-full max-h-[calc(100vh-4rem)] border-x border-border/40 bg-background/50 max-w-5xl mx-auto">
      <div className="flex items-center px-6 py-4 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <Hash className="h-5 w-5 text-muted-foreground mr-2" />
        <h2 className="text-lg font-semibold tracking-tight">team-chat</h2>
      </div>

      <div className="flex-1 overflow-y-auto p-6 space-y-6">
        {messages.length === 0 && !loading ? (
          <div className="text-center text-muted-foreground py-10">
            <Hash className="h-12 w-12 mx-auto mb-4 opacity-20" />
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message, index) => {
            const isMe = message.senderId === user?.uid;
            const showHeader = index === 0 || messages[index - 1].senderId !== message.senderId || 
              new Date(message.createdAt).getTime() - new Date(messages[index - 1].createdAt).getTime() > 5 * 60000;

            return (
              <div key={message.id} className={`flex gap-4 ${isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                {showHeader ? (
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mt-1">
                    {message.sender.fullName.charAt(0).toUpperCase()}
                  </div>
                ) : (
                  <div className="w-10 shrink-0" />
                )}
                <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                  {showHeader && (
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">{isMe ? 'You' : message.sender.fullName}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  )}
                  <div className={`px-4 py-2.5 rounded-2xl ${isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                    <p className="text-sm whitespace-pre-wrap break-words">{message.content}</p>
                  </div>
                </div>
              </div>
            );
          })
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur">
        <form onSubmit={handleSend} className="flex gap-2">
          <Input 
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="Type a message..." 
            className="flex-1 bg-muted/50 border-0 focus-visible:ring-1"
            disabled={sending}
          />
          <Button type="submit" disabled={!content.trim() || sending} size="icon" className="shrink-0 rounded-full">
            <Send className="h-4 w-4" />
          </Button>
        </form>
      </div>
    </div>
  );
}
