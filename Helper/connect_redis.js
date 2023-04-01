const { createClient } = require('redis')

const client = createClient({
    port:6379,
    host:"127.0.0.1"
});
async function redisConnect(){
    await client.connect()   
}
redisConnect()

client.on('connect', () => console.log('Redis connected'));
client.on('ready', () => console.log('Redis ready to use...'));
client.on('error', err => console.log('Redis Client Error', err));
client.on('end', () => console.log('Redis disconnected'));
process.on('SIGINT', () => client.quit());

module.exports=client