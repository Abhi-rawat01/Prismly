import { create } from 'zustand';
import { AppState, RelationshipType } from '@/types/chat';

interface AppStore extends AppState {
  setUploadedFile: (file: File | null) => void;
  setRelationshipType: (type: RelationshipType | null) => void;
  setChatData: (data: AppState['chatData']) => void;
  setIsAnalyzing: (analyzing: boolean) => void;
  setError: (error: string | null) => void;
  setShowServerWakeUp: (show: boolean) => void;
  setServerReady: (ready: boolean) => void;
  resetState: () => void;
}

export const useAppStore = create<AppStore>((set) => ({
  uploadedFile: null,
  relationshipType: null,
  chatData: null,
  isAnalyzing: false,
  error: null,
  showServerWakeUp: true,
  serverReady: false,
  
  setUploadedFile: (file) => set({ uploadedFile: file }),
  setRelationshipType: (type) => set({ relationshipType: type }),
  setChatData: (data) => set({ chatData: data }),
  setIsAnalyzing: (analyzing) => set({ isAnalyzing: analyzing }),
  setError: (error) => set({ error }),
  setShowServerWakeUp: (show) => set({ showServerWakeUp: show }),
  setServerReady: (ready) => set({ serverReady: ready }),
  resetState: () => set({
    uploadedFile: null,
    relationshipType: null,
    chatData: null,
    isAnalyzing: false,
    error: null,
    showServerWakeUp: true,
    serverReady: false,
  }),
}));