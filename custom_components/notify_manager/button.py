"""Button entities for Notify Manager integration.

Only provides the Panel Open button for navigation.
"""
from __future__ import annotations

import logging

from homeassistant.components.button import ButtonEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import DeviceInfo, EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Notify Manager button entities."""
    entities = [
        NotifyManagerOpenPanelButton(hass, entry),
    ]

    async_add_entities(entities)


class NotifyManagerOpenPanelButton(ButtonEntity):
    """Button to open the Notify Manager panel."""

    _attr_has_entity_name = True
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(self, hass: HomeAssistant, entry: ConfigEntry) -> None:
        """Initialize the button."""
        self.hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_open_panel"
        self._attr_name = "Open Panel"
        self._attr_icon = "mdi:open-in-new"

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Notify Manager",
            manufacturer="Custom Integration",
            model="Notification Manager",
            sw_version="1.2.6.0",
            configuration_url="/notify-manager",
        )

    async def async_press(self) -> None:
        """Handle the button press."""
        # Fire an event that the frontend can listen to
        self.hass.bus.async_fire(
            f"{DOMAIN}_open_panel",
            {"url": "/notify-manager"}
        )
        _LOGGER.info("Panel open button pressed - navigate to /notify-manager")
