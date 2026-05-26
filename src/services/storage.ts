import AsyncStorage from '@react-native-async-storage/async-storage';
import { AppEvent } from '../types';

const EVENTS_KEY = '@planner_events';

export const storage = {
  async getEvents(): Promise<AppEvent[]> {
    try {
      const jsonValue = await AsyncStorage.getItem(EVENTS_KEY);
      return jsonValue != null ? JSON.parse(jsonValue) : [];
    } catch (e) {
      console.error('Failed to fetch events from storage', e);
      return [];
    }
  },

  async saveEvents(events: AppEvent[]): Promise<void> {
    try {
      const jsonValue = JSON.stringify(events);
      await AsyncStorage.setItem(EVENTS_KEY, jsonValue);
    } catch (e) {
      console.error('Failed to save events to storage', e);
    }
  },
};
