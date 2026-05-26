# Планувальник подій

Мобільний додаток для планування подій, створений на React Native та Expo як залікова робота з дисципліни "Розробка інтерфейсів користувача"

Студент: Ярослав Іщик, група СА, 4 курс, спеціальність 123 "Комп'ютерна інженерія"

---

## Про додаток

Додаток для створення і перегляду подій. Є календар, список подій і нагадування.

## Функціонал

- календар з подіями по датах
- створення, редагування і видалення подій
- назва, опис, дата і час
- локальні нагадування
- збереження даних на пристрої
- список усіх подій
- світла і темна тема

## Технології

- React Native + Expo
- Expo Router
- Context API
- AsyncStorage
- expo-notifications
- react-native-calendars
- date-fns

## Структура

```
/app
  /(tabs)/index.tsx     — календар
  /(tabs)/events.tsx    — події
  /event/[id].tsx       — додавання і редагування

/src
  /context/EventContext.tsx    — події
  /context/ThemeContext.tsx    — тема
  /services/storage.ts         — збереження
  /services/notifications.ts   — нагадування
  /constants/colors.ts         — кольори
  /types/index.ts              — типи
```

## Запуск

```bash
npm install
npx expo start -c
```

Відкрити через Expo Go та відсканувати QR-код

Вимоги: Node.js 18+, Expo Go
