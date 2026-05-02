import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, X, Send, Bot, User, Facebook, Phone } from 'lucide-react';

interface ChatMessage {
  id: string;
  role: 'user' | 'bot';
  content: string;
}

export function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: 'Chào bạn, mình là Trợ lý Ảo Tuyển sinh HVTC 2026. Bạn có câu hỏi gì cần mình giải đáp không?'
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isWaiting, setIsWaiting] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = { id: Date.now().toString(), role: 'user', content: input.trim() };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setIsWaiting(true);

    try {
      const botMsgId = (Date.now() + 1).toString();

      // Simple history mapping
      const history = messages
        .filter(m => m.id !== 'welcome' && m.id !== 'error')
        .map(msg => ({
          role: msg.role === 'bot' ? 'model' : 'user',
          parts: [{ text: msg.content }]
        }));

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ history, userMsg: userMsg.content }),
      });

      if (!res.ok) {
        const errData = await res.json().catch(() => ({}));
        throw new Error(errData.error || res.statusText);
      }

      const reader = res.body?.getReader();
      if (!reader) throw new Error("Stream not available");

      const decoder = new TextDecoder("utf-8");
      let initialized = false;
      let fullText = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunkText = decoder.decode(value, { stream: true });
        fullText += chunkText;
        
        if (!initialized && fullText) {
          setIsWaiting(false);
          setMessages(prev => [...prev, { id: botMsgId, role: 'bot', content: fullText }]);
          initialized = true;
        } else if (initialized && chunkText) {
          setMessages(prev => 
            prev.map(msg => 
              msg.id === botMsgId ? { ...msg, content: fullText } : msg
            )
          );
        }
      }
    } catch (err: any) {
      console.error("Gemini API Error details:", err);
      setIsWaiting(false);
      // Detailed error for debugging purposes since user is having issues
      let errorDetail = "";
      if (err instanceof Error) {
        errorDetail = err.message;
      } else if (typeof err === 'object') {
        errorDetail = JSON.stringify(err);
      }
      const errorMsg: ChatMessage = { 
        id: (Date.now() + 1).toString(), 
        role: 'bot', 
        content: errorDetail.includes('API Key') 
          ? errorDetail 
          : `Xin lỗi, có sự cố khi kết nối với trí tuệ nhân tạo. ${errorDetail ? '(Lỗi: ' + errorDetail.substring(0, 150) + '...)' : 'Vui lòng thử lại sau.'}` 
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
      setIsWaiting(false);
    }
  };

  const renderContent = (content: string) => {
    let replacedContent = content;

    // Use regex to replace the exact fallback sentence with an interactive version,
    // rather than replacing the ENTIRE message content.
    const fallbackRegex = /Mình chưa được cập nhật thông tin này,? vui lòng đặt câu hỏi tại Group Tư vấn tuyển sinh Học viện Tài chính hoặc gọi số Hotline 0961\.481\.086 hoặc 0967\.684\.086 để được hỗ trợ chính xác nhất nhé!/gi;

    if (fallbackRegex.test(replacedContent)) {
      replacedContent = replacedContent.replace(
        fallbackRegex,
        `Mình chưa được cập nhật thông tin này, vui lòng đặt câu hỏi tại <a href="https://www.facebook.com/groups/tuyensinhhvtc" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline font-bold inline-flex items-center gap-1">Group Tư vấn tuyển sinh Học viện Tài chính</a> hoặc gọi số Hotline <b class="inline-flex items-center gap-1">0961.481.086</b> hoặc <b class="inline-flex items-center gap-1">0967.684.086</b> để được hỗ trợ chính xác nhất nhé!`
      );
    } else if (replacedContent.toLowerCase().includes('mình chưa được cập nhật thông tin này') || replacedContent.toLowerCase().includes('tôi chưa được cập nhật thông tin này')) {
      // If it contains the phrase but not the exact format, replace the phrase with the HTML interactive version
      const partialRegex = /(Mình|Tôi) chưa được cập nhật thông tin này/gi;
      replacedContent = replacedContent.replace(
        partialRegex,
        `$1 chưa được cập nhật thông tin này, vui lòng đặt câu hỏi tại <a href="https://www.facebook.com/groups/tuyensinhhvtc" target="_blank" rel="noopener noreferrer" class="text-blue-500 hover:underline font-bold inline-flex items-center gap-1">Group Tư vấn tuyển sinh Học viện Tài chính</a> hoặc gọi số Hotline <b class="inline-flex items-center gap-1">0961.481.086</b> hoặc <b class="inline-flex items-center gap-1">0967.684.086</b> để được hỗ trợ chính xác nhất nhé!`
      );
    }
    
    // Replace markdown bold, linebreaks, and list items
    let text = replacedContent
      .replace(/\*\*(.*?)\*\*/g, '<b>$1</b>')
      .replace(/\*(.*?)\*/g, '<i>$1</i>')
      .replace(/\n/g, '<br />');
      
    // Quick handle of simple lists
    text = text.replace(/- (.*?)<br \/>/g, '• $1<br />');
    
    return <span dangerouslySetInnerHTML={{ __html: text }} />;
  };

  return (
    <>
      {/* Fallback Contact Links at bottom of page (as requested: "Để 2 cái này ở cuối cùng của trang") */}
      <div className="fixed bottom-4 left-4 z-40 hidden md:flex flex-col gap-2">
        <a href="https://www.facebook.com/groups/tuyensinhhvtc" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-3 rounded-full shadow-lg hover:bg-blue-700 transition-colors flex items-center justify-center group" title="Group Tư vấn tuyển sinh">
          <Facebook className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2 text-sm font-bold">Group Tư vấn</span>
        </a>
        <a href="tel:0961481086" className="bg-green-500 text-white p-3 rounded-full shadow-lg hover:bg-green-600 transition-colors flex items-center justify-center group" title="Hotline: 0961.481.086 / 0967.684.086">
          <Phone className="w-5 h-5" />
          <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-300 ease-in-out whitespace-nowrap pl-0 group-hover:pl-2 text-sm font-bold">0961.481.086</span>
        </a>
      </div>

      {/* Chatbot Toggle Button */}
      <button
        onClick={() => setIsOpen(true)}
        className={`fixed bottom-5 right-5 lg:bottom-8 lg:right-8 w-14 h-14 bg-aof-teal text-white rounded-full shadow-2xl flex items-center justify-center hover:scale-105 transition-transform z-50 ${isOpen ? 'hidden' : 'flex'}`}
      >
        <MessageCircle className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 flex h-4 w-4">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-4 w-4 bg-red-500"></span>
        </span>
      </button>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-5 right-5 lg:bottom-8 lg:right-8 w-full max-w-sm sm:w-96 bg-white rounded-2xl shadow-2xl border border-slate-200 z-50 flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-300" style={{ maxHeight: 'calc(100vh - 100px)' }}>
          {/* Header */}
          <div className="bg-aof-teal text-white p-4 flex items-center justify-between shadow-md z-10 relative">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Bot className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-bold text-sm">Trợ lý ảo Tuyển sinh</h3>
                <p className="text-[10px] text-teal-100 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block animate-pulse"></span>
                  Sẵn sàng giải đáp
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="text-white hover:bg-white/20 p-2 rounded-full transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-4 bg-slate-50 min-h-[300px] max-h-[400px]">
            {messages.map(msg => (
              <div key={msg.id} className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                {msg.role === 'bot' && (
                  <div className="w-8 h-8 rounded-full bg-aof-teal/10 flex items-center justify-center shrink-0 border border-aof-teal/20">
                    <Bot className="w-4 h-4 text-aof-teal" />
                  </div>
                )}
                <div className={`max-w-[80%] rounded-2xl p-3 text-sm ${msg.role === 'user' ? 'bg-aof-teal text-white rounded-br-none' : 'bg-white border border-slate-200 text-slate-800 rounded-bl-none shadow-sm'}`}>
                  {renderContent(msg.content)}
                </div>
              </div>
            ))}
            {isWaiting && (
              <div className="flex gap-2 justify-start">
                <div className="w-8 h-8 rounded-full bg-aof-teal/10 flex items-center justify-center shrink-0 border border-aof-teal/20">
                  <Bot className="w-4 h-4 text-aof-teal" />
                </div>
                <div className="max-w-[80%] bg-white border border-slate-200 rounded-2xl p-3 text-sm rounded-bl-none shadow-sm flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce"></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                  <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-slate-100">
            <form onSubmit={handleSubmit} className="flex gap-2 items-center">
              <input
                type="text"
                className="flex-1 bg-slate-100 border border-slate-200 rounded-full px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-aof-teal/50 focus:bg-white transition-colors"
                placeholder="Nhập câu hỏi của bạn..."
                value={input}
                onChange={e => setInput(e.target.value)}
              />
              <button 
                type="submit" 
                disabled={!input.trim() || isLoading}
                className="w-10 h-10 bg-aof-teal text-white rounded-full flex items-center justify-center hover:bg-teal-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed shrink-0"
              >
                <Send className="w-4 h-4 ml-0.5" />
              </button>
            </form>
          </div>
        </div>
      )}

      {/* Mobile static footer links as requested */}
      <div className="mt-8 pt-6 border-t border-slate-200 pb-4 text-center">
        <p className="text-sm text-slate-500 mb-4">Cần trợ giúp thêm? Liên hệ ngay với chúng tôi:</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href="https://www.facebook.com/groups/tuyensinhhvtc" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 bg-blue-50 hover:bg-blue-100 text-blue-700 px-4 py-2 rounded-full font-bold transition-colors border border-blue-200">
            <Facebook className="w-5 h-5" /> Group Tư vấn tuyển sinh Học viện Tài chính
          </a>
          <a href="tel:0961481086" className="flex items-center gap-2 bg-green-50 hover:bg-green-100 text-green-700 px-4 py-2 rounded-full font-bold transition-colors border border-green-200">
            <Phone className="w-5 h-5" /> Hotline: 0961.481.086 - 0967.684.086
          </a>
        </div>
      </div>
    </>
  );
}
