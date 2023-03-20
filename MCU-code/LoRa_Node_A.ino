#include <LoRa.h>
#include <SPI.h>
#include <ArduinoJson.h>
#include <DHT.h>

#define ss 5
#define rst 14
#define dio0 2

#define DHTPIN 27 // output cảm biển vào chân D5 = I/O 14
#define DHTTYPE DHT11 // set type là DHT11

#define relay1 26 // GPIO 0 ~ D3 -- 31/5/2022
#define moisture 35 // GPIO 0 ~ D3 -- 31/5/2022
#define light 33 // GPIO 0 ~ D3 -- 31/5/2022

#define signalLed 13  

String Receive_Data = ""; // Sending String
String Send_Data = ""; // Receiving String

//DynamicJsonBuffer jsonBuffer;
 StaticJsonDocument<200> doc;

unsigned long startMillis;

DHT dht(DHTPIN,DHTTYPE);

float air_humi; // Humidity
float air_tempC; // Temperature
int ms = 0; // Moisture
int l = 0; // Light
int avg_ms, percent;
// int onOff = 0;

int mode1, pump;
int relay;

int disConnectCount = 0;

String node = "A";

void setup() 
{
  Serial.begin(9600);
  while (!Serial);
  Serial.println("LoRa Receiver");
 
  LoRa.setPins(ss, rst, dio0);    //setup LoRa transceiver module
 
  while (!LoRa.begin(433E6))     //433E6 - Asia, 866E6 - Europe, 915E6 - North America
  {
    Serial.println(".");
    delay(500);
  }
  LoRa.setSyncWord(0xA5);
  Serial.println("LoRa Initializing OK!");

  dht.begin(); // start DHT11
  pinMode(relay1, OUTPUT);
  digitalWrite(relay1, LOW);
  pinMode(signalLed, OUTPUT);
  digitalWrite(signalLed, LOW);
}
 
void loop() 
{
  //Receiving
  int packetSize = LoRa.parsePacket();    // try to parse packet 
  if (packetSize) 
  {
    Serial.print("Received packet from the Master: '");
    digitalWrite(signalLed, HIGH);
    while (LoRa.available()) // read packet
    {
      Receive_Data = LoRa.readString();
      Serial.print(Receive_Data);   
    }
    // print RSSI of packet
    Serial.print("' with RSSI ");
    Serial.println(LoRa.packetRssi());
    
    // JsonObject& root = jsonBuffer.parseObject(Receive_Data);
    DeserializationError error = deserializeJson(doc, Receive_Data);
  // Test if parsing succeeds.
    if (error) {
      Serial.print(F("deserializeJson() failed: "));
      Serial.println(error.f_str());
      return;
    }
//    String auto_str = doc["auto"];
//    String relay_str = doc["relay"];
    String pump_str = doc["pump1"];
    String node_str = doc["node"];
    
//    mode1 = auto_str.toInt();
//    relay = relay_str.toInt();
    pump = pump_str.toInt();
//    int lightRelay = L_relay_str.toFloat();  

    if (node_str == "G2A") // nếu nhận được G2A thì làm việc
    {
      if (pump == 0) 
      {
        digitalWrite(relay1, 0);    
      }

      if (pump == 1) 
      {
        digitalWrite(relay1, 1);    
      }

      if (pump == 2 || pump == 3) 
      {
        if (percent < 27) 
        {
          digitalWrite(relay1, 1);
        }
        if (percent > 50) 
        {
          digitalWrite(relay1, 0);
        }  
      } 
      

      air_humi = dht.readHumidity();
      air_tempC = dht.readTemperature();
      ms = analogRead(moisture);
      for (int i = 0; i <=9; i++) {
        ms += analogRead(moisture);
      }
      avg_ms = ms/10;
      Serial.print("moisture: "); Serial.println(avg_ms);
      ms = 0;
      Serial.print("END.");
      percent = map(avg_ms, 500, 4500, 100, 0);
      Serial.print("moisture: "); Serial.println(percent);
  //       l = analogRead(light);
      float volts = analogRead(light) * 3.3 / 4095.0;
      float amps = volts / 10000.0; // 10,000 Ohms
      float microamps = amps * 1000000;
      float lux = microamps * 2.0;
  //      Serial.println(lux);digitalWrite(relay1
  //      Serial.print("relay: ");
  //      Serial.println(digitalRead(relay1));
  //      delay(200);
  //      Serial.print("The Slave sending packet: ");
      Serial.print("The Slave sending packet: ");
      Send_Data =
      "{\"node\":\"" + String(node) + "\",\"humidity\":\"" + String(air_humi) + "\",\"temperature\":\"" + String(air_tempC) + "\",\"moisture\":\"" + String(percent) + + "\",\"light\":\"" + String(lux) + "\"}";                                              
      digitalWrite(signalLed, LOW);
      LoRa.beginPacket();   //Send LoRa packet to receiver
      LoRa.print(Send_Data);
      LoRa.endPacket();
      Serial.println(Send_Data);
      Serial.println("_____________________________________________________________________________________________________________");
    }
  } 
}
