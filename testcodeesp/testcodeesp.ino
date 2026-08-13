/*
  ===================================================================================
  ARGUS — Autonomous Reconnaissance & Ground Utility System
  ESP32 Firmware Code (testcodeesp.ino)
  Architecture: Home Wi-Fi (WIFI_STA) -> HTTPS POST -> Vercel Serverless Backend API -> Dashboard
  Live Vercel URL: https://argus-eight-roan.vercel.app/
  ===================================================================================
  Hardware Test Configuration:
  - ESP32 DevKit Board
  - DHT11 Sensor (DATA -> GPIO 4) - Temperature & Humidity
  - 3 x HC-SR04 Ultrasonic Sonar Sensors:
      * Shared TRIG Pin -> GPIO 5
      * Front ECHO Pin -> GPIO 18 (via 3.3V resistor voltage divider)
      * Left ECHO Pin  -> GPIO 19 (via 3.3V resistor voltage divider)
      * Right ECHO Pin -> GPIO 21 (via 3.3V resistor voltage divider)
  - Rear Sonar & Motor/Gas/GPS hardware disabled for initial hardware test.
  ===================================================================================
*/

#include <WiFi.h>
#include <HTTPClient.h>
#include <WiFiClientSecure.h>
#include <ArduinoJson.h>
#include <DHT.h>
#include "config.h" // Includes WIFI_SSID, WIFI_PASSWORD, VERCEL_TELEMETRY_URL

// ---------------------------------------------------------------------------------
// PIN DEFINITIONS & SENSOR INITIALIZATION
// ---------------------------------------------------------------------------------
#define DHT_PIN     4
#define DHT_TYPE    DHT11

#define TRIG_PIN    5
#define ECHO_FRONT  18
#define ECHO_LEFT   19
#define ECHO_RIGHT  21

DHT dht(DHT_PIN, DHT_TYPE);

// Non-blocking timing controls
unsigned long lastTelemetryTime = 0;
const unsigned long TELEMETRY_INTERVAL_MS = 1500; // Send telemetry every 1.5s

unsigned long lastWifiCheckTime = 0;
const unsigned long WIFI_CHECK_INTERVAL_MS = 10000; // Check Wi-Fi link every 10s

// ---------------------------------------------------------------------------------
// HC-SR04 ULTRASONIC SENSOR READ FUNCTION
// Returns distance in cm, or -1 if sensor timeout / no echo received
// ---------------------------------------------------------------------------------
int readUltrasonicCm(int echoPin) {
  digitalWrite(TRIG_PIN, LOW);
  delayMicroseconds(2);
  digitalWrite(TRIG_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIG_PIN, LOW);

  // 25ms timeout corresponds to ~430cm max range
  long duration = pulseIn(echoPin, HIGH, 25000);

  if (duration == 0) {
    return -1; // Sensor timeout / Disconnected / No Reading
  }

  int distanceCm = duration * 0.034 / 2;
  if (distanceCm < 2 || distanceCm > 400) {
    return -1; // Out of reliable HC-SR04 bounds
  }

  return distanceCm;
}

// ---------------------------------------------------------------------------------
// WI-FI STA CONNECTION MANAGEMENT
// ---------------------------------------------------------------------------------
void connectToWiFi() {
  if (WiFi.status() == WL_CONNECTED) return;

  Serial.println("\n------------------------------------------------");
  Serial.print("ARGUS ESP32: Connecting to Home Wi-Fi: ");
  Serial.println(WIFI_SSID);

  WiFi.mode(WIFI_STA);
  WiFi.begin(WIFI_SSID, WIFI_PASSWORD);

  int attempts = 0;
  while (WiFi.status() != WL_CONNECTED && attempts < 20) {
    delay(500);
    Serial.print(".");
    attempts++;
  }

  if (WiFi.status() == WL_CONNECTED) {
    Serial.println("\nWi-Fi connected successfully!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
    Serial.print("RSSI Signal: ");
    Serial.print(WiFi.RSSI());
    Serial.println(" dBm");
    Serial.println("ARGUS hardware telemetry started -> Vercel Endpoint");
  } else {
    Serial.println("\nWi-Fi Connection Failed! Will retry in background loop.");
  }
  Serial.println("------------------------------------------------\n");
}

// ---------------------------------------------------------------------------------
// HTTPS POST TELEMETRY TO VERCEL API
// ---------------------------------------------------------------------------------
void sendTelemetryToVercel(float tempC, float hum, int distFront, int distLeft, int distRight) {
  if (WiFi.status() != WL_CONNECTED) {
    Serial.println("[ESP32] Cannot send telemetry: Wi-Fi Disconnected.");
    return;
  }

  WiFiClientSecure client;
  client.setInsecure(); // Skip TLS certificate verification for Vercel HTTPS endpoint

  HTTPClient http;
  if (!http.begin(client, VERCEL_TELEMETRY_URL)) {
    Serial.println("[ESP32] HTTP begin failed.");
    return;
  }

  http.addHeader("Content-Type", "application/json");
  http.setTimeout(4000); // 4 sec HTTP timeout

  // Build JSON Payload
  DynamicJsonDocument doc(512);
  doc["roverId"] = "ARGUS-01";
  doc["timestamp"] = millis();

  // DHT11 Sensor Data
  if (!isnan(tempC)) {
    doc["temperature"] = tempC;
  } else {
    doc["temperature"] = nullptr;
    Serial.println("[Sensor Warning] DHT11 Temperature Read Error");
  }

  if (!isnan(hum)) {
    doc["humidity"] = hum;
  } else {
    doc["humidity"] = nullptr;
    Serial.println("[Sensor Warning] DHT11 Humidity Read Error");
  }

  // HC-SR04 Obstacles (Front, Left, Right)
  JsonObject obstacleObj = doc.createNestedObject("obstacle");
  if (distFront != -1) obstacleObj["frontCm"] = distFront;
  else obstacleObj["frontCm"] = nullptr;

  if (distLeft != -1) obstacleObj["leftCm"] = distLeft;
  else obstacleObj["leftCm"] = nullptr;

  if (distRight != -1) obstacleObj["rightCm"] = distRight;
  else obstacleObj["rightCm"] = nullptr;

  // Wi-Fi Connection RSSI
  JsonObject connObj = doc.createNestedObject("connection");
  connObj["status"] = "connected";
  connObj["rssi"] = WiFi.RSSI();
  connObj["ip"] = WiFi.localIP().toString();

  String jsonPayload;
  serializeJson(doc, jsonPayload);

  Serial.print("[HTTP POST] Sending JSON Telemetry to Vercel: ");
  Serial.println(jsonPayload);

  int httpResponseCode = http.POST(jsonPayload);

  if (httpResponseCode > 0) {
    String response = http.getString();
    Serial.print("[HTTP Success] Response Code: ");
    Serial.print(httpResponseCode);
    Serial.print(" | Payload: ");
    Serial.println(response);
  } else {
    Serial.print("[HTTP Error] POST Failed, error: ");
    Serial.println(http.errorToString(httpResponseCode).c_str());
  }

  http.end();
}

// ---------------------------------------------------------------------------------
// SETUP
// ---------------------------------------------------------------------------------
void setup() {
  Serial.begin(115200);
  delay(1000);

  Serial.println("=================================================");
  Serial.println("   ARGUS Rover ESP32 Hardware Firmware Boot     ");
  Serial.println("=================================================");

  // Initialize DHT11
  dht.begin();

  // Initialize HC-SR04 Ultrasonic Pins
  pinMode(TRIG_PIN, OUTPUT);
  pinMode(ECHO_FRONT, INPUT);
  pinMode(ECHO_LEFT, INPUT);
  pinMode(ECHO_RIGHT, INPUT);
  digitalWrite(TRIG_PIN, LOW);

  // Connect to Wi-Fi
  connectToWiFi();
}

// ---------------------------------------------------------------------------------
// MAIN LOOP
// ---------------------------------------------------------------------------------
void loop() {
  unsigned long currentMillis = millis();

  // Background Wi-Fi Health Check
  if (currentMillis - lastWifiCheckTime >= WIFI_CHECK_INTERVAL_MS) {
    lastWifiCheckTime = currentMillis;
    if (WiFi.status() != WL_CONNECTED) {
      Serial.println("[Wi-Fi Watchdog] Wi-Fi lost! Attempting background reconnect...");
      connectToWiFi();
    }
  }

  // Non-blocking Telemetry Cycle
  if (currentMillis - lastTelemetryTime >= TELEMETRY_INTERVAL_MS) {
    lastTelemetryTime = currentMillis;

    // 1. Read Sensors
    float hum = dht.readHumidity();
    float tempC = dht.readTemperature();

    int frontCm = readUltrasonicCm(ECHO_FRONT);
    int leftCm  = readUltrasonicCm(ECHO_LEFT);
    int rightCm = readUltrasonicCm(ECHO_RIGHT);

    // Debug print to Serial Monitor
    Serial.println("------------------------------------------------");
    Serial.print("DHT11 -> Temp: ");
    if (isnan(tempC)) Serial.print("SENSOR ERROR"); else { Serial.print(tempC); Serial.print(" °C"); }
    Serial.print(" | Humidity: ");
    if (isnan(hum)) Serial.print("SENSOR ERROR"); else { Serial.print(hum); Serial.print(" %"); }
    Serial.println();

    Serial.print("Ultrasonic -> Front: ");
    if (frontCm == -1) Serial.print("NO READING"); else { Serial.print(frontCm); Serial.print(" cm"); }
    Serial.print(" | Left: ");
    if (leftCm == -1) Serial.print("NO READING"); else { Serial.print(leftCm); Serial.print(" cm"); }
    Serial.print(" | Right: ");
    if (rightCm == -1) Serial.print("NO READING"); else { Serial.print(rightCm); Serial.print(" cm"); }
    Serial.println();

    // 2. Post Telemetry to Vercel Endpoint
    sendTelemetryToVercel(tempC, hum, frontCm, leftCm, rightCm);
  }
}
