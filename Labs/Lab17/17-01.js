import { createClient } from 'redis';

(async () => {
  const client = createClient({
    url: 'redis://redis-18266.c99.us-east-1-4.ec2.cloud.redislabs.com:18266',
    password: '0UiYbZhFSMDK4XvanFlotbMlk9FX38CZ'
  });

  client.on('error', (err) => console.log('Redis Client Error', err));

  await client.connect();

  await client.set('key', 'value');
  const value = await client.get('key');

  console.log(value);

})();
