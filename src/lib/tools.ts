
import type { ComponentType } from 'react';
import { Icons } from '@/components/icons';
import AIChatTool from '@/components/tools/ai-chat';
import AICodeGeneratorTool from '@/components/tools/ai-code-generator';
import AIImageGeneratorTool from '@/components/tools/ai-image-generator';
import AISummarizerTool from '@/components/tools/ai-summarizer';
import CalculatorTool from '@/components/tools/calculator';
import NotesTool from '@/components/tools/notes';
import TodoListTool from '@/components/tools/todo-list';
import RandomNumberTool from '@/components/tools/random-number-generator';
import TranslatorTool from '@/components/tools/translator';
import AIEmotionDetectorTool from '@/components/tools/ai-emotion-detector';
import AIBrainstormTool from '@/components/tools/ai-brainstorm';
import AIGrammarCheckerTool from '@/components/tools/ai-grammar-checker';
import AISmartSearchTool from '@/components/tools/ai-smart-search';
import AITextRewriterTool from '@/components/tools/ai-text-rewriter';
import QRScannerTool from '@/components/tools/qr-scanner';
import UnitConverterTool from '@/components/tools/unit-converter';
import AIPhotoEnhancerTool from '@/components/tools/ai-photo-enhancer';
import AIStoryGeneratorTool from '@/components/tools/ai-story-generator';
import AIVoiceToTextTool from '@/components/tools/ai-voice-to-text';

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
    id: 'ai-image-generator',
    name: 'AI Image Generator',
    description: 'Create stunning images from textual descriptions.',
    icon: 'AIImageGenerator',
    category: 'AI',
    component: AIImageGeneratorTool,
    isFavorite: true,
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
    id: 'ai-smart-search',
    name: 'AI Smart Search',
    description: 'Get direct answers to your questions, powered by web search.',
    icon: 'AISmartSearch',
    category: 'AI',
    component: AISmartSearchTool,
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
    id: 'ai-photo-enhancer',
    name: 'AI Photo Enhancer',
    description: 'Automatically improve the quality of your photos.',
    icon: 'AIPhotoEnhancer',
    category: 'AI',
    component: AIPhotoEnhancerTool,
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
    id: 'notes-notepad',
    name: 'Notes / Notepad',
    description: 'Quickly jot down notes, ideas, and reminders.',
    icon: 'NotesNotepad',
    category: 'Offline',
    component: NotesTool,
  },
  {
    id: 'to-do-list',
    name: 'To-Do List',
    description: 'Organize your tasks and manage your productivity.',
    icon: 'ToDoList',
    category: 'Offline',
    component: TodoListTool,
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
   // Implemented Online Tools
  {
    id: 'translator',
    name: 'Translator',
    description: 'Translate text between a multitude of languages.',
    icon: 'Translator',
    category: 'Online',
    component: TranslatorTool,
    isFavorite: true,
  },
  // Placeholder Tools
  {
    id: 'weather-updates',
    name: 'Weather Updates',
    description: 'Get real-time weather forecasts for any location.',
    icon: 'WeatherUpdates',
    category: 'Online',
  },
  {
    id: 'flashlight',
    name: 'Flashlight',
    description: 'Use your device\'s LED as a powerful flashlight.',
    icon: 'Flashlight',
    category: 'Offline',
  },
  {
    id: 'compass',
    name: 'Compass',
    description: 'Find your direction with a simple and accurate compass.',
    icon: 'Compass',
    category: 'Offline',
  },
  {
    id: 'news-aggregator',
    name: 'News Aggregator',
    description: 'Your daily news briefing from sources you trust.',
    icon: 'NewsAggregator',
    category: 'Online',
  },
  {
    id: 'cloud-backup-sync',
    name: 'Cloud Backup/Sync',
    description: 'Sync your data and settings across all devices.',
    icon: 'CloudBackupSync',
    category: 'Online',
  },
  {
    id: 'pdf-reader',
    name: 'PDF Reader',
    description: 'View and manage your PDF documents on the go.',
    icon: 'PDFReader',
    category: 'Offline',
  },
  {
    id: 'voice-recorder',
    name: 'Voice Recorder',
    description: 'Record high-quality audio with a single tap.',
    icon: 'VoiceRecorder',
    category: 'Offline',
  },
];
