import { Plus, Repeat } from 'lucide-react-native';
import React, { useRef, useState } from 'react';
import { Dimensions, Modal, ScrollView, StyleSheet, Switch, Text, TextInput, TouchableOpacity, View } from 'react-native';
import ConfettiCannon from 'react-native-confetti-cannon';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import TaskCard from '../../components/TaskCard';
import { Colors } from '../../constants/Colors';
import { useGameStore } from '../../stores/gameStore';
import { AttributeName, Difficulty, Task } from '../../types/game';

const { width } = Dimensions.get('window');

export default function QuestsScreen() {
    const { tasks, completeTask, uncompleteTask, addTask, deleteTask, updateTask } = useGameStore();
    const [modalVisible, setModalVisible] = useState(false);
    const confettiRef = useRef<ConfettiCannon>(null);

    // Edit Mode State
    const [editingTaskId, setEditingTaskId] = useState<string | null>(null);

    // Form State
    const [title, setTitle] = useState('');
    const [difficulty, setDifficulty] = useState<Difficulty>('easy');
    const [attribute, setAttribute] = useState<AttributeName>('intelligence');
    const [isDaily, setIsDaily] = useState(false);

    const uncompletedTasks = tasks.filter(t => !t.completed);
    const completedTasks = tasks.filter(t => t.completed);

    const openCreateModal = () => {
        setEditingTaskId(null);
        setTitle('');
        setDifficulty('easy');
        setAttribute('intelligence');
        setIsDaily(false);
        setModalVisible(true);
    }

    const openEditModal = (task: Task) => {
        setEditingTaskId(task.id);
        setTitle(task.title);
        setDifficulty(task.difficulty);
        setAttribute(task.attribute);
        setIsDaily(task.isDaily || false);
        setModalVisible(true);
    }

    const handleSaveTask = () => {
        if (!title) return;

        if (editingTaskId) {
            updateTask(editingTaskId, {
                title,
                difficulty,
                attribute,
                isDaily
            });
        } else {
            addTask({
                title,
                difficulty,
                attribute,
                isDaily
            });
        }
        setModalVisible(false);
    };

    const handleComplete = (id: string) => {
        const { levelUp } = completeTask(id);
        if (levelUp) {
            confettiRef.current?.start();
        }
    }

    const handleUncomplete = (id: string) => {
        uncompleteTask(id);
    }

    const handleDelete = (id: string) => {
        deleteTask(id);
    }

    const attributesList: AttributeName[] = ['intelligence', 'strength', 'love', 'network', 'family'];
    const difficulties: Difficulty[] = ['trivial', 'easy', 'medium', 'hard', 'epic'];

    return (
        <GestureHandlerRootView style={{ flex: 1 }}>
            <View style={styles.container}>
                <ScrollView contentContainerStyle={styles.scroll}>
                    <View style={styles.header}>
                        <Text style={styles.title}>Quest Board</Text>
                        <TouchableOpacity onPress={openCreateModal} style={styles.addButton}>
                            <Plus color="black" size={24} />
                        </TouchableOpacity>
                    </View>

                    {uncompletedTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onComplete={handleComplete}
                            onUncomplete={handleUncomplete}
                            onDelete={handleDelete}
                            onEdit={openEditModal}
                        />
                    ))}

                    {completedTasks.length > 0 && <Text style={styles.subtitle}>Completed</Text>}
                    {completedTasks.map(task => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onComplete={handleComplete}
                            onUncomplete={handleUncomplete}
                            onDelete={handleDelete}
                        />
                    ))}
                </ScrollView>

                <Modal visible={modalVisible} animationType="slide" transparent>
                    <View style={styles.modalOverlay}>
                        <View style={styles.modalContent}>
                            <Text style={styles.modalTitle}>{editingTaskId ? 'Edit Quest' : 'New Quest'}</Text>

                            <TextInput
                                style={styles.input}
                                placeholder="Quest Title"
                                placeholderTextColor={Colors.textDim}
                                value={title}
                                onChangeText={setTitle}
                            />

                            <View style={styles.row}>
                                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                    <Repeat color={Colors.textDim} size={16} />
                                    <Text style={[styles.label, { marginBottom: 0, marginLeft: 8 }]}>Daily Quest</Text>
                                </View>
                                <Switch value={isDaily} onValueChange={setIsDaily} trackColor={{ false: Colors.surfaceHighlight, true: Colors.primary }} />
                            </View>

                            <Text style={styles.label}>Attribute</Text>
                            <View style={styles.chips}>
                                {attributesList.map(a => (
                                    <TouchableOpacity
                                        key={a}
                                        style={[styles.chip, attribute === a && { backgroundColor: Colors.attributes[a] }]}
                                        onPress={() => setAttribute(a)}
                                    >
                                        <Text style={[styles.chipText, attribute === a && { color: 'white' }]}>{a.toUpperCase()}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <Text style={styles.label}>Difficulty</Text>
                            <View style={styles.chips}>
                                {difficulties.map(d => (
                                    <TouchableOpacity
                                        key={d}
                                        style={[styles.chip, difficulty === d && { backgroundColor: Colors.primary }]}
                                        onPress={() => setDifficulty(d)}
                                    >
                                        <Text style={[styles.chipText, difficulty === d && { color: 'black' }]}>{d.toUpperCase()}</Text>
                                    </TouchableOpacity>
                                ))}
                            </View>

                            <View style={styles.modalActions}>
                                <TouchableOpacity onPress={() => setModalVisible(false)} style={styles.cancelButton}>
                                    <Text style={styles.cancelText}>Cancel</Text>
                                </TouchableOpacity>
                                <TouchableOpacity onPress={handleSaveTask} style={styles.createButton}>
                                    <Text style={styles.createText}>{editingTaskId ? 'Save Changes' : 'Create Quest'}</Text>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>

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
            </View >
        </GestureHandlerRootView >
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
        paddingBottom: 100,
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: Colors.text,
    },
    subtitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: Colors.textDim,
        marginTop: 24,
        marginBottom: 8,
    },
    addButton: {
        backgroundColor: Colors.primary,
        padding: 8,
        borderRadius: 50,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.8)',
        justifyContent: 'center',
        padding: 16,
    },
    modalContent: {
        backgroundColor: Colors.surface,
        borderRadius: 16,
        padding: 24,
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        color: Colors.text,
        marginBottom: 16,
        textAlign: 'center',
    },
    input: {
        backgroundColor: Colors.background,
        color: Colors.text,
        padding: 12,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: Colors.border,
        marginBottom: 16,
    },
    row: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    label: {
        color: Colors.textDim,
        fontSize: 12,
        marginBottom: 8,
        textTransform: 'uppercase',
    },
    chips: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 8,
        marginBottom: 16,
    },
    chip: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        backgroundColor: Colors.surfaceHighlight,
        borderWidth: 1,
        borderColor: Colors.border,
    },
    chipText: {
        color: Colors.textDim,
        fontSize: 12,
        fontWeight: '600',
    },
    modalActions: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 8,
    },
    cancelButton: {
        padding: 12,
    },
    cancelText: {
        color: Colors.textDim,
    },
    createButton: {
        backgroundColor: Colors.primary,
        paddingHorizontal: 24,
        paddingVertical: 12,
        borderRadius: 8,
    },
    createText: {
        color: 'black',
        fontWeight: 'bold',
    },
});
