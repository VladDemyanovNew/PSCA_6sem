import { createClient } from 'redis';

const client = createClient({
  url: 'redis://redis-18266.c99.us-east-1-4.ec2.cloud.redislabs.com:18266',
  password: '0UiYbZhFSMDK4XvanFlotbMlk9FX38CZ'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

await client.set('incr', 0);

const label1 = 'test incr';
const label2 = 'test decr';
const n = 5;

console.log('incr before incr:', await client.get('incr'));
console.time(label1);
await testIncr();
console.timeEnd(label1);
console.log('incr after incr:', await client.get('incr'));

console.log('incr before decr:', await client.get('incr'));
console.time(label2);
await testDecr();
console.timeEnd(label2);
console.log('incr after decr:', await client.get('incr'));

async function testIncr() {
  for (let i = 0; i < n; i++) {
    await client.incr('incr');
  }
}

async function testDecr() {
  for (let i = 0; i < n; i++) {
    await client.decr('incr');
  }
}