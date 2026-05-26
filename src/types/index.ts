export interface AppEvent {
  id: string;
  title: string;
  description: string;
  date: string; // format: YYYY-MM-DD
  time: string; // format: HH:mm
  hasReminder: boolean;
  notificationId?: string; // ID of the scheduled notification to cancel it later if needed
  createdAt: number;
}
