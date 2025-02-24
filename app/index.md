<p><a href="https://github.com/salmantok/plugsy.git"class="repo-link">Plugsy</a> adalah sistem yang fleksibel untuk menambah dan mengelola fitur melalui plugin. Plugin dapat memperluas atau memodifikasi perilaku secara dinamis.</p>

## Instalasi

```bash
npm install plugsy
```

## Contoh penggunaan

```js
// ESM
import plugsy from 'plugsy';
// CommonJS
const plugsy = require('plugsy').default;

plugsy.use((plug) => {
  plug.run = () => console.log('Plugin executed!');
});
plugsy.run(); // Output: Plugin executed!
```

### Plugin untuk Urutan Eksekusi

Menjalankan plugin secara berurutan sesuai urutan yang ditentukan.

```js
plugsy.use((plug) => {
  plug.plugins = [
    { name: 'Logger', run: () => console.log('Logger plugin') },
    { name: 'Analytics', run: () => console.log('Analytics plugin') },
  ];
  plug.runAll = () => plug.plugins.forEach((plugin) => plugin.run());
});
plugsy.runAll();
// Output:
// Logger plugin
// Analytics plugin
```

### Plugin untuk Middleware Berantai

Memproses middleware secara berantai dengan mekanisme `next()`.

```js
plugsy.use((plug) => {
  plug.middleware = [];
  plug.useMiddleware = (fn) => plug.middleware.push(fn);
  plug.execute = (context) => {
    let index = 0;
    const next = () => {
      if (index < plug.middleware.length) {
        plug.middleware[index++](context, next);
      }
    };
    next();
  };
});
plugsy.useMiddleware((ctx, next) => {
  console.log('Step 1', ctx);
  next();
});
plugsy.useMiddleware((ctx, next) => {
  console.log('Step 2', ctx);
  next();
});
plugsy.execute('Context data');
// Output:
// Step 1 Context data
// Step 2 Context data
```

### Plugin untuk Dependency Injection

Menyediakan layanan yang dapat diakses antar plugin.

```js
plugsy.use((plug) => {
  plug.services = {};
  plug.registerService = (name, service) => {
    plug.services[name] = service;
  };
  plug.getService = (name) => plug.services[name];
});
plugsy.registerService('api', { fetch: () => 'Data fetched from API' });
console.log(plugsy.getService('api').fetch()); // Output: Data fetched from API
```

### Plugin untuk Menangani Event

Memungkinkan plugin menangani dan merespons event.

```js
plugsy.use((plug) => {
  plug.events = {};
  plug.on = (event, handler) => {
    if (!plug.events[event]) plug.events[event] = [];
    plug.events[event].push(handler);
  };
  plug.emit = (event, data) => {
    (plug.events[event] || []).forEach((handler) => handler(data));
  };
});
plugsy.on('userLogin', (user) => console.log(`${user} logged in`));
plugsy.emit('userLogin', 'Alice');
// Output: Alice logged in
```

### Plugin untuk Membuat Konfigurasi Dinamis

Menyimpan dan mengelola konfigurasi plugin secara fleksibel.

```js
plugsy.use((plug) => {
  plug.config = {};
  plug.setConfig = (key, value) => {
    plug.config[key] = value;
  };
  plug.getConfig = (key) => plug.config[key];
});
plugsy.setConfig('apiEndpoint', 'https://api.example.com');
console.log(plugsy.getConfig('apiEndpoint')); // Output: https://api.example.com
```
