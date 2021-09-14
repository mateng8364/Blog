// 观察者模式  目标对象（被观察者）  观察对象
class Subject {
  constructor() {
    this.observerQueue = []
  }

  addObserver(observer, callback) {
    for (var i = 0; i < this.observerQueue.length; i++) {
      if (this.observerQueue[i].observer === observer && callback) {
        return this.observerQueue[i].callback = callback
      }
    }
    this.observerQueue.push({observer, callback})
  }

  removeObserver(observer) {
    for (var i = 0; i < this.observerQueue.length; i++) {
      if (this.observerQueue[i].observer === observer) {
        return this.observerQueue.splice(i, 1)
      }
    }
  }

  notify() {
    this.observerQueue.forEach(item => {
      if (item.callback) {
        item.callback.call(item.observer)
      } else {
        item.observer.update()
      }
    })
  }
}

class Observer {
  constructor(name) {
    this.name = name
  }
}

const sub = new Subject()
const ob1 = new Observer('zs')
const ob2 = new Observer('ls')
const ob3 = { name: 'ob3', update() { console.log(this.name)}}
sub.addObserver(ob1, function () { console.log(this.name)})
sub.addObserver(ob2, function() { console.log(this.name) })
sub.addObserver(ob3)
sub.notify()
sub.removeObserver(ob1)
sub.notify()
// zs ls ob3
// ls ob3

// 发布订阅模式
// 在第三方事件中心 发布者进行注册 订阅者进行订阅 然后发布者发布到平台 订阅者收到平台推送
// 发布者不去统计订阅者几何  订阅者不去了解发布者为那一方  统一由平台处理
class Channel {
  constructor() {
    this.platform = {} // 生成自己的平台
  }

  // 平台注册或者开通指定的渠道名字
  addPlatformContent(name) {
    if (!this.platform[name]) {
      this.platform[name] = []
    } else {
      console.error(`栏目${name}已被注册，请更换栏目名`)
    }
  }

  // 注销渠道
  removePlatformContent(name) {
    if (this.platform[name]) {
      const result = delete this.platform[name]
      if (result) {
        console.info('注销成功')
      } else {
        console.error('注销失败')
      }
    } else {
      console.warn(`栏目${name}不存在或已被注销，请更换栏目名`)
    }
  }

  // 订阅者订阅指定的渠道服务
  subscribeContent(name, sub) {
    if (this.platform[name]) {
      this.platform[name].push(sub)
    } else {
      console.warn(`订阅的${name}服务不存在或未注册，请更换后确认`)
    }
  }

  unSubscribeContent(name, sub) {
    if (this.platform[name]) {
      const index = this.platform[name].indexOf(sub)
      if (index > -1) {
        this.platform[name].splice(index, 1)
      } else {
        console.warn(`非订阅用户，请更换后确认`)
      }
    } else {
      console.warn(`订阅的${name}服务不存在或未注册，请更换后确认`)
    }
  }

  // 通知所有的订阅者 渠道服务已更新
  publish(name) {
    this.platform[name].forEach(item => {
      item.update(name)
    })
  }
}

class Publisher {
  constructor(name, channel) {
    this.name = name
    this.channel = channel
  }

  // 开通渠道
  addContent(name) {
    this.channel.addPlatformContent(name)
  }

  // 关闭渠道
  removeContent(name) {
    this.channel.removePlatformContent(name)
  }

  // 发布
  notify(name) {
    this.channel.publish(name)
  }
}

class Subscriber {
  constructor(name, channel) {
    this.name = name
    this.channel = channel
  }

  // 订阅
  subscribe(name) {
    this.channel.subscribeContent (name, this)
  }

  // 取消订阅
  unSubscribe(name) {
    this.channel.unSubscribeContent(name, this)
  }

  update(name) {
    console.log(`${this.name}收到了${name}渠道的发布信息`)
  }
}

const channel = new Channel();

const pub1 = new Publisher("报社1", channel);
const pub2 = new Publisher("报社2", channel);

pub1.addContent("晨报1");
pub1.addContent("晚报1");
pub2.addContent("晨报2");

const sub1 = new Subscriber("小明", channel);
const sub2 = new Subscriber("小红", channel);
const sub3 = new Subscriber("小张", channel);

sub1.subscribe("晨报1");

sub2.subscribe("晨报1");
sub2.subscribe("晨报2");

sub3.subscribe("晚报1");
sub3.subscribe("晨报2");
sub3.unSubscribe("晨报2");

pub1.notify("晨报1");
pub1.notify("晚报1");
pub2.notify("晨报2");
