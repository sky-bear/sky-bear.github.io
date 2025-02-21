// 单例模式

const Singleton = (function () {
  let instance = null;
  function createInstance() {
    let object = new Object("I am the instance");
    return object;
  }
  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const instance1 = Singleton.getInstance();





