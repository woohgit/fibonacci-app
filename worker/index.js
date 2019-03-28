const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
  host: keys.redisHost,
  port: keys.redisPort,
  retry_strategy: () => 1000
})

// will be used for pub/sub
const sub = redisClient.duplicate();

// fibonacci retursive
function fib(index) {
  if (index < 2) return 1;
  return fib(index - 1) + fib(index - 2);
}

// when a new message arrives to redis, calculate it and re-write the value
sub.on('message', (channel, message) => {
  redisClient.hset('values', message, fib(parseInt(message)));
});

// subscribe to all insert to redis
sub.subscribe('insert');
