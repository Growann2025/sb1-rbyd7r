import { AffiliateAccount } from '../../models/AffiliateAccount';

export interface UploadRecord {
  id: string;
  date: string;
  fileName: string;
  recordCount: number;
  success: boolean;
  error?: string;
}

export class StorageService {
  private static STORAGE_KEY = 'affiliate_profiles';
  private static UPLOAD_HISTORY_KEY = 'upload_history';

  static saveAffiliates(affiliates: AffiliateAccount[]): void {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(affiliates));
      // Dispatch custom event for components to refresh
      window.dispatchEvent(new Event('storage'));
    } catch (error) {
      console.error('Error saving affiliates:', error);
      throw new Error('Failed to save affiliates');
    }
  }

  static getAffiliates(): AffiliateAccount[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting affiliates:', error);
      return [];
    }
  }

  static addUploadRecord(record: UploadRecord): void {
    try {
      const history = this.getUploadHistory();
      history.unshift(record);
      localStorage.setItem(this.UPLOAD_HISTORY_KEY, JSON.stringify(history.slice(0, 50))); // Keep last 50 uploads
    } catch (error) {
      console.error('Error adding to upload history:', error);
    }
  }

  static getUploadHistory(): UploadRecord[] {
    try {
      const data = localStorage.getItem(this.UPLOAD_HISTORY_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting upload history:', error);
      return [];
    }
  }

  static clearAll(): void {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
      localStorage.removeItem(this.UPLOAD_HISTORY_KEY);
    } catch (error) {
      console.error('Error clearing storage:', error);
      throw new Error('Failed to clear storage');
    }
  }
}