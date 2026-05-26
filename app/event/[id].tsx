import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Switch, Alert, Platform } from 'react-native';
import { useLocalSearchParams, useRouter } from 'expo-router';
import { useEvents } from '@/src/context/EventContext';
import { theme } from '@/src/constants/theme';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EventScreen() {
  const router = useRouter();
  const { id, date: initialDate } = useLocalSearchParams();
  const { events, addEvent, updateEvent, deleteEvent } = useEvents();
  const { colors } = useAppTheme();

  const isEditing = id !== 'new';
  const existingEvent = isEditing ? events.find(e => e.id === id) : null;

  const [title, setTitle] = useState(existingEvent?.title || '');
  const [description, setDescription] = useState(existingEvent?.description || '');
  const [date, setDate] = useState(existingEvent?.date || (initialDate as string) || '');
  const [time, setTime] = useState(existingEvent?.time || '12:00');
  const [hasReminder, setHasReminder] = useState(existingEvent?.hasReminder || false);

  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (isEditing && !existingEvent) {
      router.back();
    }
  }, [isEditing, existingEvent]);

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!title.trim()) newErrors.title = "Назва події обов'язкова";
    
    if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      newErrors.date = 'Формат дати має бути РРРР-ММ-ДД';
    }
    
    if (!/^\d{2}:\d{2}$/.test(time)) {
      newErrors.time = 'Формат часу має бути ГГ:ХХ';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      if (isEditing && existingEvent) {
        await updateEvent(existingEvent.id, {
          title,
          description,
          date,
          time,
          hasReminder
        });
      } else {
        await addEvent({
          title,
          description,
          date,
          time,
          hasReminder
        });
      }
      router.back();
    } catch (e) {
      Alert.alert('Помилка', 'Не вдалося зберегти подію');
    }
  };

  const handleDelete = () => {
    Alert.alert(
      "Видалення",
      "Ви впевнені, що хочете видалити цю подію?",
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Видалити", 
          style: "destructive", 
          onPress: async () => {
            if (existingEvent) {
              await deleteEvent(existingEvent.id);
              router.back();
            }
          }
        }
      ]
    );
  };

  return (
    <ScrollView style={[styles.container, { backgroundColor: colors.background }]} contentContainerStyle={styles.content}>
      
      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Назва події *</Text>
        <TextInput 
          style={[
            styles.input, 
            { backgroundColor: colors.card, color: colors.text, borderColor: colors.border },
            errors.title && { borderColor: colors.danger }
          ]}
          placeholder="Наприклад: Зустріч з клієнтом"
          placeholderTextColor={colors.textSecondary}
          value={title}
          onChangeText={(text) => { setTitle(text); setErrors(e => ({...e, title: ''})) }}
        />
        {errors.title ? <Text style={[styles.errorText, { color: colors.danger }]}>{errors.title}</Text> : null}
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: theme.spacing.s }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Дата (РРРР-ММ-ДД) *</Text>
          <View style={[
            styles.inputWrapper, 
            { backgroundColor: colors.card, borderColor: colors.border },
            errors.date && { borderColor: colors.danger }
          ]}>
            <IconSymbol name="calendar" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={[styles.inputNoBorder, { color: colors.text }]}
              placeholder="2024-05-15"
              placeholderTextColor={colors.textSecondary}
              value={date}
              onChangeText={(text) => { setDate(text); setErrors(e => ({...e, date: ''})) }}
            />
          </View>
          {errors.date ? <Text style={[styles.errorText, { color: colors.danger }]}>{errors.date}</Text> : null}
        </View>

        <View style={[styles.formGroup, { flex: 1, marginLeft: theme.spacing.s }]}>
          <Text style={[styles.label, { color: colors.textSecondary }]}>Час (ГГ:ХХ) *</Text>
          <View style={[
            styles.inputWrapper, 
            { backgroundColor: colors.card, borderColor: colors.border },
            errors.time && { borderColor: colors.danger }
          ]}>
            <IconSymbol name="clock" size={20} color={colors.textSecondary} style={styles.inputIcon} />
            <TextInput 
              style={[styles.inputNoBorder, { color: colors.text }]}
              placeholder="14:30"
              placeholderTextColor={colors.textSecondary}
              value={time}
              onChangeText={(text) => { setTime(text); setErrors(e => ({...e, time: ''})) }}
            />
          </View>
          {errors.time ? <Text style={[styles.errorText, { color: colors.danger }]}>{errors.time}</Text> : null}
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={[styles.label, { color: colors.textSecondary }]}>Опис</Text>
        <TextInput 
          style={[
            styles.input, 
            styles.textArea,
            { backgroundColor: colors.card, color: colors.text, borderColor: colors.border }
          ]}
          placeholder="Додаткова інформація..."
          placeholderTextColor={colors.textSecondary}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
      </View>

      <View style={[styles.switchContainer, { backgroundColor: colors.card, borderColor: colors.border }]}>
        <View style={styles.switchLabelContainer}>
          <View style={[styles.iconBox, { backgroundColor: colors.primaryLight }]}>
            <IconSymbol name="bell" size={24} color={colors.primary} />
          </View>
          <View>
            <Text style={[styles.switchLabel, { color: colors.text }]}>Увімкнути нагадування</Text>
            <Text style={[styles.switchSubLabel, { color: colors.textSecondary }]}>Надіслати сповіщення у вказаний час</Text>
          </View>
        </View>
        <Switch
          trackColor={{ false: colors.border, true: colors.primaryLight }}
          thumbColor={hasReminder ? colors.primary : '#f4f3f4'}
          ios_backgroundColor={colors.border}
          onValueChange={setHasReminder}
          value={hasReminder}
        />
      </View>

      <TouchableOpacity 
        style={[styles.saveButton, { backgroundColor: colors.primary }]} 
        onPress={handleSave}
      >
        <Text style={styles.saveButtonText}>Зберегти подію</Text>
      </TouchableOpacity>

      {isEditing && (
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <IconSymbol name="trash" size={20} color={colors.danger} />
          <Text style={[styles.deleteButtonText, { color: colors.danger }]}>Видалити подію</Text>
        </TouchableOpacity>
      )}

    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: theme.spacing.m,
  },
  formGroup: {
    marginBottom: theme.spacing.m,
  },
  row: {
    flexDirection: 'row',
  },
  label: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.xs,
    marginLeft: 4,
  },
  input: {
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.m,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
    borderWidth: 1,
  },
  errorText: {
    fontSize: 12,
    marginTop: 4,
    marginLeft: 4,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: theme.borderRadius.m,
    paddingHorizontal: theme.spacing.s,
    borderWidth: 1,
  },
  inputIcon: {
    marginHorizontal: 8,
  },
  inputNoBorder: {
    flex: 1,
    paddingVertical: Platform.OS === 'ios' ? 14 : 10,
    fontSize: 16,
  },
  textArea: {
    height: 100,
    paddingTop: theme.spacing.s,
  },
  switchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    marginTop: theme.spacing.s,
    marginBottom: theme.spacing.xl,
    borderWidth: 1,
  },
  switchLabelContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: theme.spacing.m,
  },
  switchLabel: {
    ...theme.typography.body,
    fontWeight: '600',
  },
  switchSubLabel: {
    ...theme.typography.caption,
    marginTop: 2,
  },
  saveButton: {
    borderRadius: theme.borderRadius.l,
    paddingVertical: 16,
    alignItems: 'center',
  },
  saveButtonText: {
    color: '#ffffff',
    ...theme.typography.h3,
  },
  deleteButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: theme.spacing.l,
    paddingVertical: theme.spacing.m,
  },
  deleteButtonText: {
    ...theme.typography.body,
    fontWeight: '600',
    marginLeft: 8,
  },
});
