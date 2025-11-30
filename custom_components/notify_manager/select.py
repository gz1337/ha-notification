"""Select entity for Notify Manager integration.

Provides ONE select entity showing:
1. Template names (for send_from_template service)
2. Action IDs (for automation conditions)

When a button is pressed, the entity updates to show which action was triggered.
"""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.select import SelectEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant, callback, Event
from homeassistant.helpers.entity import DeviceInfo
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Notify Manager select entity."""
    async_add_entities([NotifyManagerSelect(hass, entry)])


class NotifyManagerSelect(SelectEntity):
    """Combined select entity for templates and button actions.

    Options are organized as:
    1. "Keine Auswahl" (default)
    2. "── Vorlagen ──" (separator)
    3. Template names...
    4. "── Action IDs ──" (separator)
    5. Action IDs from buttons...

    The entity automatically updates when:
    - A notification button is pressed → shows the Action ID
    - A notification is sent from template → shows the template name
    - Templates are saved → refreshes options
    """

    _attr_has_entity_name = True

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the select entity."""
        self.hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_active_notification"
        self._attr_name = "Active Notification"
        self._attr_icon = "mdi:bell-check"

        # Track last action details
        self._last_action = None
        self._last_action_time = None
        self._last_template = None
        self._last_reply_text = None

        # Option mappings
        self._templates = {}  # id -> name
        self._actions = {}    # action_id -> template_name

        # Initial options
        self._attr_options = ["Keine Auswahl"]
        self._attr_current_option = "Keine Auswahl"

    async def async_added_to_hass(self) -> None:
        """Register event listeners when added to hass."""
        await super().async_added_to_hass()

        # Load initial options
        await self._update_options()

        @callback
        def handle_templates_updated(event: Event) -> None:
            """Refresh options when templates are saved."""
            _LOGGER.debug("Templates updated, refreshing options")
            self.hass.async_create_task(self._update_options())
            self.async_write_ha_state()

        self.hass.bus.async_listen(f"{DOMAIN}_templates_saved", handle_templates_updated)

        @callback
        def handle_notification_sent(event: Event) -> None:
            """Update when notification is sent from template."""
            template_name = event.data.get("template_name")
            if template_name:
                # Find display name
                display = template_name
                for tid, tname in self._templates.items():
                    if tid == template_name or tname == template_name:
                        display = tname
                        break

                if display in self._attr_options:
                    self._attr_current_option = display
                    self._last_template = template_name
                    self.async_write_ha_state()

        self.hass.bus.async_listen(f"{DOMAIN}_notification_sent", handle_notification_sent)

        @callback
        def handle_action(event: Event) -> None:
            """Update when a notification button is pressed."""
            action = event.data.get("action", "")
            if not action:
                return

            self._last_action = action
            self._last_action_time = event.time_fired.isoformat()
            self._last_reply_text = event.data.get("reply_text")

            # Find template for this action
            self._last_template = self._actions.get(action, "")

            # Update current option to the action ID
            if action in self._attr_options:
                self._attr_current_option = action
                self.async_write_ha_state()
                _LOGGER.info("Button '%s' pressed (template: %s)", action, self._last_template)
            else:
                # Action not in list - add it dynamically
                _LOGGER.debug("Action '%s' not in options, adding", action)
                self._attr_options.append(action)
                self._attr_current_option = action
                self.async_write_ha_state()

        self.hass.bus.async_listen("mobile_app_notification_action", handle_action)

    async def _update_options(self) -> None:
        """Build options list from templates and their action IDs."""
        options = ["Keine Auswahl"]
        self._templates = {}
        self._actions = {}

        # Get templates from storage
        data = self.hass.data.get(DOMAIN, {}).get(self._entry.entry_id, {})
        user_templates = data.get("user_templates", [])

        # Collect templates
        template_names = []
        for template in user_templates:
            name = template.get("name", "")
            template_id = template.get("id", name)
            if name:
                self._templates[template_id] = name
                template_names.append(name)

                # Collect action IDs from buttons
                for btn in template.get("buttons", []):
                    action_id = btn.get("action", "")
                    if action_id:
                        self._actions[action_id] = name

        # Build options list with sections
        if template_names:
            options.append("── Vorlagen ──")
            options.extend(sorted(template_names))

        action_ids = list(self._actions.keys())
        if action_ids:
            options.append("── Action IDs ──")
            options.extend(sorted(action_ids))

        self._attr_options = options
        _LOGGER.debug("Updated options: %d templates, %d actions",
                      len(template_names), len(action_ids))

    @property
    def device_info(self) -> DeviceInfo:
        """Return device info."""
        return DeviceInfo(
            identifiers={(DOMAIN, self._entry.entry_id)},
            name="Notify Manager",
            manufacturer="Custom Integration",
            model="Notification Manager",
            sw_version="1.2.7.3",
        )

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra state attributes."""
        return {
            "last_action": self._last_action,
            "last_action_time": self._last_action_time,
            "last_template": self._last_template,
            "reply_text": self._last_reply_text,
            "available_templates": list(self._templates.values()),
            "available_action_ids": list(self._actions.keys()),
        }

    async def async_select_option(self, option: str) -> None:
        """Handle manual option selection (for reset)."""
        # Don't allow selecting separator lines
        if option.startswith("──"):
            return
        self._attr_current_option = option
        self.async_write_ha_state()
