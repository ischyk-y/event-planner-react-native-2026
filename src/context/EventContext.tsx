import React, { createContext, useState, useEffect, ReactNode, useContext } from 'react';
import { AppEvent } from '../types';
import { storage } from '../services/storage';
import { scheduleEventReminder, cancelReminder } from '../services/notifications';
import * as Crypto from 'expo-crypto';

interface EventContextProps {
  events: AppEvent[];
  addEvent: (event: Omit<AppEvent, 'id' | 'createdAt' | 'notificationId'>) => Promise<void>;
  updateEvent: (id: string, updatedFields: Partial<AppEvent>) => Promise<void>;
  deleteEvent: (id: string) => Promise<void>;
  isLoading: boolean;
}

export const EventContext = createContext<EventContextProps | undefined>(undefined);

export const useEvents = () => {
  const context = useContext(EventContext);
  if (!context) {
    throw new Error('useEvents must be used within an EventProvider');
  }
  return context;
};

export const EventProvider = ({ children }: { children: ReactNode }) => {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    const loadedEvents = await storage.getEvents();
    setEvents(loadedEvents);
    setIsLoading(false);
  };

  const addEvent = async (eventData: Omit<AppEvent, 'id' | 'createdAt' | 'notificationId'>) => {
    let notificationId: string | undefined;

    const eventDate = new Date(`${eventData.date}T${eventData.time}`);

    if (eventData.hasReminder && eventDate.getTime() > Date.now()) {
      notificationId = await scheduleEventReminder(
        eventData.title,
        eventData.description,
        eventDate
      );
    }

    const newEvent: AppEvent = {
      ...eventData,
      id: Crypto.randomUUID(),
      createdAt: Date.now(),
      notificationId,
    };

    const newEvents = [...events, newEvent];
    setEvents(newEvents);
    await storage.saveEvents(newEvents);
  };

  const updateEvent = async (id: string, updatedFields: Partial<AppEvent>) => {
    const eventIndex = events.findIndex(e => e.id === id);
    if (eventIndex === -1) return;

    const oldEvent = events[eventIndex];
    let newNotificationId = oldEvent.notificationId;

    const needsNewReminder =
      updatedFields.date !== undefined ||
      updatedFields.time !== undefined ||
      updatedFields.hasReminder !== undefined ||
      updatedFields.title !== undefined ||
      updatedFields.description !== undefined;

    if (needsNewReminder) {
      if (oldEvent.notificationId) {
        await cancelReminder(oldEvent.notificationId);
        newNotificationId = undefined;
      }

      const hasReminder = updatedFields.hasReminder !== undefined ? updatedFields.hasReminder : oldEvent.hasReminder;
      const dateStr = updatedFields.date || oldEvent.date;
      const timeStr = updatedFields.time || oldEvent.time;
      const title = updatedFields.title || oldEvent.title;
      const desc = updatedFields.description || oldEvent.description;

      const eventDate = new Date(`${dateStr}T${timeStr}`);

      if (hasReminder && eventDate.getTime() > Date.now()) {
        newNotificationId = await scheduleEventReminder(title, desc, eventDate);
      }
    }

    const updatedEvent = { ...oldEvent, ...updatedFields, notificationId: newNotificationId };
    const newEvents = [...events];
    newEvents[eventIndex] = updatedEvent;

    setEvents(newEvents);
    await storage.saveEvents(newEvents);
  };

  const deleteEvent = async (id: string) => {
    const event = events.find(e => e.id === id);
    if (event?.notificationId) {
      await cancelReminder(event.notificationId);
    }

    const newEvents = events.filter(e => e.id !== id);
    setEvents(newEvents);
    await storage.saveEvents(newEvents);
  };

  return (
    <EventContext.Provider value={{ events, addEvent, updateEvent, deleteEvent, isLoading }}>
      {children}
    </EventContext.Provider>
  );
};
