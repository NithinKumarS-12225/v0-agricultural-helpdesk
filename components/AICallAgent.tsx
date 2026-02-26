'use client';

import React, { useState, useEffect, useRef } from 'react';
import type { Locale } from '@/i18n.config';
import { getTranslation } from '@/lib/translations';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { initDB, saveQuery, saveResponse, getPendingQueries, updateQueryStatus, getResponsesByQueryId } from '@/lib/db';
import { Phone, Send, Mic, Volume2, VolumeX, X, Loader } from 'lucide-react';

interface Message {
  id: string;
  type: 'user' | 'agent';
  content: string;
  timestamp: number;
}

interface AICallAgentProps {
  isOpen: boolean;
  onClose: () => void;
  locale: Locale;
}

export default function AICallAgent({ isOpen, onClose, locale }: AICallAgentProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [isListening, setIsListening] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const recognitionRef = useRef<any>(null);
  const synthesisRef = useRef<any>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const t = getTranslation(locale);

  // Initialize voice recognition
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const SpeechRecognition = window.SpeechRecognition || (window as any).webkitSpeechRecognition;
      if (SpeechRecognition) {
        recognitionRef.current = new SpeechRecognition();
        recognitionRef.current.continuous = false;
        recognitionRef.current.interimResults = false;

        recognitionRef.current.onstart = () => setIsListening(true);
        recognitionRef.current.onend = () => setIsListening(false);

        recognitionRef.current.onresult = (event: any) => {
          let transcript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            transcript += event.results[i][0].transcript;
          }
          setInput(transcript);
          // Auto-submit after speech recognition
          setTimeout(() => handleSubmit(transcript), 500);
        };

        recognitionRef.current.onerror = (event: any) => {
          console.log('[v0] Speech recognition error:', event.error);
        };
      }
    }
  }, []);

  // Listen for online/offline status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      processPendingQueries();
    };

    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-scroll to latest message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const speakResponse = (text: string) => {
    if (isMuted || !text) return;

    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = locale === 'en' ? 'en-US' : locale === 'hi' ? 'hi-IN' : locale === 'kn' ? 'kn-IN' : locale === 'ta' ? 'ta-IN' : locale === 'te' ? 'te-IN' : locale === 'bn' ? 'bn-IN' : locale === 'ml' ? 'ml-IN' : 'ur-PK';
      window.speechSynthesis.speak(utterance);
    }
  };

  const callGroqAPI = async (query: string): Promise<string> => {
    try {
      const response = await fetch('/api/groq-query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: query, language: locale }),
      });

      if (!response.ok) throw new Error('API call failed');

      const data = await response.json();
      return data.response || 'Unable to process your query. Please try again.';
    } catch (error) {
      console.log('[v0] API error:', error);
      return 'Error: Unable to connect to AI service. Your query has been saved and will be processed when online.';
    }
  };

  const handleSubmit = async (queryText?: string) => {
    const finalQuery = queryText || input;
    if (!finalQuery.trim()) return;

    setInput('');
    const messageId = Date.now().toString();

    // Add user message
    setMessages((prev) => [
      ...prev,
      { id: messageId, type: 'user', content: finalQuery, timestamp: Date.now() },
    ]);

    setIsLoading(true);

    try {
      const queryId = await saveQuery({
        prompt: finalQuery,
        type: 'text',
        status: isOnline ? 'completed' : 'pending',
        createdAt: Date.now(),
      });

      if (isOnline) {
        const agentResponse = await callGroqAPI(finalQuery);
        await saveResponse({ queryId, response: agentResponse, createdAt: Date.now() });

        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${messageId}`,
            type: 'agent',
            content: agentResponse,
            timestamp: Date.now(),
          },
        ]);

        speakResponse(agentResponse);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${messageId}`,
            type: 'agent',
            content: 'Your query has been saved offline. It will be processed automatically when internet returns.',
            timestamp: Date.now(),
          },
        ]);
      }
    } catch (error) {
      console.log('[v0] Error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const processPendingQueries = async () => {
    try {
      const pending = await getPendingQueries();

      for (const query of pending) {
        const response = await callGroqAPI(query.prompt);
        const queryId = query.id!;

        await saveResponse({
          queryId,
          response,
          createdAt: Date.now(),
        });

        await updateQueryStatus(queryId, 'completed');

        setMessages((prev) => [
          ...prev,
          {
            id: `agent-${queryId}`,
            type: 'agent',
            content: response,
            timestamp: Date.now(),
          },
        ]);

        speakResponse(response);
      }
    } catch (error) {
      console.log('[v0] Error processing pending queries:', error);
    }
  };

  const toggleVoiceInput = () => {
    if (recognitionRef.current) {
      if (isListening) {
        recognitionRef.current.stop();
      } else {
        recognitionRef.current.start();
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <Card className="w-full max-w-2xl max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Phone className="h-6 w-6" />
            <div>
              <h2 className="text-2xl font-bold">AI Farm Agent</h2>
              <p className="text-sm opacity-90">
                {isOnline ? 'Connected - Online Mode' : 'Offline Mode - Queries will sync when online'}
              </p>
            </div>
          </div>
          <button onClick={onClose} className="hover:bg-white/20 rounded-full p-2">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Chat Area */}
        <div className="h-96 overflow-y-auto p-6 space-y-4 bg-background">
          {messages.length === 0 ? (
            <div className="flex h-full items-center justify-center text-center text-muted-foreground">
              <p>Start by asking a farming question. Voice or text input welcome!</p>
            </div>
          ) : (
            messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs rounded-lg px-4 py-2 ${
                    msg.type === 'user'
                      ? 'bg-primary text-primary-foreground'
                      : 'bg-card border border-border text-foreground'
                  }`}
                >
                  <p className="text-sm">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={messagesEndRef} />
        </div>

        {/* Input Area */}
        <div className="border-t border-border bg-card p-6 space-y-4">
          <div className="flex gap-2">
            <Input
              placeholder="Type your question or click microphone..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
              disabled={isLoading}
            />
            <Button
              onClick={toggleVoiceInput}
              variant="outline"
              size="icon"
              disabled={isLoading}
              className={isListening ? 'bg-red-500/20 border-red-500' : ''}
            >
              <Mic className="h-4 w-4" />
            </Button>
            <Button onClick={() => handleSubmit()} disabled={isLoading} size="icon">
              {isLoading ? <Loader className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsMuted(!isMuted)}
              className="flex-1"
            >
              {isMuted ? (
                <>
                  <VolumeX className="mr-2 h-4 w-4" />
                  Unmute
                </>
              ) : (
                <>
                  <Volume2 className="mr-2 h-4 w-4" />
                  Mute
                </>
              )}
            </Button>
            <div className="text-xs text-muted-foreground flex items-center">
              {isOnline ? (
                <span className="text-green-600 font-semibold">● Online</span>
              ) : (
                <span className="text-yellow-600 font-semibold">● Offline</span>
              )}
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
}
