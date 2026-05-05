# Tidly 🧹

> *Split the work, not your sanity.*

A modern roommate task-splitting app built with React Native + Expo.

---

## Tech Stack

| Layer | Choice |
|-------|--------|
| Framework | React Native + Expo (SDK 51) |
| Navigation | React Navigation v6 (native-stack + bottom-tabs) |
| Icons | `@expo/vector-icons` (Feather set) |
| Notifications | `expo-notifications` |
| State | React Context (AppContext + ThemeContext) |
| Backend | **TBD — see `/backend` (empty, Swayam's domain)** |
| Styling | StyleSheet (no external CSS lib) |

---

## Project Structure

```
tidly/
├── App.tsx                        # Entry point
├── src/
│   ├── screens/
│   │   ├── HomeScreen.tsx         # Dashboard, group card, my tasks
│   │   ├── TasksScreen.tsx        # Filtered task list (mine / all / overdue / done)
│   │   ├── MembersScreen.tsx      # Leaderboard + group stats
│   │   ├── AlertsScreen.tsx       # Activity feed + notification settings
│   │   ├── ProfileScreen.tsx      # User profile, settings, completion stats
│   │   └── AddTaskScreen.tsx      # Create task modal (presets + custom)
│   ├── components/
│   │   ├── TaskCard.tsx           # Reusable task row with complete toggle
│   │   ├── Badge.tsx              # Status badge (overdue / today / soon / done)
│   │   ├── Avatar.tsx             # Initials avatar
│   │   ├── Toggle.tsx             # Animated toggle switch
│   │   └── ScoreBar.tsx           # Animated progress bar
│   ├── navigation/
│   │   ├── RootNavigator.tsx      # Stack (Main + AddTask modal)
│   │   └── TabNavigator.tsx       # 5-tab bottom nav with badges
│   ├── context/
│   │   ├── ThemeContext.tsx        # Dark/light theme toggle
│   │   └── AppContext.tsx          # Tasks, members, notifications state
│   ├── constants/
│   │   ├── theme.ts               # Colors, typography, spacing, radius
│   │   └── mockData.ts            # Mock members, tasks, activity, presets
│   ├── types/
│   │   └── index.ts               # All TypeScript types
│   └── utils/
│       ├── helpers.ts             # Date formatting, task status, sorting
│       └── notifications.ts       # expo-notifications scheduling logic
└── backend/                       # 🔧 Swayam's zone — keep empty for now
```

---

## Features

### Core
- ✅ **5 screens** — Home, Tasks, Members, Alerts, Profile
- 🌙 **Dark / Light theme** — toggle in Home and Profile headers
- ✅ **Task completion** — tap the check on any task card
- 📋 **12 preset tasks** + custom task name input
- 🔁 **Repeat intervals** — never / daily / weekly / bi-weekly / monthly
- 👤 **Assignee picker** — assign to any roommate or yourself
- 🏆 **Leaderboard** — score-based ranking with animated bars

### Notifications (expo-notifications)
- 🔕 **Silent morning digest** — 8:00 AM every day (overview of due tasks)
- 🔔 **1-hour alert** — fires 1 hour before task due time
- ⚠️ **2-hour soft reminder** — silent, 2 hours before due
- Toggle each type on/off from Alerts screen

### Task Filtering (Tasks screen)
- **Mine** — only tasks assigned to current user
- **All** — entire group's tasks
- **Overdue** — past-due across all members
- **Done** — completed tasks

---

## Getting Started

```bash
# Install dependencies
npm install

# Start Expo dev server
npx expo start

# iOS simulator
npx expo run:ios

# Android emulator
npx expo run:android
```

---

## Backend (Swayam)

The `/backend` folder is intentionally empty. Suggested stack:

- **Node.js + Express** or **Fastify**
- **PostgreSQL** (users, groups, tasks, activity)
- **Socket.io** for real-time task updates
- **Firebase Cloud Messaging** for push delivery
- **REST API** endpoints:
  - `POST /groups` — create group
  - `POST /groups/:id/members` — invite member
  - `GET/POST /groups/:id/tasks` — list / create tasks
  - `PATCH /tasks/:id/complete` — mark complete
  - `GET /groups/:id/leaderboard` — scores
  - `POST /notifications/schedule` — schedule push

---

## Design

- **Name:** Tidly
- **Tagline:** *"Split the work, not your sanity."*
- **Theme:** Dark-first, purple accent (#7C6AF5), two-mode support
- **Icons:** Feather icon set (no emojis in navigation)
- **Typography:** System font with monospace for numbers/scores

---

## Team

| Name | Role |
|------|------|
| Dev Dalsania | Frontend |
| Swayam Patel | Backend |
