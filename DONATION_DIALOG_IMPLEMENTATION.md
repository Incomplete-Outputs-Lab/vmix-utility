# Donation Dialog Implementation

## Summary
Successfully implemented a donation prompt dialog that appears on first launch and every 30 days thereafter, with an option to permanently dismiss it.

## Changes Made

### Rust Backend

#### 1. `app/src-tauri/src/types.rs`
- Added `DonationPromptConfig` struct with:
  - `last_shown: Option<String>` - RFC3339 timestamp of last display
  - `permanently_dismissed: bool` - Flag for "Don't show again"
- Added `donation_prompt: Option<DonationPromptConfig>` field to `AppConfig` (with `#[serde(default)]` for backward compatibility)

#### 2. `app/src-tauri/src/state.rs`
- Added `donation_prompt: Arc<Mutex<DonationPromptConfig>>` to `AppState`
- Initialized in `new()` with `DonationPromptConfig::default()`
- Updated `save_config()` to include donation_prompt in AppConfig
- Updated `load_config()` to restore donation_prompt from config.json

#### 3. `app/src-tauri/src/commands.rs`
- Added `use chrono::{DateTime, Duration, Utc};` for date/time handling
- Implemented `should_show_donation_prompt()`:
  - Returns `false` if `permanently_dismissed == true`
  - Returns `true` if `last_shown == None` (first launch)
  - Returns `true` if 30+ days have passed since `last_shown`
  - Returns `false` otherwise
- Implemented `dismiss_donation_prompt(permanently: bool)`:
  - Updates `last_shown` to current timestamp
  - Sets `permanently_dismissed = true` if requested
  - Calls `save_config()` to persist changes

#### 4. `app/src-tauri/src/lib.rs`
- Registered new commands in `generate_handler!`:
  - `should_show_donation_prompt`
  - `dismiss_donation_prompt`

### React Frontend

#### 5. `app/src/components/DonationDialog.tsx` (New File)
- Material-UI Dialog component matching existing design patterns
- Title: "Support vmix-utility" with FavoriteOutlined icon
- Content:
  - Thank you message
  - Explanation that project is free and open source
  - Three support buttons (matching Developer.tsx style):
    - "Star on GitHub" (secondary color)
    - "GitHub Sponsors" (#13C3FF blue)
    - "Subscribe on Twitch" (#9146FF purple)
  - "Don't show this again" checkbox
- "Close" button in DialogActions
- Uses same TwitchIcon SVG as Developer.tsx

#### 6. `app/src/App.tsx`
- Added imports: `DonationDialog`, `invoke`
- Added state: `donationDialogOpen`
- Added useEffect to check dialog display conditions:
  - Only runs on main window (`currentPath === '/'`)
  - Waits 2 seconds after startup
  - Calls `invoke('should_show_donation_prompt')`
  - Opens dialog if backend returns true
- Added `handleDonationDialogClose()`:
  - Closes dialog
  - Calls `invoke('dismiss_donation_prompt', { permanently })`
- Rendered `<DonationDialog>` inside `<VMixStatusProvider>`

## Design Considerations

### Backward Compatibility
- Used `#[serde(default)]` and `Option<DonationPromptConfig>` so existing config.json files work without migration
- Default values ensure safe behavior for missing fields

### Display Timing
- 2-second delay after startup to avoid conflicts with:
  - Theme loading
  - Update checker (3-second delay)
- Only shows on main window (not on popup windows like List Manager)

### State Management
- Backend centralizes all display logic for consistency
- Frontend only calls backend commands, no date logic duplication
- Persistent storage via existing config.json mechanism

### User Experience
- Non-intrusive: only shows on first launch and monthly
- Easy to dismiss permanently
- Uses familiar UI patterns from existing Developer page
- Accessible via same support buttons throughout the app

## Testing Checklist

1. ✅ First launch: Dialog appears 2 seconds after startup
2. ⏳ Second launch (within 30 days): Dialog does NOT appear
3. ⏳ Launch after 30+ days: Dialog appears again
4. ⏳ "Don't show again" + close: Dialog never appears again (even after 30 days)
5. ⏳ Manual config.json test: Verify timestamps are saved correctly
6. ⏳ Popup windows (List Manager): Dialog does NOT appear
7. ⏳ All support buttons work (open correct URLs)

## Build Status
✅ Compilation successful (both Rust and TypeScript)
✅ Debug build completed without errors
✅ Type checking passed

## Files Modified
- `app/src-tauri/src/types.rs`
- `app/src-tauri/src/state.rs`
- `app/src-tauri/src/commands.rs`
- `app/src-tauri/src/lib.rs`
- `app/src/App.tsx`

## Files Created
- `app/src/components/DonationDialog.tsx`

## Dependencies Used
- `chrono` - Already in Cargo.toml (for date/time calculations)
- No new frontend dependencies required
