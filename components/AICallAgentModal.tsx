'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Phone, Mic, Send, X, Volume2, VolumeX, Loader } from 'lucide-react';
import { VoiceAssistant } from '@/lib/voice-assistant';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

interface AICallAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export default function AICallAgentModal({ isOpen, onClose, locale }: AICallAgentModalProps) {
  const t = getTranslation(locale);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceAssistant, setVoiceAssistant] = useState<VoiceAssistant | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize voice assistant
  useEffect(() => {
    if (!isOpen) return;

    const setup = async () => {
      const assistant = new VoiceAssistant({
        language: getLanguageCode(locale),
        onTranscript: (transcript) => {
          console.log('[v0] Voice transcript received:', transcript);
          setInput(transcript);
          setIsListening(false);
        },
        onError: (error) => {
          console.error('[v0] Voice error:', error);
          setIsListening(false);
        },
        onStart: () => {
          console.log('[v0] Voice listening started');
          setIsListening(true);
        },
        onEnd: () => {
          console.log('[v0] Voice listening ended');
          setIsListening(false);
        },
      });
      setVoiceAssistant(assistant);
    };

    setup();
  }, [isOpen, locale]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getLanguageCode = (loc: Locale): string => {
    const codes: Record<Locale, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      ml: 'ml-IN',
      ur: 'ur-IN',
    };
    return codes[loc] || 'en-US';
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      // Call Groq API
      const response = await fetch('/api/groq-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: input,
          language: locale,
        }),
      });

      if (!response.ok) throw new Error('Failed to get response');

      const data = await response.json();
      console.log('[v0] Groq response:', data);

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: data.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, assistantMessage]);

      // Speak response if not muted
      if (voiceAssistant && !isMuted) {
        console.log('[v0] Speaking response:', data.response);
        await voiceAssistant.speak(data.response);
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 2).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error. Please try again.',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!voiceAssistant || !voiceAssistant.isSupported()) {
      alert('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      voiceAssistant.startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md flex flex-col max-h-96 md:max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <h2 className="text-lg font-bold">AI Farm Agent</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm">Ask our AI agent for farming help</p>
                <p className="text-xs mt-1 opacity-70">Available in {locale.toUpperCase()}</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-xs ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground border border-border'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground border border-border rounded-lg px-3 py-2 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a question..."
              disabled={isLoading}
              className="text-sm"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant={isListening ? 'default' : 'outline'}
              onClick={handleVoiceInput}
              className="text-xs"
            >
              <Mic className={`h-3 w-3 mr-1 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Listening...' : 'Voice'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
              className="text-xs"
            >
              {isMuted ? <VolumeX className="h-3 w-3 mr-1" /> : <Volume2 className="h-3 w-3 mr-1" />}
              {isMuted ? 'Muted' : 'Sound'}
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            <p>Using Groq AI • {locale.toUpperCase()}</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  type: 'text' | 'voice';
  timestamp: Date;
}

interface AICallAgentModalProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export default function AICallAgentModal({ isOpen, onClose, locale }: AICallAgentModalProps) {
  const t = getTranslation(locale);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const [isMuted, setIsMuted] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceAssistant, setVoiceAssistant] = useState<VoiceAssistant | null>(null);
  const [showStatus, setShowStatus] = useState(false);

  // Initialize IndexedDB and voice assistant
  useEffect(() => {
    if (!isOpen) return;

    const setup = async () => {
      await initDB();
      const assistant = new VoiceAssistant({
        language: getLanguageCode(locale),
        onTranscript: (transcript) => {
          setInput(transcript);
          setIsListening(false);
        },
        onError: (error) => {
          console.error('[v0] Voice error:', error);
          setIsListening(false);
        },
        onStart: () => setIsListening(true),
        onEnd: () => setIsListening(false),
      });
      setVoiceAssistant(assistant);

      // Setup online listener
      setupOnlineListener(() => {
        setIsOnline(true);
        setShowStatus(true);
        setTimeout(() => setShowStatus(false), 3000);
      });

      // Check initial online status
      setIsOnline(navigator.onLine);
    };

    setup();
  }, [isOpen, locale]);

  // Monitor online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowStatus(true);
      setTimeout(() => setShowStatus(false), 3000);
    };
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const getLanguageCode = (loc: Locale): string => {
    const codes: Record<Locale, string> = {
      en: 'en-US',
      hi: 'hi-IN',
      kn: 'kn-IN',
      ta: 'ta-IN',
      te: 'te-IN',
      bn: 'bn-IN',
      ml: 'ml-IN',
      ur: 'ur-PK',
    };
    return codes[loc] || 'en-US';
  };

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input,
      type: 'text',
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      if (isOnline) {
        // Send to API immediately
        const response = await fetch('/api/groq-query', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: input, language: locale }),
        });

        if (!response.ok) throw new Error('API call failed');
        const data = await response.json();

        const assistantMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: data.response,
          type: 'text',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, assistantMessage]);

        // Save to IndexedDB
        const queryId = await saveQuery({
          prompt: input,
          type: 'text',
          status: 'completed',
          createdAt: Date.now(),
        });

        await saveResponse({
          queryId,
          response: data.response,
          createdAt: Date.now(),
        });

        // Speak response
        if (voiceAssistant && !isMuted) {
          await voiceAssistant.speak(data.response);
        }
      } else {
        // Store offline
        const queryId = await saveQuery({
          prompt: input,
          type: 'text',
          status: 'pending',
          createdAt: Date.now(),
        });

        const statusMessage: Message = {
          id: (Date.now() + 1).toString(),
          role: 'assistant',
          content: 'Query stored offline. Will process automatically when internet returns.',
          type: 'text',
          timestamp: new Date(),
        };

        setMessages((prev) => [...prev, statusMessage]);
        setShowStatus(true);
      }
    } catch (error) {
      console.error('[v0] Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: 'Sorry, there was an error processing your query. Please try again.',
        type: 'text',
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleVoiceInput = () => {
    if (!voiceAssistant || !voiceAssistant.isSupported()) {
      alert('Voice input is not supported in your browser');
      return;
    }

    if (isListening) {
      voiceAssistant.stopListening();
      setIsListening(false);
    } else {
      voiceAssistant.startListening();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-md flex flex-col max-h-96 md:max-h-[600px]">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 text-white flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Phone className="h-5 w-5" />
            <h2 className="text-lg font-bold">AI Farm Agent</h2>
          </div>
          <button
            onClick={onClose}
            className="hover:bg-white/20 rounded-full p-1 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Status Bar */}
        {showStatus && (
          <div className={`px-4 py-2 text-xs font-medium ${isOnline ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {isOnline ? 'Internet reconnected - Processing queries' : 'Offline mode - Queries will process when online'}
          </div>
        )}

        {/* Messages */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <div>
                <div className="h-12 w-12 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center mx-auto mb-2">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <p className="text-sm">Start a conversation with our AI agent</p>
                <p className="text-xs mt-1 opacity-70">Available in {locale.toUpperCase()}</p>
              </div>
            </div>
          ) : (
            messages.map((msg) => (
              <div key={msg.id} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`rounded-lg px-3 py-2 text-sm max-w-xs ${
                    msg.role === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-muted text-foreground border border-border'
                  }`}
                >
                  <p>{msg.content}</p>
                  <span className="text-xs opacity-70 mt-1 block">
                    {msg.timestamp.toLocaleTimeString()}
                  </span>
                </div>
              </div>
            ))
          )}
          {isLoading && (
            <div className="flex justify-start">
              <div className="bg-muted text-foreground border border-border rounded-lg px-3 py-2 flex items-center gap-2">
                <Loader className="h-4 w-4 animate-spin" />
                <span className="text-sm">Processing...</span>
              </div>
            </div>
          )}
        </div>

        {/* Input Area */}
        <div className="border-t border-border p-4 space-y-3">
          <div className="flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
              placeholder="Ask a farming question..."
              disabled={isLoading}
              className="text-sm"
            />
            <Button
              size="icon"
              onClick={handleSendMessage}
              disabled={isLoading || !input.trim()}
              className="h-9 w-9"
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>

          <div className="flex gap-2 justify-center">
            <Button
              size="sm"
              variant={isListening ? 'default' : 'outline'}
              onClick={handleVoiceInput}
              className="text-xs"
            >
              <Mic className={`h-3 w-3 mr-1 ${isListening ? 'animate-pulse' : ''}`} />
              {isListening ? 'Listening...' : 'Voice'}
            </Button>
            <Button
              size="sm"
              variant="outline"
              onClick={() => setIsMuted(!isMuted)}
              className="text-xs"
            >
              {isMuted ? <VolumeX className="h-3 w-3 mr-1" /> : <Volume2 className="h-3 w-3 mr-1" />}
              {isMuted ? 'Muted' : 'Sound'}
            </Button>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            <p>Status: <span className={isOnline ? 'text-green-600 font-medium' : 'text-yellow-600 font-medium'}>{isOnline ? 'Online' : 'Offline'}</span></p>
          </div>
        </div>
      </Card>
    </div>
  );
}
