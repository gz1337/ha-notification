"""Additional services for Notify Manager - TTS, Maps, Device Commands, etc."""
from __future__ import annotations

import logging
from typing import Any

import voluptuous as vol

from homeassistant.core import HomeAssistant, ServiceCall
from homeassistant.helpers import config_validation as cv

from .const import (
    DOMAIN,
    CONF_DEVICES,
    ATTR_TITLE,
    ATTR_MESSAGE,
    ATTR_TARGET,
    ATTR_TAG,
    ATTR_DATA,
    ATTR_TTS_TEXT,
    ATTR_MEDIA_STREAM,
    ATTR_LATITUDE,
    ATTR_LONGITUDE,
    ATTR_SECOND_LATITUDE,
    ATTR_SECOND_LONGITUDE,
    ATTR_SHOWS_LINE,
    ATTR_COMMAND,
    ATTR_VIDEO,
    ATTR_AUDIO,
    ATTR_IMAGE,
    ATTR_PROGRESS,
    ATTR_PROGRESS_MAX,
    ATTR_CHRONOMETER,
    ATTR_WHEN,
    ATTR_SUBTITLE,
    ATTR_SUBJECT,
    ATTR_BADGE,
    ATTR_ICON,
    ATTR_VISIBILITY,
    ATTR_VIBRATION,
    ATTR_LED_COLOR,
    ATTR_ALERT_ONCE,
    ATTR_NOTIFICATION_ICON,
    ATTR_CAR_UI,
    SERVICE_SEND_TTS,
    SERVICE_SEND_MAP,
    SERVICE_SEND_VIDEO,
    SERVICE_DEVICE_COMMAND,
    SERVICE_REQUEST_LOCATION,
)

_LOGGER = logging.getLogger(__name__)

# ============================================================================
# SERVICE SCHEMAS
# ============================================================================

# TTS Service Schema
SEND_TTS_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TTS_TEXT): cv.string,
        vol.Optional(ATTR_TARGET): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional(ATTR_MEDIA_STREAM, default="music_stream"): vol.In([
            "music_stream",
            "alarm_stream",
            "alarm_stream_max",
        ]),
        vol.Optional(ATTR_DATA): dict,
    }
)

# Map Service Schema (iOS)
SEND_MAP_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_MESSAGE): cv.string,
        vol.Required(ATTR_LATITUDE): cv.string,
        vol.Required(ATTR_LONGITUDE): cv.string,
        vol.Optional(ATTR_TITLE): cv.string,
        vol.Optional(ATTR_TARGET): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional(ATTR_SECOND_LATITUDE): cv.string,
        vol.Optional(ATTR_SECOND_LONGITUDE): cv.string,
        vol.Optional(ATTR_SHOWS_LINE): cv.boolean,
        vol.Optional("shows_compass"): cv.boolean,
        vol.Optional("shows_traffic"): cv.boolean,
        vol.Optional("shows_scale"): cv.boolean,
        vol.Optional("shows_points_of_interest"): cv.boolean,
        vol.Optional("shows_user_location"): cv.boolean,
        vol.Optional("latitude_delta"): cv.string,
        vol.Optional("longitude_delta"): cv.string,
        vol.Optional(ATTR_TAG): cv.string,
        vol.Optional(ATTR_DATA): dict,
    }
)

# Video/Audio Service Schema
SEND_VIDEO_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_TITLE): cv.string,
        vol.Required(ATTR_MESSAGE): cv.string,
        vol.Exclusive(ATTR_VIDEO, "media"): cv.string,
        vol.Exclusive(ATTR_AUDIO, "media"): cv.string,
        vol.Optional(ATTR_IMAGE): cv.string,  # Thumbnail
        vol.Optional(ATTR_TARGET): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional(ATTR_TAG): cv.string,
        vol.Optional(ATTR_DATA): dict,
    }
)

# Device Command Schema (Android)
DEVICE_COMMAND_SCHEMA = vol.Schema(
    {
        vol.Required(ATTR_COMMAND): vol.In([
            "command_dnd",
            "command_ringer_mode",
            "command_volume_level",
            "command_screen_on",
            "command_screen_brightness_level",
            "command_bluetooth",
            "command_high_accuracy_mode",
            "command_activity",
            "command_broadcast_intent",
            "command_webview",
            "command_launch_app",
            "command_media",
            "command_flashlight",
            "command_app_lock",
            "command_persistent_connection",
            "command_update_sensors",
            "command_stop_tts",
            "command_auto_screen_brightness",
            "command_screen_off_timeout",
            "command_ble_transmitter",
            "command_beacon_monitor",
            "remove_channel",
        ]),
        vol.Optional(ATTR_TARGET): vol.All(cv.ensure_list, [cv.string]),
        vol.Optional(ATTR_DATA): dict,
    }
)

# Request Location Schema
REQUEST_LOCATION_SCHEMA = vol.Schema(
    {
        vol.Optional(ATTR_TARGET): vol.All(cv.ensure_list, [cv.string]),
    }
)


# ============================================================================
# SERVICE HANDLERS
# ============================================================================

async def async_register_additional_services(hass: HomeAssistant, entry) -> None:
    """Register additional services for TTS, Maps, Commands, etc."""
    
    async def _send_to_devices(message: str, data: dict, targets: list[str] | None = None) -> None:
        """Send notification to specified devices."""
        config_data = hass.data[DOMAIN].get(entry.entry_id, {})
        devices = targets if targets else config_data.get("devices", [])
        
        for device in devices:
            service_name = f"mobile_app_{device}"
            try:
                await hass.services.async_call(
                    "notify",
                    service_name,
                    {
                        "message": message,
                        "data": data,
                    } if "title" not in data else {
                        "title": data.pop("title", ""),
                        "message": message,
                        "data": data,
                    },
                    blocking=True,
                )
                _LOGGER.debug("Sent to %s", device)
            except Exception as err:
                _LOGGER.error("Failed to send to %s: %s", device, err)
    
    # ========== SERVICE: send_tts (Text-to-Speech, Android) ==========
    async def handle_send_tts(call: ServiceCall) -> None:
        """Handle TTS notification (Android only)."""
        tts_text = call.data[ATTR_TTS_TEXT]
        media_stream = call.data.get(ATTR_MEDIA_STREAM, "music_stream")
        extra_data = call.data.get(ATTR_DATA, {})
        
        data = {
            "tts_text": tts_text,
            "media_stream": media_stream,
            **extra_data,
        }
        
        await _send_to_devices(
            message="TTS",
            data=data,
            targets=call.data.get(ATTR_TARGET),
        )
    
    # ========== SERVICE: send_map (iOS Map with Pin) ==========
    async def handle_send_map(call: ServiceCall) -> None:
        """Handle map notification with location pin (iOS only)."""
        action_data = {
            "latitude": call.data[ATTR_LATITUDE],
            "longitude": call.data[ATTR_LONGITUDE],
        }
        
        # Optional second pin
        if call.data.get(ATTR_SECOND_LATITUDE):
            action_data["second_latitude"] = call.data[ATTR_SECOND_LATITUDE]
            action_data["second_longitude"] = call.data.get(ATTR_SECOND_LONGITUDE, "")
        
        # Map options
        for opt in ["shows_line_between_points", "shows_compass", "shows_traffic", 
                    "shows_scale", "shows_points_of_interest", "shows_user_location",
                    "latitude_delta", "longitude_delta"]:
            if call.data.get(opt) is not None:
                action_data[opt] = call.data[opt]
        
        data = {
            "action_data": action_data,
        }
        
        if call.data.get(ATTR_TAG):
            data["tag"] = call.data[ATTR_TAG]
        
        extra_data = call.data.get(ATTR_DATA, {})
        data.update(extra_data)
        
        # For title we need to handle it differently
        if call.data.get(ATTR_TITLE):
            data["title"] = call.data[ATTR_TITLE]
        
        await _send_to_devices(
            message=call.data[ATTR_MESSAGE],
            data=data,
            targets=call.data.get(ATTR_TARGET),
        )
    
    # ========== SERVICE: send_video (Video/Audio attachment) ==========
    async def handle_send_video(call: ServiceCall) -> None:
        """Handle video or audio attachment notification."""
        data = {}
        
        if call.data.get(ATTR_VIDEO):
            data["video"] = call.data[ATTR_VIDEO]
        if call.data.get(ATTR_AUDIO):
            data["audio"] = call.data[ATTR_AUDIO]
        if call.data.get(ATTR_IMAGE):
            data["image"] = call.data[ATTR_IMAGE]  # Thumbnail
        if call.data.get(ATTR_TAG):
            data["tag"] = call.data[ATTR_TAG]
        
        extra_data = call.data.get(ATTR_DATA, {})
        data.update(extra_data)
        data["title"] = call.data[ATTR_TITLE]
        
        await _send_to_devices(
            message=call.data[ATTR_MESSAGE],
            data=data,
            targets=call.data.get(ATTR_TARGET),
        )
    
    # ========== SERVICE: device_command (Android device control) ==========
    async def handle_device_command(call: ServiceCall) -> None:
        """Handle device command (Android only)."""
        command = call.data[ATTR_COMMAND]
        extra_data = call.data.get(ATTR_DATA, {})
        
        # The message IS the command
        message = command
        
        await _send_to_devices(
            message=message,
            data=extra_data,
            targets=call.data.get(ATTR_TARGET),
        )
    
    # ========== SERVICE: request_location_update ==========
    async def handle_request_location(call: ServiceCall) -> None:
        """Request location update from device."""
        await _send_to_devices(
            message="request_location_update",
            data={},
            targets=call.data.get(ATTR_TARGET),
        )
    
    # ========== SERVICE: send_progress (Android Progress Bar) ==========
    async def handle_send_progress(call: ServiceCall) -> None:
        """Handle progress notification (Android)."""
        title = call.data.get("title", "")
        message = call.data.get("message", "")
        progress = call.data.get("progress", 0)
        progress_max = call.data.get("progress_max", 100)
        tag = call.data.get(ATTR_TAG, "progress")
        
        data = {
            "title": title,
            "tag": tag,
            "progress": progress,
            "progress_max": progress_max,
        }
        
        await _send_to_devices(
            message=message,
            data=data,
            targets=call.data.get(ATTR_TARGET),
        )
    
    # ========== SERVICE: send_chronometer (Android Timer) ==========
    async def handle_send_chronometer(call: ServiceCall) -> None:
        """Handle chronometer/timer notification (Android)."""
        title = call.data.get("title", "")
        message = call.data.get("message", "")
        when = call.data.get("when", 60)
        tag = call.data.get(ATTR_TAG, "timer")
        
        data = {
            "title": title,
            "tag": tag,
            "chronometer": True,
            "when": when,
            "when_relative": True,
        }
        
        await _send_to_devices(
            message=message,
            data=data,
            targets=call.data.get(ATTR_TARGET),
        )
    
    # Register services
    hass.services.async_register(
        DOMAIN, SERVICE_SEND_TTS, handle_send_tts, schema=SEND_TTS_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SEND_MAP, handle_send_map, schema=SEND_MAP_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_SEND_VIDEO, handle_send_video, schema=SEND_VIDEO_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_DEVICE_COMMAND, handle_device_command, schema=DEVICE_COMMAND_SCHEMA
    )
    hass.services.async_register(
        DOMAIN, SERVICE_REQUEST_LOCATION, handle_request_location, schema=REQUEST_LOCATION_SCHEMA
    )
    
    # Progress notification schema
    SEND_PROGRESS_SCHEMA = vol.Schema({
        vol.Required("title"): cv.string,
        vol.Required("message"): cv.string,
        vol.Required("progress"): vol.All(vol.Coerce(int), vol.Range(min=-1, max=100)),
        vol.Optional("progress_max", default=100): vol.Coerce(int),
        vol.Required(ATTR_TAG): cv.string,
        vol.Optional(ATTR_TARGET): vol.All(cv.ensure_list, [cv.string]),
    })
    hass.services.async_register(
        DOMAIN, "send_progress", handle_send_progress, schema=SEND_PROGRESS_SCHEMA
    )
    
    # Chronometer notification schema
    SEND_CHRONOMETER_SCHEMA = vol.Schema({
        vol.Required("title"): cv.string,
        vol.Required("message"): cv.string,
        vol.Required("when"): vol.Coerce(int),
        vol.Required(ATTR_TAG): cv.string,
        vol.Optional(ATTR_TARGET): vol.All(cv.ensure_list, [cv.string]),
    })
    hass.services.async_register(
        DOMAIN, "send_chronometer", handle_send_chronometer, schema=SEND_CHRONOMETER_SCHEMA
    )


async def async_unregister_additional_services(hass: HomeAssistant) -> None:
    """Unregister additional services."""
    for service in [SERVICE_SEND_TTS, SERVICE_SEND_MAP, SERVICE_SEND_VIDEO, 
                    SERVICE_DEVICE_COMMAND, SERVICE_REQUEST_LOCATION,
                    "send_progress", "send_chronometer"]:
        try:
            hass.services.async_remove(DOMAIN, service)
        except Exception:
            pass
