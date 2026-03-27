import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, User, Cpu } from 'lucide-react';

const AIAssistant: React.FC = () => {
  const [messages, setMessages] = useState([
    { id: 1, sender: 'ai', text: 'Hello, I am UnionCyberAI Assistant. I can help analyze threats, recommend remediations, and explain SOC playbooks. How can I assist you today?' }
  ]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const userMessage = { id: Date.now(), sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsTyping(true);

    const question = input.toLowerCase();
    let responseText = "I'm analyzing your request. Based on current Union Bank protocols, please refer to the SOC playbook or contact the Incident Response Team for bespoke escalation paths.";

    if (question.includes('ransomware') || question.includes('stop')) {
      responseText = `To stop ransomware, immediate containment is critical. Follow these standardized steps: 
1. Isolate the infected system from the network immediately.
2. Disable SMB (port 445) across the branch if lateral movement is detected.
3. Preserve the encrypted state for forensic analysis.
4. Notify the Crisis Management Team and engage the Immutable Backup restoration process.`;
    } else if (question.includes('vulnerability') || question.includes('what is')) {
      responseText = "A vulnerability is a weakness in an IT system that can be exploited by an attacker to deliver a successful attack. In our context, exposed ports (like 3389 or 445) combined with missing patches are the most critical vectors. Would you like me to scan the active registry for you?";
    }

    setTimeout(() => {
      setMessages(prev => [...prev, { id: Date.now() + 1, sender: 'ai', text: responseText }]);
      setIsTyping(false);
    }, 1500);
  };

  const quickPrompts = [
    "How to stop ransomware?", 
    "What is this vulnerability?", 
    "Show active SOC protocols"
  ];

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-120px)] flex flex-col">
      <div className="mb-4">
        <h1 className="text-2xl font-bold tracking-tight text-gray-800 flex items-center">
          <Bot size={28} className="mr-3 text-unionBlue" /> Security Operations Assistant
        </h1>
        <p className="text-gray-500 mt-1">Ask questions about ongoing threats, past incidents, or mitigation playbooks.</p>
      </div>

      <div className="card flex-1 flex flex-col p-4 shadow-lg border-t-4 border-t-unionBlue overflow-hidden">
        
        {/* Chat Area */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-6 pb-4">
          <AnimatePresence>
            {messages.map((msg) => (
              <motion.div 
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                key={msg.id} 
                className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div className={`flex items-start max-w-[80%] ${msg.sender === 'user' ? 'flex-row-reverse' : ''}`}>
                  <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center mt-1 font-bold ${
                    msg.sender === 'user' ? 'bg-unionBlue text-white ml-3 shadow-md' : 'bg-gray-100 text-unionBlue border border-gray-200 mr-3 shadow-inner'
                  }`}>
                    {msg.sender === 'user' ? <User size={16} /> : <Bot size={18} />}
                  </div>
                  
                  <div className={`rounded-2xl p-4 text-sm font-medium leading-relaxed tracking-wide ${
                    msg.sender === 'user' 
                      ? 'bg-unionBlue text-white shadow-md rounded-tr-none' 
                      : 'bg-gray-50 text-gray-800 border border-gray-100 shadow-sm rounded-tl-none'
                  }`}>
                    {msg.sender === 'ai' ? (
                      msg.text.split('\n').map((line, i) => (
                        <span key={i} className="block mb-1.5 last:mb-0">
                          {line.match(/^\d\./) ? (
                            <span className="flex items-start"><span className="text-unionBlue mr-2 font-black">•</span> <span>{line}</span></span>
                          ) : (
                            line
                          )}
                        </span>
                      ))
                    ) : (
                      msg.text
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
            
            {isTyping && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-start">
                <div className="flex items-start">
                  <div className="w-8 h-8 rounded-full flex-shrink-0 bg-gray-100 border border-gray-200 text-unionBlue flex items-center justify-center mt-1 mr-3 shadow-inner">
                    <Bot size={18} />
                  </div>
                  <div className="bg-gray-50 rounded-2xl rounded-tl-none p-4 shadow-sm border border-gray-100 flex items-center space-x-2">
                    <div className="w-2 h-2 rounded-full bg-unionBlue animate-bounce"></div>
                    <div className="w-2 h-2 rounded-full bg-unionBlue animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    <div className="w-2 h-2 rounded-full bg-unionBlue animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                  </div>
                </div>
              </motion.div>
            )}
            <div ref={messagesEndRef} />
          </AnimatePresence>
        </div>

        {/* Input Area */}
        <div className="mt-auto pt-4 border-t border-gray-100">
          <div className="flex space-x-2 mb-3 overflow-x-auto pb-1 scrollbar-hide">
             {quickPrompts.map((prompt, i) => (
               <button 
                 key={i} 
                 onClick={() => setInput(prompt)}
                 className="flex-shrink-0 bg-blue-50 text-unionBlue text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 hover:bg-unionBlue hover:text-white transition-colors cursor-pointer"
               >
                 {prompt}
               </button>
             ))}
          </div>

          <form onSubmit={handleSend} className="relative">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Query the SOC knowledge base..."
              className="w-full pl-5 pr-14 py-4 bg-gray-50 border-2 border-gray-100 rounded-xl focus:bg-white focus:border-unionBlue focus:ring-0 transition-all outline-none text-sm font-medium tracking-wide shadow-inner"
              disabled={isTyping}
            />
            <button 
              type="submit" 
              disabled={!input.trim() || isTyping}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 w-10 h-10 bg-unionBlue text-white rounded-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-800 transition-colors shadow-md active:scale-95"
            >
              <Send size={18} className="ml-0.5" />
            </button>
          </form>
          <div className="text-center mt-3 text-[10px] text-gray-400 font-medium uppercase tracking-widest flex items-center justify-center">
            <Cpu size={12} className="mr-1" /> Powered by UnionCyberAI Core
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAssistant;
