import { create } from 'zustand';
import type { Invitation, InvitationSection, InvitationSettings } from '@/types';

interface BuilderState {
  invitation: Invitation | null;
  activeSection: string | null;
  isSaving: boolean;
  hasChanges: boolean;
  history: Invitation[];
  historyIndex: number;
  
  // Actions
  setInvitation: (invitation: Invitation) => void;
  setActiveSection: (sectionId: string | null) => void;
  updateSection: (sectionId: string, data: any, style?: any) => void;
  updateSettings: (settings: Partial<InvitationSettings>) => void;
  reorderSections: (sections: InvitationSection[]) => void;
  toggleSection: (sectionId: string, enabled: boolean) => void;
  setSaving: (status: boolean) => void;
  undo: () => void;
  redo: () => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  invitation: null,
  activeSection: null,
  isSaving: false,
  hasChanges: false,
  history: [],
  historyIndex: -1,

  setInvitation: (invitation) => set({ invitation, hasChanges: false, history: [invitation], historyIndex: 0 }),
  
  setActiveSection: (activeSection) => set({ activeSection }),
  
  updateSection: (sectionId, data, style) => set((state) => {
    if (!state.invitation) return state;
    const newSections = state.invitation.sections.map(s => 
      s.id === sectionId ? { ...s, data: { ...s.data, ...data }, style: style ? { ...s.style, ...style } : s.style } : s
    );
    const newInvitation = { ...state.invitation, sections: newSections };
    
    // Add to history
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newInvitation);
    
    return { 
      invitation: newInvitation,
      hasChanges: true,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  updateSettings: (settings) => set((state) => {
    if (!state.invitation) return state;
    const newInvitation = {
      ...state.invitation, 
      settings: { ...state.invitation.settings, ...settings } 
    };
    
    // Add to history
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(newInvitation);
    
    return {
      invitation: newInvitation,
      hasChanges: true,
      history: newHistory,
      historyIndex: newHistory.length - 1
    };
  }),

  reorderSections: (sections) => set((state) => {
    if (!state.invitation) return state;
    const reordered = sections.map((item, index) => ({ ...item, order: index }));
    const newInvitation = { ...state.invitation, sections: reordered };
    
    return {
      invitation: newInvitation,
      hasChanges: true
    };
  }),

  toggleSection: (sectionId, enabled) => set((state) => {
    if (!state.invitation) return state;
    const newSections = state.invitation.sections.map(s => 
      s.id === sectionId ? { ...s, enabled } : s
    );
    return {
      invitation: { ...state.invitation, sections: newSections },
      hasChanges: true
    };
  }),

  setSaving: (isSaving) => set({ isSaving, ...(isSaving ? {} : { hasChanges: false }) }),

  undo: () => set((state) => {
    if (state.historyIndex <= 0) return state;
    const prevIndex = state.historyIndex - 1;
    return {
      invitation: state.history[prevIndex],
      historyIndex: prevIndex,
      hasChanges: true
    };
  }),

  redo: () => set((state) => {
    if (state.historyIndex >= state.history.length - 1) return state;
    const nextIndex = state.historyIndex + 1;
    return {
      invitation: state.history[nextIndex],
      historyIndex: nextIndex,
      hasChanges: true
    };
  }),
}));
