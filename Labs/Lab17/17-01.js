import { createClient } from 'redis';

(async () => {
    const client = createClient({
        url: 'redis://redis-15728.c10.us-east-1-2.ec2.cloud.redislabs.com:15728',
        password: 'iji8ItnLkUmtwiFTwpqG7gRDDgRIeyTQ'
    });

    client.on('error', (err) => console.log('Redis Client Error', err));

    await client.connect();

    await client.set('key', 'value');
    const value = await client.get('key');

    console.log(value);

})();
