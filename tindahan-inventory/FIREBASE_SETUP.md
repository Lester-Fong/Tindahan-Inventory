# Firebase Integration - Phase 7

## Overview

This application now implements an **offline-first architecture** with Firebase as a backup and sync system. The architecture is designed for Android APK deployment via webview with older users who need offline functionality.

## Architecture

### Offline-First Design

- **Primary Storage**: Local JSON file (`src/data/database.json`) + localStorage
- **Secondary Storage**: Firebase Firestore (backup/sync)
- **Sync Direction**: One-way Firebase → Local (download only)
- **Bulk Import**: CSV → Firebase → Local (for adding new products)

### Key Features

- ✅ **Offline Mode**: Full functionality without internet
- ✅ **Auto-Sync**: Downloads latest data from Firebase when online
- ✅ **CSV Import**: Bulk import 500+ products via Firebase
- ✅ **Status Indicators**: Real-time connection and sync status
- ✅ **Data Export**: Download local data as JSON backup

## Usage

### Sync Panel

The sync panel appears at the top of the application and shows:

- **Connection Status**: Online/Offline indicator
- **Last Sync Time**: When data was last synced from Firebase
- **Sync Button**: Manual sync trigger
- **Import/Export**: CSV import and JSON export buttons

### CSV Import Process

1. Click "Import CSV" button
2. Download the CSV template (4 columns: Name, Brand, Size, Price)
3. Fill in your product data
4. Upload the CSV file
5. Preview and import to Firebase
6. Data automatically syncs to local storage

### Status Indicators

- 🟢 **Green**: Online and synced
- 🟡 **Yellow**: Offline mode
- 🔴 **Red**: Sync error

## Firebase Configuration

The Firebase configuration is located in `src/config/firebase.ts`:

```typescript
const firebaseConfig = {
  apiKey: 'AIzaSyApyNj4lm2i0gXVrQ3S9G-jMwTdjG9o7GU',
  authDomain: 'tindahan-inventory.firebaseapp.com',
  projectId: 'tindahan-inventory',
  storageBucket: 'tindahan-inventory.firebasestorage.app',
  messagingSenderId: '128402097823',
  appId: '1:128402097823:web:714de3b6e027f24a5b44aa',
  measurementId: 'G-PMMEBG3SQF',
}
```

## Firestore Collections

### Products Collection (`products`)

```typescript
{
  id: string,
  name: string,
  brand: string,
  size: string,
  price: number,
  createdAt: Timestamp,
  updatedAt: Timestamp
}
```

### Sync Metadata Collection (`syncMetadata`)

```typescript
{
  lastSync: Timestamp,
  syncStatus: 'idle' | 'syncing' | 'success' | 'error',
  errorMessage?: string
}
```

## Development vs Production

### Development Mode

- Optional Firestore emulator support
- Enhanced logging
- Analytics disabled

### Production Mode

- Direct Firebase connection
- Analytics enabled
- Error tracking

## Next Steps

1. **Test CSV Import**: Import your 500 products via CSV
2. **Verify Offline Mode**: Test application functionality when offline
3. **Deploy to Firebase Hosting**: For web access
4. **Package as APK**: Convert to Android app via webview

## Security Notes

- Firebase rules should be configured for your use case
- Consider authentication if multiple users will access the system
- Regular backups recommended via the export feature
