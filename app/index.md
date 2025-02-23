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
