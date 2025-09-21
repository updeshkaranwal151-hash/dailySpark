
import type { ComponentType } from 'react';
import { Icons } from '@/components/icons';
import AIChatTool from '@/components/tools/ai-chat';
import AICodeGeneratorTool from '@/components/tools/ai-code-generator';
import AISummarizerTool from '@/components/tools/ai-summarizer';
import CalculatorTool from '@/components/tools/calculator';
import NotesTool from '@/components/tools/notes';
import TodoListTool from '@/components/tools/todo-list';
import RandomNumberTool from '@/components/tools/random-number-generator';
import TranslatorTool from '@/components/tools/translator';
import AIEmotionDetectorTool from '@/components/tools/ai-emotion-detector';
import AIBrainstormTool from '@/components/tools/ai-brainstorm';
import AIGrammarCheckerTool from '@/components/tools/ai-grammar-checker';
import AITextRewriterTool from '@/components/tools/ai-text-rewriter';
import QRScannerTool from '@/components/tools/qr-scanner';
import UnitConverterTool from '@/components/tools/unit-converter';
import AIStoryGeneratorTool from '@/components/tools/ai-story-generator';
import AIVoiceToTextTool from '@/components/tools/ai-voice-to-text';
import AIVideoSummarizerTool from '@/components/tools/ai-video-summarizer';
import WeatherTool from '@/components/tools/weather-tool';
import AISmartSearchTool from '@/components/tools/ai-smart-search';
import NewsAggregatorTool from '@/components/tools/news-aggregator';
import CompassTool from '@/components/tools/compass';
import PDFReaderTool from '@/components/tools/pdf-reader';
import VoiceRecorderTool from '@/components/tools/voice-recorder';

export interface Tool {
  id: string;
  name: string;
  description: string;
  icon: keyof typeof Icons;
  category: 'Offline' | 'Online' | 'AI';
  component?: ComponentType;
  isFavorite?: boolean;
}

export const allTools: Tool[] = [
  // Implemented AI Tools
  {
    id: 'ai-chat-assistant',
    name: 'AI Chat Assistant',
    description: 'Engage in conversations with an intelligent AI assistant.',
    icon: 'AIChatAssistant',
    category: 'AI',
    component: AIChatTool,
    isFavorite: true,
  },
  {
    id: 'ai-code-generator',
    name: 'AI Code Generator',
    description: 'Generate code snippets in various languages from descriptions.',
    icon: 'AICodingScriptGenerator',
    category: 'AI',
    component: AICodeGeneratorTool,
  },
  {
    id: 'ai-summarizer',
    name: 'AI Summarizer',
    description: 'Get concise summaries of long texts or articles.',
    icon: 'AISummarizer',
    category: 'AI',
    component: AISummarizerTool,
  },
  {
    id: 'ai-emotion-detector',
    name: 'AI Emotion Detector',
    description: 'Analyze text to determine the underlying emotion.',
    icon: 'AIEmotionDetector',
    category: 'AI',
    component: AIEmotionDetectorTool,
  },
  {
    id: 'ai-brainstorm-generator',
    name: 'AI Idea Generator',
    description: 'Generate creative ideas for any topic.',
    icon: 'AIBrainstormIdeaGenerator',
    category: 'AI',
    component: AIBrainstormTool,
  },
  {
    id: 'ai-grammar-spell-checker',
    name: 'AI Grammar & Spell Checker',
    description: 'Corrects grammar and spelling mistakes in your text.',
    icon: 'AIGrammarSpellChecker',
    category: 'AI',
    component: AIGrammarCheckerTool,
  },
  {
    id: 'ai-text-rewriter',
    name: 'AI Text Rewriter',
    description: 'Paraphrase and rewrite text to improve clarity.',
    icon: 'AITextRewriter',
    category: 'AI',
    component: AITextRewriterTool,
  },
  {
    id: 'ai-story-generator',
    name: 'AI Story Generator',
    description: 'Write short stories from a simple prompt.',
    icon: 'AIStoryGenerator',
    category: 'AI',
    component: AIStoryGeneratorTool,
  },
  {
    id: 'ai-voice-to-text',
    name: 'AI Voice to Text',
    description: 'Transcribe audio files into text.',
    icon: 'AIVoiceToText',
    category: 'AI',
    component: AIVoiceToTextTool,
  },
   {
    id: 'ai-video-summarizer',
    name: 'AI Video Summarizer',
    description: 'Generate a summary from a video file.',
    icon: 'AIVideoSummarizer',
    category: 'AI',
    component: AIVideoSummarizerTool,
  },
  {
    id: 'ai-smart-search',
    name: 'AI Smart Search',
    description: 'Get direct answers to your questions from the web.',
    icon: 'AISmartSearch',
    category: 'AI',
    component: AISmartSearchTool,
  },
  // Implemented Offline Tools
  {
    id: 'calculator',
    name: 'Calculator',
    description: 'Perform basic and scientific calculations.',
    icon: 'Calculator',
    category: 'Offline',
    component: CalculatorTool,
    isFavorite: true,
  },
  {
    id: 'random-number-generator',
    name: 'Random Number Generator',
    description: 'Generate random numbers within a specified range.',
    icon: 'RandomNumberGenerator',
    category: 'Offline',
    component: RandomNumberTool,
  },
  {
    id: 'qr-barcode-scanner',
    name: 'QR/Barcode Scanner',
    description: 'Scan and decode QR codes and barcodes instantly.',
    icon: 'QRBarcodeScanner',
    category: 'Offline',
    component: QRScannerTool,
  },
  {
    id: 'unit-converter',
    name: 'Unit Converter',
    description: 'Convert between various units of measurement.',
    icon: 'UnitConverter',
    category: 'Offline',
    component: UnitConverterTool,
  },
  {
    id: 'compass',
    name: 'Compass',
    description: 'Find your direction with a simple and accurate compass.',
    icon: 'Compass',
    category: 'Offline',
    component: CompassTool,
  },
  {
    id: 'pdf-reader',
    name: 'PDF Reader',
    description: 'View and manage your PDF documents on the go.',
    icon: 'PDFReader',
    category: 'Offline',
    component: PDFReaderTool,
  },
  {
    id: 'voice-recorder',
    name: 'Voice Recorder',
    description: 'Record high-quality audio with a single tap.',
    icon: 'VoiceRecorder',
    category: 'Offline',
    component: VoiceRecorderTool,
  },
   // Implemented Online Tools
  {
    id: 'notes-notepad',
    name: 'Notes / Notepad',
    description: 'Quickly jot down notes, ideas, and reminders.',
    icon: 'NotesNotepad',
    category: 'Online',
    component: NotesTool,
  },
  {
    id: 'to-do-list',
    name: 'To-Do List',
    description: 'Organize your tasks and manage your productivity.',
    icon: 'ToDoList',
    category: 'Online',
    component: TodoListTool,
  },
  {
    id: 'translator',
    name: 'Translator',
    description: 'Translate text between a multitude of languages.',
    icon: 'Translator',
    category: 'Online',
    component: TranslatorTool,
    isFavorite: true,
  },
  {
    id: 'weather-updates',
    name: 'Weather Updates',
    description: 'Get real-time weather forecasts for any location.',
    icon: 'WeatherUpdates',
    category: 'Online',
    component: WeatherTool,
  },
  {
    id: 'news-aggregator',
    name: 'News Aggregator',
    description: 'Your daily news briefing from sources you trust.',
    icon: 'NewsAggregator',
    category: 'Online',
    component: NewsAggregatorTool,
  },
  {
    id: 'cloud-backup-sync',
    name: 'Cloud Backup/Sync',
    description: 'Sync your data and settings across all devices.',
    icon: 'CloudBackupSync',
    category: 'Online',
  },
];
