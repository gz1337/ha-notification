# Changelog

All notable changes to Notify Manager will be documented in this file.

## [1.2.6.0] - 2025-11-30

### Changed
- **Simplified Device Page**: Device page now only shows Panel button and Sidebar toggle
  - Removed: Action templates, Button responses, Category switches
  - Cleaner device integration page with only essential controls

- **Removed Categories Tab**: Frontend panel reduced from 5 tabs to 4
  - Tabs: Send, Devices/Groups, Templates, Help
  - Categories were rarely used and added unnecessary complexity

- **Auto Language Detection**: Frontend automatically detects user's language
  - Supports German (DE) and English (EN)
  - Uses Home Assistant's language setting with browser fallback
  - All UI text now properly translated

- **Dashboard Dropdown**: "On click open" field improved
  - Shows all available Lovelace dashboards and their views
  - Organized with optgroups for better navigation
  - No more manual URL typing required

- **Simplified Device Conditions**: For automation conditions
  - Only shows user-created notification templates
  - Removed category-based switches from conditions
  - Tracks button responses by template for better automation logic

- **Groups Sync**: Real synchronization between frontend and backend
  - Groups created in panel are synced to HA services
  - Removed hardcoded mock groups from services.yaml
  - Dynamic group resolution in all notification services

### Technical
- Updated version strings to 1.2.6.0 across all files
- Cleaned up deprecated entity code
- Improved WebSocket communication for dashboard loading
- Added `_syncGroupsToHA()` method for real-time group synchronization

---

## [1.2.5.0] - 2025-11-29

### Added
- Device Conditions: Template filter for "Last Button Action"
- Groups in Services: Saved groups available in all notification services
- Buy me a coffee button in panel header

### Fixed
- Duplicate `async_setup_entry` in sensor.py
- Duplicate code in select.py

---

## [1.2.3.6] - Previous

### Added
- Template association for button responses
- New "Send to Group" service
- New "Last Template" select entity for conditions
- Persistent group storage in HA Storage

---

## [1.2.3.4] - Previous

### Changed
- Button Response select shows individual buttons as options

---

## [1.2.3.3] - Previous

### Added
- "Last Button" sensor
- Persistent template storage
- WebSocket API

---

## [1.2.3] - Previous

### Added
- Button editor with individual fields
- `send_from_template` service

---

## [1.2.0] - Previous

### Added
- Device Triggers, Conditions and Actions

---

## [1.1.0] - Previous

### Added
- 18 Services
- Frontend Panel
