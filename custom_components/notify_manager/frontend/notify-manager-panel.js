/**
 * Notify Manager Panel - Complete notification management
 * Version 1.2.6.0
 *
 * Features:
 * - Automatic language detection (DE/EN)
 * - Template management
 * - Group management with inline editing
 * - Dashboard/page selection for click actions
 */

import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.5.1/lit-element.js?module";

// Translations
const TRANSLATIONS = {
  en: {
    // Header
    title: "Notify Manager",
    devices: "Devices",
    services: "Services",

    // Tabs
    send: "Send",
    devicesGroups: "Devices & Groups",
    templates: "Templates",
    help: "Help",

    // Send tab
    quickNotification: "Quick Notification",
    useTemplate: "Use template",
    recipients: "Recipients",
    allDevices: "All Devices",
    notificationType: "Notification type",
    simple: "Simple",
    withButtons: "With Buttons",
    withCamera: "With Camera",
    tts: "TTS",
    title_field: "Title",
    priority: "Priority",
    quiet: "Quiet",
    normal: "Normal",
    important: "Important",
    critical: "Critical",
    message: "Message",
    textToRead: "Text to read",
    camera: "Camera",
    selectCamera: "-- Select camera --",
    buttonTemplate: "Button template",
    none: "None",
    confirmReject: "Confirm/Reject",
    yesNo: "Yes/No",
    alarm: "Alarm",
    door: "Door",
    reply: "Reply",
    buttons: "Buttons",
    canBeCustomized: "(can be customized)",
    actionId: "Action ID (e.g. CONFIRM)",
    buttonText: "Button Text",
    addButton: "+ Add Button",
    clickAction: "On click open",
    selectDashboard: "-- Select page --",
    customUrl: "Or enter URL...",
    preview: "Preview",
    saveAsTemplate: "Save as template",
    sendNotification: "Send notification",
    sending: "Sending...",
    sent: "Notification sent!",
    error: "Error",

    // Devices tab
    statistics: "Statistics",
    groups: "Groups",
    deviceGroups: "Device Groups",
    newGroup: "+ New Group",
    clickToAddRemove: "Click on a group to add/remove devices.",
    noGroups: "No groups created yet.",
    connectedDevices: "Connected Devices",
    clickDevicesFor: "Click devices for",
    inGroup: "in group",
    clickToToggle: "Click to add/remove",
    selectGroupAbove: "Select a group above to add/remove devices.",
    noDevices: "No Companion App devices found.",
    rename: "Rename",

    // Templates tab
    manageTemplates: "Manage Templates",
    newTemplate: "+ New Template",
    type: "Type",
    use: "Use",
    noTemplates: "No custom templates created yet.",
    createFirst: "Create first template",

    // Help tab
    helpTitle: "Help & Documentation",
    quickStart: "Quick Start",
    quickStartText: "1. Select recipients and type in the Send tab\n2. Enter title and message\n3. Click Send",
    templatesHelp: "Templates",
    templatesHelpText: "Save frequently used notifications as templates. They appear as quick buttons in the Send tab.",
    groupsHelp: "Groups",
    groupsHelpText: "Create device groups like 'Family' or 'All iPhones' to notify multiple devices at once.",
    buttonReaction: "React to Buttons",
    availableServices: "Available Services",

    // Modals
    editTemplate: "Edit Template",
    newTemplateTitle: "New Template",
    templateName: "Template name (with emoji)",
    cancel: "Cancel",
    save: "Save",
    editGroup: "Edit Group",
    newGroupTitle: "New Group",
    groupName: "Group name",
    selectDevices: "Select devices (click to add/remove)",
    selectAtLeastOne: "Please select at least one device",
    enterName: "Please enter a name",
    deleteConfirm: "Really delete?",
    templateSaved: "Template saved!",
  },
  de: {
    // Header
    title: "Notify Manager",
    devices: "Geräte",
    services: "Services",

    // Tabs
    send: "Senden",
    devicesGroups: "Geräte & Gruppen",
    templates: "Vorlagen",
    help: "Hilfe",

    // Send tab
    quickNotification: "Schnell-Benachrichtigung",
    useTemplate: "Vorlage verwenden",
    recipients: "Empfänger",
    allDevices: "Alle Geräte",
    notificationType: "Benachrichtigungstyp",
    simple: "Einfach",
    withButtons: "Mit Buttons",
    withCamera: "Mit Kamera",
    tts: "TTS",
    title_field: "Titel",
    priority: "Priorität",
    quiet: "Leise",
    normal: "Normal",
    important: "Wichtig",
    critical: "Kritisch",
    message: "Nachricht",
    textToRead: "Text zum Vorlesen",
    camera: "Kamera",
    selectCamera: "-- Kamera wählen --",
    buttonTemplate: "Button-Vorlage wählen",
    none: "Keine",
    confirmReject: "Bestätigen/Ablehnen",
    yesNo: "Ja/Nein",
    alarm: "Alarm",
    door: "Tür",
    reply: "Antwort",
    buttons: "Buttons",
    canBeCustomized: "(können angepasst werden)",
    actionId: "Action ID (z.B. CONFIRM)",
    buttonText: "Button Text",
    addButton: "+ Button hinzufügen",
    clickAction: "Bei Klick öffnen",
    selectDashboard: "-- Seite wählen --",
    customUrl: "Oder URL eingeben...",
    preview: "Vorschau",
    saveAsTemplate: "Als Vorlage speichern",
    sendNotification: "Benachrichtigung senden",
    sending: "Sende...",
    sent: "Benachrichtigung gesendet!",
    error: "Fehler",

    // Devices tab
    statistics: "Statistiken",
    groups: "Gruppen",
    deviceGroups: "Gerätegruppen",
    newGroup: "+ Neue Gruppe",
    clickToAddRemove: "Klicke auf eine Gruppe, um Geräte hinzuzufügen oder zu entfernen.",
    noGroups: "Noch keine Gruppen erstellt.",
    connectedDevices: "Verbundene Geräte",
    clickDevicesFor: "Klicke Geräte für",
    inGroup: "in Gruppe",
    clickToToggle: "Klicke zum Hinzufügen/Entfernen",
    selectGroupAbove: "Wähle oben eine Gruppe aus, um Geräte hinzuzufügen oder zu entfernen.",
    noDevices: "Keine Companion App Geräte gefunden.",
    rename: "Umbenennen",

    // Templates tab
    manageTemplates: "Vorlagen verwalten",
    newTemplate: "+ Neue Vorlage",
    type: "Typ",
    use: "Verwenden",
    noTemplates: "Noch keine eigenen Vorlagen erstellt.",
    createFirst: "Erste Vorlage erstellen",

    // Help tab
    helpTitle: "Hilfe & Dokumentation",
    quickStart: "Schnellstart",
    quickStartText: "1. Wähle im Senden-Tab Empfänger und Typ\n2. Gib Titel und Nachricht ein\n3. Klicke auf Senden",
    templatesHelp: "Vorlagen",
    templatesHelpText: "Speichere häufig genutzte Benachrichtigungen als Vorlage. Diese erscheinen dann als Schnell-Buttons im Senden-Tab.",
    groupsHelp: "Gruppen",
    groupsHelpText: "Erstelle Gerätegruppen wie 'Familie' oder 'Alle iPhones' um mehrere Geräte gleichzeitig zu benachrichtigen.",
    buttonReaction: "Auf Buttons reagieren",
    availableServices: "Verfügbare Services",

    // Modals
    editTemplate: "Vorlage bearbeiten",
    newTemplateTitle: "Neue Vorlage",
    templateName: "Vorlagen-Name (mit Emoji)",
    cancel: "Abbrechen",
    save: "Speichern",
    editGroup: "Gruppe bearbeiten",
    newGroupTitle: "Neue Gruppe",
    groupName: "Gruppen-Name",
    selectDevices: "Geräte auswählen (klicken zum Hinzufügen/Entfernen)",
    selectAtLeastOne: "Bitte mindestens ein Gerät auswählen",
    enterName: "Bitte Namen eingeben",
    deleteConfirm: "Wirklich löschen?",
    templateSaved: "Vorlage gespeichert!",
  }
};

class NotifyManagerPanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      _tab: { type: String },
      _loading: { type: Boolean },
      _success: { type: String },
      _lang: { type: String },
      // Send Form
      _title: { type: String },
      _message: { type: String },
      _type: { type: String },
      _priority: { type: String },
      _camera: { type: String },
      _clickAction: { type: String },
      _buttons: { type: Array },
      _selectedDevices: { type: Array },
      _selectedGroup: { type: String },
      // Templates & Groups
      _templates: { type: Array },
      _groups: { type: Array },
      // Lovelace dashboards
      _dashboards: { type: Array },
      // Edit mode
      _editingTemplate: { type: Object },
      _editingGroup: { type: Object },
      // Inline group editing
      _activeGroupId: { type: String },
    };
  }

  constructor() {
    super();
    this._tab = "send";
    this._loading = false;
    this._success = "";
    this._lang = "en"; // Will be detected
    this._title = "";
    this._message = "";
    this._type = "simple";
    this._priority = "normal";
    this._camera = "";
    this._clickAction = "";
    this._buttons = [];
    this._selectedDevices = [];
    this._selectedGroup = "";
    this._editingTemplate = null;
    this._editingGroup = null;
    this._activeGroupId = null;
    this._dashboards = [];

    // Default templates
    this._templates = [
      { id: "doorbell", name: "🚪 Doorbell", title: "Doorbell", message: "Someone is at the door!", type: "image", priority: "high", buttons: [{ action: "DOOR_OPEN", title: "🔓 Open" }, { action: "DOOR_IGNORE", title: "Ignore" }] },
      { id: "alarm", name: "🚨 Alarm", title: "Alarm!", message: "Motion detected", type: "buttons", priority: "critical", buttons: [{ action: "ALARM_OK", title: "✅ OK" }, { action: "ALARM_EMERGENCY", title: "🆘 Emergency" }] },
      { id: "reminder", name: "⏰ Reminder", title: "Reminder", message: "", type: "simple", priority: "normal", buttons: [] },
    ];
    this._groups = [];
    this._templatesLoaded = false;
  }

  // Get translation
  t(key) {
    return TRANSLATIONS[this._lang]?.[key] || TRANSLATIONS.en[key] || key;
  }

  async connectedCallback() {
    super.connectedCallback();
    // Detect language from Home Assistant
    this._detectLanguage();
    // Load templates and groups
    await this._loadTemplatesFromHA();
    // Load dashboards
    await this._loadDashboards();
  }

  _detectLanguage() {
    // Try to detect from HA language setting
    const haLang = this.hass?.language || navigator.language || "en";
    this._lang = haLang.startsWith("de") ? "de" : "en";
  }

  async _loadDashboards() {
    if (!this.hass) return;

    try {
      // Get lovelace dashboards via WebSocket
      const dashboards = await this.hass.callWS({ type: "lovelace/dashboards" });
      this._dashboards = dashboards || [];

      // Also try to get views from each dashboard
      for (const dashboard of this._dashboards) {
        try {
          const config = await this.hass.callWS({
            type: "lovelace/config",
            url_path: dashboard.url_path || null
          });
          dashboard.views = config?.views || [];
        } catch (e) {
          dashboard.views = [];
        }
      }
    } catch (e) {
      console.debug("Could not load dashboards:", e);
      this._dashboards = [];
    }
  }

  async _loadTemplatesFromHA() {
    if (this.hass && !this._templatesLoaded) {
      try {
        const response = await this.hass.callWS({
          type: "notify_manager/get_templates"
        });
        if (response && response.templates && response.templates.length) {
          this._templates = response.templates;
          this._templatesLoaded = true;
        }
      } catch (e) {
        // Fallback to localStorage
        const stored = localStorage.getItem("notify_manager_templates");
        if (stored) {
          try {
            this._templates = JSON.parse(stored);
            await this._syncTemplatesToHA();
          } catch {}
        }
      }

      // Load groups
      try {
        const storedGroups = localStorage.getItem("notify_manager_groups");
        if (storedGroups) {
          this._groups = JSON.parse(storedGroups);
          // Sync groups to HA
          await this._syncGroupsToHA();
        }
      } catch {}
    }
  }

  _saveToStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      if (key === "notify_manager_templates") {
        this._syncTemplatesToHA();
      } else if (key === "notify_manager_groups") {
        this._syncGroupsToHA();
      }
    } catch (e) {
      console.error("Storage error:", e);
    }
  }

  async _syncTemplatesToHA() {
    if (this.hass && this._templates) {
      try {
        await this.hass.callService("notify_manager", "save_templates", {
          templates: this._templates
        });
      } catch (e) {
        console.debug("Template sync error:", e);
      }
    }
  }

  async _syncGroupsToHA() {
    if (this.hass && this._groups) {
      try {
        await this.hass.callService("notify_manager", "save_groups", {
          groups: this._groups
        });
      } catch (e) {
        console.debug("Groups sync error:", e);
      }
    }
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        max-width: 1000px;
        margin: 0 auto;
        --accent: var(--primary-color, #03a9f4);
        --card-bg: var(--ha-card-background, var(--card-background-color, #fff));
        --text: var(--primary-text-color, #212121);
        --text2: var(--secondary-text-color, #727272);
        --border: var(--divider-color, #e0e0e0);
        --success: #4caf50;
        --error: #f44336;
      }

      .header {
        display: flex;
        align-items: center;
        gap: 16px;
        margin-bottom: 20px;
        padding: 16px;
        background: linear-gradient(135deg, var(--accent), #0288d1);
        border-radius: 16px;
        color: white;
        box-shadow: 0 4px 12px rgba(0,0,0,0.15);
      }
      .header-logo {
        width: 64px;
        height: 64px;
        border-radius: 12px;
        background: white;
        padding: 4px;
        box-shadow: 0 2px 8px rgba(0,0,0,0.2);
      }
      .header-title { font-size: 26px; font-weight: 600; margin: 0 0 4px 0; }
      .header-version { font-size: 13px; opacity: 0.9; }
      .header-spacer { flex: 1; }
      .bmc-button {
        display: flex;
        align-items: center;
        text-decoration: none;
        transition: transform 0.2s;
      }
      .bmc-button:hover { transform: scale(1.05); }
      .bmc-button img { border-radius: 8px; box-shadow: 0 2px 8px rgba(0,0,0,0.2); }

      .tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 8px;
        flex-wrap: wrap;
      }
      .tab {
        padding: 10px 16px;
        background: none;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        color: var(--text2);
        transition: all 0.2s;
      }
      .tab:hover { background: rgba(0,0,0,0.05); color: var(--text); }
      .tab.active { background: var(--accent); color: white; }

      .card {
        background: var(--card-bg);
        border-radius: 12px;
        padding: 20px;
        box-shadow: var(--ha-card-box-shadow, 0 2px 8px rgba(0,0,0,0.1));
        margin-bottom: 16px;
      }
      .card-title {
        font-size: 16px;
        font-weight: 600;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
        justify-content: space-between;
        color: var(--text);
      }

      .stats-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
        margin-bottom: 16px;
      }
      .stat-card {
        background: linear-gradient(135deg, rgba(3,169,244,0.1), rgba(3,169,244,0.05));
        border-radius: 12px;
        padding: 16px;
        text-align: center;
        border: 1px solid rgba(3,169,244,0.2);
      }
      .stat-value { font-size: 32px; font-weight: 700; color: var(--accent); }
      .stat-label { font-size: 12px; color: var(--text2); margin-top: 4px; }

      .form-group { margin-bottom: 16px; }
      label {
        display: block;
        font-size: 13px;
        font-weight: 500;
        color: var(--text2);
        margin-bottom: 6px;
      }
      input, textarea, select {
        width: 100%;
        padding: 10px 12px;
        border: 1px solid var(--border);
        border-radius: 8px;
        font-size: 14px;
        background: var(--card-bg);
        color: var(--text);
        box-sizing: border-box;
        font-family: inherit;
      }
      input:focus, textarea:focus, select:focus {
        outline: none;
        border-color: var(--accent);
        box-shadow: 0 0 0 2px rgba(3,169,244,0.2);
      }
      textarea { resize: vertical; min-height: 80px; }

      .row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
      @media (max-width: 600px) { .row { grid-template-columns: 1fr; } }

      .type-selector, .device-selector { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 8px; }
      .type-btn, .device-chip {
        padding: 10px 14px;
        border: 2px solid var(--border);
        border-radius: 10px;
        background: var(--card-bg);
        cursor: pointer;
        font-size: 13px;
        font-weight: 500;
        color: var(--text);
        transition: all 0.2s;
        display: flex;
        align-items: center;
        gap: 6px;
      }
      .type-btn:hover, .device-chip:hover { border-color: var(--accent); }
      .type-btn.active, .device-chip.selected {
        border-color: var(--accent);
        background: var(--accent);
        color: white;
      }
      .device-chip.group { border-style: dashed; }
      .device-chip.group.selected { border-style: solid; }
      .device-chip.clickable:hover { transform: scale(1.05); box-shadow: 0 2px 8px rgba(0,0,0,0.15); }

      .button-list { display: flex; flex-direction: column; gap: 8px; }
      .button-item { display: flex; gap: 8px; align-items: center; }
      .button-item input { flex: 1; }

      .btn {
        padding: 8px 16px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        font-size: 14px;
        font-weight: 500;
        transition: all 0.2s;
        display: inline-flex;
        align-items: center;
        gap: 6px;
      }
      .btn:hover { opacity: 0.85; transform: translateY(-1px); }
      .btn-primary { background: var(--accent); color: white; }
      .btn-success { background: var(--success); color: white; }
      .btn-danger { background: var(--error); color: white; }
      .btn-outline { background: transparent; border: 1px solid var(--border); color: var(--text); }
      .btn-small { padding: 6px 12px; font-size: 12px; }
      .btn-icon { width: 36px; height: 36px; padding: 0; justify-content: center; border-radius: 50%; }

      .send-btn {
        width: 100%;
        padding: 14px;
        background: linear-gradient(135deg, var(--accent), #0288d1);
        color: white;
        border: none;
        border-radius: 10px;
        font-size: 16px;
        font-weight: 600;
        cursor: pointer;
        transition: all 0.2s;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        box-shadow: 0 4px 12px rgba(3,169,244,0.3);
      }
      .send-btn:hover { transform: translateY(-2px); box-shadow: 0 6px 16px rgba(3,169,244,0.4); }
      .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; box-shadow: none; }

      .success-msg {
        background: rgba(76,175,80,0.1);
        color: var(--success);
        padding: 12px;
        border-radius: 8px;
        margin-top: 12px;
        text-align: center;
        font-weight: 500;
      }
      .error-msg {
        background: rgba(244,67,54,0.1);
        color: var(--error);
        padding: 12px;
        border-radius: 8px;
        margin-top: 12px;
        text-align: center;
        font-weight: 500;
      }

      .preview {
        background: #1a1a1a;
        border-radius: 12px;
        padding: 16px;
        color: white;
        margin-top: 16px;
      }
      .preview-title { font-size: 12px; color: #888; margin-bottom: 8px; }
      .preview-notification { background: #2d2d2d; border-radius: 10px; padding: 12px; }
      .preview-header { display: flex; align-items: center; gap: 8px; margin-bottom: 6px; }
      .preview-icon { width: 20px; height: 20px; background: var(--accent); border-radius: 4px; }
      .preview-app { font-size: 11px; color: #888; }
      .preview-t { font-weight: 600; font-size: 14px; }
      .preview-m { font-size: 13px; color: #ccc; margin-top: 4px; }
      .preview-buttons { display: flex; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid #444; }
      .preview-btn { flex: 1; padding: 8px; background: #444; border-radius: 6px; text-align: center; font-size: 12px; color: white; }

      .template-grid, .group-grid {
        display: grid;
        grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
        gap: 12px;
      }
      .template-card, .group-card {
        background: var(--card-bg);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 14px;
        cursor: pointer;
        transition: all 0.2s;
      }
      .template-card:hover, .group-card:hover {
        border-color: var(--accent);
        box-shadow: 0 4px 12px rgba(0,0,0,0.1);
        transform: translateY(-2px);
      }
      .group-card.active-group {
        border-color: var(--accent);
        background: linear-gradient(135deg, rgba(3,169,244,0.15), rgba(3,169,244,0.05));
        box-shadow: 0 0 0 2px var(--accent);
      }
      .template-name, .group-name { font-weight: 600; font-size: 15px; margin-bottom: 4px; }
      .template-preview, .group-info { font-size: 12px; color: var(--text2); }
      .template-actions, .group-actions { display: flex; gap: 8px; margin-top: 10px; }

      .modal-overlay {
        position: fixed;
        top: 0; left: 0; right: 0; bottom: 0;
        background: rgba(0,0,0,0.5);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000;
      }
      .modal {
        background: var(--card-bg);
        border-radius: 16px;
        padding: 24px;
        max-width: 500px;
        width: 90%;
        max-height: 80vh;
        overflow-y: auto;
      }
      .modal-title { font-size: 18px; font-weight: 600; margin-bottom: 16px; }
      .modal-actions { display: flex; gap: 8px; justify-content: flex-end; margin-top: 20px; }

      .empty-state { text-align: center; padding: 40px; color: var(--text2); }
      .empty-state-icon { font-size: 48px; margin-bottom: 16px; }

      .help-section { margin-bottom: 20px; }
      .help-section h3 { font-size: 15px; margin: 0 0 8px 0; color: var(--text); }
      .help-section p, .help-section li { font-size: 13px; color: var(--text2); line-height: 1.6; }
      .help-section code { background: rgba(0,0,0,0.05); padding: 2px 6px; border-radius: 4px; font-family: monospace; font-size: 12px; }
      .help-section pre { background: rgba(0,0,0,0.05); padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 11px; font-family: monospace; }
    `;
  }

  render() {
    return html`
      <div class="header">
        <img src="/notify_manager_static/images/logo.png" alt="Logo" class="header-logo">
        <div class="header-info">
          <h1 class="header-title">${this.t('title')}</h1>
          <div class="header-version">v1.2.6.0 • ${this._getDevices().length} ${this.t('devices')} • ${this._getServiceCount()} ${this.t('services')}</div>
        </div>
        <div class="header-spacer"></div>
        <a href="https://www.buymeacoffee.com/edflock" target="_blank" rel="noopener noreferrer" class="bmc-button">
          <img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 40px;">
        </a>
      </div>

      <div class="tabs">
        <button class="tab ${this._tab === 'send' ? 'active' : ''}" @click=${() => this._tab = 'send'}>📤 ${this.t('send')}</button>
        <button class="tab ${this._tab === 'devices' ? 'active' : ''}" @click=${() => this._tab = 'devices'}>📱 ${this.t('devicesGroups')}</button>
        <button class="tab ${this._tab === 'templates' ? 'active' : ''}" @click=${() => this._tab = 'templates'}>📋 ${this.t('templates')}</button>
        <button class="tab ${this._tab === 'help' ? 'active' : ''}" @click=${() => this._tab = 'help'}>❓ ${this.t('help')}</button>
      </div>

      ${this._tab === 'send' ? this._renderSendTab() : ''}
      ${this._tab === 'devices' ? this._renderDevicesTab() : ''}
      ${this._tab === 'templates' ? this._renderTemplatesTab() : ''}
      ${this._tab === 'help' ? this._renderHelpTab() : ''}

      ${this._editingTemplate ? this._renderTemplateModal() : ''}
      ${this._editingGroup ? this._renderGroupModal() : ''}
    `;
  }

  _renderDevicesTab() {
    const devices = this._getDevices();
    const sensors = this._getSensors();
    const activeGroup = this._activeGroupId ? this._groups.find(g => g.id === this._activeGroupId) : null;

    return html`
      <div class="stats-grid">
        <div class="stat-card">
          <div class="stat-value">${devices.length}</div>
          <div class="stat-label">${this.t('devices')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this._groups.length}</div>
          <div class="stat-label">${this.t('groups')}</div>
        </div>
        <div class="stat-card">
          <div class="stat-value">${this._getServiceCount()}</div>
          <div class="stat-label">${this.t('services')}</div>
        </div>
        ${sensors.map(s => html`
          <div class="stat-card">
            <div class="stat-value">${this.hass.states[s]?.state || '0'}</div>
            <div class="stat-label">${this.hass.states[s]?.attributes?.friendly_name?.replace('Notify Manager ', '') || s}</div>
          </div>
        `)}
      </div>

      <div class="card">
        <div class="card-title">
          <span>👥 ${this.t('deviceGroups')}</span>
          <button class="btn btn-primary btn-small" @click=${() => this._editingGroup = { id: '', name: '', devices: [] }}>
            ${this.t('newGroup')}
          </button>
        </div>

        <p style="color: var(--text2); font-size: 13px; margin-bottom: 12px;">
          ${this.t('clickToAddRemove')}
        </p>

        ${this._groups.length ? html`
          <div class="group-grid" style="margin-bottom: 16px;">
            ${this._groups.map(g => html`
              <div class="group-card ${this._activeGroupId === g.id ? 'active-group' : ''}"
                   @click=${() => this._activeGroupId = this._activeGroupId === g.id ? null : g.id}>
                <div class="group-name">👥 ${g.name}</div>
                <div class="group-info">${g.devices?.length || 0} ${this.t('devices')}: ${g.devices?.slice(0, 3).join(', ') || '-'}${g.devices?.length > 3 ? '...' : ''}</div>
                <div class="group-actions" @click=${(e) => e.stopPropagation()}>
                  <button class="btn btn-outline btn-small" @click=${() => this._editingGroup = {...g, devices: [...(g.devices || [])]}}>✏️ ${this.t('rename')}</button>
                  <button class="btn btn-danger btn-small" @click=${() => this._deleteGroup(g.id)}>🗑️</button>
                </div>
              </div>
            `)}
          </div>
        ` : html`
          <div style="text-align: center; padding: 20px; color: var(--text2);">
            <p>${this.t('noGroups')}</p>
          </div>
        `}
      </div>

      <div class="card">
        <div class="card-title">
          📱 ${this.t('connectedDevices')}
          ${activeGroup ? html`
            <span style="font-size: 13px; font-weight: normal; color: var(--accent);">
              → ${this.t('clickDevicesFor')} "${activeGroup.name}"
            </span>
          ` : ''}
        </div>

        ${activeGroup ? html`
          <p style="color: var(--accent); font-size: 13px; margin-bottom: 12px; padding: 8px; background: rgba(3,169,244,0.1); border-radius: 8px;">
            🔵 = ${this.t('inGroup')} "${activeGroup.name}" | ${this.t('clickToToggle')}
          </p>
        ` : html`
          <p style="color: var(--text2); font-size: 13px; margin-bottom: 12px;">
            ${this.t('selectGroupAbove')}
          </p>
        `}

        <div class="device-selector">
          ${devices.map(d => {
            const isInActiveGroup = activeGroup && (activeGroup.devices || []).includes(d);
            return html`
              <div class="device-chip ${isInActiveGroup ? 'selected' : ''} ${activeGroup ? 'clickable' : ''}"
                   @click=${() => activeGroup ? this._toggleDeviceInGroup(d, activeGroup.id) : null}
                   style="${activeGroup ? 'cursor: pointer;' : ''}">
                ${d.toLowerCase().includes('iphone') || d.toLowerCase().includes('ipad') ? '📱' : '🤖'}
                ${d}
                ${isInActiveGroup ? html`<span style="margin-left: 4px;">✓</span>` : ''}
              </div>
            `;
          })}
        </div>
        ${!devices.length ? html`<p style="color: var(--text2);">${this.t('noDevices')}</p>` : ''}
      </div>
    `;
  }

  _toggleDeviceInGroup(device, groupId) {
    const group = this._groups.find(g => g.id === groupId);
    if (!group) return;

    group.devices = group.devices || [];
    if (group.devices.includes(device)) {
      group.devices = group.devices.filter(d => d !== device);
    } else {
      group.devices = [...group.devices, device];
    }

    this._groups = [...this._groups];
    this._saveToStorage("notify_manager_groups", this._groups);
    this.requestUpdate();
  }

  _renderSendTab() {
    const devices = this._getDevices();
    const cameras = Object.keys(this.hass?.states || {}).filter(e => e.startsWith('camera.'));

    return html`
      <div class="card">
        <div class="card-title">📨 ${this.t('quickNotification')}</div>

        <div class="form-group">
          <label>${this.t('useTemplate')}</label>
          <div class="type-selector">
            ${this._templates.map(t => html`
              <div class="type-btn" @click=${() => this._applyTemplate(t)}>${t.name}</div>
            `)}
          </div>
        </div>

        <div class="form-group">
          <label>${this.t('recipients')}</label>
          <div class="device-selector">
            <div class="device-chip ${this._selectedDevices.length === 0 && !this._selectedGroup ? 'selected' : ''}"
                 @click=${() => { this._selectedDevices = []; this._selectedGroup = ''; }}>
              📱 ${this.t('allDevices')}
            </div>
            ${this._groups.map(g => html`
              <div class="device-chip group ${this._selectedGroup === g.id ? 'selected' : ''}"
                   @click=${() => { this._selectedGroup = g.id; this._selectedDevices = []; }}>
                👥 ${g.name}
              </div>
            `)}
            ${devices.map(d => html`
              <div class="device-chip ${this._selectedDevices.includes(d) ? 'selected' : ''}"
                   @click=${() => this._toggleDevice(d)}>
                ${d.toLowerCase().includes('iphone') || d.toLowerCase().includes('ipad') ? '📱' : '🤖'} ${d}
              </div>
            `)}
          </div>
        </div>

        <div class="form-group">
          <label>${this.t('notificationType')}</label>
          <div class="type-selector">
            <button class="type-btn ${this._type === 'simple' ? 'active' : ''}" @click=${() => this._type = 'simple'}>📱 ${this.t('simple')}</button>
            <button class="type-btn ${this._type === 'buttons' ? 'active' : ''}" @click=${() => this._type = 'buttons'}>🔘 ${this.t('withButtons')}</button>
            <button class="type-btn ${this._type === 'image' ? 'active' : ''}" @click=${() => this._type = 'image'}>📷 ${this.t('withCamera')}</button>
            <button class="type-btn ${this._type === 'tts' ? 'active' : ''}" @click=${() => this._type = 'tts'}>🔊 ${this.t('tts')}</button>
          </div>
        </div>

        <div class="row">
          <div class="form-group">
            <label>${this.t('title_field')}</label>
            <input type="text" .value=${this._title} @input=${(e) => this._title = e.target.value} placeholder="Home Assistant">
          </div>
          <div class="form-group">
            <label>${this.t('priority')}</label>
            <select .value=${this._priority} @change=${(e) => this._priority = e.target.value}>
              <option value="low">🔇 ${this.t('quiet')}</option>
              <option value="normal">📱 ${this.t('normal')}</option>
              <option value="high">🔔 ${this.t('important')}</option>
              <option value="critical">🚨 ${this.t('critical')}</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>${this._type === 'tts' ? this.t('textToRead') : this.t('message')}</label>
          <textarea .value=${this._message} @input=${(e) => this._message = e.target.value}
                    placeholder="${this._type === 'tts' ? this.t('textToRead') : this.t('message')}..."></textarea>
        </div>

        ${this._type === 'image' ? html`
          <div class="form-group">
            <label>${this.t('camera')}</label>
            <select .value=${this._camera} @change=${(e) => this._camera = e.target.value}>
              <option value="">${this.t('selectCamera')}</option>
              ${cameras.map(c => html`<option value="${c}">${this.hass.states[c]?.attributes?.friendly_name || c}</option>`)}
            </select>
          </div>
        ` : ''}

        ${this._type === 'buttons' ? html`
          <div class="form-group">
            <label>${this.t('buttonTemplate')}</label>
            <div class="type-selector" style="margin-bottom: 12px;">
              <div class="type-btn ${this._buttons.length === 0 ? 'active' : ''}" @click=${() => this._buttons = []}>${this.t('none')}</div>
              <div class="type-btn" @click=${() => this._applyButtonTemplate('confirm_dismiss')}>✅ ${this.t('confirmReject')}</div>
              <div class="type-btn" @click=${() => this._applyButtonTemplate('yes_no')}>👍 ${this.t('yesNo')}</div>
              <div class="type-btn" @click=${() => this._applyButtonTemplate('alarm_response')}>🚨 ${this.t('alarm')}</div>
              <div class="type-btn" @click=${() => this._applyButtonTemplate('door_response')}>🚪 ${this.t('door')}</div>
              <div class="type-btn" @click=${() => this._applyButtonTemplate('reply')}>💬 ${this.t('reply')}</div>
            </div>
            <label>${this.t('buttons')} <span style="font-weight: normal; color: var(--text2);">${this.t('canBeCustomized')}</span></label>
            <div class="button-list">
              ${this._buttons.map((btn, i) => html`
                <div class="button-item">
                  <input type="text" placeholder="${this.t('actionId')}" .value=${btn.action} @input=${(e) => this._updateButton(i, 'action', e.target.value)}>
                  <input type="text" placeholder="${this.t('buttonText')}" .value=${btn.title} @input=${(e) => this._updateButton(i, 'title', e.target.value)}>
                  <button class="btn btn-danger btn-icon" @click=${() => this._removeButton(i)}>✕</button>
                </div>
              `)}
              <button class="btn btn-success btn-small" @click=${this._addButton}>${this.t('addButton')}</button>
            </div>
          </div>
        ` : ''}

        <!-- Click Action / Dashboard Selection -->
        <div class="form-group">
          <label>${this.t('clickAction')}</label>
          <select .value=${this._clickAction} @change=${(e) => this._clickAction = e.target.value}>
            <option value="">${this.t('selectDashboard')}</option>
            ${this._dashboards.map(d => html`
              <optgroup label="${d.title || d.url_path || 'Default'}">
                ${d.url_path ? html`<option value="/lovelace-${d.url_path}">${d.title || d.url_path} (Dashboard)</option>` : html`<option value="/lovelace">Default Dashboard</option>`}
                ${(d.views || []).map(v => html`
                  <option value="${d.url_path ? `/lovelace-${d.url_path}/${v.path || v.title}` : `/lovelace/${v.path || v.title}`}">
                    └ ${v.title || v.path || 'View'}
                  </option>
                `)}
              </optgroup>
            `)}
          </select>
          <input type="text" style="margin-top: 8px;" placeholder="${this.t('customUrl')}"
                 .value=${this._clickAction.startsWith('/lovelace') ? '' : this._clickAction}
                 @input=${(e) => this._clickAction = e.target.value}>
        </div>

        <div class="preview">
          <div class="preview-title">📱 ${this.t('preview')}</div>
          <div class="preview-notification">
            <div class="preview-header">
              <div class="preview-icon"></div>
              <span class="preview-app">HOME ASSISTANT</span>
            </div>
            <div class="preview-t">${this._title || this.t('title_field')}</div>
            <div class="preview-m">${this._message || this.t('message') + '...'}</div>
            ${this._type === 'buttons' && this._buttons.length ? html`
              <div class="preview-buttons">
                ${this._buttons.map(b => html`<div class="preview-btn">${b.title || 'Button'}</div>`)}
              </div>
            ` : ''}
          </div>
        </div>

        <div style="margin-top: 12px;">
          <button class="btn btn-outline" @click=${this._saveAsTemplate}>💾 ${this.t('saveAsTemplate')}</button>
        </div>

        <button class="send-btn" style="margin-top: 16px;" @click=${this._send} ?disabled=${this._loading || !this._message}>
          ${this._loading ? `⏳ ${this.t('sending')}` : `📤 ${this.t('sendNotification')}`}
        </button>
        ${this._success ? html`<div class="${this._success.startsWith('❌') ? 'error-msg' : 'success-msg'}">${this._success}</div>` : ''}
      </div>
    `;
  }

  _renderTemplatesTab() {
    return html`
      <div class="card">
        <div class="card-title">
          <span>📋 ${this.t('manageTemplates')}</span>
          <button class="btn btn-primary btn-small" @click=${() => this._editingTemplate = { id: '', name: '', title: '', message: '', type: 'simple', priority: 'normal', buttons: [] }}>
            ${this.t('newTemplate')}
          </button>
        </div>

        ${this._templates.length ? html`
          <div class="template-grid">
            ${this._templates.map(t => html`
              <div class="template-card">
                <div class="template-name">${t.name}</div>
                <div class="template-preview">${t.title}: ${t.message?.substring(0, 40)}${t.message?.length > 40 ? '...' : ''}</div>
                <div class="template-preview">${this.t('type')}: ${t.type} | ${this.t('priority')}: ${t.priority}</div>
                <div class="template-actions">
                  <button class="btn btn-primary btn-small" @click=${() => this._applyTemplateAndSwitch(t)}>${this.t('use')}</button>
                  <button class="btn btn-outline btn-small" @click=${() => this._editingTemplate = {...t, buttons: [...(t.buttons || [])]}}>✏️</button>
                  <button class="btn btn-danger btn-small" @click=${() => this._deleteTemplate(t.id)}>🗑️</button>
                </div>
              </div>
            `)}
          </div>
        ` : html`
          <div class="empty-state">
            <div class="empty-state-icon">📋</div>
            <p>${this.t('noTemplates')}</p>
            <button class="btn btn-primary" @click=${() => this._editingTemplate = { id: '', name: '', title: '', message: '', type: 'simple', priority: 'normal', buttons: [] }}>
              ${this.t('createFirst')}
            </button>
          </div>
        `}
      </div>
    `;
  }

  _renderHelpTab() {
    return html`
      <div class="card">
        <div class="card-title">❓ ${this.t('helpTitle')}</div>

        <div class="help-section">
          <h3>🚀 ${this.t('quickStart')}</h3>
          <p>${this.t('quickStartText').split('\n').map(line => html`${line}<br>`)}</p>
        </div>

        <div class="help-section">
          <h3>📋 ${this.t('templatesHelp')}</h3>
          <p>${this.t('templatesHelpText')}</p>
        </div>

        <div class="help-section">
          <h3>👥 ${this.t('groupsHelp')}</h3>
          <p>${this.t('groupsHelpText')}</p>
        </div>

        <div class="help-section">
          <h3>🔄 ${this.t('buttonReaction')}</h3>
          <pre>trigger:
  - platform: event
    event_type: mobile_app_notification_action
    event_data:
      action: "YOUR_ACTION_ID"</pre>
        </div>

        <div class="help-section">
          <h3>📲 ${this.t('availableServices')}</h3>
          <ul>
            <li><code>send_notification</code> - Simple</li>
            <li><code>send_actionable</code> - With Buttons</li>
            <li><code>send_with_image</code> - With Camera</li>
            <li><code>send_tts</code> - Text-to-Speech</li>
            <li><code>send_progress</code> - Progress Bar</li>
            <li><code>device_command</code> - Device Commands</li>
            <li><code>send_advanced</code> - All Options</li>
          </ul>
        </div>
      </div>
    `;
  }

  _renderTemplateModal() {
    const t = this._editingTemplate;
    return html`
      <div class="modal-overlay" @click=${(e) => { if(e.target === e.currentTarget) this._editingTemplate = null; }}>
        <div class="modal">
          <div class="modal-title">${t.id ? `✏️ ${this.t('editTemplate')}` : `📋 ${this.t('newTemplateTitle')}`}</div>

          <div class="form-group">
            <label>${this.t('templateName')}</label>
            <input type="text" .value=${t.name} @input=${(e) => t.name = e.target.value} placeholder="🚪 Doorbell">
          </div>

          <div class="row">
            <div class="form-group">
              <label>${this.t('title_field')}</label>
              <input type="text" .value=${t.title} @input=${(e) => t.title = e.target.value}>
            </div>
            <div class="form-group">
              <label>${this.t('type')}</label>
              <select .value=${t.type} @change=${(e) => { t.type = e.target.value; this.requestUpdate(); }}>
                <option value="simple">${this.t('simple')}</option>
                <option value="buttons">${this.t('withButtons')}</option>
                <option value="image">${this.t('withCamera')}</option>
                <option value="tts">${this.t('tts')}</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>${this.t('message')}</label>
            <textarea .value=${t.message} @input=${(e) => t.message = e.target.value}></textarea>
          </div>

          <div class="form-group">
            <label>${this.t('priority')}</label>
            <select .value=${t.priority} @change=${(e) => t.priority = e.target.value}>
              <option value="low">${this.t('quiet')}</option>
              <option value="normal">${this.t('normal')}</option>
              <option value="high">${this.t('important')}</option>
              <option value="critical">${this.t('critical')}</option>
            </select>
          </div>

          ${t.type === 'buttons' ? html`
            <div class="form-group">
              <label>${this.t('buttons')}</label>
              <div class="button-list">
                ${(t.buttons || []).map((btn, i) => html`
                  <div class="button-item">
                    <input type="text" placeholder="Action ID" .value=${btn.action} @input=${(e) => { t.buttons[i].action = e.target.value; this.requestUpdate(); }}>
                    <input type="text" placeholder="Text" .value=${btn.title} @input=${(e) => { t.buttons[i].title = e.target.value; this.requestUpdate(); }}>
                    <button class="btn btn-danger btn-icon" @click=${() => { t.buttons.splice(i, 1); this.requestUpdate(); }}>✕</button>
                  </div>
                `)}
                <button class="btn btn-success btn-small" @click=${() => { t.buttons = [...(t.buttons || []), {action: '', title: ''}]; this.requestUpdate(); }}>+ Button</button>
              </div>
            </div>
          ` : ''}

          <div class="modal-actions">
            <button class="btn btn-outline" @click=${() => this._editingTemplate = null}>${this.t('cancel')}</button>
            <button class="btn btn-primary" @click=${() => this._saveTemplate(t)}>💾 ${this.t('save')}</button>
          </div>
        </div>
      </div>
    `;
  }

  _renderGroupModal() {
    const g = this._editingGroup;
    const devices = this._getDevices();

    return html`
      <div class="modal-overlay" @click=${(e) => { if(e.target === e.currentTarget) this._editingGroup = null; }}>
        <div class="modal">
          <div class="modal-title">${g.id ? `✏️ ${this.t('editGroup')}` : `👥 ${this.t('newGroupTitle')}`}</div>

          <div class="form-group">
            <label>${this.t('groupName')}</label>
            <input type="text" .value=${g.name} @input=${(e) => g.name = e.target.value} placeholder="Family">
          </div>

          <div class="form-group">
            <label>${this.t('selectDevices')}</label>
            <div class="device-selector">
              ${devices.map(d => html`
                <div class="device-chip ${(g.devices || []).includes(d) ? 'selected' : ''}"
                     @click=${() => {
                       g.devices = g.devices || [];
                       if(g.devices.includes(d)) g.devices = g.devices.filter(x => x !== d);
                       else g.devices = [...g.devices, d];
                       this.requestUpdate();
                     }}>
                  ${d.toLowerCase().includes('iphone') || d.toLowerCase().includes('ipad') ? '📱' : '🤖'} ${d}
                </div>
              `)}
            </div>
          </div>

          <div class="modal-actions">
            <button class="btn btn-outline" @click=${() => this._editingGroup = null}>${this.t('cancel')}</button>
            <button class="btn btn-primary" @click=${() => this._saveGroup(g)}>💾 ${this.t('save')}</button>
          </div>
        </div>
      </div>
    `;
  }

  // Helper methods
  _getDevices() {
    return Object.keys(this.hass?.services?.notify || {})
      .filter(s => s.startsWith('mobile_app_'))
      .map(s => s.replace('mobile_app_', ''));
  }

  _getSwitches() {
    return Object.keys(this.hass?.states || {})
      .filter(e => e.startsWith('switch.notify_manager'));
  }

  _getSensors() {
    return Object.keys(this.hass?.states || {})
      .filter(e => e.startsWith('sensor.notify_manager'));
  }

  _getServiceCount() {
    return Object.keys(this.hass?.services?.notify_manager || {}).length;
  }

  _toggleDevice(device) {
    this._selectedGroup = '';
    if (this._selectedDevices.includes(device)) {
      this._selectedDevices = this._selectedDevices.filter(d => d !== device);
    } else {
      this._selectedDevices = [...this._selectedDevices, device];
    }
  }

  _applyTemplate(t) {
    this._title = t.title || '';
    this._message = t.message || '';
    this._type = t.type || 'simple';
    this._priority = t.priority || 'normal';
    this._buttons = [...(t.buttons || [])];
  }

  _applyTemplateAndSwitch(t) {
    this._applyTemplate(t);
    this._tab = 'send';
  }

  _applyButtonTemplate(templateName) {
    const buttonTemplates = {
      confirm_dismiss: [
        { action: 'CONFIRM', title: '✅ Confirm' },
        { action: 'DISMISS', title: '❌ Dismiss' }
      ],
      yes_no: [
        { action: 'YES', title: '👍 Yes' },
        { action: 'NO', title: '👎 No' }
      ],
      alarm_response: [
        { action: 'ALARM_CONFIRM', title: '✅ All OK' },
        { action: 'ALARM_SNOOZE', title: '⏰ Later' },
        { action: 'ALARM_EMERGENCY', title: '🆘 Emergency!' }
      ],
      door_response: [
        { action: 'DOOR_UNLOCK', title: '🔓 Open' },
        { action: 'DOOR_IGNORE', title: '🚪 Ignore' },
        { action: 'DOOR_SPEAK', title: '🔊 Speak' }
      ],
      reply: [
        { action: 'REPLY', title: '💬 Reply', behavior: 'textInput', textInputButtonTitle: 'Send', textInputPlaceholder: 'Message...' }
      ]
    };

    this._buttons = [...(buttonTemplates[templateName] || [])];
  }

  _addButton() { this._buttons = [...this._buttons, { action: "", title: "" }]; }
  _removeButton(i) { this._buttons = this._buttons.filter((_, idx) => idx !== i); }
  _updateButton(i, field, value) { this._buttons = this._buttons.map((btn, idx) => idx === i ? { ...btn, [field]: value } : btn); }

  _saveAsTemplate() {
    const name = prompt(this.t('templateName') + ":", this._title || "📝 New Template");
    if (!name) return;

    const newTemplate = {
      id: 'tpl_' + Date.now(),
      name,
      title: this._title,
      message: this._message,
      type: this._type,
      priority: this._priority,
      buttons: [...this._buttons]
    };

    this._templates = [...this._templates, newTemplate];
    this._saveToStorage("notify_manager_templates", this._templates);
    this._success = `✅ ${this.t('templateSaved')}`;
    setTimeout(() => this._success = "", 3000);
  }

  _saveTemplate(t) {
    if (!t.name) { alert(this.t('enterName')); return; }

    if (t.id) {
      this._templates = this._templates.map(x => x.id === t.id ? {...t} : x);
    } else {
      t.id = 'tpl_' + Date.now();
      this._templates = [...this._templates, {...t}];
    }

    this._saveToStorage("notify_manager_templates", this._templates);
    this._editingTemplate = null;
  }

  _deleteTemplate(id) {
    if (!confirm(this.t('deleteConfirm'))) return;
    this._templates = this._templates.filter(t => t.id !== id);
    this._saveToStorage("notify_manager_templates", this._templates);
  }

  _saveGroup(g) {
    if (!g.name) { alert(this.t('enterName')); return; }
    if (!g.devices?.length) { alert(this.t('selectAtLeastOne')); return; }

    if (g.id) {
      this._groups = this._groups.map(x => x.id === g.id ? {...g} : x);
    } else {
      g.id = 'grp_' + Date.now();
      this._groups = [...this._groups, {...g}];
    }

    this._saveToStorage("notify_manager_groups", this._groups);
    this._editingGroup = null;
  }

  _deleteGroup(id) {
    if (!confirm(this.t('deleteConfirm'))) return;
    this._groups = this._groups.filter(g => g.id !== id);
    this._saveToStorage("notify_manager_groups", this._groups);
  }

  async _send() {
    if (!this._message) return;
    this._loading = true;
    this._success = "";

    try {
      let service = "send_notification";
      let data = { title: this._title || "Home Assistant", message: this._message, priority: this._priority };

      // Add click action if set
      if (this._clickAction) {
        data.clickAction = this._clickAction;
      }

      // Target devices
      let targets = [];
      if (this._selectedGroup) {
        const group = this._groups.find(g => g.id === this._selectedGroup);
        if (group) targets = group.devices;
      } else if (this._selectedDevices.length) {
        targets = this._selectedDevices;
      }
      if (targets.length) data.target = targets;

      if (this._type === "buttons" && this._buttons.length) {
        service = "send_actionable";
        data.actions = this._buttons.filter(b => b.action && b.title);
      } else if (this._type === "image" && this._camera) {
        service = "send_with_image";
        data.camera_entity = this._camera;
      } else if (this._type === "tts") {
        service = "send_tts";
        data = { tts_text: this._message, media_stream: this._priority === "critical" ? "alarm_stream_max" : "music_stream" };
        if (targets.length) data.target = targets;
      }

      await this.hass.callService("notify_manager", service, data);
      this._success = `✅ ${this.t('sent')}`;
      setTimeout(() => this._success = "", 3000);
    } catch (err) {
      console.error("Send error:", err);
      this._success = `❌ ${this.t('error')}: ` + err.message;
    } finally {
      this._loading = false;
    }
  }
}

customElements.define("notify-manager-panel", NotifyManagerPanel);
