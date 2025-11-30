"""Switch platform for Notify Manager."""
from __future__ import annotations

import logging
from typing import Any

from homeassistant.components.switch import SwitchEntity
from homeassistant.config_entries import ConfigEntry
from homeassistant.core import HomeAssistant
from homeassistant.helpers.entity import DeviceInfo, EntityCategory
from homeassistant.helpers.entity_platform import AddEntitiesCallback

from .const import DOMAIN, CONF_SHOW_SIDEBAR

_LOGGER = logging.getLogger(__name__)


async def async_setup_entry(
    hass: HomeAssistant,
    entry: ConfigEntry,
    async_add_entities: AddEntitiesCallback,
) -> None:
    """Set up Notify Manager switches."""
    # Only sidebar switch - categories removed for cleaner device page
    switches = [
        NotifySidebarSwitch(hass, entry),
    ]

    async_add_entities(switches)


class NotifySidebarSwitch(SwitchEntity):
    """Switch to show/hide Notify Manager in sidebar."""

    _attr_has_entity_name = True
    _attr_name = "Show in Sidebar"
    _attr_icon = "mdi:dock-left"
    _attr_entity_category = EntityCategory.CONFIG

    def __init__(
        self,
        hass: HomeAssistant,
        entry: ConfigEntry,
    ) -> None:
        """Initialize the sidebar switch."""
        self.hass = hass
        self._entry = entry
        self._attr_unique_id = f"{entry.entry_id}_sidebar"

        self._attr_device_info = DeviceInfo(
            identifiers={(DOMAIN, entry.entry_id)},
            name="Notify Manager",
            manufacturer="Custom Integration",
            model="Notification Manager",
            sw_version="1.2.6.0",
            configuration_url="/notify-manager",
        )

    @property
    def is_on(self) -> bool:
        """Return true if sidebar is enabled."""
        return self._entry.data.get(CONF_SHOW_SIDEBAR, True)

    async def async_turn_on(self, **kwargs: Any) -> None:
        """Show in sidebar."""
        await self._set_sidebar_state(True)

    async def async_turn_off(self, **kwargs: Any) -> None:
        """Hide from sidebar."""
        await self._set_sidebar_state(False)

    async def _set_sidebar_state(self, show: bool) -> None:
        """Set the sidebar visibility state."""
        # Update config entry
        new_data = {**self._entry.data}
        new_data[CONF_SHOW_SIDEBAR] = show
        self.hass.config_entries.async_update_entry(self._entry, data=new_data)

        # Reload to apply sidebar change
        await self.hass.config_entries.async_reload(self._entry.entry_id)

        self.async_write_ha_state()
        _LOGGER.info("Sidebar visibility set to %s", show)

    @property
    def extra_state_attributes(self) -> dict[str, Any]:
        """Return extra attributes."""
        return {
            "panel_url": "/notify-manager",
        }
