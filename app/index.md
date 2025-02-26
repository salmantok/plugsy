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

// Gunakan
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

// Gunakan
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

// Gunakan
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

// Gunakan
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

// Gunakan
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

// Gunakan
plugsy.setConfig('apiEndpoint', 'https://api.example.com');
console.log(plugsy.getConfig('apiEndpoint')); // Output: https://api.example.com
```

### Plugin untuk Menyimpan State Global

Menyimpan dan mengakses data global dalam plugin.

```js
plugsy.use((plug) => {
  plug.state = {};
  plug.setState = (key, value) => (plug.state[key] = value);
  plug.getState = (key) => plug.state[key];
});

// Gunakan
plugsy.setState('theme', 'dark');
console.log(plugsy.getState('theme')); // Output: dark
```

### Plugin untuk Logging

Menyediakan sistem logging sederhana untuk debugging.

```js
plugsy.use((plug) => {
  plug.log = (message) => console.log(`[LOG]: ${message}`);
});

// Gunakan
plugsy.log('Hello, world!'); // Output: [LOG]: Hello, world!
```

### Plugin untuk Caching Data

Menyimpan dan mengambil data dari cache untuk efisiensi.

```js
plugsy.use((plug) => {
  plug.cache = new Map();
  plug.setCache = (key, value) => plug.cache.set(key, value);
  plug.getCache = (key) => plug.cache.get(key);
});

// Gunakan
plugsy.setCache('user', { name: 'Alice' });
console.log(plugsy.getCache('user')); // Output: { name: 'Alice' }
```

### Plugin untuk Manajemen Tugas Asinkron

Menjalankan tugas asinkron dalam antrean secara berurutan.

```js
plugsy.use((plug) => {
  plug.queue = [];
  plug.addTask = (task) => plug.queue.push(task);
  plug.runTasks = async () => {
    for (const task of plug.queue) {
      await task();
    }
  };
});

// Gunakan
plugsy.addTask(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('Task 1 done');
        resolve();
      }, 1000);
    })
);
plugsy.addTask(
  () =>
    new Promise((resolve) => {
      setTimeout(() => {
        console.log('Task 2 done');
        resolve();
      }, 500);
    })
);
plugsy.runTasks();
```

### Plugin untuk Validasi Data

Menambahkan validator kustom untuk memeriksa data.

```js
plugsy.use((plug) => {
  plug.validators = {};
  plug.addValidator = (name, fn) => (plug.validators[name] = fn);
  plug.validate = (name, value) => plug.validators[name]?.(value);
});

// Gunakan
plugsy.addValidator('isNumber', (val) => typeof val === 'number');
console.log(plugsy.validate('isNumber', 42)); // Output: true
console.log(plugsy.validate('isNumber', 'test')); // Output: false
```

### Plugin untuk Memonitor Waktu Eksekusi

Mengukur waktu eksekusi fungsi untuk analisis performa.

```js
plugsy.use((plug) => {
  plug.trackExecution = (fn) => {
    const start = performance.now();
    fn();
    const end = performance.now();
    console.log(`Execution time: ${end - start}ms`);
  };
});

// Gunakan
plugsy.trackExecution(() => {
  for (let i = 0; i < 1000000; i++) {} // Simulasi kerja
});
```

### Plugin untuk Menyediakan Hook Lifecycle

Menjalankan kode sebelum dan sesudah proses utama dengan sistem hook.

```js
plugsy.use((plug) => {
  plug.hooks = { beforeRun: [], afterRun: [] };
  plug.addHook = (type, fn) => plug.hooks[type]?.push(fn);
  plug.runWithHooks = () => {
    plug.hooks.beforeRun.forEach((fn) => fn());
    console.log('Running main logic');
    plug.hooks.afterRun.forEach((fn) => fn());
  };
});

// Gunakan
plugsy.addHook('beforeRun', () => console.log('Before run logic'));
plugsy.addHook('afterRun', () => console.log('After run logic'));
plugsy.runWithHooks();
```

### Plugin untuk Manajemen Tema UI

Menyediakan fitur untuk mengatur tema (misalnya, mode terang & gelap).

```js
plugsy.use((plug) => {
  plug.theme = {
    current: 'light',
    setTheme: (theme) => {
      plug.theme.current = theme;
      document.documentElement.setAttribute('data-theme', theme);
      console.log(`Theme set to: ${theme}`);
    },
    toggleTheme: () => {
      plug.theme.current = plug.theme.current === 'light' ? 'dark' : 'light';
      plug.theme.setTheme(plug.theme.current);
    },
  };
});

// Gunakan
plugsy.theme.setTheme('light'); // Output: "Theme set to: light"
plugsy.theme.toggleTheme(); // Output: "Theme set to: dark"
```

Full contoh tema UI

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta http-equiv="X-UA-Compatible" content="ie=edge" />
    <title>Theme Toggle</title>
    <style>
      /* Default light theme */
      :root {
        --background-color: white;
        --text-color: black;
      }

      /* Dark theme */
      [data-theme='dark'] {
        --background-color: black;
        --text-color: white;
      }

      /* Terapkan warna ke body */
      body {
        background-color: var(--background-color);
        color: var(--text-color);
        transition:
          background-color 0.3s,
          color 0.3s;
      }

      /* Style tombol */
      #theme-toggle {
        margin: 20px;
        padding: 10px 20px;
        font-size: 16px;
        cursor: pointer;
        border: none;
        background: gray;
        color: white;
        border-radius: 5px;
      }
    </style>
  </head>
  <body>
    <button id="theme-toggle">Toggle Dark Mode</button>

    <script type="module">
      import plugsy from 'https://cdn.jsdelivr.net/npm/plugsy@0.0.2/+esm';

      plugsy.use((plug) => {
        plug.theme = {
          current: 'light',
          setTheme: (theme) => {
            plug.theme.current = theme;
            document.documentElement.setAttribute('data-theme', theme);
            console.log(`Theme set to: ${theme}`);
          },
          toggleTheme: () => {
            plug.theme.current =
              plug.theme.current === 'light' ? 'dark' : 'light';
            plug.theme.setTheme(plug.theme.current);
          },
        };

        // Pastikan tema awal diatur ke 'light'
        plug.theme.setTheme('light');

        // Tambahkan event listener untuk tombol
        document
          .getElementById('theme-toggle')
          .addEventListener('click', () => {
            plug.theme.toggleTheme();
          });
      });
    </script>
  </body>
</html>
```

### Plugin untuk Menyediakan API Fetch Wrapper

Membuat wrapper untuk `fetch()` dengan penanganan kesalahan dan opsi global.

```js
plugsy.use((plug) => {
  plug.api = {
    baseUrl: '',
    setBaseUrl: (url) => {
      plug.api.baseUrl = url;
    },
    get: async (endpoint) => {
      try {
        const response = await fetch(plug.api.baseUrl + endpoint);
        return await response.json();
      } catch (error) {
        console.error('API Fetch Error:', error);
        return null;
      }
    },
    post: async (endpoint, data) => {
      try {
        const response = await fetch(plug.api.baseUrl + endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(data),
        });
        return await response.json();
      } catch (error) {
        console.error('API Fetch Error:', error);
        return null;
      }
    },
  };
});

// Gunakan
plugsy.api.setBaseUrl('https://api.example.com');
plugsy.api.get('/users').then(console.log);
```

### Plugin untuk Menyediakan Fitur Undo/Redo

Menyediakan mekanisme untuk membatalkan dan mengulang perubahan.

```js
plugsy.use((plug) => {
  plug.history = {
    stack: [],
    index: -1,
    execute: (action) => {
      plug.history.stack.splice(plug.history.index + 1);
      plug.history.stack.push(action);
      plug.history.index++;
      action();
    },
    undo: () => {
      if (plug.history.index >= 0) {
        plug.history.index--;
        console.log('Undo action');
      }
    },
    redo: () => {
      if (plug.history.index < plug.history.stack.length - 1) {
        plug.history.index++;
        plug.history.stack[plug.history.index]();
        console.log('Redo action');
      }
    },
  };
});

// Gunakan
plugsy.history.execute(() => console.log('Action 1 executed'));
plugsy.history.undo(); // Output: "Undo action"
plugsy.history.redo(); // Output: "Action 1 executed"
```
