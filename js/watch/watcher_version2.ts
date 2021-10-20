function remove(subs: Array<Watcher>, target: Watcher) {
  for (let i = 0; i < subs.length; i++) {
    if (subs[i] === target) {
      return subs.splice(i, 1);
    }
  }
}

class Dep {
  static target: Watcher
  static id = 0
  subs: Array<Watcher>
  id: number
  constructor() {
    this.subs = []
    this.id = Dep.id++
  }

  addSub(sub) {
    this.subs.push(sub)
  }

  removeSub(sub) {
    remove(this.subs, sub)
  }

  depend() {
    if (Dep.target) {
      Dep.target.addDep(this)
    }
  }

  notify() {
    const subs = this.subs.slice()
    for (let i = 0; i < subs.length; i++) {
      subs[i].update()
    }
  }
}
Dep.target = null
const targetStack = []

export function pushTarget (_target: Watcher) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

export function popTarget () {
  Dep.target = targetStack.pop()
}

class Watcher {
  getter
  constructor(vm, expOrFn) {
    this.getter = expOrFn
    this.get(vm)
  }
  get (vm) {
    pushTarget(this)
    const value = this.getter.call(vm, vm)
    popTarget()
    return value
  }
  addDep(dep) {
    dep.addSub(this)
  }

  update() {}
}

export function defineReactive (
  obj: Object,
  key: string,
  val: any,
  customSetter?: Function
) {
  // 每个data的属性都会有一个dep对象，用来进行收集依赖
  const dep = new Dep()
  let value = val

  Object.defineProperty(obj, key, {
    enumerable: true,
    configurable: true,
    get: function reactiveGetter () {
      if (Dep.target) {
        dep.depend()
      }
      return value
    },
    set: function reactiveSetter (newVal) {
      value = newVal
      dep.notify()
    }
  })
}
