import React, { useEffect, useRef } from 'react';
import { Dimensions, ScrollView, StyleSheet, Text, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import RadarChart from '../../components/RadarChart';
import TaskCard from '../../components/TaskCard';
import { Colors } from '../../constants/Colors';
import { useGameStore } from '../../stores/gameStore';
import { AttributeName } from '../../types/game';

const { width } = Dimensions.get('window');

export default function DashboardScreen() {
  const { hp, maxHp, userName, attributes, tasks, completeTask } = useGameStore(); // Removing uncomplete for now as dashboard only shows active
  const { checkDailyReset } = useGameStore();
  const confettiRef = useRef<ConfettiCannon>(null);

  useEffect(() => {
    checkDailyReset();
  }, []);

  const handleTaskComplete = (id: string) => {
    const { levelUp } = completeTask(id);
    if (levelUp) {
      confettiRef.current?.start();
    }
  };

  const attributeList = ['intelligence', 'strength', 'love', 'network', 'family'].map(
    (name) => attributes[name as AttributeName]
  );

  // Find max level for chart scaling (at least 10)
  const maxLevel = Math.max(10, ...attributeList.map(a => a.level));

  const activeTasks = tasks.filter(t => !t.completed).slice(0, 3); // Top 3 tasks

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <View style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Header Stats */}
          <View style={styles.header}>
            <View>
              <Text style={styles.greeting}>Welcome, {userName}</Text>
              <Text style={styles.subGreeting}>Level up your life.</Text>
            </View>
            <View style={styles.statBox}>
              <Text style={styles.statLabel}>HP</Text>
              <Text style={[styles.statValue, { color: Colors.danger }]}>{hp}/{maxHp}</Text>
            </View>
          </View>

          {/* Hero Chart & Details */}
          <View style={styles.chartContainer}>
            <Text style={styles.sectionTitle}>STATUS</Text>
            <RadarChart data={attributeList} maxValue={maxLevel} size={250} />

            <View style={styles.statsGrid}>
              {attributeList.map(attr => (
                <View key={attr.name} style={styles.miniStat}>
                  <Text style={[styles.miniStatLabel, { color: Colors.attributes[attr.name] }]}>
                    {attr.name.toUpperCase().substring(0, 3)}
                  </Text>
                  <Text style={styles.miniStatValue}>{attr.level}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Suggested Quests */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>ACTIVE QUESTS</Text>
            {activeTasks.length > 0 ? (
              activeTasks.map(task => (
                <TaskCard key={task.id} task={task} onComplete={handleTaskComplete} />
              ))
            ) : (
              <Text style={styles.emptyText}>No active quests. Check the Quest Board.</Text>
            )}
          </View>
        </ScrollView>

        <View style={styles.confettiContainer} pointerEvents="none">
          <ConfettiCannon
            count={200}
            origin={{ x: width / 2, y: -50 }}
            autoStart={false}
            ref={confettiRef}
            fallSpeed={3000}
            fadeOut={true}
          />
        </View>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  confettiContainer: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1000,
  },
  scroll: {
    padding: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  greeting: {
    color: Colors.text,
    fontSize: 18,
    fontWeight: 'bold',
  },
  subGreeting: {
    color: Colors.textDim,
    fontSize: 12,
  },
  statBox: {
    alignItems: 'center',
  },
  statLabel: {
    color: Colors.textDim,
    fontSize: 12,
    fontWeight: 'bold',
  },
  statValue: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  chartContainer: {
    alignItems: 'center',
    marginBottom: 24,
    backgroundColor: Colors.surface,
    padding: 16,
    borderRadius: 12,
  },
  statsGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    paddingTop: 16,
  },
  miniStat: {
    alignItems: 'center',
  },
  miniStatLabel: {
    fontWeight: 'bold',
    fontSize: 10,
    marginBottom: 4,
  },
  miniStatValue: {
    color: Colors.text,
    fontSize: 16,
    fontWeight: 'bold',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: Colors.textDim,
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 12,
  },
  emptyText: {
    color: Colors.textDim,
    fontStyle: 'italic',
  }
});
