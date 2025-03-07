
function Queue() {
  this.dataStore = [];
  this.enqueue = function (ele) {
    return this.dataStore.push(ele);
  };
  this.dequeue = function () {
    return this.dataStore.shift();
  };
  this.front = function () {
    return this.dataStore[0];
  };
  this.back = function () {
    return this.dataStore[this.dataStore.length - 1];
  };
  this.toString = function (s = " ") {
    return this.dataStore.join(s);
  };
  this.empty = function () {
    return !this.dataStore.length;
  };
  this.getDataStore = function () {
    return this.dataStore;
  };
}



module.exports = Queue;


