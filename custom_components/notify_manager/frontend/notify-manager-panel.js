/**
 * Notify Manager Panel - Kompakt & Benutzerfreundlich
 * Home Assistant Companion App Notification Management
 */

import {
  LitElement,
  html,
  css,
} from "https://unpkg.com/lit-element@2.5.1/lit-element.js?module";

class NotifyManagerPanel extends LitElement {
  static get properties() {
    return {
      hass: { type: Object },
      narrow: { type: Boolean },
      _tab: { type: String },
      _loading: { type: Boolean },
      _success: { type: String },
      // Quick Send Form
      _title: { type: String },
      _message: { type: String },
      _type: { type: String },
      _priority: { type: String },
      _camera: { type: String },
      _buttons: { type: Array },
    };
  }

  constructor() {
    super();
    this._tab = "send";
    this._loading = false;
    this._success = "";
    this._title = "";
    this._message = "";
    this._type = "simple";
    this._priority = "normal";
    this._camera = "";
    this._buttons = [];
  }

  static get styles() {
    return css`
      :host {
        display: block;
        padding: 16px;
        max-width: 800px;
        margin: 0 auto;
        --accent: var(--primary-color, #03a9f4);
        --card-bg: var(--ha-card-background, var(--card-background-color, #fff));
        --text: var(--primary-text-color, #212121);
        --text2: var(--secondary-text-color, #727272);
        --border: var(--divider-color, #e0e0e0);
        --success: #4caf50;
        --error: #f44336;
      }

      h1 {
        font-size: 22px;
        font-weight: 500;
        margin: 0 0 16px 0;
        display: flex;
        align-items: center;
        gap: 10px;
        color: var(--text);
      }

      .tabs {
        display: flex;
        gap: 4px;
        margin-bottom: 16px;
        border-bottom: 1px solid var(--border);
        padding-bottom: 8px;
      }

      .tab {
        padding: 8px 16px;
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
        font-weight: 500;
        margin-bottom: 16px;
        display: flex;
        align-items: center;
        gap: 8px;
      }

      .form-group {
        margin-bottom: 16px;
      }

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
        box-shadow: 0 0 0 2px rgba(3, 169, 244, 0.2);
      }

      textarea { resize: vertical; min-height: 80px; }

      .row {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 12px;
      }

      @media (max-width: 500px) {
        .row { grid-template-columns: 1fr; }
      }

      .type-selector {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
      }

      .type-btn {
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

      .type-btn:hover { border-color: var(--accent); }
      .type-btn.active { 
        border-color: var(--accent); 
        background: rgba(3, 169, 244, 0.1);
        color: var(--accent);
      }

      .button-list {
        display: flex;
        flex-direction: column;
        gap: 8px;
      }

      .button-item {
        display: flex;
        gap: 8px;
        align-items: center;
      }

      .button-item input {
        flex: 1;
      }

      .btn-icon {
        width: 36px;
        height: 36px;
        border: none;
        border-radius: 8px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 18px;
        transition: all 0.2s;
      }

      .btn-add { background: var(--success); color: white; }
      .btn-remove { background: var(--error); color: white; }
      .btn-add:hover { opacity: 0.8; }
      .btn-remove:hover { opacity: 0.8; }

      .send-btn {
        width: 100%;
        padding: 14px;
        background: var(--accent);
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
      }

      .send-btn:hover { opacity: 0.9; transform: translateY(-1px); }
      .send-btn:disabled { opacity: 0.5; cursor: not-allowed; transform: none; }

      .success-msg {
        background: rgba(76, 175, 80, 0.1);
        color: var(--success);
        padding: 12px;
        border-radius: 8px;
        margin-top: 12px;
        text-align: center;
        font-weight: 500;
      }

      .quick-templates {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        margin-bottom: 16px;
      }

      .template-btn {
        padding: 8px 12px;
        background: rgba(3, 169, 244, 0.1);
        border: 1px solid var(--accent);
        border-radius: 20px;
        color: var(--accent);
        font-size: 12px;
        font-weight: 500;
        cursor: pointer;
        transition: all 0.2s;
      }

      .template-btn:hover {
        background: var(--accent);
        color: white;
      }

      .devices-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }

      .device-chip {
        padding: 6px 12px;
        background: var(--accent);
        color: white;
        border-radius: 16px;
        font-size: 13px;
        display: flex;
        align-items: center;
        gap: 6px;
      }

      .preview {
        background: #1a1a1a;
        border-radius: 12px;
        padding: 16px;
        color: white;
        margin-top: 16px;
      }

      .preview-title {
        font-size: 12px;
        color: #888;
        margin-bottom: 8px;
      }

      .preview-notification {
        background: #2d2d2d;
        border-radius: 10px;
        padding: 12px;
      }

      .preview-header {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 6px;
      }

      .preview-icon {
        width: 20px;
        height: 20px;
        background: var(--accent);
        border-radius: 4px;
      }

      .preview-app { font-size: 11px; color: #888; }
      .preview-t { font-weight: 600; font-size: 14px; }
      .preview-m { font-size: 13px; color: #ccc; margin-top: 4px; }

      .preview-buttons {
        display: flex;
        gap: 8px;
        margin-top: 10px;
        padding-top: 10px;
        border-top: 1px solid #444;
      }

      .preview-btn {
        flex: 1;
        padding: 8px;
        background: #444;
        border-radius: 6px;
        text-align: center;
        font-size: 12px;
        color: white;
      }

      .help-text {
        font-size: 12px;
        color: var(--text2);
        margin-top: 4px;
      }

      .stat-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
        gap: 12px;
      }

      .stat-card {
        background: rgba(3, 169, 244, 0.05);
        border: 1px solid var(--border);
        border-radius: 10px;
        padding: 16px;
        text-align: center;
      }

      .stat-value {
        font-size: 28px;
        font-weight: 600;
        color: var(--accent);
      }

      .stat-label {
        font-size: 12px;
        color: var(--text2);
        margin-top: 4px;
      }
    `;
  }

  render() {
    return html`
      <h1>
        <ha-icon icon="mdi:bell-ring"></ha-icon>
        Notify Manager
      </h1>

      <div class="tabs">
        <button class="tab ${this._tab === 'send' ? 'active' : ''}" @click=${() => this._tab = 'send'}>
          📤 Senden
        </button>
        <button class="tab ${this._tab === 'devices' ? 'active' : ''}" @click=${() => this._tab = 'devices'}>
          📱 Geräte
        </button>
        <button class="tab ${this._tab === 'help' ? 'active' : ''}" @click=${() => this._tab = 'help'}>
          ❓ Hilfe
        </button>
      </div>

      ${this._tab === 'send' ? this._renderSendTab() : ''}
      ${this._tab === 'devices' ? this._renderDevicesTab() : ''}
      ${this._tab === 'help' ? this._renderHelpTab() : ''}
    `;
  }

  _renderSendTab() {
    const cameras = Object.keys(this.hass?.states || {})
      .filter(e => e.startsWith('camera.'));

    return html`
      <div class="card">
        <div class="card-title">📨 Schnell-Benachrichtigung</div>
        
        <!-- Vorlagen -->
        <div class="quick-templates">
          <button class="template-btn" @click=${() => this._applyTemplate('doorbell')}>
            🚪 Türklingel
          </button>
          <button class="template-btn" @click=${() => this._applyTemplate('alarm')}>
            🚨 Alarm
          </button>
          <button class="template-btn" @click=${() => this._applyTemplate('motion')}>
            🏃 Bewegung
          </button>
          <button class="template-btn" @click=${() => this._applyTemplate('reminder')}>
            ⏰ Erinnerung
          </button>
        </div>

        <!-- Typ Auswahl -->
        <div class="form-group">
          <label>Benachrichtigungstyp</label>
          <div class="type-selector">
            <button class="type-btn ${this._type === 'simple' ? 'active' : ''}" 
                    @click=${() => this._type = 'simple'}>
              📱 Einfach
            </button>
            <button class="type-btn ${this._type === 'buttons' ? 'active' : ''}" 
                    @click=${() => this._type = 'buttons'}>
              🔘 Mit Buttons
            </button>
            <button class="type-btn ${this._type === 'image' ? 'active' : ''}" 
                    @click=${() => this._type = 'image'}>
              📷 Mit Kamera
            </button>
            <button class="type-btn ${this._type === 'tts' ? 'active' : ''}" 
                    @click=${() => this._type = 'tts'}>
              🔊 TTS
            </button>
          </div>
        </div>

        <!-- Titel & Nachricht -->
        <div class="row">
          <div class="form-group">
            <label>Titel</label>
            <input type="text" .value=${this._title} 
                   @input=${(e) => this._title = e.target.value}
                   placeholder="z.B. Home Assistant">
          </div>
          <div class="form-group">
            <label>Priorität</label>
            <select .value=${this._priority} @change=${(e) => this._priority = e.target.value}>
              <option value="low">🔇 Leise</option>
              <option value="normal">📱 Normal</option>
              <option value="high">🔔 Wichtig</option>
              <option value="critical">🚨 Kritisch</option>
            </select>
          </div>
        </div>

        <div class="form-group">
          <label>${this._type === 'tts' ? 'Text zum Vorlesen' : 'Nachricht'}</label>
          <textarea .value=${this._message} 
                    @input=${(e) => this._message = e.target.value}
                    placeholder="${this._type === 'tts' ? 'Was soll vorgelesen werden?' : 'Deine Nachricht...'}"></textarea>
        </div>

        <!-- Kamera Auswahl -->
        ${this._type === 'image' ? html`
          <div class="form-group">
            <label>Kamera auswählen</label>
            <select .value=${this._camera} @change=${(e) => this._camera = e.target.value}>
              <option value="">-- Kamera wählen --</option>
              ${cameras.map(c => html`
                <option value="${c}">${this.hass.states[c]?.attributes?.friendly_name || c}</option>
              `)}
            </select>
          </div>
        ` : ''}

        <!-- Buttons -->
        ${this._type === 'buttons' ? html`
          <div class="form-group">
            <label>Buttons</label>
            <div class="button-list">
              ${this._buttons.map((btn, i) => html`
                <div class="button-item">
                  <input type="text" placeholder="Action ID (z.B. CONFIRM)" 
                         .value=${btn.action}
                         @input=${(e) => this._updateButton(i, 'action', e.target.value)}>
                  <input type="text" placeholder="Button Text (z.B. ✓ OK)" 
                         .value=${btn.title}
                         @input=${(e) => this._updateButton(i, 'title', e.target.value)}>
                  <button class="btn-icon btn-remove" @click=${() => this._removeButton(i)}>✕</button>
                </div>
              `)}
              <button class="btn-icon btn-add" @click=${this._addButton} style="width: 100%;">
                + Button hinzufügen
              </button>
            </div>
            <div class="help-text">
              Die Action ID wird in Automationen verwendet um auf Klicks zu reagieren.
            </div>
          </div>
        ` : ''}

        <!-- Vorschau -->
        <div class="preview">
          <div class="preview-title">📱 Vorschau</div>
          <div class="preview-notification">
            <div class="preview-header">
              <div class="preview-icon"></div>
              <span class="preview-app">HOME ASSISTANT</span>
            </div>
            <div class="preview-t">${this._title || 'Titel'}</div>
            <div class="preview-m">${this._message || 'Nachricht...'}</div>
            ${this._type === 'buttons' && this._buttons.length > 0 ? html`
              <div class="preview-buttons">
                ${this._buttons.map(b => html`
                  <div class="preview-btn">${b.title || 'Button'}</div>
                `)}
              </div>
            ` : ''}
          </div>
        </div>

        <!-- Senden Button -->
        <button class="send-btn" @click=${this._send} ?disabled=${this._loading || !this._message}>
          ${this._loading ? '⏳ Sende...' : '📤 Benachrichtigung senden'}
        </button>

        ${this._success ? html`<div class="success-msg">${this._success}</div>` : ''}
      </div>
    `;
  }

  _renderDevicesTab() {
    const mobileDevices = Object.keys(this.hass?.services?.notify || {})
      .filter(s => s.startsWith('mobile_app_'))
      .map(s => s.replace('mobile_app_', ''));

    return html`
      <div class="card">
        <div class="card-title">📱 Verbundene Geräte</div>
        
        ${mobileDevices.length > 0 ? html`
          <div class="devices-list">
            ${mobileDevices.map(d => html`
              <div class="device-chip">
                <ha-icon icon="mdi:cellphone"></ha-icon>
                ${d}
              </div>
            `)}
          </div>
        ` : html`
          <p>Keine Companion App Geräte gefunden.</p>
        `}
      </div>

      <div class="card">
        <div class="card-title">📊 Statistiken</div>
        <div class="stat-grid">
          <div class="stat-card">
            <div class="stat-value">${mobileDevices.length}</div>
            <div class="stat-label">Geräte</div>
          </div>
          <div class="stat-card">
            <div class="stat-value">12</div>
            <div class="stat-label">Services</div>
          </div>
        </div>
      </div>
    `;
  }

  _renderHelpTab() {
    return html`
      <div class="card">
        <div class="card-title">❓ Schnellstart</div>
        
        <h3>Services in Automationen nutzen</h3>
        <p>Gehe zu <strong>Einstellungen → Automatisierungen</strong> und füge eine Aktion hinzu:</p>
        
        <ul>
          <li><strong>📱 Benachrichtigung senden</strong> - Einfache Nachricht</li>
          <li><strong>🔘 Mit Buttons</strong> - Interaktive Benachrichtigung</li>
          <li><strong>📷 Mit Kamera</strong> - Inkl. Kamera-Snapshot</li>
          <li><strong>🚨 Alarm-Bestätigung</strong> - Vordefinierte Buttons</li>
          <li><strong>🔊 TTS</strong> - Text vorlesen (Android)</li>
        </ul>

        <h3>Auf Button-Klicks reagieren</h3>
        <pre style="background: #f5f5f5; padding: 12px; border-radius: 8px; overflow-x: auto; font-size: 12px;">
trigger:
  - platform: event
    event_type: mobile_app_notification_action
    event_data:
      action: "DEINE_ACTION_ID"
action:
  - service: light.turn_off
    target:
      entity_id: light.wohnzimmer</pre>

        <h3>Wichtige Tipps</h3>
        <ul>
          <li>Verwende <strong>Tags</strong> um Benachrichtigungen zu ersetzen</li>
          <li><strong>Kritische</strong> Priorität durchbricht "Nicht Stören"</li>
          <li>Action IDs sollten eindeutig und in GROSSBUCHSTABEN sein</li>
        </ul>
      </div>
    `;
  }

  _applyTemplate(template) {
    const templates = {
      doorbell: {
        title: "🚪 Türklingel",
        message: "Jemand ist an der Tür!",
        type: "image",
        priority: "high",
        buttons: [
          { action: "DOOR_OPEN", title: "🔓 Öffnen" },
          { action: "DOOR_IGNORE", title: "Ignorieren" }
        ]
      },
      alarm: {
        title: "🚨 Alarm!",
        message: "Bewegung erkannt während Abwesenheit",
        type: "buttons",
        priority: "critical",
        buttons: [
          { action: "ALARM_CONFIRM", title: "✓ Alles OK" },
          { action: "ALARM_CALL", title: "📞 Anrufen" }
        ]
      },
      motion: {
        title: "🏃 Bewegung erkannt",
        message: "Bewegung im Außenbereich",
        type: "image",
        priority: "high",
        buttons: []
      },
      reminder: {
        title: "⏰ Erinnerung",
        message: "Vergiss nicht...",
        type: "simple",
        priority: "normal",
        buttons: []
      }
    };

    const t = templates[template];
    if (t) {
      this._title = t.title;
      this._message = t.message;
      this._type = t.type;
      this._priority = t.priority;
      this._buttons = [...t.buttons];
    }
  }

  _addButton() {
    this._buttons = [...this._buttons, { action: "", title: "" }];
  }

  _removeButton(index) {
    this._buttons = this._buttons.filter((_, i) => i !== index);
  }

  _updateButton(index, field, value) {
    this._buttons = this._buttons.map((btn, i) => 
      i === index ? { ...btn, [field]: value } : btn
    );
  }

  async _send() {
    if (!this._message) return;

    this._loading = true;
    this._success = "";

    try {
      let service = "send_notification";
      let data = {
        title: this._title || "Home Assistant",
        message: this._message,
        priority: this._priority,
      };

      if (this._type === "buttons" && this._buttons.length > 0) {
        service = "send_actionable";
        data.actions = this._buttons.filter(b => b.action && b.title);
      } else if (this._type === "image" && this._camera) {
        service = "send_with_image";
        data.camera_entity = this._camera;
      } else if (this._type === "tts") {
        service = "send_tts";
        data = {
          tts_text: this._message,
          media_stream: this._priority === "critical" ? "alarm_stream_max" : "music_stream"
        };
      }

      await this.hass.callService("notify_manager", service, data);
      this._success = "✅ Benachrichtigung gesendet!";
      
      setTimeout(() => {
        this._success = "";
      }, 3000);
    } catch (err) {
      console.error("Send error:", err);
      this._success = "❌ Fehler: " + err.message;
    } finally {
      this._loading = false;
    }
  }
}

customElements.define("notify-manager-panel", NotifyManagerPanel);
