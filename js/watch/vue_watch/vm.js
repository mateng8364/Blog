// import { defineReactive } from './defineReactive';
// import { Watcher } from './Watcher';

const { defineReactive } = require('./defineReactive');
const { Watcher } = require('./Watcher');

function render(vm) {
  console.log(vm)
  const context = vm || this
  for (let key in context.$data) {
    context[key] = context.$data[key];
  }
  console.log('render')
}
class VueComponent {
  constructor(options) {
    console.log('beforeCreate')
    this._data = options.data();
    defineReactive(this, '$data', options.data())
    for (let key in this.$data) {
      defineReactive(this.$data, key, this.$data[key])
    }
    console.log('created')

    console.log('beforeMount')
    const watcher = new Watcher(this, render)
    this._watcher = watcher
    console.log('mounted')
  }
} 

const vm = new VueComponent({ data() { return ({ a: 1, b: 2 }) } })
console.log('改变data.a前')
vm.$data.a = 123
vm.$data.b = 456
console.log(vm)

