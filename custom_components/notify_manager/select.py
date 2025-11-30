"""Select entities for Notify Manager integration.

Bietet Select-Entities für:
- Button-Antwort Auswahl (für Conditions)
- Standard-Priorität
- Standard-Kategorie
"""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback, Event
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import (
    DOMAIN,
    ACTION_TEMPLATES,
    DEFAULT_CATEGORIES,
    PRIORITY_LEVELS,
)

_LOGGER = logging.getLogger(__name__)

# All individual button actions that can be selected
BUTTON_ACTIONS = {
    "none": "⏸️ Keine Auswahl",
    "CONFIRM": "✅ Bestätigen",
    "DISMISS": "❌ Ablehnen",
    "YES": "👍 Ja",
    "NO": "👎 Nein",
    "ALARM_CONFIRM": "🚨 Alarm OK",
    "ALARM_SNOOZE": "⏰ Später erinnern",
    "ALARM_EMERGENCY": "🆘 Notfall",
    "DOOR_UNLOCK": "🔓 Tür öffnen",
    "DOOR_IGNORE": "🚪 Ignorieren",
    "DOOR_SPEAK": "🔊 Sprechen",
    "REPLY": "💬 Antwort gesendet",
}


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Notify Manager select entities."""
    entities = [
        NotifyManagerButtonResponseSelect(hass, entry),
        NotifyManagerPrioritySelect(hass, entry),
        NotifyManagerCategorySelect(hass, entry),
    ]
    
    async_add_entities(entities)


class NotifyManagerButtonResponseSelect(SelectEntity):
    """Select entity that tracks and allows selecting button responses.
    
    This entity:
    1. Automatically updates when a button is clicked on a notification
    2. Can be used in automation conditions to check which button was clicked
    3. Shows all possible button actions as options
    """
    
    _attr_has_entity_name = True
    
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the select entity."""
        self.hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_button_response"
        self._attr_name = "Button-Antwort"
        self._last_action_time = None
        self._last_reply_text = None
        
        self._attr_options = list(BUTTON_ACTIONS.values())
        self._attr_current_option = BUTTON_ACTIONS["none"]
    
    async def async_added_to_hass(self) -> None:
        """Register event listener when added to hass."""
        await super().async_added_to_hass()
        
        @callback
        def handle_action(event: Event) -> None:
            """Handle notification action events - auto-update this select."""
            action = event.data.get("action", "")
            if action and action in BUTTON_ACTIONS:
                self._attr_current_option = BUTTON_ACTIONS[action]
                self._last_action_time = event.time_fired.isoformat()
                self._last_reply_text = event.data.get("reply_text")
                
                # Store in hass.data for other components
                data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
                data["last_button_action"] = action
                data["last_button_time"] = self._last_action_time
                
                self.async_write_ha_state()
                _LOGGER.debug("Button response updated: %s", action)
        
        self.hass.bus.async_listen("mobile_app_notification_action", handle_action)
    
    @property
    def device_info(self) -> DeviceInfo:
        """Return device info."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name="Notify Manager",
            manufacturer="Custom Integration",
            model="Notification Manager",
            sw_version="1.2.3.4",
        )
    
    @property
    def icon(self) -> str:
        """Return icon based on current selection."""
        current = self._attr_current_option
        if "Bestätigen" in current or "OK" in current:
            return "mdi:check-circle"
        elif "Ablehnen" in current or "Nein" in current:
            return "mdi:close-circle"
        elif "Notfall" in current:
            return "mdi:alert"
        elif "Tür" in current or "öffnen" in current:
            return "mdi:door-open"
        elif "Antwort" in current:
            return "mdi:message-reply"
        return "mdi:gesture-tap-button"
    
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        action_key = self._get_action_key(self._attr_current_option)
        return {
            "action_id": action_key,
            "last_action_time": self._last_action_time,
            "reply_text": self._last_reply_text,
            "available_actions": list(BUTTON_ACTIONS.keys()),
        }
    
    def _get_action_key(self, label: str) -> str:
        """Get action key from label."""
        for key, value in BUTTON_ACTIONS.items():
            if value == label:
                return key
        return "none"
    
    def _get_action_label(self, key: str) -> str:
        """Get label from action key."""
        return BUTTON_ACTIONS.get(key, BUTTON_ACTIONS["none"])
    
    async def async_select_option(self, option: str) -> None:
        """Change the selected option (manual selection for testing/reset)."""
        self._attr_current_option = option
        action_key = self._get_action_key(option)
        
        # Update hass.data
        data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
        data["last_button_action"] = action_key
        
        self.async_write_ha_state()


class NotifyManagerPrioritySelect(SelectEntity):
    """Select entity for default priority."""
    
    _attr_has_entity_name = True
    _attr_translation_key = "default_priority"
    
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the select entity."""
        self.hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_default_priority"
        self._attr_name = "Standard-Priorität"
        
        self._priority_labels = {
            "low": "🔇 Niedrig (Leise)",
            "normal": "📱 Normal",
            "high": "🔔 Hoch (Wichtig)",
            "critical": "🚨 Kritisch (Durchbricht Nicht-Stören)",
        }
        
        self._attr_options = list(self._priority_labels.values())
        
        # Get current from config
        current_priority = entry.data.get("default_priority", "normal")
        self._attr_current_option = self._priority_labels.get(current_priority, self._priority_labels["normal"])
    
    @property
    def device_info(self) -> DeviceInfo:
        """Return device info."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name="Notify Manager",
            manufacturer="Custom Integration",
            model="Notification Manager",
            sw_version="1.2.3.4",
        )
    
    @property
    def icon(self) -> str:
        """Return icon."""
        if "Kritisch" in str(self._attr_current_option):
            return "mdi:alert-circle"
        elif "Hoch" in str(self._attr_current_option):
            return "mdi:bell-ring"
        elif "Niedrig" in str(self._attr_current_option):
            return "mdi:bell-sleep"
        return "mdi:bell"
    
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        priority_key = self._get_priority_key(self._attr_current_option)
        priority_config = PRIORITY_LEVELS.get(priority_key, {})
        
        return {
            "priority_key": priority_key,
            "importance": priority_config.get("importance"),
            "interruption_level": priority_config.get("interruption_level"),
            "is_critical": priority_config.get("critical", False),
        }
    
    def _get_priority_key(self, label: str) -> str:
        """Get priority key from label."""
        for key, value in self._priority_labels.items():
            if value == label:
                return key
        return "normal"
    
    async def async_select_option(self, option: str) -> None:
        """Change the selected option."""
        self._attr_current_option = option
        priority_key = self._get_priority_key(option)
        
        # Store in hass.data
        self.hass.data[DOMAIN].setdefault("default_priority", "normal")
        self.hass.data[DOMAIN]["default_priority"] = priority_key
        
        self.async_write_ha_state()


class NotifyManagerCategorySelect(SelectEntity):
    """Select entity for default category."""
    
    _attr_has_entity_name = True
    _attr_translation_key = "default_category"
    
    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the select entity."""
        self.hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_default_category"
        self._attr_name = "Standard-Kategorie"
        
        # Build from DEFAULT_CATEGORIES
        self._category_labels = {
            "none": "Keine Kategorie",
        }
        for cat_id, cat_config in DEFAULT_CATEGORIES.items():
            icon = cat_config.get("icon", "mdi:bell").replace("mdi:", "")
            name = cat_config.get("name", cat_id.title())
            self._category_labels[cat_id] = f"{name}"
        
        self._attr_options = list(self._category_labels.values())
        self._attr_current_option = self._category_labels["none"]
    
    @property
    def device_info(self) -> DeviceInfo:
        """Return device info."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name="Notify Manager",
            manufacturer="Custom Integration",
            model="Notification Manager",
            sw_version="1.2.3.4",
        )
    
    @property
    def icon(self) -> str:
        """Return icon."""
        category_key = self._get_category_key(self._attr_current_option)
        if category_key in DEFAULT_CATEGORIES:
            return DEFAULT_CATEGORIES[category_key].get("icon", "mdi:tag")
        return "mdi:tag"
    
    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        category_key = self._get_category_key(self._attr_current_option)
        category_config = DEFAULT_CATEGORIES.get(category_key, {})
        
        return {
            "category_key": category_key,
            "priority": category_config.get("priority"),
            "sound": category_config.get("sound"),
            "channel": category_config.get("channel"),
            "color": category_config.get("color"),
        }
    
    def _get_category_key(self, label: str) -> str:
        """Get category key from label."""
        for key, value in self._category_labels.items():
            if value == label:
                return key
        return "none"
    
    async def async_select_option(self, option: str) -> None:
        """Change the selected option."""
        self._attr_current_option = option
        category_key = self._get_category_key(option)
        
        # Store in hass.data
        self.hass.data[DOMAIN].setdefault("default_category", "none")
        self.hass.data[DOMAIN]["default_category"] = category_key
        
        self.async_write_ha_state()
