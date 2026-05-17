import { useState, useRef, useEffect } from 'react';
import api from '../utils/api';

const QUICK_PROMPTS = [
  'Check my complaint status',
  'What welfare schemes are available?',
  'Show project progress in my ward',
  'How do I register as a volunteer?',
];

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { role: 'bot', text: 'நான் UCI AI Assistant. I can help you with complaints, welfare schemes, project progress, and volunteer queries. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => { bottomRef.current?.scrollIntoView({ behavior: 'smooth' }); }, [messages]);

  const sendMessage = async (text = input) => {
    if (!text.trim()) return;
    const userMsg = { role: 'user', text };
    setMessages(p => [...p, userMsg]);
    setInput('');
    setLoading(true);
    try {
      const res = await api.post('/api/ai/chat', { message: text });
      setMessages(p => [...p, { role: 'bot', text: res.data.reply || res.data.message || 'I received your message.' }]);
    } catch {
      setMessages(p => [...p, { role: 'bot', text: 'Sorry, the AI service is temporarily unavailable. Please try again shortly.' }]);
    } finally { setLoading(false); }
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="text-center mb-6">
        <h1 className="font-display text-3xl text-civic-navy">AI Civic Assistant</h1>
        <p className="text-slate-500 text-sm mt-1">Ask me anything about governance, welfare, or volunteer activities</p>
      </div>

      <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden flex flex-col" style={{ height: '65vh' }}>
        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {messages.map((m, i) => (
            <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
              {m.role === 'bot' && (
                <span className="h-8 w-8 rounded-full bg-civic-teal flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0 mt-1">AI</span>
              )}
              <div className={`max-w-xs sm:max-w-sm lg:max-w-md px-4 py-3 rounded-2xl text-sm leading-relaxed ${
                m.role === 'user' ? 'bg-civic-navy text-white rounded-br-sm' : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              }`}>
                {m.text}
              </div>
            </div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <span className="h-8 w-8 rounded-full bg-civic-teal flex items-center justify-center text-white text-xs font-bold mr-2 shrink-0">AI</span>
              <div className="bg-slate-100 rounded-2xl rounded-bl-sm px-4 py-3">
                <div className="flex gap-1 items-center h-5">
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                  <span className="h-2 w-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* Quick prompts */}
        <div className="px-4 py-2 border-t border-slate-100 flex gap-2 overflow-x-auto">
          {QUICK_PROMPTS.map(q => (
            <button key={q} onClick={() => sendMessage(q)}
              className="shrink-0 px-3 py-1 text-xs bg-civic-teal/10 text-civic-teal border border-civic-teal/20 rounded-full hover:bg-civic-teal/20 transition whitespace-nowrap">
              {q}
            </button>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-slate-100">
          <form onSubmit={e => { e.preventDefault(); sendMessage(); }} className="flex gap-3">
            <input
              value={input}
              onChange={e => setInput(e.target.value)}
              disabled={loading}
              className="flex-1 border border-slate-300 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-civic-teal"
              placeholder="Ask about complaints, welfare, projects…"
            />
            <button type="submit" disabled={loading || !input.trim()}
              className="px-5 py-2.5 bg-civic-teal text-white rounded-xl text-sm font-semibold hover:bg-opacity-90 transition disabled:opacity-50">
              Send
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
