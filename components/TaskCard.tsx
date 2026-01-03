import { Brain, CheckCircle, Circle, Dumbbell, Edit2, Heart, Network, Users } from 'lucide-react-native';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Swipeable from 'react-native-gesture-handler/Swipeable';
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
    onUncomplete?: (id: string) => void;
    onDelete?: (id: string) => void;
    onEdit?: (task: Task) => void;
}

const TaskCard: React.FC<TaskCardProps> = ({ task, onComplete, onUncomplete, onDelete, onEdit }) => {
    const Icon = AttributeIcons[task.attribute] || Circle;
    const color = Colors.attributes[task.attribute] || Colors.text;

    const renderRightActions = (progress: any, dragX: any) => {
        return (
            <TouchableOpacity style={styles.deleteAction} onPress={() => onDelete?.(task.id)}>
                <Text style={styles.actionText}>Delete</Text>
            </TouchableOpacity>
        );
    };

    const handlePress = () => {
        if (task.completed) {
            onUncomplete?.(task.id);
        } else {
            onComplete(task.id);
        }
    };

    return (
        <Swipeable
            renderRightActions={renderRightActions}
            onSwipeableRightOpen={() => onDelete?.(task.id)}
        >
            <View style={[styles.card, { borderColor: color }]}>
                <View style={styles.header}>
                    <View style={[styles.iconContainer, { backgroundColor: color + '20' }]}>
                        <Icon size={20} color={color} />
                    </View>
                    <View style={styles.info}>
                        <Text style={[styles.title, task.completed && styles.completedText]}>{task.title}</Text>
                        <Text style={styles.subtitle}>
                            {task.attribute.toUpperCase()} • {task.difficulty.toUpperCase()}
                        </Text>
                    </View>
                </View>

                <View style={styles.actions}>
                    {!task.completed && onEdit && (
                        <TouchableOpacity onPress={() => onEdit(task)} style={styles.editBtn}>
                            <Edit2 size={20} color={Colors.textDim} />
                        </TouchableOpacity>
                    )}

                    <TouchableOpacity onPress={handlePress}>
                        {task.completed ? (
                            <CheckCircle size={28} color={Colors.primary} />
                        ) : (
                            <Circle size={28} color={Colors.textDim} />
                        )}
                    </TouchableOpacity>
                </View>
            </View>
        </Swipeable>
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
    completedText: {
        textDecorationLine: 'line-through',
        color: Colors.textDim,
    },
    subtitle: {
        color: Colors.textDim,
        fontSize: 10,
        marginTop: 4,
    },
    actions: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 16,
    },
    editBtn: {
        padding: 4,
    },
    deleteAction: {
        backgroundColor: Colors.danger,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingHorizontal: 20,
        marginBottom: 12,
        marginTop: 0,
        borderRadius: 12,
        flex: 1,
    },
    dismissAction: {
        backgroundColor: Colors.textDim,
        justifyContent: 'center',
        alignItems: 'flex-start',
        paddingHorizontal: 20,
        marginBottom: 12,
        borderRadius: 12,
        flex: 1,
    },
    actionText: {
        color: 'white',
        fontWeight: 'bold',
        padding: 20,
    }
});

export default TaskCard;
