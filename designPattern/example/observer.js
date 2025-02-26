// 观察者模式  发布订阅
class Observer {
    constructor() {
        this.subscribers = [];
    }

    subscribe(fn) {
        this.subscribers.push(fn);
    }

    unsubscribe(fn) {
        this.subscribers = this.subscribers.filter(sub => sub !== fn);
    }

    notify(data) {
        this.subscribers.forEach(sub => sub(data));
    }
}


const observer = new Observer();
observer.subscribe(data => console.log(`sub1: ${data}`));

observer.notify("5");