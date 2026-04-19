import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { MessageCircle, X, Send, Bot } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello 👋 Welcome to LUMIÈRE Jewel! I'm your AI concierge. How can I help you sparkle today?",
      sender: 'bot',
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  // Auto-open chatbot only on the FAQ page
  useEffect(() => {
    if (location.pathname === '/faq') {
      // Add a tiny delay so the transition looks smooth
      setTimeout(() => setIsOpen(true), 500);
    } else {
      setIsOpen(false);
    }
  }, [location.pathname]);

  // Hide the icon completely on all pages EXCEPT the FAQ page
  if (location.pathname !== '/faq') {
    return null;
  }

  const generateBotResponse = (userText: string) => {
    const text = userText.toLowerCase().trim();

    // Condensed Master Knowledge Base
    const knowledgeBase = [
      // 1. Brand Identity & Trust
      {
        keywords: ['who are', 'what is', 'brand', 'premium', 'luxury', 'trust', 'trustworthy'],
        response: "LUMIÈRE is a premium jewellery brand focusing on luxury, high-quality craftsmanship, and modern designs. We guarantee certified jewellery built on absolute transparency and quality standards."
      },
      // 2. Who & Where
      {
        keywords: ['where', 'location', 'store', 'visit', 'branch', 'online', 'who can buy', 'men', 'women', 'kids'],
        response: "Our beautiful pieces can be conveniently purchased online. We offer collections suitable for everyone—men, women, and kids. If a physical store is available in your city, we'd love for you to visit!"
      },
      // 3. Products
      {
        keywords: ['product', 'products', 'sell', 'offer', 'collection', 'ring', 'necklace', 'earring', 'bracelet', 'bangle', 'bridal', 'daily wear', 'men'],
        response: "We offer an exclusive range of Rings, Necklaces (short, layered, bridal), Earrings (studs, hoops, drops), Bracelets, Bangles, and complete Bridal sets. We also offer elegant daily wear and men's jewellery!"
      },
      // 4. Materials
      {
        keywords: ['gold', 'diamond', 'silver', 'gemstone', 'types'],
        response: "We craft jewelry in multiple purities of Gold, highly stylish Silver collections, and certified Diamond and Gemstone jewelry."
      },
      // 5. Certification & Uniqueness
      {
        keywords: ['unique', 'certif', 'authentic', 'hallmark', 'igi', 'gia'],
        response: "What makes us unique is our commitment to quality! All our gold is 100% BIS Hallmarked and every diamond is IGI or GIA certified to guarantee authenticity."
      },
      // 6. Customization
      {
        keywords: ['custom', 'design', 'engrave', 'name', 'message', 'redesign', 'old'],
        response: "Yes! We offer fully customized designs. You can engrave names and messages, or even redesign your old jewellery into beautiful modern pieces!"
      },
      // 7. Pricing
      {
        keywords: ['price', 'cost', 'charge', 'rate', 'priced'],
        response: "Our jewellery is transparently priced based on weight, purity, and making charges. Please note that gold prices change daily based on global market rates."
      },
      // 8. Orders
      {
        keywords: ['order', 'cancel', 'how to'],
        response: "To place an order: Select product → Add to cart → Checkout. If you change your mind, you can cancel your order anytime before dispatch."
      },
      // 9. Shipping & Delivery
      {
        keywords: ['ship', 'deliver', 'delivery', 'time', 'long', 'arrive', 'dispatch'],
        response: "Yes, we offer secure delivery services! Depending on your location, delivery usually takes 3–10 business days."
      },
      // 10. Fallbacks
      {
        keywords: ['hi', 'hello', 'hey', 'greetings'],
        response: "Hello there! I'm your AI jewelry concierge. I can answer questions about our products, customization, pricing, or shipping."
      }
    ];

    let bestMatch = null;
    let maxMatches = 0;

    for (const intent of knowledgeBase) {
      const matchCount = intent.keywords.filter(kw => text.includes(kw)).length;
      if (matchCount > maxMatches) {
        maxMatches = matchCount;
        bestMatch = intent.response;
      }
    }

    return bestMatch || "I'm still learning! For highly specific inquiries concerning your beautiful jewelry, please contact our customer care team directly at +91 98765 43210. How else can I assist you today?";
  };

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputValue.trim()) return;
    sendDirectMessage(inputValue.trim());
  };

  const sendDirectMessage = (text: string) => {
    const userMessage: Message = {
      id: Date.now(),
      text: text,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);

    setTimeout(() => {
      const botResponse: Message = {
        id: Date.now() + 1,
        text: generateBotResponse(text),
        sender: 'bot',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botResponse]);
      setIsTyping(false);
    }, 1000);
  };

  const recommendedQuestions = [
    "What products do you offer?",
    "Do you offer customizations?",
    "How is jewellery priced?",
    "Do you offer delivery?"
  ];

  return (
    <>
      <div className="fixed bottom-6 left-6 z-[100] flex flex-col items-start gap-4">
        
        {/* Chat Window */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="w-80 sm:w-96 bg-card border shadow-xl rounded-2xl overflow-hidden flex flex-col mb-2 origin-bottom-left"
              style={{ maxHeight: '600px', height: '65vh' }}
            >
              {/* Header */}
              <div className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <Bot className="w-5 h-5" />
                  <div>
                    <h3 className="font-medium text-sm">Lumière Assistant</h3>
                    <p className="text-[10px] opacity-80 uppercase tracking-wider">AI Support</p>
                  </div>
                </div>
                <button 
                  onClick={() => setIsOpen(false)}
                  className="p-1 hover:bg-white/20 rounded-md transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Messages Area */}
              <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-muted/20">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] whitespace-pre-wrap rounded-2xl px-4 py-2.5 text-sm ${
                        msg.sender === 'user'
                          ? 'bg-primary text-primary-foreground rounded-br-sm'
                          : 'bg-background border rounded-bl-sm shadow-sm text-foreground'
                      }`}
                    >
                      {msg.text}
                    </div>
                    <span className="text-[10px] text-muted-foreground mt-1 px-1">
                      {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                ))}
                
                {isTyping && (
                  <div className="flex items-start">
                    <div className="bg-background border rounded-2xl rounded-bl-sm px-4 py-3 shadow-sm flex gap-1">
                      <motion.div className="w-1.5 h-1.5 bg-primary/40 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0 }} />
                      <motion.div className="w-1.5 h-1.5 bg-primary/40 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }} />
                      <motion.div className="w-1.5 h-1.5 bg-primary/40 rounded-full" animate={{ y: [0, -3, 0] }} transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }} />
                    </div>
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Recommended Questions & Input Area */}
              <div className="bg-background border-t">
                
                {/* Horizontal scrollable recommended questions */}
                {messages.length < 5 && (
                  <div className="flex overflow-x-auto gap-2 p-3 pb-0 no-scrollbar" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                    {recommendedQuestions.map((q, idx) => (
                      <button
                        key={idx}
                        onClick={() => sendDirectMessage(q)}
                        className="whitespace-nowrap bg-muted/40 hover:bg-muted text-xs px-3 py-1.5 rounded-full transition-colors border shadow-sm text-foreground/80 font-medium"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}

                <div className="p-3">
                  <form onSubmit={handleSendMessage} className="flex gap-2">
                  <input
                    type="text"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    placeholder="Type your question..."
                    className="flex-1 bg-muted/30 border-none rounded-full px-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary"
                    disabled={isTyping}
                  />
                  <Button 
                    type="submit" 
                    size="icon" 
                    className="rounded-full w-10 h-10 flex-shrink-0"
                    disabled={!inputValue.trim() || isTyping}
                  >
                    <Send className="w-4 h-4 ml-0.5" />
                  </Button>
                </form>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Toggle Button */}
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsOpen(!isOpen)}
          className="w-14 h-14 bg-primary text-primary-foreground rounded-full shadow-lg flex items-center justify-center relative hover:bg-primary/90 transition-colors"
        >
          <AnimatePresence mode="wait">
            {isOpen ? (
              <motion.div
                key="close"
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: 90 }}
                transition={{ duration: 0.2 }}
              >
                <X className="w-6 h-6" />
              </motion.div>
            ) : (
              <motion.div
                key="open"
                initial={{ opacity: 0, rotate: 90 }}
                animate={{ opacity: 1, rotate: 0 }}
                exit={{ opacity: 0, rotate: -90 }}
                transition={{ duration: 0.2 }}
                className="relative"
              >
                <MessageCircle className="w-6 h-6" />
                <span className="absolute -top-1 -right-1 flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-gold-light opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-gold"></span>
                </span>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.button>
        
      </div>
    </>
  );
}
