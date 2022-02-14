import { createClient } from 'redis';

const client = createClient({
    url: 'redis://redis-15728.c10.us-east-1-2.ec2.cloud.redislabs.com:15728',
    password: 'iji8ItnLkUmtwiFTwpqG7gRDDgRIeyTQ'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

const label1 = 'test hset';
const label2 = 'test hget';
const n = 1;

console.time(label1);
await testHset();
console.timeEnd(label1);

console.time(label1);
await testHget();
console.timeEnd(label1);

//console.log(await client.hGet(i, 'val'));

async function testHset() {
    for (let i = 0; i < n; i++) {
        await client.hSet(i, { id: i, val: `val-${i}` });
    }
}

async function testHget() {
    for (let i = 0; i < n; i++) {
        await client.hGet(i, 'val');
    }
}
