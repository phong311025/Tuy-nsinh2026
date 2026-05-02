import React, { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, Bot, User, Trash2, Copy, Check, Sparkles, HelpCircle, RefreshCw, Facebook } from 'lucide-react';
import Markdown from 'react-markdown';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot' | 'error';
  content: string;
  timestamp?: number;
}

const INITIAL_MSG: ChatMessage = {
  id: 'welcome',
  role: 'bot',
  content: 'Xin chào! Mình là AI Trợ lý Tuyển sinh Học viện Tài chính 2026 được phát triển bởi Ban phát thanh Học viện Tài chính. Mình có thể giúp gì cho bạn?',
  timestamp: Date.now()
};

const SUGGESTIONS = [
  "Xét tuyển kết hợp (PT2) như thế nào?",
  "Chỉ tiêu ngành Kế toán là bao nhiêu?",
  "Cách tính điểm xét tuyển học bạ?",
  "Giải Nhất thi HSG tỉnh được quy đổi ra sao?"
];

export function Chatbot({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (v: boolean) => void }) {
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MSG]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (text: string) => {
    if (!text.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: text.trim(), timestamp: Date.now() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const botMsgId = (Date.now() + 1).toString();
      
      const history = messages
        .filter(m => m.role !== 'error' && m.id !== 'welcome')
        .map(msg => ({
          role: msg.role === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          history,
          text: text.trim()
        })
      });

      if (!response.ok) {
        const err = await response.json().catch(() => ({}));
        throw new Error(err.error || `Lỗi máy chủ (${response.status})`);
      }

      const reader = response.body?.getReader();
      if (!reader) throw new Error("Stream not available");
      
      const decoder = new TextDecoder('utf-8');
      let fullText = '';
      let initialized = false;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value, { stream: true });
        fullText += chunk;
        
        if (!initialized) {
          setMessages(prev => [...prev, { id: botMsgId, role: 'bot', content: fullText, timestamp: Date.now() }]);
          initialized = true;
        } else {
          setMessages(prev => prev.map(msg => msg.id === botMsgId ? { ...msg, content: fullText } : msg));
        }
      }
    } catch (err: any) {
      console.error("Lỗi chat:", err);
      let errorMsg = err?.message || "Lỗi kết nối đến máy chủ.";
      setMessages(prev => [...prev, { 
        id: Date.now().toString(), 
        role: 'error', 
        content: errorMsg,
        timestamp: Date.now()
      }]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([{ ...INITIAL_MSG, timestamp: Date.now() }]);
  };

  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const formatTime = (time?: number) => {
    if (!time) return '';
    return new Intl.DateTimeFormat('vi-VN', { hour: '2-digit', minute: '2-digit' }).format(time);
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-6 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl flex items-center justify-center hover:bg-indigo-700 hover:scale-105 transition-all z-40 ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
      >
        <MessageSquare className="w-6 h-6" />
      </button>

      <div 
        className={`fixed bottom-0 right-0 sm:bottom-24 sm:right-6 w-full sm:w-[400px] h-full sm:h-[600px] sm:max-h-[calc(100vh-120px)] bg-white sm:rounded-2xl shadow-2xl z-50 flex flex-col transform transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)] origin-bottom-right sm:overflow-hidden ${isOpen ? 'scale-100 opacity-100' : 'scale-95 opacity-0 pointer-events-none'}`}
      >
        <div className="bg-gradient-to-r from-indigo-700 to-indigo-600 text-white p-4 flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <a href="https://xettuyen.hvtc.edu.vn" target="_blank" rel="noopener noreferrer" className="w-10 h-10 bg-white rounded-full flex items-center justify-center border-2 border-white/20 hover:scale-105 transition-transform shrink-0 shadow-sm overflow-hidden" title="Trang Tuyển Sinh HVTC">
              <img src="/logo.png" alt="HVTC" className="w-full h-full object-contain p-0.5" />
            </a>
            <div className="flex flex-col">
              <h3 className="font-bold text-sm tracking-wide">AOF Assistant</h3>
              <p className="text-[11px] text-indigo-100 font-medium">BPT Học viện Tài chính</p>
            </div>
          </div>
          <div className="flex items-center gap-1.5">
            <a href="https://www.facebook.com/groups/tuyensinhhvtc" target="_blank" rel="noopener noreferrer" className="p-2 hover:bg-white/20 rounded-full transition-all hover:scale-110" title="Group Tư vấn Tuyển sinh">
              <Facebook className="w-4 h-4" />
            </a>
            <button onClick={clearChat} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Bắt đầu lại">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-white/20 rounded-full transition-colors" title="Đóng">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 bg-slate-50 flex flex-col gap-5 scroll-smooth">
          <div className="flex justify-center text-xs text-slate-400 my-2 font-medium">Hôm nay</div>
          {messages.map(msg => (
            <div key={msg.id} className={`flex gap-3 max-w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
              <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 shadow-sm ${
                msg.role === 'user' ? 'bg-indigo-600 text-white' : 
                msg.role === 'error' ? 'bg-red-100 text-red-600' : 'bg-gradient-to-br from-indigo-500 to-indigo-600 text-white relative'
              }`}>
                {msg.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                {msg.role === 'bot' && <span className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>}
              </div>
              
              <div className={`flex flex-col ${msg.role === 'user' ? 'items-end' : 'items-start'} max-w-[78%]`}>
                <div className={`rounded-2xl px-4 py-3 shadow-sm relative group ${
                  msg.role === 'user' 
                    ? 'bg-indigo-600 text-white rounded-tr-sm' 
                    : msg.role === 'error'
                      ? 'bg-red-50 border border-red-200 text-red-800 rounded-tl-sm'
                      : 'bg-white border border-slate-100 text-slate-800 rounded-tl-sm'
                }`}>
                  <div className={msg.role !== 'user' ? "prose prose-sm prose-slate max-w-none text-[14.5px] leading-relaxed break-words" : "whitespace-pre-wrap text-[14.5px] break-words"}>
                    {msg.role === 'error' ? msg.content : <Markdown>{msg.content}</Markdown>}
                  </div>
                  
                  {msg.role === 'bot' && (
                    <button 
                      onClick={() => copyToClipboard(msg.content, msg.id)}
                      className={`absolute -bottom-3 -right-3 p-1.5 rounded-full bg-white border border-slate-200 shadow-sm text-slate-400 hover:text-indigo-600 transition-all opacity-0 group-hover:opacity-100 focus:opacity-100`}
                      title="Sao chép"
                    >
                      {copiedId === msg.id ? <Check className="w-3.5 h-3.5 text-green-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                  )}
                </div>
                <span className="text-[10px] text-slate-400 mt-1 px-1 font-medium select-none">
                  {formatTime(msg.timestamp)}
                </span>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex gap-3 flex-row">
              <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex items-center justify-center shrink-0">
                <Bot className="w-4 h-4" />
              </div>
              <div className="bg-white border border-slate-200 rounded-2xl rounded-tl-sm p-4 shadow-sm flex items-center gap-2">
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce"></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <div className="bg-white border-t border-slate-200 pt-3 flex flex-col shrink-0 relative">
          {messages.length < 3 && !isLoading && (
            <div className="flex gap-2 overflow-x-auto px-4 pb-3 no-scrollbar scroll-smooth">
              {SUGGESTIONS.map((s, i) => (
                <button
                  key={i}
                  onClick={() => handleSubmit(s)}
                  className="whitespace-nowrap text-[12px] font-medium text-indigo-700 bg-indigo-50/80 px-3.5 py-2 rounded-full hover:bg-indigo-100 hover:text-indigo-800 transition-colors border border-indigo-100 shrink-0"
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          
          <form 
            onSubmit={(e) => { e.preventDefault(); handleSubmit(input); }} 
            className="flex items-center gap-2.5 px-4 pb-4"
          >
            <div className="relative flex-1">
              <input
                type="text"
                className="w-full bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-2xl pl-4 pr-10 py-3 text-[14.5px] focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all font-medium placeholder:text-slate-400"
                placeholder="Nhập câu hỏi (VD: Ngành kế toán xét khối nào?)..."
                value={input}
                onChange={e => setInput(e.target.value)}
                disabled={isLoading}
              />
            </div>
            <button 
              type="submit" 
              disabled={!input.trim() || isLoading}
              className="w-[46px] h-[46px] bg-indigo-600 text-white rounded-2xl flex items-center justify-center hover:bg-indigo-700 transition-colors disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500 shrink-0 shadow-sm"
            >
              <Send className="w-[18px] h-[18px] ml-0.5" />
            </button>
          </form>
        </div>
      </div>
      
      {isOpen && (
        <div 
          onClick={() => setIsOpen(false)}
          className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 sm:hidden"
        />
      )}
    </>
  );
}

