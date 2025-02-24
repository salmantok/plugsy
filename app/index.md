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
