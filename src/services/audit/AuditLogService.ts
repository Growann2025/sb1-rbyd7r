import { StorageService } from '../storage/StorageService';

export interface AuditEntry {
  id: string;
  action: string;
  entityId: string;
  entityType: string;
  changes: Record<string, { before: any; after: any }>;
  timestamp: string;
}

export interface DateRange {
  start: string;
  end: string;
}

export interface ExportResult {
  success: boolean;
  data?: AuditEntry[];
  error?: string;
}

export class AuditLogService {
  private static STORAGE_KEY = 'audit_log';

  static logAction(
    action: string,
    entityId: string,
    entityType: string,
    changes: Record<string, { before: any; after: any }>
  ) {
    try {
      const auditLog = this.getAuditLog();
      const entry: AuditEntry = {
        id: Math.random().toString(36).substr(2, 9),
        action,
        entityId,
        entityType,
        changes,
        timestamp: new Date().toISOString()
      };

      auditLog.unshift(entry);
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(auditLog.slice(0, 1000))); // Keep last 1000 entries
      
      return entry;
    } catch (error) {
      console.error('Error logging audit entry:', error);
    }
  }

  static getAuditLog(): AuditEntry[] {
    try {
      const data = localStorage.getItem(this.STORAGE_KEY);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error getting audit log:', error);
      return [];
    }
  }

  static getEntityHistory(entityId: string): AuditEntry[] {
    return this.getAuditLog().filter(entry => entry.entityId === entityId);
  }

  static getActionsByType(entityType: string): AuditEntry[] {
    return this.getAuditLog().filter(entry => entry.entityType === entityType);
  }

  static exportAuditLog(dateRange?: DateRange): ExportResult {
    try {
      let entries = this.getAuditLog();

      if (dateRange) {
        entries = entries.filter(entry => {
          const timestamp = new Date(entry.timestamp);
          const start = new Date(dateRange.start);
          const end = new Date(dateRange.end);
          return timestamp >= start && timestamp <= end;
        });
      }

      return {
        success: true,
        data: entries
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error occurred'
      };
    }
  }

  static clearAuditLog() {
    try {
      localStorage.removeItem(this.STORAGE_KEY);
    } catch (error) {
      console.error('Error clearing audit log:', error);
    }
  }
}