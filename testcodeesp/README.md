# ARGUS ESP32 Hardware Firmware (`testcodeesp.ino`)

Complete ESP32 C++ firmware code for **ARGUS — Autonomous Reconnaissance & Ground Utility System**.
Designed to pair directly with your live Vercel dashboard: [https://argus-eight-roan.vercel.app/](https://argus-eight-roan.vercel.app/)

---

## 🏗️ Target Architecture

```text
DHT11 (Pin 4) ────────┐
                      │
HC-SR04 Front (P18) ──┤
HC-SR04 Left (P19)  ──┼──► ESP32 ──► Home Wi-Fi (STA) ──► Vercel API ──► ARGUS Dashboard
HC-SR04 Right (P21) ──┘                                 (Serverless)   (React/Vite)
```

---

## 🛠️ Required Arduino IDE Libraries

Install these libraries via Arduino IDE Library Manager (`Ctrl + Shift + I`):

1. `ArduinoJson` (v6.x or v7.x by Benoit Blanchon)
2. `DHT sensor library` (by Adafruit)
3. `Adafruit Unified Sensor`

---

## 🔌 Pin Connections & Wiring Diagram

### 1. DHT11 Sensor
* `VCC`  &rarr; ESP32 `3.3V` (or 5V)
* `DATA` &rarr; ESP32 `GPIO 4`
* `GND`  &rarr; ESP32 `GND`

### 2. Ultrasonic Sonar Array (3 x HC-SR04)
* **Shared Trigger (`TRIG`)**: ESP32 `GPIO 5`
* **VCC**: `5V`
* **GND**: `GND`

#### ⚠️ HC-SR04 Echo Voltage Divider Safety (5V to 3.3V):
HC-SR04 `ECHO` outputs 5V. Use a simple 2-resistor voltage divider (**1kΩ** and **2kΩ** resistors) on each Echo line before connecting to ESP32:

```text
HC-SR04 ECHO (5V) ─── [ 1kΩ ] ───┬─── ESP32 ECHO GPIO
                                 │
                             [ 2kΩ ]
                                 │
                                GND
```

* **Front ECHO** &rarr; Voltage Divider &rarr; ESP32 `GPIO 18`
* **Left ECHO**  &rarr; Voltage Divider &rarr; ESP32 `GPIO 19`
* **Right ECHO** &rarr; Voltage Divider &rarr; ESP32 `GPIO 21`

---

## 🔑 Entering Wi-Fi Credentials

Open `testcodeesp/config.h` in Arduino IDE and enter your home Wi-Fi details:

```cpp
const char* WIFI_SSID     = "YOUR_HOME_WIFI_SSID";
const char* WIFI_PASSWORD = "YOUR_HOME_WIFI_PASSWORD";
```

*(Note: `config.h` is listed in `.gitignore` so your Wi-Fi password will never be committed to GitHub).*

---

## 🧪 Step-by-Step Test Procedure

### A. ESP32 Flashing
1. Open `testcodeesp/testcodeesp.ino` in Arduino IDE.
2. Select **Tools &rarr; Board &rarr; ESP32 Dev Module**.
3. Select your ESP32 COM Port.
4. Click **Upload**.
5. Open **Serial Monitor** at `115200` baud.
6. Verify output prints:
   ```text
   ARGUS ESP32: Connecting to Home Wi-Fi: YourHomeWiFi
   Wi-Fi connected successfully!
   IP Address: 192.168.1.XX
   [HTTP POST] Sending JSON Telemetry to Vercel...
   [HTTP Success] Response Code: 200
   ```

### B. Vercel Dashboard Verification
1. Open your live dashboard: [https://argus-eight-roan.vercel.app/](https://argus-eight-roan.vercel.app/)
2. Turn **DEMO MODE** **OFF** to switch to **LIVE HARDWARE MODE**.
3. Confirm status changes to **ONLINE** (`connected`).
4. Touch or breathe on the DHT11 sensor &rarr; verify temperature & humidity update live on screen.
5. Wave your hand in front of the Front, Left, or Right HC-SR04 sensors &rarr; verify distance changes live on screen.
6. Move an object closer than 30cm &rarr; verify an **OBSTACLE DETECTED** alert banner appears on the dashboard!
