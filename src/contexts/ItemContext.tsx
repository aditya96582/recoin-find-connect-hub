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

// --- Sophisticated AI Matching ---

const STOP_WORDS = new Set([
  'the','a','an','is','was','are','were','in','on','at','to','for','of','and','or','but',
  'with','this','that','it','its','my','i','has','had','have','be','been','not','no','from',
  'by','as','do','did','so','if','will','can','may','very','just','about','also','into','some',
]);

function tokenize(text: string): string[] {
  return text.toLowerCase().replace(/[^a-z0-9\s]/g, '').split(/\s+/).filter(w => w.length > 1 && !STOP_WORDS.has(w));
}

function getBigrams(tokens: string[]): string[] {
  return tokens.slice(0, -1).map((t, i) => `${t}_${tokens[i + 1]}`);
}

// TF-IDF-inspired term weighting
function buildTF(tokens: string[]): Map<string, number> {
  const tf = new Map<string, number>();
  for (const t of tokens) tf.set(t, (tf.get(t) || 0) + 1);
  for (const [k, v] of tf) tf.set(k, v / tokens.length);
  return tf;
}

function cosineSimilarity(a: Map<string, number>, b: Map<string, number>): number {
  let dot = 0, magA = 0, magB = 0;
  for (const [k, v] of a) { magA += v * v; if (b.has(k)) dot += v * b.get(k)!; }
  for (const [, v] of b) magB += v * v;
  if (magA === 0 || magB === 0) return 0;
  return dot / (Math.sqrt(magA) * Math.sqrt(magB));
}

const BRAND_KEYWORDS = ['apple','samsung','nike','adidas','sony','dell','hp','lenovo','asus','jbl','boat','realme','xiaomi','oneplus','puma','gucci','louis','canon','nikon'];
const COLOR_KEYWORDS = ['black','white','red','blue','green','yellow','pink','purple','brown','grey','gray','silver','gold','orange'];

function extractFeatures(text: string) {
  const lower = text.toLowerCase();
  const brands = BRAND_KEYWORDS.filter(b => lower.includes(b));
  const colors = COLOR_KEYWORDS.filter(c => lower.includes(c));
  return { brands, colors };
}

function calculateMatch(lost: LostItem, found: FoundItem): { score: number; reasons: string[] } {
  let score = 0;
  const reasons: string[] = [];

  // 1. Category match (25 pts)
  if (lost.category === found.category) {
    score += 25;
    reasons.push(`Same category: ${lost.category}`);
  }

  // 2. Text similarity via TF-IDF cosine (30 pts max)
  const lTokens = tokenize(`${lost.title} ${lost.description}`);
  const fTokens = tokenize(`${found.title} ${found.description}`);
  const unigramSim = cosineSimilarity(buildTF(lTokens), buildTF(fTokens));
  const bigramSim = cosineSimilarity(buildTF(getBigrams(lTokens)), buildTF(getBigrams(fTokens)));
  const textScore = Math.round((unigramSim * 0.6 + bigramSim * 0.4) * 30);
  if (textScore > 0) {
    score += textScore;
    reasons.push(`Text similarity: ${Math.round((unigramSim * 0.6 + bigramSim * 0.4) * 100)}%`);
  }

  // 3. Brand match (10 pts)
  const lFeat = extractFeatures(`${lost.title} ${lost.description}`);
  const fFeat = extractFeatures(`${found.title} ${found.description}`);
  const brandMatch = lFeat.brands.filter(b => fFeat.brands.includes(b));
  if (brandMatch.length > 0) {
    score += 10;
    reasons.push(`Brand match: ${brandMatch.join(', ')}`);
  }

  // 4. Color match (8 pts)
  const colorMatch = lFeat.colors.filter(c => fFeat.colors.includes(c));
  if (colorMatch.length > 0) {
    score += 8;
    reasons.push(`Color match: ${colorMatch.join(', ')}`);
  }

  // 5. Location proximity (15 pts)
  const lLoc = lost.location.toLowerCase().split(/[,\s]+/);
  const fLoc = found.location.toLowerCase().split(/[,\s]+/);
  const locCommon = lLoc.filter(w => w.length > 2 && fLoc.includes(w));
  if (locCommon.length > 0) {
    score += Math.min(15, locCommon.length * 8);
    reasons.push(`Location overlap: ${locCommon.join(', ')}`);
  }

  // 6. Temporal proximity (7 pts)
  const dayDiff = Math.abs(new Date(lost.date).getTime() - new Date(found.date).getTime()) / 86400000;
  if (dayDiff <= 1) { score += 7; reasons.push('Found within 1 day'); }
  else if (dayDiff <= 3) { score += 4; reasons.push('Found within 3 days'); }
  else if (dayDiff <= 7) { score += 2; reasons.push('Found within a week'); }

  // 7. Image presence bonus (5 pts)
  if (lost.image && found.image) {
    score += 5;
    reasons.push('Both items have images for visual comparison');
  }

  return { score: Math.min(98, score), reasons };
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
        const { score, reasons } = calculateMatch(lost, found);
        if (score >= 60) {
          const matchType = score >= 90 ? 'hybrid' : score >= 75 ? 'image' : 'text';
          newMatches.push({
            id: `m_${Date.now()}_${Math.random().toString(36).slice(2)}`,
            lostItemId: lost.id, foundItemId: found.id, confidence: score,
            matchType: matchType as 'text' | 'image' | 'hybrid',
            lostTitle: lost.title, foundTitle: found.title,
            reasons,
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
