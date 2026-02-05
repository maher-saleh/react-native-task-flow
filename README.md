# TaskFlow

A clean and simple task manager app built with React Native and TypeScript.

## What I Built

This is my solution for the Chapter One React Native tech screen. I wanted to create something useful for managing daily tasks, not just check requirement boxes.

### Core Features

* Add tasks with title and optional details
* Mark tasks as complete/incomplete
* Delete tasks (with confirmation)
* Tasks persist between sessions using AsyncStorage

### Extra Features

* **Category System**: Organize tasks by Work, Personal, Urgent, or Other with color coding
* **Smart Filtering**: Quick tabs to view All, Active, or Completed tasks
* **Progress Stats**: See completion rate and task counts at a glance
* **Clean UI**: Simple design focused on usability

## Tech Stack

* React Native with Expo (SDK 50)
* TypeScript
* Expo Router (file-based routing)
* AsyncStorage for data persistence
* Expo Vector Icons

## How to Run

```bash
# Install dependencies
npm install

# Start the app
npx expo start
```

Then:

* Press `i` for iOS simulator
* Press `a` for Android emulator
* Scan QR code with Expo Go app on your phone

## Project Structure

```
TaskFlow/
├── app/
│   └── (tabs)/
│       ├── index.tsx          # Main screen
│       └── _layout.tsx        # Tab navigation
├── components/
│   ├── TaskItem.tsx           # Individual task component
│   └── CategoryPicker.tsx     # Category selection
├── utils/
│   └── storage.ts             # AsyncStorage helpers
├── types/
│   └── index.ts               # TypeScript interfaces
└── README.md
```

## Design Decisions

**Why TypeScript?**\
The Expo template uses it by default, and it's good practice for catching bugs early. Defining clear interfaces for Task and Category made the code more maintainable.

**Why categories?**\
I use task apps daily and basic to-do lists feel too simple. Categories help organize without being overwhelming.

**Why this UI approach?**\
I went with a bottom sheet for adding tasks instead of a separate screen - it feels more modern and keeps you in context.

**Why local storage?**\
For this test, I focused on getting fundamentals right. AsyncStorage is simple, reliable, and shows I understand state persistence.

## Things I'd Add Next

* Edit task functionality
* Due dates with reminders
* Drag to reorder
* Dark mode
* Task search

## Development Timeline

\~7 hours over 3 days:

* **Day 1**: Core CRUD + AsyncStorage (4 hours)
* **Day 2**: Categories, filtering, stats (2 hours)
* **Day 3**: Polish, testing, docs (1 hour)

Tested on:

* iOS Simulator (iPhone 15)
* Android device (Pixel 6)

## Contact

Questions about the code? Reach out:

* Email: hire@mahersaleh.com
* GitHub: @maher-saleh

***

Built with React Native + TypeScript
