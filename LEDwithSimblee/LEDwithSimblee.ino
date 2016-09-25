#include "SimbleeForMobile.h"
#include "SimbleeForMobileClient.h"
#include "SimbleeCloud.h"

int led = 3;
int on_switch =5;
int off_switch =6;
int currentState= 0;
int previousState =0;
int analogReadPin = 4;
int valueFromAnalogRead= 0;

unsigned int userId = 0x53d71fc6;
unsigned int destESN= 0x12;

SimbleeForMobileClient client;
SimbleeCloud cloud(&client);

uint8_t mobileSwitch, mobileLight, mobileText;
void setup() {
  // put your setup code here, to run once:
pinMode(led, OUTPUT);
pinMode(on_switch, INPUT);
pinMode(off_switch, INPUT); 
Serial.begin(9600);
Serial.println("Hola soy la prueba");

Serial.println("ESN is 0x:");
cloud.userID = userId;
Serial.println(cloud.myESN, HEX);

 SimbleeForMobile.advertisementData = "Light";
  SimbleeForMobile.begin();

}

void loop() {
  // put your main code here, to run repeatedly:
  readSwitches();

  if(currentState != previousState){
    checkState();
    previousState =currentState;
  }

  if(SimbleeForMobile.updatable){
    SimbleeForMobile.updateColor(mobileLight, currentState ? GREEN:BLACK);
    SimbleeForMobile.updateValue(mobileSwitch, currentState);
    SimbleeForMobile.updateText(mobileText, currentState ? "That's Good":"A Little More");
    SimbleeForMobile.updateColor(mobileText, currentState ? BLACK:WHITE);
    SimbleeForMobile.updateX(mobileText, currentState ? 115:100);
  }

  SimbleeForMobile.process();
  cloud.process();

  valueFromAnalogRead = analogRead(analogReadPin);
//  Serial.println(valueFromAnalogRead);
}

void ui(){

   if (cloud.connect())
    printf("Cloud Connected\n");
  else
    printf("Cloud disconnected\n");
    
  SimbleeForMobile.beginScreen();
  mobileLight = SimbleeForMobile.drawRect(30, 80, 260, 260, BLACK);
  mobileSwitch = SimbleeForMobile.drawSwitch(135,380);
  mobileText = SimbleeForMobile.drawText(100,180,"OFF",WHITE, 20);
  SimbleeForMobile.setEvents(mobileSwitch, EVENT_PRESS);
  SimbleeForMobile.endScreen();
}

void ui_event(event_t &event){
  if(event.id == mobileSwitch){
    currentState = !currentState;
  }
  
}

void SimbleeCloud_OnReceive(unsigned int originESN, const unsigned char *payload, int len)
{
  printf("cloud switch\n");
  if(payload[0] =='1')
  {
    currentState=1;
  }else  if(payload[0] =='0')
  {
    currentState=0;
  }else
  {
    if(currentState==1){
      cloud.send(destESN, "1", 1);
    }else{
      cloud.send(destESN, "0", 1);
    }
  }
}

void readSwitches(){
//  if(digitalRead(on_switch)==HIGH){
//    currentState = 1;
//  }
//   if(digitalRead(off_switch)==HIGH){
//    currentState = 0;
//  }

   if(analogRead(analogReadPin)>=400){
    currentState = 1;
//    Serial.println("Listo con el peso");
  }
   if(analogRead(analogReadPin)< 400){
    currentState = 0;
//    Serial.println("falta");
  }
}

void checkState(){
  if( currentState==1){
    digitalWrite(led,HIGH);
    if(cloud.active()){
      cloud.send(destESN, "1", 1);
       Serial.println("SENT");
    }
    Serial.println("LED ON");

    
  }else
  {
       digitalWrite(led,LOW);
       if(cloud.active()){
      cloud.send(destESN, "0", 1);
       Serial.println("SENT");
    }
    Serial.println("LED OFF");
  }
}

void SimbleeForMobile_onConnect(){
   Serial.println("Device Connected");
}

void SimbleeForMobile_onDisconnect(){
   Serial.println("Device disconnected");
   Serial.println("Cloud disconnected");
}

