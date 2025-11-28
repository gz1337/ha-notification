# Notify Manager - Feature Checklist

Vergleich der Home Assistant Companion App Dokumentation mit der Implementierung.

## ✅ = Implementiert | ⚠️ = Teilweise | ❌ = Fehlt

---

## notifications-basic (Grundlagen)

| Feature | Status | Notizen |
|---------|--------|---------|
| title, message | ✅ | Basis-Parameter |
| Grouping (group) | ✅ | iOS thread-id + Android group |
| Replacing (tag) | ✅ | Tag für Ersetzung |
| Clearing (clear_notification) | ✅ | Via Service |
| Subtitle (iOS) | ❌ | Fehlt |
| Subject (Android) | ❌ | Fehlt für langen Text |
| Color (Android) | ✅ | Über Kategorie-Farben |
| Sticky (Android) | ✅ | persistent + sticky |
| Notification Channels | ✅ | Über channel Parameter |
| Channel Importance | ✅ | importance Parameter |
| Vibration Pattern | ❌ | vibrationPattern fehlt |
| LED Color | ❌ | ledColor fehlt |
| Persistent Notification | ✅ | persistent Parameter |
| Timeout | ✅ | timeout Parameter |
| HTML Formatting | ❌ | Nicht dokumentiert |
| icon_url (Android) | ❌ | Fehlt |
| visibility (Lock Screen) | ❌ | Fehlt |
| TTS (Text-to-Speech) | ❌ | message: TTS fehlt |
| Chronometer | ❌ | Fehlt |
| Progress Bar | ❌ | Fehlt |
| alert_once | ❌ | Fehlt |
| notification_icon (MDI) | ❌ | Fehlt |
| car_ui (Android Auto) | ❌ | Fehlt |
| Interruption Level (iOS) | ✅ | interruption-level |
| Presentation Options (iOS) | ❌ | Fehlt |
| Badge (iOS) | ❌ | Fehlt |
| Sound (iOS) | ✅ | Über push.sound |
| URL/clickAction | ✅ | Beide implementiert |

---

## notification-attachments (Anhänge)

| Feature | Status | Notizen |
|---------|--------|---------|
| image | ✅ | Bild-URL |
| video | ❌ | Fehlt |
| audio | ❌ | Fehlt |
| /api/camera_proxy | ✅ | camera_entity Parameter |
| /api/image_proxy | ❌ | Für image entities |
| media_source | ❌ | /media/local/ Pfade |
| attachment.hide-thumbnail | ❌ | iOS spezifisch |
| attachment.lazy | ❌ | iOS spezifisch |
| attachment.content-type | ❌ | Fehlt |

---

## dynamic-content (Dynamische Inhalte - iOS)

| Feature | Status | Notizen |
|---------|--------|---------|
| Map mit Pin | ❌ | action_data.latitude/longitude |
| Map Zoom Level | ❌ | latitude_delta, longitude_delta |
| Zweiter Pin | ❌ | second_latitude/longitude |
| Map Optionen | ❌ | shows_compass, shows_traffic, etc. |
| Camera Stream | ⚠️ | Nur Snapshot, kein Live-Stream |

---

## actionable-notifications (Aktionen)

| Feature | Status | Notizen |
|---------|--------|---------|
| actions Array | ✅ | Vollständig |
| action (ID) | ✅ | Wird zurückgegeben |
| title | ✅ | Button-Text |
| uri | ✅ | URL öffnen |
| behavior: textInput | ✅ | Text-Eingabe |
| icon (SF Symbols) | ✅ | sfsymbols:... |
| destructive | ✅ | Roter Button |
| authenticationRequired | ✅ | Face/Touch ID |
| textInputButtonTitle | ✅ | Für Reply |
| textInputPlaceholder | ✅ | Für Reply |
| activationMode (iOS) | ❌ | foreground/background |
| action_data (iOS) | ✅ | Wird zurückgegeben |
| Dynamische Action-IDs | ✅ | In Beispielen gezeigt |
| wait_for_trigger Pattern | ✅ | In Beispielen |

---

## critical-notifications (Kritische)

| Feature | Status | Notizen |
|---------|--------|---------|
| push.sound.critical (iOS) | ✅ | Bei priority=critical |
| push.sound.volume | ✅ | 1.0 bei critical |
| interruption-level: critical | ✅ | Implementiert |
| ttl: 0, priority: high (Android) | ✅ | Bei high/critical |
| channel: alarm_stream | ❌ | Android-spezifisch |
| media_stream: alarm_stream | ❌ | Für TTS |
| media_stream: alarm_stream_max | ❌ | Max Volume TTS |

---

## notification-cleared (Android)

| Feature | Status | Notizen |
|---------|--------|---------|
| mobile_app_notification_cleared Event | ⚠️ | Nicht explizit gehandled |

---

## notification-commands (Befehle)

| Feature | Status | Notizen |
|---------|--------|---------|
| request_location_update | ❌ | Fehlt |
| clear_notification | ✅ | Via Service |
| command_activity | ❌ | Android Activity starten |
| command_app_lock | ❌ | App-Sperre |
| command_auto_screen_brightness | ❌ | Fehlt |
| command_bluetooth | ❌ | Fehlt |
| command_ble_transmitter | ❌ | Fehlt |
| command_beacon_monitor | ❌ | Fehlt |
| command_broadcast_intent | ❌ | Fehlt |
| command_dnd | ❌ | Do Not Disturb |
| command_flashlight | ❌ | Fehlt |
| command_high_accuracy_mode | ❌ | GPS |
| command_launch_app | ❌ | App starten |
| command_media | ❌ | Mediensteuerung |
| command_ringer_mode | ❌ | Klingelton |
| command_screen_brightness_level | ❌ | Fehlt |
| command_screen_off_timeout | ❌ | Fehlt |
| command_screen_on | ❌ | Fehlt |
| command_stop_tts | ❌ | Fehlt |
| command_persistent_connection | ❌ | Fehlt |
| command_update_sensors | ❌ | Fehlt |
| command_volume_level | ❌ | Fehlt |
| command_webview | ❌ | Fehlt |
| remove_channel | ❌ | Fehlt |
| update_widgets (iOS) | ❌ | Fehlt |
| update_complications (iOS) | ❌ | Fehlt |
| clear_badge (iOS) | ❌ | Fehlt |

---

## notification-sounds

| Feature | Status | Notizen |
|---------|--------|---------|
| Custom Sound (iOS) | ⚠️ | sound Parameter vorhanden |
| sound: none | ⚠️ | Sollte funktionieren |
| Pre-installed Sounds | ⚠️ | Können verwendet werden |
| Channel Sound (Android) | ⚠️ | Über Systemeinstellungen |

---

## notification-local (Lokale Benachrichtigungen)

| Feature | Status | Notizen |
|---------|--------|---------|
| Lokale Push | ❌ | Nicht implementiert |

---

## notification-received (Empfangen)

| Feature | Status | Notizen |
|---------|--------|---------|
| mobile_app_notification_received Event | ❌ | Nicht gehandled |

---

## Zusammenfassung

### Gut implementiert ✅
- Basis-Benachrichtigungen
- Actionable Notifications mit Buttons
- Kritische Benachrichtigungen (iOS)
- Kamera-Snapshots (Bild)
- Text-Eingabe (Reply)
- Tags und Gruppen
- Prioritäten und Interruption Levels
- Action-Handling via Events

### Teilweise implementiert ⚠️
- Sounds (Basis vorhanden)
- Dynamische Inhalte (nur Bilder)
- Notification Cleared Event

### Fehlt noch ❌
- Video/Audio Attachments
- TTS (Text-to-Speech)
- Maps mit Pins
- Notification Commands (device control)
- Progress Bars
- Chronometer
- LED Color / Vibration Pattern
- Android Auto (car_ui)
- iOS Badge
- Presentation Options
- Subtitle/Subject
- Screen Control Commands
- Location Update Request
- Widget/Complication Updates
