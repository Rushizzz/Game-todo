import React from 'react';
import { ScrollView, StyleSheet, Text, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useGameStore } from '../../stores/gameStore';
import { AttributeName } from '../../types/game';
import { getProgressToNextLevel } from '../../utils/leveling';

export default function AttributesScreen() {
    const { attributes } = useGameStore();

    const attributeList = ['intelligence', 'strength', 'love', 'network', 'family'];

    return (
        <ScrollView style={styles.container}>
            {attributeList.map((nameString) => {
                const name = nameString as AttributeName;
                const attr = attributes[name];
                const { percentage, needed, current } = getProgressToNextLevel(attr.totalXp, attr.level);

                return (
                    <View key={name} style={[styles.card, { borderLeftColor: Colors.attributes[name] }]}>
                        <View style={styles.header}>
                            <Text style={styles.name}>{name.toUpperCase()}</Text>
                            <Text style={styles.level}>Lvl {attr.level}</Text>
                        </View>

                        {/* XP Bar */}
                        <View style={styles.barBackground}>
                            <View style={[styles.barFill, { width: `${percentage * 100}%`, backgroundColor: Colors.attributes[name] }]} />
                        </View>

                        <View style={styles.footer}>
                            <Text style={styles.xpText}>{current} / {needed} XP to next level</Text>
                            <Text style={styles.totalXp}>Total: {attr.totalXp}</Text>
                        </View>
                    </View>
                );
            })}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 16,
    },
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 16,
        borderLeftWidth: 4,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 12,
    },
    name: {
        color: Colors.text,
        fontSize: 18,
        fontWeight: 'bold',
    },
    level: {
        color: Colors.primary,
        fontSize: 18,
        fontWeight: 'bold',
    },
    barBackground: {
        height: 8,
        backgroundColor: Colors.surfaceHighlight,
        borderRadius: 4,
        overflow: 'hidden',
        marginBottom: 8,
    },
    barFill: {
        height: '100%',
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    xpText: {
        color: Colors.textDim,
        fontSize: 12,
    },
    totalXp: {
        color: Colors.textDim,
        fontSize: 12,
    }
});
