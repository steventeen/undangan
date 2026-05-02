'use client';

import { useBuilderStore } from '@/lib/store';
import { 
  DndContext, 
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { SortableSection } from './SortableSection';
import { motion, AnimatePresence } from 'framer-motion';
import { Smartphone, Monitor, Tablet, Undo2, Redo2, Eye } from 'lucide-react';
import { useState } from 'react';

export default function VisualCanvas() {
  const { invitation, setActiveSection, reorderSections, undo, redo, historyIndex, history } = useBuilderStore();
  const [viewMode, setViewMode] = useState<'mobile' | 'tablet' | 'desktop'>('mobile');

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  if (!invitation) return null;

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = invitation.sections.findIndex((s) => s.id === active.id);
      const newIndex = invitation.sections.findIndex((s) => s.id === over.id);
      
      const newSections = arrayMove(invitation.sections, oldIndex, newIndex);
      reorderSections(newSections);
    }
  };

  const activeSections = invitation.sections.filter(s => s.enabled).sort((a, b) => a.order - b.order);

  const containerVariants = {
    mobile: { width: 375, height: 812, borderRadius: 40 },
    tablet: { width: 768, height: 1024, borderRadius: 20 },
    desktop: { width: '100%', height: '100%', borderRadius: 0 }
  };

  return (
    <div className="flex flex-col h-full bg-gray-100/50">
      {/* Canvas Toolbar */}
      <div className="flex items-center justify-between px-6 py-3 bg-white border-b border-gray-200">
        <div className="flex items-center gap-2">
          <button 
            onClick={undo} 
            disabled={historyIndex <= 0}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
          >
            <Undo2 size={18} />
          </button>
          <button 
            onClick={redo} 
            disabled={historyIndex >= history.length - 1}
            className="p-2 hover:bg-gray-100 rounded-lg disabled:opacity-30 transition-colors"
          >
            <Redo2 size={18} />
          </button>
        </div>

        <div className="flex items-center bg-gray-100 p-1 rounded-xl">
          <button 
            onClick={() => setViewMode('mobile')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'mobile' ? 'bg-white shadow-sm text-rose-500' : 'text-gray-400'}`}
          >
            <Smartphone size={18} />
          </button>
          <button 
            onClick={() => setViewMode('tablet')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'tablet' ? 'bg-white shadow-sm text-rose-500' : 'text-gray-400'}`}
          >
            <Tablet size={18} />
          </button>
          <button 
            onClick={() => setViewMode('desktop')}
            className={`p-2 rounded-lg transition-all ${viewMode === 'desktop' ? 'bg-white shadow-sm text-rose-500' : 'text-gray-400'}`}
          >
            <Monitor size={18} />
          </button>
        </div>

        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2 bg-gray-900 text-white text-sm font-bold rounded-xl hover:bg-gray-800 transition-all shadow-lg shadow-gray-200">
            <Eye size={16} /> Preview
          </button>
        </div>
      </div>

      {/* Canvas Area */}
      <div className="flex-1 overflow-hidden relative p-8 flex items-center justify-center">
        <motion.div
          animate={viewMode}
          variants={containerVariants}
          transition={{ type: 'spring', damping: 25, stiffness: 120 }}
          className="bg-white shadow-[0_0_50px_rgba(0,0,0,0.1)] border border-gray-200 overflow-hidden relative"
        >
          <div className="w-full h-full overflow-y-auto no-scrollbar scroll-smooth">
            <DndContext 
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
            >
              <SortableContext 
                items={activeSections.map(s => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="flex flex-col min-h-full">
                  <AnimatePresence>
                    {activeSections.map((section) => (
                      <SortableSection 
                        key={section.id} 
                        section={section} 
                        settings={invitation.settings}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </SortableContext>
            </DndContext>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
