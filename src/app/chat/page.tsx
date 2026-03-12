'use client';

import * as React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import {
  MessageCircle,
  Send,
  Smile,
  Image as ImageIcon,
  Gift,
  Users,
  Hash,
  Lock,
  Crown,
  Plus,
  Search,
  MoreVertical,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { cn } from '@/lib/utils';

// Mock data
const chatRooms = [
  {
    id: 1,
    name: '影视讨论区',
    description: '聊聊最新的影视作品',
    avatar: 'https://picsum.photos/seed/room1/100/100',
    memberCount: 1234,
    onlineCount: 56,
    isVipOnly: false,
    lastMessage: '这部剧真的太好看了！',
    lastMessageTime: '刚刚',
    unread: 3,
  },
  {
    id: 2,
    name: '动漫爱好者',
    description: '二次元聚集地',
    avatar: 'https://picsum.photos/seed/room2/100/100',
    memberCount: 2345,
    onlineCount: 89,
    isVipOnly: false,
    lastMessage: '新番推荐一下~',
    lastMessageTime: '5分钟前',
    unread: 0,
  },
  {
    id: 3,
    name: 'VIP专属群',
    description: 'VIP会员专属聊天室',
    avatar: 'https://picsum.photos/seed/room3/100/100',
    memberCount: 567,
    onlineCount: 23,
    isVipOnly: true,
    lastMessage: '独家资源分享中',
    lastMessageTime: '10分钟前',
    unread: 12,
  },
  {
    id: 4,
    name: '游戏交流群',
    description: '游戏玩家交流',
    avatar: 'https://picsum.photos/seed/room4/100/100',
    memberCount: 890,
    onlineCount: 34,
    isVipOnly: false,
    lastMessage: '有人一起玩吗？',
    lastMessageTime: '30分钟前',
    unread: 0,
  },
];

const messages = [
  {
    id: 1,
    user: { name: '电影迷', avatar: 'https://picsum.photos/seed/user1/50/50' },
    content: '大家最近看了什么好电影推荐吗？',
    time: '20:30',
    isMe: false,
  },
  {
    id: 2,
    user: { name: '小明', avatar: 'https://picsum.photos/seed/user2/50/50' },
    content: '推荐《星际穿越》，诺兰的神作！',
    time: '20:31',
    isMe: false,
  },
  {
    id: 3,
    user: { name: '我', avatar: 'https://picsum.photos/seed/me/50/50' },
    content: '同意！星际穿越真的太好看了，看了三遍还是很感动',
    time: '20:32',
    isMe: true,
  },
  {
    id: 4,
    user: { name: '影视达人', avatar: 'https://picsum.photos/seed/user3/50/50' },
    content: '除了星际穿越，盗梦空间也很推荐，也是诺兰的作品',
    time: '20:33',
    isMe: false,
  },
  {
    id: 5,
    user: { name: '小红', avatar: 'https://picsum.photos/seed/user4/50/50' },
    content: '最近看了《奥本海默》，也很棒！',
    time: '20:35',
    isMe: false,
  },
];

export default function ChatPage() {
  const [selectedRoom, setSelectedRoom] = React.useState(chatRooms[0]);
  const [messageInput, setMessageInput] = React.useState('');

  return (
    <div className="container px-4 py-6">
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <MessageCircle className="h-8 w-8 text-primary" />
        <h1 className="text-2xl font-bold">聊天中心</h1>
      </div>

      <div className="grid gap-4 lg:grid-cols-[300px_1fr] h-[calc(100vh-200px)] min-h-[500px]">
        {/* Room List */}
        <Card className="flex flex-col">
          <CardHeader className="pb-3">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">聊天室</CardTitle>
              <Button variant="ghost" size="icon">
                <Plus className="h-5 w-5" />
              </Button>
            </div>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input placeholder="搜索聊天室..." className="pl-9" />
            </div>
          </CardHeader>
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full">
              <div className="space-y-1 p-2">
                {chatRooms.map((room) => (
                  <button
                    key={room.id}
                    onClick={() => setSelectedRoom(room)}
                    className={cn(
                      'w-full flex items-start gap-3 p-3 rounded-lg transition-colors text-left',
                      selectedRoom.id === room.id
                        ? 'bg-primary/10'
                        : 'hover:bg-muted'
                    )}
                  >
                    <div className="relative">
                      <Avatar className="h-12 w-12">
                        <AvatarImage src={room.avatar} />
                        <AvatarFallback>{room.name[0]}</AvatarFallback>
                      </Avatar>
                      {room.isVipOnly && (
                        <Crown className="absolute -bottom-1 -right-1 h-4 w-4 text-yellow-500" />
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="font-medium truncate">{room.name}</span>
                        <span className="text-xs text-muted-foreground">
                          {room.lastMessageTime}
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground truncate">
                        {room.lastMessage}
                      </p>
                      <div className="flex items-center gap-2 mt-1">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Users className="h-3 w-3" />
                          {room.onlineCount}在线
                        </div>
                      </div>
                    </div>
                    {room.unread > 0 && (
                      <Badge className="h-5 min-w-5 flex items-center justify-center p-0">
                        {room.unread}
                      </Badge>
                    )}
                  </button>
                ))}
              </div>
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Chat Area */}
        <Card className="flex flex-col">
          {/* Room Header */}
          <CardHeader className="pb-3 border-b">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={selectedRoom.avatar} />
                  <AvatarFallback>{selectedRoom.name[0]}</AvatarFallback>
                </Avatar>
                <div>
                  <CardTitle className="text-lg flex items-center gap-2">
                    {selectedRoom.name}
                    {selectedRoom.isVipOnly && (
                      <Badge className="bg-yellow-500 text-yellow-900">
                        <Crown className="mr-1 h-3 w-3" />
                        VIP
                      </Badge>
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground">
                    {selectedRoom.memberCount} 成员 · {selectedRoom.onlineCount} 在线
                  </p>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-5 w-5" />
              </Button>
            </div>
          </CardHeader>

          {/* Messages */}
          <CardContent className="flex-1 p-0 overflow-hidden">
            <ScrollArea className="h-full p-4">
              <div className="space-y-4">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={cn(
                      'flex gap-3',
                      message.isMe && 'flex-row-reverse'
                    )}
                  >
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={message.user.avatar} />
                      <AvatarFallback>{message.user.name[0]}</AvatarFallback>
                    </Avatar>
                    <div
                      className={cn(
                        'max-w-[70%]',
                        message.isMe && 'items-end'
                      )}
                    >
                      <div
                        className={cn(
                          'flex items-center gap-2 mb-1',
                          message.isMe && 'flex-row-reverse'
                        )}
                      >
                        <span className="text-sm font-medium">
                          {message.user.name}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {message.time}
                        </span>
                      </div>
                      <div
                        className={cn(
                          'rounded-lg px-3 py-2',
                          message.isMe
                            ? 'bg-primary text-primary-foreground'
                            : 'bg-muted'
                        )}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </ScrollArea>
          </CardContent>

          {/* Input Area */}
          <div className="p-4 border-t">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon">
                <Smile className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <ImageIcon className="h-5 w-5" />
              </Button>
              <Button variant="ghost" size="icon">
                <Gift className="h-5 w-5" />
              </Button>
              <Input
                value={messageInput}
                onChange={(e) => setMessageInput(e.target.value)}
                placeholder="输入消息..."
                className="flex-1"
                onKeyDown={(e) => {
                  if (e.key === 'Enter' && messageInput.trim()) {
                    // 发送消息
                    setMessageInput('');
                  }
                }}
              />
              <Button disabled={!messageInput.trim()}>
                <Send className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
