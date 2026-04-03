import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles, Loader2, X } from 'lucide-react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { useAppSettings } from '../contexts/AppSettingsContext';
import { useDebug } from '../contexts/DebugContext';

interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface AIChatProps {
  onClose: () => void;
}

export function AIChat({ onClose }: AIChatProps) {
  const { t, settings } = useAppSettings();
  const { data: debugData, enabled: debugEnabled } = useDebug();
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: settings.language === 'ru' 
      ? 'Здравствуйте! Я ИИ-ассистент для управления городом Алматы. Задайте вопрос о данных города.' 
      : settings.language === 'kk'
      ? 'Сәлеметсіз бе! Мен Алматы қаласын басқару бойынша ЖИ-көмекшімін. Қала деректері туралы сұрақ қойыңыз.'
      : 'Hello! I am an AI assistant for Almaty city management. Ask me a question about city data.'
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || loading) return;

    const userMessage: ChatMessage = { role: 'user', content: input };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setLoading(true);

    const contextInfo = debugEnabled 
      ? `Debug mode active. Energy: ${debugData.energy.consumption} MW, Transport: ${debugData.transport.bus} units, Weather: ${debugData.weather.temp}°C`
      : '';

    const prompt = `You are an expert AI Smart City Analyst for Almaty, Kazakhstan. Answer the user's question about city data concisely and helpfully.

LANGUAGE REQUIREMENT:
- Respond in the same language as the user's question. If mixed, use Russian.

${contextInfo}

User question: ${input}`;

    try {
      const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY;
      
      if (!apiKey || apiKey === '' || apiKey === 'your_openrouter_api_key_here') {
        const fallback = settings.language === 'ru'
          ? 'ИИ недоступен. Добавьте API ключ для живых ответов.'
          : settings.language === 'kk'
          ? 'ЖИ қолжетімсіз. Тікелей жауаптар үшін API кілтін қосыңыз.'
          : 'AI unavailable. Add API key for live responses.';
        setMessages(prev => [...prev, { role: 'assistant', content: fallback }]);
        setLoading(false);
        return;
      }

      const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': window.location.origin,
          'X-Title': 'Smart City Dashboard',
        },
        body: JSON.stringify({
          model: 'qwen/qwen3.6-plus:free',
          messages: [
            { role: 'system', content: 'You are a Smart City AI analyst for Almaty. Respond in the user\'s language. Be concise and helpful.' },
            { role: 'user', content: prompt }
          ],
          temperature: 0.7,
          max_tokens: 500,
        })
      });

      if (!response.ok) throw new Error('API error');

      const data = await response.json();
      const content = data.choices?.[0]?.message?.content || 
        (settings.language === 'ru' ? 'Не удалось получить ответ.' : 'Failed to get response.');
      
      setMessages(prev => [...prev, { role: 'assistant', content }]);
    } catch (error) {
      const errorMsg = settings.language === 'ru'
        ? 'Ошибка подключения к ИИ. Попробуйте позже.'
        : settings.language === 'kk'
        ? 'ЖИ-ге қосылу қатесі. Кейінірек қайталаңыз.'
        : 'Failed to connect to AI. Try again later.';
      setMessages(prev => [...prev, { role: 'assistant', content: errorMsg }]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="fixed bottom-4 left-4 z-50 w-96 max-h-[500px] flex flex-col bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-2xl">
      {/* Header */}
      <div className="flex items-center justify-between p-3 border-b border-gray-200 dark:border-gray-700 bg-gradient-to-r from-purple-50 to-blue-50 dark:from-purple-900/30 dark:to-blue-900/30 rounded-t-lg">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-600" />
          <h3 className="text-sm font-semibold text-gray-800 dark:text-gray-200">{t('aiChat')}</h3>
        </div>
        <button onClick={onClose} className="p-1 hover:bg-gray-200 dark:hover:bg-gray-700 rounded transition-colors">
          <X className="w-4 h-4 text-gray-500 dark:text-gray-400" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 min-h-[300px] max-h-[350px]">
        {messages.map((msg, i) => (
          <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
              msg.role === 'user' 
                ? 'bg-purple-600 text-white' 
                : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
            }`}>
              {msg.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="bg-gray-100 dark:bg-gray-700 rounded-lg px-3 py-2 text-sm text-gray-600 dark:text-gray-300 flex items-center gap-2">
              <Loader2 className="w-3 h-3 animate-spin" />
              {t('aiChatThinking')}
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="p-3 border-t border-gray-200 dark:border-gray-700">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder={t('aiChatPlaceholder')}
            className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-purple-500"
            disabled={loading}
          />
          <Button
            onClick={handleSend}
            disabled={loading || !input.trim()}
            size="sm"
            className="bg-purple-600 hover:bg-purple-700 text-white"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </Card>
  );
}
