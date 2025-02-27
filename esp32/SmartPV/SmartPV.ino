#include <SPI.h>
#include <WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>
#include <LittleFS.h>
#include <map>
#include "arduino_secrets.h"
#include "Mppt.h"
#include <Adafruit_NeoPixel.h> 

// Socket Server
AsyncWebServer server(81);
// Web Server HTTP
AsyncWebServer server2(80);
// Socket initialisation -> ws:IP-Address:81/ws
AsyncWebSocket ws("/ws");

Mppt mpptController;

#define LED_PIN 48
#define NUM_LEDS 1
Adafruit_NeoPixel strip = Adafruit_NeoPixel(NUM_LEDS, LED_PIN, NEO_GRB + NEO_KHZ800);

// WiFi-Status
const char *__ssid = SECRET_SSID;
const char *__pass = SECRET_PASS;
int status = WL_IDLE_STATUS;

unsigned long lastCheck = 0;
const unsigned long checkInterval = 5000;

bool WifiStatus = false;
bool LittleFSStatus = false;
bool ModbusStatus = false;

unsigned long previousMillis = 0;
const long blinkInterval = 500;
bool redLedState = false;

void setup()
{
  // Starting serial communication
  Serial.begin(9600);
  while (!Serial);

  WiFi.mode(WIFI_STA);
  WiFi.begin(__ssid, __pass);

  while (WiFi.status() != WL_CONNECTED)
  {
    delay(500);
    Serial.print(".");
  }

  Serial.println("\n✅ WiFi connected!");
  Serial.print("📡 IP-Address: ");
  Serial.println(WiFi.localIP());

  // LittleFS (Filesystem) mounten
  if (!LittleFS.begin(true))
  {
    Serial.println("❌ LittleFS error during mounting!");
    return;
  } else {
    LittleFSStatus = true;
    Serial.println("✅ LittleFS successfully mounted!");
  }
  
  // MODBUS Setup
  ModbusStatus = mpptController.setupModbusRTU();

  // Websocket
  ws.onEvent(onWebSocketEvent);
  server.addHandler(&ws);
  server.begin();
  delay(500);
  Serial.println("✅ WebSocket-Server läuft.");

  // Start WebServer
  serverHosting();
  server2.begin();

  // Initialize the NeoPixel for LED
  strip.begin();
  strip.show(); // Initialize all pixels to 'off'
  strip.setBrightness(30); 

}

// WebSocket-Event-Handler
void onWebSocketEvent(AsyncWebSocket *server, AsyncWebSocketClient *client, AwsEventType type, void *arg, uint8_t *data, size_t len)
{
  if (type == WS_EVT_CONNECT)
  {
    Serial.printf("📡 WebSocket Client %u connected!\n", client->id());
  }
  else if (type == WS_EVT_DISCONNECT)
  {
    Serial.printf("❌ Client [%u] disconnected!\n", client->id());
  }
  else if (type == WS_EVT_DATA)
  {

    String message = String((char *)data, len);
    message.replace("\"", "");
    message.trim();
    String response = "";

    if (message == "battery")
    {
      //Serial.println("✅ Send battery data...");
      response = mpptController.getBatteryData();
    }
    else if (message == "load")
    {
      //Serial.println("✅ Send load data...");
      response = mpptController.getLoadData();
    }
    else if (message == "pv")
    {
      //Serial.println("✅ Send pv data...");
      response = mpptController.getPVData();
    } else if (message == "deActivate_load") {
      // ToDo: activate and deactivate the load via socket
      //Serial.println("✅ DeActivate Load");
      //....
    } else {
      Serial.println("⚠️ Unknown message received.");
      response = "{\"error\": \"Invalid command\"}";
    }

    if (response.length() > 0)
    {
      client->text(response);
    }
  }
}

void serverHosting()
{
  server2.on("/", HTTP_GET, [](AsyncWebServerRequest *request) { 
    request->send(LittleFS, "/index.html", "text/html"); 
  });

  server2.onNotFound([](AsyncWebServerRequest *request)
                     {
    String path = request->url();
    if (path.startsWith("/")) {
      path = path.substring(1);
    }

    static std::map<String, String> mimeTypes = {
      {".html", "text/html"}, {".js", "application/javascript"},
      {".css", "text/css"},   {".png", "image/png"},
      {".jpg", "image/jpeg"}, {".jpeg", "image/jpeg"},
      {".svg", "image/svg+xml"}, {".woff", "font/woff"},
      {".woff2", "font/woff2"}
    };

    String mimeType = "text/plain";
    for (auto &kv : mimeTypes) {
      if (path.endsWith(kv.first)) {
        mimeType = kv.second;
        break;
      }
    }

    if (LittleFS.exists("/" + path)) {
      request->send(LittleFS, "/" + path, mimeType);
    } else {
      Serial.println("⚠️ File not found, redirect to index.html: " + path);
      request->send(LittleFS, "/index.html", "text/html");
    } });
}

void healthStatusLED(){

  if (WifiStatus && LittleFSStatus && ModbusStatus) {
    strip.setPixelColor(0, strip.Color(0, 255, 0));
    strip.show();
  } else {
    blinkRedLED();
  }
}

void blinkRedLED() {
  unsigned long currentMillis = millis();
  if (currentMillis - previousMillis >= blinkInterval) {
    previousMillis = currentMillis;
    redLedState = !redLedState;  // Zustand umschalten
    if(redLedState){
      strip.setPixelColor(0, strip.Color(255, 0, 0));
    } else {
      strip.setPixelColor(0, strip.Color(0, 0, 0));
    }
    strip.show();
  }
}

void loop()
{

  if (WiFi.status() != WL_CONNECTED)
  {
    Serial.println("❌ WiFi disconnected! Restart...");
    //ESP.restart();
    WifiStatus = false;
  }
  else
  {
    if (millis() - lastCheck > checkInterval) {
      Serial.println("✅ WiFi ist stabil.");
      lastCheck = millis();
      healthStatusLED();
    }
    WifiStatus = true;
  }

  ws.cleanupClients();
}