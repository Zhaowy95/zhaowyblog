export interface GuestbookEntry {
  id: string;
  identity?: string;
  contact?: string;
  content: string;
  timestamp: number;
  createdAt: string;
}

export interface GuestbookFormData {
  identity: string;
  contact: string;
  content: string;
}

export interface GuestbookFormErrors {
  content?: string;
  contact?: string;
}
