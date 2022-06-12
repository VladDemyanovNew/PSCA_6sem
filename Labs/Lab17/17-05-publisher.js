import { createClient } from 'redis';

const client = createClient({
  url: 'redis://redis-18266.c99.us-east-1-4.ec2.cloud.redislabs.com:18266',
  password: '0UiYbZhFSMDK4XvanFlotbMlk9FX38CZ'
});
await client.connect();

setInterval(() => client.publish('channel', 'Hello'), 1000);