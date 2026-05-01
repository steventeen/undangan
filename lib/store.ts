import { create } from 'zustand';
import type { Invitation, InvitationSection, InvitationSettings } from '@/types';

interface BuilderState {
  invitation: Invitation | null;
  activeSection: string | null;
  isSaving: boolean;
  hasChanges: boolean;
  
  // Actions
  setInvitation: (invitation: Invitation) => void;
  setActiveSection: (sectionId: string | null) => void;
  updateSection: (sectionId: string, data: any) => void;
  updateSettings: (settings: Partial<InvitationSettings>) => void;
  reorderSections: (startIndex: number, endIndex: number) => void;
  toggleSection: (sectionId: string, enabled: boolean) => void;
  setSaving: (status: boolean) => void;
}

export const useBuilderStore = create<BuilderState>((set) => ({
  invitation: null,
  activeSection: null,
  isSaving: false,
  hasChanges: false,

  setInvitation: (invitation) => set({ invitation, hasChanges: false }),
  
  setActiveSection: (activeSection) => set({ activeSection }),
  
  updateSection: (sectionId, data) => set((state) => {
    if (!state.invitation) return state;
    const newSections = state.invitation.sections.map(s => 
      s.id === sectionId ? { ...s, data: { ...s.data, ...data } } : s
    );
    return { 
      invitation: { ...state.invitation, sections: newSections },
      hasChanges: true 
    };
  }),

  updateSettings: (settings) => set((state) => {
    if (!state.invitation) return state;
    return {
      invitation: { 
        ...state.invitation, 
        settings: { ...state.invitation.settings, ...settings } 
      },
      hasChanges: true
    };
  }),

  reorderSections: (startIndex, endIndex) => set((state) => {
    if (!state.invitation) return state;
    const result = Array.from(state.invitation.sections);
    const [removed] = result.splice(startIndex, 1);
    result.splice(endIndex, 0, removed);
    
    // Update order property
    const reordered = result.map((item, index) => ({ ...item, order: index }));
    
    return {
      invitation: { ...state.invitation, sections: reordered },
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
}));
