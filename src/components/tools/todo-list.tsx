'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Trash2 } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

interface TodoItem {
  id: number;
  text: string;
  completed: boolean;
}

export default function TodoListTool() {
  const [todos, setTodos] = useState<TodoItem[]>([]);
  const [input, setInput] = useState('');

  useEffect(() => {
    const savedTodos = localStorage.getItem('daily-spark-todos');
    if (savedTodos) {
      setTodos(JSON.parse(savedTodos));
    }
  }, []);
  
  useEffect(() => {
    localStorage.setItem('daily-spark-todos', JSON.stringify(todos));
  }, [todos]);

  const handleAddTodo = () => {
    if (input.trim() === '') return;
    const newTodo: TodoItem = {
      id: Date.now(),
      text: input,
      completed: false,
    };
    setTodos(prev => [newTodo, ...prev]);
    setInput('');
  };

  const toggleTodo = (id: number) => {
    setTodos(
      todos.map(todo =>
        todo.id === id ? { ...todo, completed: !todo.completed } : todo
      )
    );
  };

  const deleteTodo = (id: number) => {
    setTodos(todos.filter(todo => todo.id !== id));
  };
  
  const completedCount = todos.filter(t => t.completed).length;
  const totalCount = todos.length;

  return (
    <div className="flex flex-col h-[60vh]">
      <div className="flex gap-2 p-1">
        <Input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyPress={e => e.key === 'Enter' && handleAddTodo()}
          placeholder="Add a new task..."
        />
        <Button onClick={handleAddTodo} size="icon">
          <Plus className="h-4 w-4" />
        </Button>
      </div>
      <ScrollArea className="flex-1 my-4">
        <AnimatePresence>
          {todos.length > 0 ? (
            <div className="space-y-2 pr-4">
              {todos.map(todo => (
                <motion.div
                  key={todo.id}
                  layout
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, transition: { duration: 0.2 } }}
                  className="flex items-center gap-3 p-3 rounded-md bg-muted/50"
                >
                  <Checkbox
                    id={`todo-${todo.id}`}
                    checked={todo.completed}
                    onCheckedChange={() => toggleTodo(todo.id)}
                  />
                  <label
                    htmlFor={`todo-${todo.id}`}
                    className={`flex-1 text-sm cursor-pointer ${todo.completed ? 'line-through text-muted-foreground' : ''}`}
                  >
                    {todo.text}
                  </label>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-muted-foreground hover:text-destructive" onClick={() => deleteTodo(todo.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </motion.div>
              ))}
            </div>
          ) : (
             <div className="text-center text-muted-foreground p-8">
                <p>Your to-do list is empty.</p>
                <p>Add a task to get started!</p>
             </div>
          )}
        </AnimatePresence>
      </ScrollArea>
       <div className="text-sm text-muted-foreground p-1">
        {totalCount > 0 && (
            <span>{completedCount} of {totalCount} tasks completed.</span>
        )}
      </div>
    </div>
  );
}
