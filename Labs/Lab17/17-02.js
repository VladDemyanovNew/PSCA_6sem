import { createClient } from 'redis';

const client = createClient({
    url: 'redis://redis-15728.c10.us-east-1-2.ec2.cloud.redislabs.com:15728',
    password: 'iji8ItnLkUmtwiFTwpqG7gRDDgRIeyTQ'
});

client.on('error', (err) => console.log('Redis Client Error', err));

await client.connect();

const label1 = 'test set';
const label2 = 'test get';
const n = 5;

console.time(label1);
await testSet();
console.timeEnd(label1);

console.time(label2);
await testGet();
console.timeEnd(label2);

const label3 = 'test del';
console.time(label3);
await testDel();
console.timeEnd(label3);

async function testSet() {
    for (let i = 0; i < n; i++) {
        await client.set(i, `set${i}`);
    }
}

async function testGet() {
    for (let i = 0; i < n; i++) {
        await client.get(i);
    }
}

async function testDel() {
    for (let i = 0; i < 3; i++) {
        await client.del(i);
    }
}
