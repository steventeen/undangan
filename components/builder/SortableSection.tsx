'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useBuilderStore } from '@/lib/store';
import { InvitationSection, InvitationSettings } from '@/types';
import { GripVertical, Settings2, Trash2, EyeOff } from 'lucide-react';
import { motion } from 'framer-motion';

interface Props {
  section: InvitationSection;
  settings: InvitationSettings;
}

export function SortableSection({ section, settings }: Props) {
  const { activeSection, setActiveSection, toggleSection } = useBuilderStore();
  const isActive = activeSection === section.id;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 100 : 1,
    opacity: isDragging ? 0.5 : 1,
  };

  const renderContent = () => {
    switch (section.type) {
      case 'cover':
        return (
          <div className="h-[400px] flex flex-col items-center justify-center p-8 text-center space-y-4">
            <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-xs uppercase tracking-widest text-gray-500">The Wedding Of</motion.p>
            <motion.h1 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="text-4xl font-bold" 
              style={{ color: settings.primary_color, fontFamily: settings.font_heading }}
            >
              {section.data.headline || 'Nama Pasangan'}
            </motion.h1>
            <p className="text-sm italic text-gray-500">{section.data.subtitle || 'We are getting married'}</p>
          </div>
        );
      case 'couple':
        return (
          <div className="py-12 px-6 flex flex-col items-center gap-8 bg-gray-50/30">
            <div className="flex gap-4">
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
              <div className="w-16 h-16 bg-gray-200 rounded-full" />
            </div>
            <div className="text-center">
              <h3 className="font-bold" style={{ fontFamily: settings.font_heading }}>{section.data.groom_name || 'Groom'} & {section.data.bride_name || 'Bride'}</h3>
              <p className="text-xs text-gray-400 mt-1">Mempelai Berbahagia</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="py-12 px-6 text-center border-b border-gray-100 last:border-0">
            <h3 className="text-sm font-bold uppercase tracking-wider text-gray-400">{section.type}</h3>
            <p className="text-xs text-gray-300 mt-2">Section content preview</p>
          </div>
        );
    }
  };

  return (
    <div 
      ref={setNodeRef} 
      style={style}
      className={`group relative border-2 transition-all ${
        isActive ? 'border-rose-500 shadow-2xl z-10' : 'border-transparent hover:border-rose-200'
      }`}
      onClick={() => setActiveSection(section.id)}
    >
      {/* Selection Overlay */}
      {isActive && (
        <div className="absolute -top-10 left-0 right-0 h-10 bg-rose-500 flex items-center justify-between px-4 rounded-t-xl text-white">
          <div className="flex items-center gap-2">
             <div {...attributes} {...listeners} className="cursor-grab active:cursor-grabbing p-1 hover:bg-white/20 rounded">
               <GripVertical size={16} />
             </div>
             <span className="text-[10px] font-bold uppercase tracking-widest">{section.type}</span>
          </div>
          <div className="flex items-center gap-2">
            <button className="p-1 hover:bg-white/20 rounded"><Settings2 size={14} /></button>
            <button 
              onClick={(e) => { e.stopPropagation(); toggleSection(section.id, false); }}
              className="p-1 hover:bg-white/20 rounded"
            >
              <EyeOff size={14} />
            </button>
          </div>
        </div>
      )}

      {/* Actual Content Preview */}
      <div className="relative overflow-hidden">
        {renderContent()}
      </div>
    </div>
  );
}
