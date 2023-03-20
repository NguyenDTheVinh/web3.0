#include <ESP8266WiFi.h>
#include <FirebaseESP8266.h>
#include <ArduinoJson.h>
#include <Adafruit_ADS1X15.h>
#include <DHT.h>
#include <LoRa.h>
#include <SPI.h>

#define wifiLed 2
#define signalLed 5
#define ss 15
#define rst 16
#define dio0 4



int count = 0; // đếm số nếu không nhận được packet

int count_Json_error = 0; // đếm số error khi Json String lỗi

/*-------LoRa variables-----*/
String Receive_Data = ""; // Receiving String
StaticJsonDocument<200> doc;

int auto2, L_relay, pump2;
int relay2 = 0;

int pump1, percent_1, avg_ms;

int fromB = 0;
int fromC = 0;

unsigned long startMillis = 0;
unsigned long currentMillis = 0;

/*Receiving value--*/
float re_humi = 0;
float re_temp = 0; 
int re_mois = 0; 
float re_light = 0;
int re_auto = 0;
int re_relay = 0;
/*-----------------*/

int goDatabase = 0;

int ms = 0;
int l = 0;
int secs = 0; // đếm mốc thời gian gửi đến end-nodes

/*-----------------------------------Prepare for Connection------------------------------------------*/
/*-------------------------------------Firebase connection-------------------------------------------*/
#define FIREBASE_HOST "https://smartgreen-e57d2-default-rtdb.firebaseio.com/" // Firebase Admin SDK
#define FIREBASE_AUTH "sQlrUYAJt4OQGh77Um7S5QWDKIPyCESnRLEZREQz" // Database secret key
FirebaseData firebaseData;
FirebaseJson json;

String data ="";
// String path = "Pump";
String path_A = "A"; // Firebase database reference
String path_B = "B"; // Firebase database reference
/*---------------------------------------------------------------------------------------------------*/

/*---------------------------------------WiFi connection---------------------------------------------*/
WiFiClient client;
WiFiServer server(80);

//const char* ssid = "Hung Dien";
//const char* password = "hungdien1972";
 const char* ssid = "Galaxy M5165AB";
 const char* password = "mouf7022";
//const char* ssid = "International University";
//const char* password = "";
/*---------------------------------------------------------------------------------------------------*/

/*---------------------Setup here-------------------------*/

void setup() {
  Serial.begin(9600);

  // WiFi.mode(WIFI_MODE_STA);
  WiFi.begin(ssid, password);
  Serial.print("Connecting to Wi-Fi");
  while (WiFi.status() != WL_CONNECTED)
  {
    Serial.print(".");
    delay(300);
  }
  Serial.println();

  Serial.print("Connected with IP: ");
  Serial.println(WiFi.localIP());
  Serial.println();

  pinMode(wifiLed, OUTPUT);
  digitalWrite(wifiLed, HIGH);
  delay(500);
  digitalWrite(wifiLed, LOW);
  delay(500);
  digitalWrite(wifiLed, HIGH);
  delay(500);
  digitalWrite(wifiLed, LOW);
  
  pinMode(signalLed, OUTPUT);
  digitalWrite(signalLed, LOW);

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH); // Start connecting to Firebase database

  LoRa.setPins(ss, rst, dio0);    //setup LoRa transceiver module
  while (!LoRa.begin(433E6))     //433E6 - Asia, 866E6 - Europe, 915E6 - North America
  {
    Serial.println(".");
    delay(500);
  }
  LoRa.setSyncWord(0xA5);
  Serial.println("LoRa Initializing OK!");

  Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH); // Start connecting to Firebase database
  Firebase.reconnectWiFi(true);
  firebaseData.setBSSLBufferSize(2048, 2048);
}
/*--------------------------------------------------------*/

/*---------------------Loop here-------------------------*/
void loop() {
  int packetSize = LoRa.parsePacket();
  if (packetSize) 
  {
    // Nhận packet
    Serial.print("Received packet from the End-Nodes: '");
    count = 0;
    // read packet
    while (LoRa.available()) {
      Receive_Data = LoRa.readString();
      Serial.print(Receive_Data);
    }
    // print RSSI of packet
    Serial.print("' with RSSI ");
    Serial.println(LoRa.packetRssi());

    // JsonObject& doc = jsonBuffer.parseObject(Receive_Data);
    // Deserialize the JSON document
    DeserializationError error = deserializeJson(doc, Receive_Data);

    // Test if parsing succeeds.
    if (error) {
      count_Json_error++;
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      if (count_Json_error == 10) {
        ESP.restart();
      }
      return;
    } 

    String str_node = doc["node"];
    String str_humi = doc["humidity"];
    String str_temp = doc["temperature"];
    String str_mois = doc["moisture"];
    String str_light = doc["light"];
    String str_auto = doc["auto"];
    // String str_relay = doc["relay"];

    re_humi = str_humi.toFloat();
    re_temp = str_temp.toFloat();
    re_mois = str_mois.toInt();
    re_light = str_light.toFloat();
    re_auto = str_auto.toInt();
    //  re_relay = str_relay.toInt();

    // Firebase.setIntAsync(firebaseData, "B/Relay", re_relay);
    if (str_node == "B") // upload database B nếu nhận packet từ node B
    {
      digitalWrite(wifiLed, LOW);
      Firebase.setFloatAsync(firebaseData, "B/AirTempC", re_temp); 
      Firebase.setFloatAsync(firebaseData, "B/AirHumidity", re_humi);
      Firebase.setIntAsync(firebaseData, "B/Moisture", re_mois);
      Firebase.setFloatAsync(firebaseData, "B/Light", re_light);
      fromC = 0;
    }

    if (str_node == "A") // upload database A nếu nhận packet từ node A
    {
      digitalWrite(signalLed, LOW);
      Firebase.setFloatAsync(firebaseData, "A/AirTempC", re_temp); 
      Firebase.setFloatAsync(firebaseData, "A/AirHumidity", re_humi);
      Firebase.setIntAsync(firebaseData, "A/Moisture", re_mois);
      Firebase.setFloatAsync(firebaseData, "A/Light", re_light);
      fromB = 0;
    }
    // }
    Serial.println("__________________________________________________________________________________________________________________");
  } 
  else {
    if (count == 20) {
      ESP.restart();
    }
  }

  currentMillis = millis();

  if ((currentMillis - startMillis) > 400)
  {
    secs = secs + 1;
    if ( secs == 4 )
    {
      secs = 0;
    }
    
    // if ((secs >= 1) && (secs <= 2))
    if ((secs == 1)) // Send to B
    {
      if (Firebase.getInt(firebaseData, "B/Pump") == true)
      { 
        pump2 = firebaseData.intData();
      }
      String node = "G2B";
      Serial.print("The Master sending packet Node 2: ");
      String Send_Data = "{\"node\":\"" + String(node) + "\",\"pump2\":\"" + String(pump2) + "\"}";
      digitalWrite(signalLed, HIGH);
      LoRa.beginPacket();   //Send LoRa packet to receiver
      LoRa.print(Send_Data);
      LoRa.endPacket();
      Serial.println(Send_Data);
      fromB = 1;
      count++;
    }

    // if ((secs >= 3) && (secs <= 4))
    if ((secs == 3)) // Send to A
    {
      if (Firebase.getInt(firebaseData, "A/Pump") == true)
      { 
        pump1 = firebaseData.intData();
      }

      Serial.print("The Master sending packet to Node 1: ");
      String node = "G2A";
      String Send_Data = "{\"node\":\"" + String(node) + "\",\"pump1\":\"" + String(pump1) + "\"}";
      digitalWrite(wifiLed, HIGH);
      LoRa.beginPacket();   //Send LoRa packet to receiver
      LoRa.print(Send_Data);
      LoRa.endPacket();
      Serial.println(Send_Data);
      fromC = 1;
      count++;
    }
    startMillis = currentMillis;
  }
}
