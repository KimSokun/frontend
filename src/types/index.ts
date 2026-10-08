export type ToolCategory = 
  | 'image' 
  | 'pdf' 
  | 'video' 
  | 'generators' 
  | 'testdata' 
  | 'text' 
  | 'developer';

export interface ToolItem {
  id: string;
  name: string;
  category: ToolCategory;
  categoryName: string;
  description: string;
  iconName: string;
  route: string;
  endpoint: string;
  isPopular?: boolean;
  isNew?: boolean;
  acceptedFormats?: string[];
  maxSizeMb?: number;
  rating?: number;
  votesCount?: number;
  tags?: string[];
  faq?: { question: string; answer: string }[];
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
}

export interface AdSlotConfig {
  id: string;
  name: string;
  enabled: boolean;
  width: number;
  height: number;
  customHtml?: string;
  slotType: 'left' | 'right' | 'bottom' | 'top' | 'in-feed';
}
