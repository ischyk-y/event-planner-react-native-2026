import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestPermissionsAsync = async () => {
  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }
  return finalStatus === 'granted';
};

export const scheduleEventReminder = async (
  title: string,
  body: string,
  date: Date
): Promise<string | undefined> => {
  const hasPermission = await requestPermissionsAsync();
  if (!hasPermission) {
    return undefined;
  }

  if (date.getTime() <= Date.now()) {
    return undefined;
  }

  try {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: `Нагадування: ${title}`,
        body,
        sound: true,
      },
      trigger: {
        type: 'date',
        date,
      } as Notifications.NotificationTriggerInput,
    });
    return id;
  } catch (error) {
    return undefined;
  }
};

export const cancelReminder = async (notificationId: string) => {
  try {
    await Notifications.cancelScheduledNotificationAsync(notificationId);
  } catch (error) {
    // ignore
  }
};
