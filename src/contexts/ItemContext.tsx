import React, { createContext, useContext, useState } from "react";
import {
  LostItem, FoundItem, AIMatch, EmergencyRequest, MedicalRequest,
  mockLostItems, mockFoundItems, mockMatches, mockEmergencies, mockMedicalRequests,
} from "@/data/mockData";

interface ItemContextType {
  lostItems: LostItem[];
  foundItems: FoundItem[];
  matches: AIMatch[];
  emergencies: EmergencyRequest[];
  medicalRequests: MedicalRequest[];
  addLostItem: (item: Omit<LostItem, 'id' | 'status'>) => void;
  addFoundItem: (item: Omit<FoundItem, 'id' | 'status'>) => void;
  resolveItem: (type: 'lost' | 'found', id: string) => void;
  addEmergency: (e: Omit<EmergencyRequest, 'id' | 'status' | 'responders'>) => void;
  respondToEmergency: (id: string) => void;
  addMedicalRequest: (m: Omit<MedicalRequest, 'id' | 'status' | 'pharmacyResponses'>) => void;
  respondToMedical: (id: string, pharmacyName: string, available: boolean, price?: number) => void;
  runAIMatch: () => AIMatch[];
}

const ItemContext = createContext<ItemContextType | undefined>(undefined);

export const useItems = () => {
  const ctx = useContext(ItemContext);
  if (!ctx) throw new Error("useItems must be used within ItemProvider");
  return ctx;
};

function calculateMatch(lost: LostItem, found: FoundItem): number {
  let score = 0;
  if (lost.category === found.category) score += 30;
  const lWords = lost.description.toLowerCase().split(/\s+/);
  const fWords = found.description.toLowerCase().split(/\s+/);
  const common = lWords.filter(w => w.length > 3 && fWords.includes(w)).length;
  score += Math.min(40, common * 10);
  if (lost.location.split(',')[0] === found.location.split(',')[0]) score += 20;
  const dayDiff = Math.abs(new Date(lost.date).getTime() - new Date(found.date).getTime()) / 86400000;
  if (dayDiff <= 1) score += 10;
  else if (dayDiff <= 3) score += 5;
  return Math.min(98, score);
}

export const ItemProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [lostItems, setLostItems] = useState<LostItem[]>(mockLostItems);
  const [foundItems, setFoundItems] = useState<FoundItem[]>(mockFoundItems);
  const [matches, setMatches] = useState<AIMatch[]>(mockMatches);
  const [emergencies, setEmergencies] = useState<EmergencyRequest[]>(mockEmergencies);
  const [medicalRequests, setMedicalRequests] = useState<MedicalRequest[]>(mockMedicalRequests);

  const addLostItem = (item: Omit<LostItem, 'id' | 'status'>) => {
    setLostItems(prev => [{ ...item, id: `l_${Date.now()}`, status: 'active' }, ...prev]);
  };

  const addFoundItem = (item: Omit<FoundItem, 'id' | 'status'>) => {
    setFoundItems(prev => [{ ...item, id: `f_${Date.now()}`, status: 'active' }, ...prev]);
  };

  const resolveItem = (type: 'lost' | 'found', id: string) => {
    if (type === 'lost') setLostItems(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' } : i));
    else setFoundItems(prev => prev.map(i => i.id === id ? { ...i, status: 'resolved' } : i));
  };

  const addEmergency = (e: Omit<EmergencyRequest, 'id' | 'status' | 'responders'>) => {
    setEmergencies(prev => [{ ...e, id: `e_${Date.now()}`, status: 'active', responders: 0 }, ...prev]);
  };

  const respondToEmergency = (id: string) => {
    setEmergencies(prev => prev.map(e => e.id === id ? { ...e, responders: e.responders + 1, status: 'responded' } : e));
  };

  const addMedicalRequest = (m: Omit<MedicalRequest, 'id' | 'status' | 'pharmacyResponses'>) => {
    setMedicalRequests(prev => [{ ...m, id: `med_${Date.now()}`, status: 'pending', pharmacyResponses: [] }, ...prev]);
  };

  const respondToMedical = (id: string, pharmacyName: string, available: boolean, price?: number) => {
    setMedicalRequests(prev => prev.map(m => m.id === id ? {
      ...m, status: 'matched',
      pharmacyResponses: [...m.pharmacyResponses, { pharmacyName, available, price }],
    } : m));
  };

  const runAIMatch = (): AIMatch[] => {
    const newMatches: AIMatch[] = [];
    const activeLost = lostItems.filter(i => i.status === 'active');
    const activeFound = foundItems.filter(i => i.status === 'active');
    for (const lost of activeLost) {
      for (const found of activeFound) {
        const confidence = calculateMatch(lost, found);
        if (confidence >= 60) {
          const matchType = confidence >= 90 ? 'hybrid' : confidence >= 75 ? 'image' : 'text';
          newMatches.push({
            id: `m_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            lostItemId: lost.id, foundItemId: found.id, confidence,
            matchType: matchType as 'text' | 'image' | 'hybrid',
            lostTitle: lost.title, foundTitle: found.title,
            reasons: [
              lost.category === found.category ? `Same category: ${lost.category}` : '',
              `Confidence score: ${confidence}%`,
              'AI keyword analysis match',
            ].filter(Boolean),
            timestamp: new Date().toISOString(),
          });
        }
      }
    }
    if (newMatches.length > 0) setMatches(prev => [...newMatches, ...prev]);
    return newMatches;
  };

  return (
    <ItemContext.Provider value={{
      lostItems, foundItems, matches, emergencies, medicalRequests,
      addLostItem, addFoundItem, resolveItem,
      addEmergency, respondToEmergency,
      addMedicalRequest, respondToMedical, runAIMatch,
    }}>
      {children}
    </ItemContext.Provider>
  );
};
