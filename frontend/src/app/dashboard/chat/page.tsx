'use client';

import { useEffect, useState, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { useAuthStore } from '@/store/authStore';
import { useWorkspaceStore } from '@/store/workspaceStore';
import { Input } from '@/components/ui/Input';
import { Button } from '@/components/ui/Button';
import { Send, Hash, Plus, User } from 'lucide-react';

interface ChannelItem {
  id: string;
  name: string;
  type: 'channel' | 'dm';
}

export default function ChatPage() {
  const { messages, loading, fetchMessages, sendMessage } = useChatStore();
  const { activeWorkspaceId, activeWorkspaceDetails } = useWorkspaceStore();
  const { user } = useAuthStore();
  const [content, setContent] = useState('');
  const [sending, setSending] = useState(false);
  const [activeChannelId, setActiveChannelId] = useState<string>('team-chat');
  
  // Custom message history for demo channels/DMs
  const [channelMessages, setChannelMessages] = useState<Record<string, Array<{ id: string; content: string; senderName: string; isMe: boolean; time: string }>>>({
    'general': [
      { id: '1', content: 'Welcome to the #general channel!', senderName: 'DevFlow Bot', isMe: false, time: '10:00 AM' },
      { id: '2', content: 'Feel free to share company updates and announcements here.', senderName: 'DevFlow Bot', isMe: false, time: '10:01 AM' }
    ],
    'random': [
      { id: '1', content: 'Welcome to #random! Share memes, food photos, or off-topic chat.', senderName: 'DevFlow Bot', isMe: false, time: '09:30 AM' }
    ]
  });

  const messagesContainerRef = useRef<HTMLDivElement>(null);

  const channels: ChannelItem[] = [
    { id: 'team-chat', name: 'team-chat', type: 'channel' },
    { id: 'general', name: 'general', type: 'channel' },
    { id: 'random', name: 'random', type: 'channel' },
  ];

  // Dynamically load real workspace members under Direct Messages
  const realMembers = (activeWorkspaceDetails?.members || []).map(member => ({
    id: `dm-${member.userId}`,
    name: member.user?.fullName || member.user?.email || 'Team Member',
    type: 'dm' as const
  }));

  const directMessages: ChannelItem[] = realMembers.length > 0 ? realMembers : [
    { id: 'dm-sample', name: 'Team Member', type: 'dm' }
  ];

  const currentChannel = [...channels, ...directMessages].find(c => c.id === activeChannelId) || channels[0];

  // Fallback polling for real team-chat backend
  useEffect(() => {
    if (!activeWorkspaceId) return;
    const intervalId = setInterval(() => {
      fetchMessages(true);
    }, 3000);
    
    return () => clearInterval(intervalId);
  }, [activeWorkspaceId, fetchMessages]);

  useEffect(() => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
    }
  }, [messages.length, activeChannelId, channelMessages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim() || sending) return;

    setSending(true);
    try {
      if (activeChannelId === 'team-chat') {
        await sendMessage(content);
      } else {
        const newMsg = {
          id: Date.now().toString(),
          content: content.trim(),
          senderName: 'You',
          isMe: true,
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setChannelMessages(prev => ({
          ...prev,
          [activeChannelId]: [...(prev[activeChannelId] || []), newMsg]
        }));
      }
      setContent('');
      if (messagesContainerRef.current) {
        messagesContainerRef.current.scrollTop = messagesContainerRef.current.scrollHeight;
      }
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
    <div className="h-full w-full min-w-0 min-h-0 flex border border-border/40 bg-background/50 rounded-xl overflow-hidden shadow-sm">
      {/* Chat Sidebar */}
      <div className="hidden md:flex w-64 shrink-0 flex-col border-r border-border/40 bg-background/95">
        <div className="h-14 px-4 border-b border-border/40 flex items-center justify-between shrink-0">
          <h2 className="font-semibold tracking-tight">Channels</h2>
          <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex-1 overflow-y-auto p-3 space-y-1">
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 mt-2">
            Text Channels
          </div>
          {channels.map((channel) => {
            const isActive = activeChannelId === channel.id;
            return (
              <Button 
                key={channel.id}
                onClick={() => setActiveChannelId(channel.id)}
                variant={isActive ? "secondary" : "ghost"} 
                className={`w-full justify-start font-medium transition-colors ${isActive ? 'bg-primary/10 text-primary' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <Hash className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">{channel.name}</span>
              </Button>
            );
          })}
          
          <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wider mt-6 mb-1">
            Direct Messages
          </div>
          {directMessages.map((dm) => {
            const isActive = activeChannelId === dm.id;
            return (
              <Button 
                key={dm.id}
                onClick={() => setActiveChannelId(dm.id)}
                variant={isActive ? "secondary" : "ghost"} 
                className={`w-full justify-start transition-colors ${isActive ? 'bg-primary/10 text-primary font-medium' : 'text-muted-foreground hover:text-foreground'}`}
              >
                <User className="mr-2 h-4 w-4 shrink-0" />
                <span className="truncate">{dm.name}</span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 min-w-0 min-h-0 flex flex-col bg-background/50 relative">
        <div className="h-14 flex items-center px-6 border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 z-10 shrink-0">
          {currentChannel.type === 'channel' ? (
            <Hash className="h-5 w-5 text-muted-foreground mr-2" />
          ) : (
            <User className="h-5 w-5 text-muted-foreground mr-2" />
          )}
          <h2 className="text-lg font-semibold tracking-tight">{currentChannel.name}</h2>
        </div>

        <div ref={messagesContainerRef} className="flex-1 min-h-0 overflow-y-auto p-6 space-y-6">
          {activeChannelId === 'team-chat' ? (
            loading ? (
              <div className="flex h-full items-center justify-center">
                <div className="h-8 w-8 animate-spin rounded-full border-b-2 border-primary"></div>
              </div>
            ) : messages.length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <Hash className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>No messages yet in #team-chat. Start the conversation!</p>
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
                        {message.sender?.fullName ? message.sender.fullName.charAt(0).toUpperCase() : 'U'}
                      </div>
                    ) : (
                      <div className="w-10 shrink-0" />
                    )}
                    <div className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                      {showHeader && (
                        <div className="flex items-baseline gap-2 mb-1">
                          <span className="font-semibold text-sm">{isMe ? 'You' : (message.sender?.fullName || 'User')}</span>
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
            )
          ) : (
            (channelMessages[activeChannelId] || []).length === 0 ? (
              <div className="text-center text-muted-foreground py-10">
                <User className="h-12 w-12 mx-auto mb-4 opacity-20" />
                <p>Start a conversation with {currentChannel.name}.</p>
              </div>
            ) : (
              channelMessages[activeChannelId].map((msg) => (
                <div key={msg.id} className={`flex gap-4 ${msg.isMe ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 flex items-center justify-center text-primary font-medium mt-1">
                    {msg.senderName.charAt(0).toUpperCase()}
                  </div>
                  <div className={`flex flex-col ${msg.isMe ? 'items-end' : 'items-start'} max-w-[70%]`}>
                    <div className="flex items-baseline gap-2 mb-1">
                      <span className="font-semibold text-sm">{msg.senderName}</span>
                      <span className="text-xs text-muted-foreground">{msg.time}</span>
                    </div>
                    <div className={`px-4 py-2.5 rounded-2xl ${msg.isMe ? 'bg-primary text-primary-foreground rounded-tr-sm' : 'bg-muted rounded-tl-sm'}`}>
                      <p className="text-sm whitespace-pre-wrap break-words">{msg.content}</p>
                    </div>
                  </div>
                </div>
              ))
            )
          )}
        </div>

        <div className="p-4 border-t border-border/40 bg-background/95 backdrop-blur shrink-0">
          <form onSubmit={handleSend} className="flex gap-2">
            <Input 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder={currentChannel.type === 'channel' ? `Message #${currentChannel.name}...` : `Message @${currentChannel.name}...`} 
              className="flex-1 bg-muted/50 border-0 focus-visible:ring-1"
              disabled={sending}
            />
            <Button type="submit" disabled={!content.trim() || sending} size="icon" className="shrink-0 rounded-full">
              <Send className="h-4 w-4" />
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}



