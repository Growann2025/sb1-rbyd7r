export interface Attachment {
  id: string;
  name: string;
  type: string;
  url: string;
}

export interface CommunicationEntry {
  id: string;
  type: 'email' | 'note' | 'meeting';
  content: string;
  date: string;
  status?: string;
  userId?: string;
  attachments: Attachment[];
}