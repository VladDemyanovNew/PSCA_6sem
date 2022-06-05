import express from 'express';
import jsonRouter from 'express-json-rpc-router';
import bodyParser from 'body-parser';

const app =  express();

const controller = {
  sum(params, raw) {
    return params.reduce((previousValue, currentValue) => previousValue + currentValue, 0);
  },
  mul(params, raw) {
    return params.reduce((previousValue, currentValue) => previousValue * currentValue, 1);
  },
  div(params, raw) {
    return params[0] / params[1];
  },
  proc(params, raw) {
    return params[0] / params[1] * 100;
  },
};

function arrayValidator(params, _, raw) {
  if (!Array.isArray(params)) {
    throw new Error('Expected array');
  }
  return params;
}

function numberValidator(params, _, raw) {
  const areAllNumbers = params.every(param => isFinite(param));
  if (!areAllNumbers) {
    throw new Error('Expected number');
  }
  return params;
}

const beforeController = {
  sum(params, _, raw) {
    arrayValidator(params, _, raw);
    numberValidator(params, _, raw);
  },
  mul(params, _, raw) {
    arrayValidator(params, _, raw);
    numberValidator(params, _, raw);
  },
  div(params, _, raw) {
    arrayValidator(params, _, raw);
    numberValidator(params, _, raw);
    if (params.length > 2) {
      throw new Error('Expected 2 params');
    }
    if (params[1] === 0) {
      throw new Error('Unable to div on zero');
    }
  },
  proc(params, _, raw) {
    arrayValidator(params, _, raw);
    numberValidator(params, _, raw);
    if (params.length > 2) {
      throw new Error('Expected 2 params');
    }
    if (params[1] === 0) {
      throw new Error('Unable to div on zero');
    }
  },
}

const afterController = {
  sum: [
    (params, result, raw) => console.log('testMethod executed 1!'),
    () => console.log('testMethod executed 2!'),
  ]
}

app.use(bodyParser.json())
app.use(jsonRouter({
  methods: controller,
  beforeMethods: beforeController,
  afterMethods: afterController,
  onError(error) {
    console.log(error);
  },
}));
app.listen(3000, () => console.log('Server has benn started'));