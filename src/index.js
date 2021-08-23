import { check, sleep } from 'k6';
import http from 'k6/http';

const url = __ENV.URL || 'http://localhost:4000';
const duration = __ENV.DURATION || '60s';
const iterations = __ENV.ITERATIONS || 2;
const maxVus = __ENV.MAX_VUS || 100;
const stages = [];
for (let i = 0; i < iterations; i++) {
  stages.push({ duration, target: maxVus });
  stages.push({ duration, target: Math.floor(maxVus / 2) });
}

export const options = {
  scenarios: {
    basic: {
      exec: 'basic',
      executor: 'per-vu-iterations',
      //gracefulRampDown: '30s',
      iterations,
      vus: maxVus,
    },
  },
  thresholds: {
    http_req_duration: ['p(95)<1000'], // 95% of requests should be faster than 1 second.
  },
};

export function basic() {
  const response = http.get(`${url}/hello`);
  check(response.body, {
    'Hello World': (value) => {
      if (value === undefined || value === null || value === '') return false;
      const text = JSON.parse(value);
      return text == 'Hello world!';
    },
  });
  sleep(1)
}