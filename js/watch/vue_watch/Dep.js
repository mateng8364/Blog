class Dep {
  static target
  static id = 0
  subs
  id
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
      subs[i].update(this)
    }
  }
}
const targetStack = []
Dep.target = null

function pushTarget (_target) {
  if (Dep.target) targetStack.push(Dep.target)
  Dep.target = _target
}

function popTarget () {
  Dep.target = targetStack.pop()
}

module.exports = {
  Dep,
  pushTarget,
  popTarget
}