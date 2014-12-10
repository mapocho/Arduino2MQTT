// Constantes para MQTT Broker
const MQTT_BROKER_URL = process.env.MQTT_BROKER_URL || "m10.cloudmqtt.com";
const MQTT_BROKER_PORT = process.env.MQTT_BROKER_PORT || 18919;
const MQTT_BROKER_USERNAME = process.env.MQTT_BROKER_USERNAME || "naecfjkf";
const MQTT_BROKER_PASSWORD = process.env.MQTT_BROKER_PASSWORD || "nJmWvEGZF-b4";
const MQTT_BROKER_TOPIC = process.env.MQTT_BROKER_TOPIC || "/demo/arduino01/";

// Para leer JSOn que viene desde el Arduino (puerta serial)
var serialport = require("serialport");
var SerialPort = serialport.SerialPort; 
var puertoSerial = new SerialPort("/dev/ttyACM1", {
  baudrate: 9600,
  parser: serialport.parsers.readline("\n")
});

// Para llevar datos a un broker MQTT
var mqtt = require('mqtt');
var clienteMQTT = mqtt.createClient(MQTT_BROKER_PORT, MQTT_BROKER_URL,
	{
		username: MQTT_BROKER_USERNAME,
		password: MQTT_BROKER_PASSWORD
	}
);

// Leemos desde la puerta serial
puertoSerial.on('data', function(data) {
	try {
		var jsonBuffer = JSON.parse( data );
		
		// Publicamos en MQTT Broker
		clienteMQTT.publish(MQTT_BROKER_TOPIC, jsonBuffer);
		console.log("Se publicó MQTT Broker: \"" + JSON.stringify(jsonBuffer) + "\"");
//    clienteMQTT.end();
	} catch (e) {
	  console.log("Error: \"" + e + "\"");
	}	
});
