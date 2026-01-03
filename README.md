# Indexical Avatar: Level Up Your Life ⚔️

**Indexical Avatar** is a gamified productivity application that transforms your daily life into an RPG adventure. Complete tasks to gain XP, level up your attributes (Intelligence, Strength, Love, Network, Family), and visualize your personal growth with a dynamic radar chart.

Built with **React Native**, **Expo**, and **TypeScript**.

## 🚀 Features

- **RPG Attribute System**: Every task is linked to an attribute (e.g., "Read a book" -> Intelligence). Watch your stats grow as you complete tasks.
- **Dynamic Radar Chart**: Visual representation of your attribute balance. Are you balanced or specialized?
- **Daily Quests**: Mark quests as "Daily" to have them automatically reset each day if you haven't completed them.
- **XP Progression**: Gain experience points to level up. 
- **Swipe Gestures**:
  - **Swipe Right**: Instantly delete a quest.
- **Interactive UI**:
  - Haptic feedback on interactions.
  - Confetti celebrations on level-up!
  - Dark Mode aesthetic.
- **Offline Persistence**: Your progress is saved locally.

## 🛠️ Tech Stack

- **Framework**: [React Native](https://reactnative.dev/) with [Expo](https://expo.dev/) (SDK 52)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **State Management**: [Zustand](https://github.com/pmndrs/zustand) with MMKV/AsyncStorage persistence.
- **Navigation**: [Expo Router](https://docs.expo.dev/router/introduction/)
- **UI/Icons**: `lucide-react-native`, `react-native-svg`
- **Animations**: `react-native-confetti-cannon`, `react-native-reanimated`

## 📦 Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Rushizzz/Game-todo.git
    cd Game-todo
    ```

2.  **Install dependencies**:
    ```bash
    npm install
    ```

3.  **Start the app**:
    ```bash
    npx expo start
    ```

4.  **Run on Device**:
    - Scan the QR code with the **Expo Go** app (Android/iOS).
    - Or run on an emulator: `A` for Android, `I` for iOS simulator.

## 📖 Usage Guide

### Dashboard
- View your HP (Health Points) and Level.
- Check the **Radar Chart** to see your current attribute build.
- See your top 3 active quests.

### Quests
- **Add Quest**: Tap the `+` button. Select Title, Difficulty, Attribute, and "Daily" status.
- **Complete**: Tap the circle to complete. Get XP!
- **Uncomplete**: Tap the checkmark to undo (reverts XP).
- **Edit**: Tap the pencil icon on any uncompleted task.
- **Delete**: Swipe the task card to the **Right**.

### Attributes
- View detailed progress bars for each attribute active level.

### Profile
- Edit your "Hunter Name".
- Reset game data (Debug option).

## 🤝 Contributing

Contributions are welcome! Whether it's fixing bugs, improving the UI, or adding new RPG mechanics.

1.  Fork the Project
2.  Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3.  Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4.  Push to the Branch (`git push origin feature/AmazingFeature`)
5.  Open a Pull Request

## 📄 License

Distributed under the MIT License. See `LICENSE` for more information.
