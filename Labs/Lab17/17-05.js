import { createClient } from 'redis';

const publisher = createClient({
    url: 'redis://redis-15728.c10.us-east-1-2.ec2.cloud.redislabs.com:15728',
    password: 'iji8ItnLkUmtwiFTwpqG7gRDDgRIeyTQ'
});
const subscriber = publisher.duplicate()

publisher.on('error', (err) => console.log('Redis Client Error', err));
subscriber.on('error', (err) => console.log('Redis Client Error', err));

await publisher.connect();
await subscriber.connect();

setTimeout(() => publisher.publish('notification', 'hello'), 5000);

subscriber.on('message', function (channel, message) {
    console.log(`Message: ${message} on channel: ${channel} is arrive!`);
});

subscriber.subscribe('notification');