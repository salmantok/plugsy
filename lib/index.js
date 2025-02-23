class Plugsy {
    constructor() {
        this.plugins = [];
    }
    use(plugin) {
        this.plugins.push(plugin);
        plugin(this);
    }
}
const plugsy = new Plugsy();
export default plugsy;
