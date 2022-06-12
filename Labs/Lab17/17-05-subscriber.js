import { createClient } from 'redis';

const subscriber = createClient({
  url: 'redis://redis-18266.c99.us-east-1-4.ec2.cloud.redislabs.com:18266',
  password: '0UiYbZhFSMDK4XvanFlotbMlk9FX38CZ'
});
await subscriber.connect();

await subscriber.subscribe('channel', (message, channel) => {
  console.log(message);
});
