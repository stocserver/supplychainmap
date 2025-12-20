import Redis from 'ioredis';

// Using the connection details provided
const redis = new Redis('redis://default:HDvuHCKtZWhSprrdZYCzbU7mUABaMG7V@redis-10654.c74.us-east-1-4.ec2.cloud.redislabs.com:10654');

export default redis;
