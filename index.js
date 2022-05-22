const mqtt = require("mqtt");
const si = require("systeminformation");

const host = "broker.hivemq.com";
const port = "1883";
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`;

const connectUrl = `mqtt://${host}:${port}`;

const client = mqtt.connect(connectUrl, {
  clientId,
  clean: true,
  connectTimeout: 4000,
  username: "hivemq",
  password: "public",
  reconnectPeriod: 1000,
});

const topic = "/canada/montreal/macbook";

client.on("connect", async () => {
  console.log("Connected");

  while (true) {
    // retrieve  battery info
    const batteryData = await si.battery();

    // send the data to MQTT broker
    await client.publish(
      topic,
      JSON.stringify({ capacity: batteryData.percent }),
      { qos: 0, retain: false },
      (error) => {
        if (error) {
          console.error(error);
        }
      }
    );

    // wait 10 sec until next loop
    await new Promise((resolve) => setTimeout(resolve, 10000));
  }
});
