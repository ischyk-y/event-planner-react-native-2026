import React, { useMemo } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, SafeAreaView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { useEvents } from '@/src/context/EventContext';
import { theme } from '@/src/constants/theme';
import { useAppTheme } from '@/src/hooks/useAppTheme';
import { IconSymbol } from '@/components/ui/icon-symbol';

export default function EventsListScreen() {
  const router = useRouter();
  const { events, deleteEvent } = useEvents();
  const { colors, isDark } = useAppTheme();

  const sortedEvents = useMemo(() => {
    return [...events].sort((a, b) => {
      const dateA = new Date(`${a.date}T${a.time}`);
      const dateB = new Date(`${b.date}T${b.time}`);
      return dateA.getTime() - dateB.getTime();
    });
  }, [events]);

  const handleDelete = (id: string, title: string) => {
    Alert.alert(
      "Видалення",
      `Видалити подію "${title}"?`,
      [
        { text: "Скасувати", style: "cancel" },
        { 
          text: "Видалити", 
          style: "destructive", 
          onPress: () => deleteEvent(id) 
        }
      ]
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Всі події</Text>
      </View>

      {sortedEvents.length === 0 ? (
        <View style={styles.emptyState}>
          <IconSymbol name="calendar.badge.clock" size={48} color={colors.border} />
          <Text style={[styles.emptyText, { color: colors.textSecondary }]}>У вас поки немає запланованих подій</Text>
        </View>
      ) : (
        <FlatList
          data={sortedEvents}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.eventCardWrapper}>
              <TouchableOpacity 
                style={[styles.eventCard, { backgroundColor: colors.card, borderColor: colors.border, shadowOpacity: isDark ? 0 : 0.03 }]}
                onPress={() => router.push(`/event/${item.id}`)}
              >
                <View style={styles.dateBlock}>
                  <Text style={[styles.dateMonth, { color: colors.textSecondary }]}>
                    {new Date(item.date).toLocaleString('uk-UA', { month: 'short' }).toUpperCase()}
                  </Text>
                  <Text style={[styles.dateDay, { color: colors.text }]}>
                    {new Date(item.date).getDate()}
                  </Text>
                </View>

                <View style={[styles.eventInfo, { borderLeftColor: colors.border }]}>
                  <View style={styles.titleRow}>
                    <Text style={[styles.eventTitle, { color: colors.text }]} numberOfLines={1}>{item.title}</Text>
                    {item.hasReminder && (
                      <IconSymbol name="bell.fill" size={14} color={colors.textSecondary} />
                    )}
                  </View>
                  <Text style={[styles.eventTime, { color: colors.primary }]}>
                    {item.time}
                  </Text>
                  {item.description ? (
                    <Text style={[styles.eventDesc, { color: colors.textSecondary }]} numberOfLines={2}>{item.description}</Text>
                  ) : null}
                </View>
              </TouchableOpacity>

              <TouchableOpacity 
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id, item.title)}
              >
                <IconSymbol name="trash" size={20} color={colors.textSecondary} />
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingHorizontal: theme.spacing.m,
    paddingTop: theme.spacing.m,
    paddingBottom: theme.spacing.m,
  },
  headerTitle: {
    ...theme.typography.h2,
  },
  listContent: {
    paddingHorizontal: theme.spacing.m,
    paddingBottom: 100,
  },
  emptyState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingBottom: 100,
  },
  emptyText: {
    marginTop: theme.spacing.m,
    ...theme.typography.body,
  },
  eventCardWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: theme.spacing.m,
  },
  eventCard: {
    flex: 1,
    flexDirection: 'row',
    borderRadius: theme.borderRadius.m,
    borderWidth: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
    overflow: 'hidden',
  },
  dateBlock: {
    width: 60,
    alignItems: 'center',
    justifyContent: 'center',
    padding: theme.spacing.s,
  },
  dateMonth: {
    ...theme.typography.caption,
    fontWeight: '600',
  },
  dateDay: {
    ...theme.typography.h3,
    marginTop: 2,
  },
  eventInfo: {
    flex: 1,
    padding: theme.spacing.m,
    justifyContent: 'center',
    borderLeftWidth: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  eventTitle: {
    ...theme.typography.body,
    fontWeight: '600',
    flex: 1,
    marginRight: theme.spacing.s,
  },
  eventTime: {
    ...theme.typography.caption,
    fontWeight: '500',
    marginBottom: 4,
  },
  eventDesc: {
    ...theme.typography.caption,
  },
  deleteButton: {
    marginLeft: theme.spacing.s,
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
});
