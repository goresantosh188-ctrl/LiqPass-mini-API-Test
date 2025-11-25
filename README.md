# LiqPass Mini Quote API

## Install
npm install \
npm run build

## Run
npm start

## Run tests
npm test

## Example curl
curl -X POST http://localhost:8080/quote \
    -H "Content-Type: application/json" \
    -d '{"userId": "user1", "principal": 1000, "leverage": 20, "durationHours": 24}'

curl http://localhost:8080/quotes/user1
