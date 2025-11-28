{% if installed %}

<p align="center">
  <img src="https://raw.githubusercontent.com/gz1337/ha-notify-manager/main/icon.png" alt="Notify Manager" width="120">
</p>

## Aktuelle Version: {{ version_installed }}

---

{% endif %}

## 🚀 100% Companion App Features

**18 Services** für vollständige Kontrolle über iOS & Android Benachrichtigungen.

### Benachrichtigungstypen
- 📱 Einfache Benachrichtigungen
- 🔘 Actionable Notifications (Buttons)
- 📷 Kamera-Snapshots
- 🎬 Video & Audio Anhänge
- ✏️ Text-Eingabe
- 🗺️ Karten mit Pin (iOS)
- 📊 Fortschrittsbalken (Android)
- ⏱️ Timer/Countdown (Android)
- 🔊 Text-to-Speech (Android)
- 🚨 Kritische Benachrichtigungen

### Steuerung
- 📲 20+ Android Geräte-Befehle
- 📍 Standort anfordern
- 🔄 iOS Widgets aktualisieren
- ⌚ Apple Watch Complications
- 🔴 App-Badges (iOS)

### Frontend-Panel
- 📤 **Senden** - Schnelltest
- 📋 **Vorlagen** - Eigene Vorlagen speichern
- 👥 **Gruppen** - Gerätegruppen erstellen

---

## Beispiel

```yaml
service: notify_manager.send_actionable
data:
  title: "🔔 Türklingel"
  message: "Jemand ist an der Tür!"
  camera_entity: camera.haustuer
  target:
    - iphone_max
  actions:
    - action: "DOOR_OPEN"
      title: "🔓 Öffnen"
    - action: "DOOR_IGNORE"
      title: "Ignorieren"
  priority: high
```

---

## Links

- 📖 [Dokumentation](https://github.com/gz1337/ha-notify-manager)
- 🐛 [Issues melden](https://github.com/gz1337/ha-notify-manager/issues)
- 📋 [Companion App Docs](https://companion.home-assistant.io/docs/notifications/notifications-basic)
