import express from 'express';
import fs from 'fs';
import jsonRouter from 'express-json-rpc-router';

const app = express();

let wasmCode = fs.readFileSync('./public/out.wasm');
let wasmImport = {};
let wasmModule = new WebAssembly.Module(wasmCode);
let wasmInstance = new WebAssembly.Instance(wasmModule, wasmImport);

app.use('/', express.static('public'));

const controller = {
  sum(params, raw) {
    return wasmInstance.exports.sum(params[0], params[1]);
  },
  mul(params, raw) {
    return wasmInstance.exports.mul(params[0], params[1]);
  },
  sub(params, raw) {
    return wasmInstance.exports.sub(params[0], params[1]);
  },
};

app.use(express.json())
app.use(jsonRouter({
  methods: controller,
}));

app.listen(3000, () => console.log('Server has been started'));