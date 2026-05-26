import React, { useState, useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView } from 'react-native';
import { Calendar, LocaleConfig } from 'react-native-calendars';
import { useRouter } from 'expo-router';
import { useEvents } from '@/src/context/EventContext';
import { theme } from '@/src/constants/theme';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/icon-symbol';
import { format } from 'date-fns';

LocaleConfig.locales['uk'] = {
  monthNames: ['Січень','Лютий','Березень','Квітень','Травень','Червень','Липень','Серпень','Вересень','Жовтень','Листопад','Грудень'],
  monthNamesShort: ['Січ.','Лют.','Бер.','Квіт.','Трав.','Черв.','Лип.','Серп.','Вер.','Жовт.','Лист.','Груд.'],
  dayNames: ['Неділя','Понеділок','Вівторок','Середа','Четвер','П\'ятниця','Субота'],
  dayNamesShort: ['Нд','Пн','Вт','Ср','Чт','Пт','Сб'],
  today: 'Сьогодні'
};
LocaleConfig.defaultLocale = 'uk';

export default function CalendarScreen() {
  const router = useRouter();
  const { events } = useEvents();
  const { colors, isDark } = useAppTheme();
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));

  const markedDates = useMemo(() => {
    const marks: any = {};
    events.forEach(event => {
      marks[event.date] = {
        marked: true,
        dotColor: colors.primary,
        selected: event.date === selectedDate,
        selectedColor: event.date === selectedDate ? colors.primaryLight : undefined,
        selectedTextColor: event.date === selectedDate ? colors.primary : colors.text,
      };
    });

    if (!marks[selectedDate]) {
      marks[selectedDate] = { 
        selected: true, 
        selectedColor: colors.primaryLight,
        selectedTextColor: colors.primary
      };
    }
    return marks;
  }, [events, selectedDate, colors]);

  const selectedEvents = events
    .filter(e => e.date === selectedDate)
    .sort((a, b) => a.time.localeCompare(b.time));

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.headerTitle, { color: colors.text }]}>Календар</Text>
      
      <View style={[styles.calendarCard, { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: isDark ? 0 : 0.03 }]}>
        <Calendar
          current={selectedDate}
          onDayPress={(day: any) => setSelectedDate(day.dateString)}
          markedDates={markedDates}
          theme={{
            backgroundColor: colors.card,
            calendarBackground: colors.card,
            textSectionTitleColor: colors.textSecondary,
            selectedDayBackgroundColor: colors.primaryLight,
            selectedDayTextColor: colors.primary,
            todayTextColor: colors.primary,
            dayTextColor: colors.text,
            textDisabledColor: colors.border,
            arrowColor: colors.textSecondary,
            monthTextColor: colors.text,
            textDayFontWeight: '400',
            textMonthFontWeight: '600',
            textDayHeaderFontWeight: '500',
            textDayFontSize: 15,
            textMonthFontSize: 16,
            textDayHeaderFontSize: 13,
            'stylesheet.calendar.header': {
              header: {
                flexDirection: 'row',
                justifyContent: 'space-between',
                paddingLeft: 10,
                paddingRight: 10,
                marginTop: 6,
                alignItems: 'center'
              }
            }
          }}
        />
      </View>

      <View style={styles.listContainer}>
        <Text style={[styles.listHeader, { color: colors.textSecondary }]}>
          Події на {selectedDate}
        </Text>
        
        {selectedEvents.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={[styles.emptyText, { color: colors.textSecondary }]}>Немає подій на цей день</Text>
          </View>
        ) : (
          <FlatList
            data={selectedEvents}
            keyExtractor={item => item.id}
            renderItem={({ item }) => (
              <TouchableOpacity 
                style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: isDark ? 0 : 0.03 }]}
                onPress={() => router.push(`/event/${item.id}`)}
              >
                <View style={styles.eventTimeContainer}>
                  <Text style={[styles.eventTime, { color: colors.text }]}>{item.time}</Text>
                </View>
                <View style={[styles.eventInfo, { borderLeftColor: colors.border }]}>
                  <View style={styles.eventTitleRow}>
                    <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                    {item.hasReminder && (
                      <IconSymbol name="bell.fill" size={14} color={colors.textSecondary} style={{ marginLeft: 6 }} />
                    )}
                  </View>
                  {item.description ? (
                    <Text style={[styles.eventDesc, { color: colors.textSecondary }]} numberOfLines={1}>{item.description}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>
            )}
            contentContainerStyle={{ paddingBottom: 100 }}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>

      <TouchableOpacity 
        style={[styles.fab, { backgroundColor: colors.primary, shadowColor: colors.primary }]}
        onPress={() => router.push(`/event/new?date=${selectedDate}`)}
      >
        <IconSymbol name="plus" size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  headerTitle: {
    ...theme.typography.h2,
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.xs,
  },
  calendarCard: {
    marginHorizontal: theme.spacing.m,
    borderRadius: theme.borderRadius.l,
    overflow: 'hidden',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 12,
    elevation: 2,
    marginBottom: theme.spacing.m,
  },
  listContainer: {
    flex: 1,
    paddingHorizontal: theme.spacing.m,
  },
  listHeader: {
    ...theme.typography.caption,
    fontWeight: '600',
    marginBottom: theme.spacing.s,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: theme.spacing.xl,
  },
  emptyText: {
    marginTop: theme.spacing.s,
    ...theme.typography.body,
  },
  eventCard: {
    flexDirection: 'row',
    padding: theme.spacing.m,
    borderRadius: theme.borderRadius.m,
    marginBottom: theme.spacing.s,
    alignItems: 'center',
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 1,
  },
  eventTimeContainer: {
    width: 50,
  },
  eventTime: {
    ...theme.typography.body,
    fontWeight: '500',
  },
  eventInfo: {
    flex: 1,
    paddingLeft: theme.spacing.m,
    borderLeftWidth: 1,
  },
  eventTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  eventTitle: {
    ...theme.typography.body,
    fontWeight: '500',
    flex: 1,
  },
  eventDesc: {
    ...theme.typography.caption,
    marginTop: 2,
  },
  fab: {
    position: 'absolute',
    bottom: 90,
    right: 20,
    width: 52,
    height: 52,
    borderRadius: 26,
    alignItems: 'center',
    justifyContent: 'center',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 5,
  },
});
