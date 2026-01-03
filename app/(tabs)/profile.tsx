import { CheckCircle, Edit2 } from 'lucide-react-native';
import React, { useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { Colors } from '../../constants/Colors';
import { useGameStore } from '../../stores/gameStore';

export default function ProfileScreen() {
    const { hp, maxHp, userName, setUserName, resetGame } = useGameStore();
    const [isEditing, setIsEditing] = useState(false);
    const [nameInput, setNameInput] = useState(userName);

    const handleSave = () => {
        setUserName(nameInput);
        setIsEditing(false);
    };

    const handleReset = () => {
        Alert.alert("Reset Game", "This will wipe all progress. Are you sure?", [
            { text: "Cancel", style: "cancel" },
            { text: "Reset", style: "destructive", onPress: resetGame }
        ]);
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Hunter Profile</Text>

            <View style={styles.nameContainer}>
                {isEditing ? (
                    <View style={styles.editRow}>
                        <TextInput
                            style={styles.input}
                            value={nameInput}
                            onChangeText={setNameInput}
                            autoFocus
                        />
                        <TouchableOpacity onPress={handleSave}>
                            <CheckCircle color={Colors.primary} size={24} />
                        </TouchableOpacity>
                    </View>
                ) : (
                    <View style={styles.editRow}>
                        <Text style={styles.name}>{userName}</Text>
                        <TouchableOpacity onPress={() => setIsEditing(true)}>
                            <Edit2 color={Colors.textDim} size={20} />
                        </TouchableOpacity>
                    </View>
                )}
            </View>

            <View style={styles.statRow}>
                <Text style={styles.label}>Hit Points</Text>
                <Text style={[styles.value, { color: Colors.danger }]}>{hp} / {maxHp}</Text>
            </View>

            <View style={{ height: 40 }} />
            <Text style={[styles.label, { textAlign: 'center' }]}>System</Text>
            <TouchableOpacity onPress={handleReset}>
                <Text style={[styles.button, { color: Colors.danger, marginTop: 20 }]}>
                    Reset Game Data
                </Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: Colors.background,
        padding: 24,
    },
    title: {
        color: Colors.text,
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 32,
        textAlign: 'center',
    },
    nameContainer: {
        marginBottom: 32,
        alignItems: 'center',
    },
    editRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    name: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
    },
    input: {
        fontSize: 32,
        fontWeight: 'bold',
        color: Colors.primary,
        borderBottomWidth: 1,
        borderBottomColor: Colors.primary,
        minWidth: 150,
        textAlign: 'center',
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: Colors.border,
    },
    label: {
        color: Colors.textDim,
        fontSize: 16,
    },
    value: {
        color: Colors.text,
        fontSize: 16,
        fontWeight: 'bold',
    },
    button: {
        textAlign: 'center',
        fontSize: 16,
        fontWeight: 'bold',
    },
});
