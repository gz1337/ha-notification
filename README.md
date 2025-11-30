# Notify Manager

<p align="center">
  <img src="icon.png" alt="Notify Manager Logo" width="200">
</p>

<p align="center">
  <strong>Complete notification management for Home Assistant</strong><br>
  100% Companion App features - simple and organized
</p>

<p align="center">
  <a href="https://github.com/gz1337/ha-notify-manager/releases"><img src="https://img.shields.io/github/v/release/gz1337/ha-notify-manager?style=flat-square" alt="Release"></a>
  <a href="https://github.com/hacs/integration"><img src="https://img.shields.io/badge/HACS-Custom-orange.svg?style=flat-square" alt="HACS"></a>
  <a href="LICENSE"><img src="https://img.shields.io/github/license/gz1337/ha-notify-manager?style=flat-square" alt="License"></a>
</p>

<p align="center">
  <a href="https://www.buymeacoffee.com/edflock"><img src="https://img.shields.io/badge/Buy%20me%20a%20coffee-FFDD00?style=for-the-badge&logo=buy-me-a-coffee&logoColor=black" alt="Buy Me A Coffee"></a>
</p>

---

## Changelog

### v1.2.6.0
- **Simplified Device Page**: Only Panel button and Sidebar toggle on the device page - removed cluttered controls
- **Removed Categories Tab**: Cleaner UI with focus on essential features (Send, Devices/Groups, Templates, Help)
- **Auto Language Detection**: Frontend automatically detects German or English based on Home Assistant language settings
- **Dashboard Dropdown**: "On click open" field now shows all available dashboards and views in a dropdown with optgroup organization
- **Simplified Device Conditions**: Only shows created notification templates for automation conditions (removed category switches)
- **Groups Sync**: Groups created in the frontend are now properly synced to the backend services (no more mock data)
- **Code Cleanup**: Removed deprecated category entities and streamlined codebase

---

## Features

### Core Features
- **Central Notification Hub** - All Companion App features in one place
- **iOS & Android** - Full support for both platforms
- **Custom Frontend Panel** - With template and group manager
- **Device Groups** - Send to multiple devices at once
- **Templates** - Save frequently used notifications

### Notification Types
- **Actionable Notifications** - Interactive buttons
- **Camera Snapshots** - Images directly in the notification
- **Video & Audio** - Media attachments
- **Text Input** - Users can reply
- **Maps with Pin** - Location notifications (iOS)
- **Progress Bars** - Progress display (Android)
- **Timer/Countdown** - Chronometer (Android)
- **Text-to-Speech** - Read text aloud (Android)

### Advanced Features
- **Critical Notifications** - Override Do Not Disturb (iOS)
- **20+ Device Commands** - Control Android devices
- **Badge Control** - Set/clear app badges (iOS)
- **Apple Watch** - Update complications
- **Widgets** - Update iOS Home Screen widgets

---

## Installation

### HACS (Recommended)

1. Open **HACS** in Home Assistant
2. Click the **three dots** (...) in the top right
3. Select **Custom repositories**
4. Add:
   - **Repository**: `https://github.com/gz1337/ha-notify-manager`
   - **Category**: `Integration`
5. Click **Add**
6. Search for **Notify Manager** and install
7. **Restart Home Assistant**

### Manual Installation

1. Download the [latest release](https://github.com/gz1337/ha-notify-manager/releases)
2. Copy `custom_components/notify_manager` to `config/custom_components/`
3. Restart Home Assistant

---

## Setup

1. Go to **Settings** > **Devices & Services**
2. Click **+ Add Integration**
3. Search for **Notify Manager**
4. Select your Companion App devices
5. Done! "Notify Manager" appears in the sidebar

---

## Available Services (18 total)

### Basic Services

| Service | Description |
|---------|-------------|
| `send_notification` | Simple notification |
| `send_actionable` | With buttons |
| `send_with_image` | With image/camera |
| `send_alarm_confirmation` | Alarm templates |
| `send_text_input` | With text input |
| `clear_notifications` | Clear notifications |

### Extended Services

| Service | Description | Platform |
|---------|-------------|----------|
| `send_tts` | Text-to-speech | Android |
| `send_map` | Map with pin | iOS |
| `send_media` | Video/Audio | Both |
| `send_progress` | Progress bar | Android |
| `send_chronometer` | Timer/Countdown | Android |
| `send_advanced` | All options | Both |

### Control Services

| Service | Description | Platform |
|---------|-------------|----------|
| `device_command` | 20+ device commands | Android |
| `request_location_update` | Request location | Both |
| `update_widgets` | Update widgets | iOS |
| `update_complications` | Update watch | iOS |
| `set_badge` | Set badge | iOS |
| `clear_badge` | Clear badge | iOS |

---

## Examples

### Simple Notification

```yaml
service: notify_manager.send_notification
data:
  title: "Welcome"
  message: "You're home!"
  priority: normal
```

### With Buttons

```yaml
service: notify_manager.send_actionable
data:
  title: "Doorbell"
  message: "Someone is at the door!"
  target:
    - iphone_max
  actions:
    - action: "DOOR_OPEN"
      title: "Open"
    - action: "DOOR_IGNORE"
      title: "Ignore"
  priority: high
  tag: doorbell
```

### With Camera Snapshot

```yaml
service: notify_manager.send_with_image
data:
  title: "Motion Detected"
  message: "Motion at the front door"
  camera_entity: camera.front_door
  priority: high
  actions:
    - action: "VIEW_LIVE"
      title: "View Live"
```

### Send to Group

```yaml
service: notify_manager.send_to_group
data:
  group_name: "Family"
  title: "Dinner Time"
  message: "Dinner is ready!"
  priority: normal
```

### Text-to-Speech (Android)

```yaml
service: notify_manager.send_tts
data:
  tts_text: "Attention, the washing machine is done!"
  media_stream: alarm_stream
  target:
    - pixel_7
```

---

## Reacting to Button Clicks

```yaml
automation:
  - alias: "Doorbell - Open Door"
    trigger:
      - platform: event
        event_type: mobile_app_notification_action
        event_data:
          action: "DOOR_OPEN"
    action:
      - service: lock.unlock
        target:
          entity_id: lock.front_door
      - service: notify_manager.clear_notifications
        data:
          tag: doorbell
```

---

## Frontend Panel

The panel provides:

- **Send** - Quickly test notifications
- **Devices/Groups** - Manage devices and create groups
- **Templates** - Create and manage templates
- **Help** - Quick reference guide

---

## Troubleshooting

### No devices found
- Companion App installed and connected?
- Notifications enabled in the app?

### Notifications not arriving
- Test with `notify.mobile_app_xxx` directly

### Panel not showing
- Clear browser cache
- Restart Home Assistant

---

## License

MIT License - see [LICENSE](LICENSE)
