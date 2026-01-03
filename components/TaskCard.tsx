import { Brain, CheckCircle, Circle, Dumbbell, Heart, Network, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { Colors } from '../constants/Colors';
import { Task } from '../types/game';

const AttributeIcons: Record<string, any> = {
    intelligence: Brain,
    strength: Dumbbell,
    love: Heart,
    network: Network,
    family: Users,
};

interface TaskCardProps {
    task: Task;
    onComplete: (id: string) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete }) => {
    const Icon = AttributeIcons[task.attribute] || Circle;
    const color = Colors.attributes[task.attribute] || Colors.text;

    return (
        <View style={[styles.card, { borderColor: color }]}>
            <View style={styles.header}>
                <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                    <Icon size={20} color={color} />
                </View>
                <View style={styles.info}>
                    <Text style={styles.title}>{task.title}</Text>
                    <Text style={styles.subtitle}>
                        {task.attribute.toUpperCase()} • {task.difficulty.toUpperCase()}
                    </Text>
                </View>
            </View>

            <TouchableOpacity
                onPress={() => onComplete(task.id)}
                disabled={task.completed}
            >
                {task.completed ? (
                    <CheckCircle size={28} color={Colors.primary} />
                ) : (
                    <Circle size={28} color={Colors.textDim} />
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    card: {
        backgroundColor: Colors.surface,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderLeftWidth: 4,
        // Shadow for premium feel
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
        elevation: 5,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    iconContainer: {
        padding: 8,
        borderRadius: 8,
        marginRight: 12,
    },
    info: {
        flex: 1,
    },
    title: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    subtitle: {
        color: Colors.textDim,
        fontSize: 10,
        marginTop: 4,
    },
});

export default TaskCard;
