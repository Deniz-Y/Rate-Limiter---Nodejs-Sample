
import express from "express";
const app = express();
const port = 3000;
import rateLimit from "express-rate-limit";
import RedisStore from "rate-limit-redis";
import {createClient}  from "redis";


// Create a `node-redis` client
const client = createClient({
  // ... (see https://github.com/redis/node-redis/blob/master/docs/client-configuration.md)
});


// Then connect to the Redis server
await client.connect();
const apiLimiter = rateLimit({

     
	//id(optional) Identifier of a limiter, to support multiple rate-limiter
	windowMs: 30 * 1000, // 30 seconds
	max: 2, // Limit each IP to 2 requests per `window` (here, per 30 seconds)
	standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
	legacyHeaders: true, // enable the `X-RateLimit-*` headers

	
	// Redis store configuration
        store: new RedisStore({
           //sendCommand: (...args: string[]) => client.sendCommand(args),
	   sendCommand: function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return client.sendCommand(args);
        }
  }),

})

// Apply the rate limiting middleware to API calls only
app.use('/', apiLimiter)

//returns the string Hello World when / is visited
app.get("/", (req, res) => {
  res.send("Hello World!");
});



app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
