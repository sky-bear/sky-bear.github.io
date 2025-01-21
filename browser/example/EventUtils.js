// 事件
const EventUtils = {
  addEventListener: function (el, type, fn) {
    if (el.addEventListener) {
      el.addEventListener(type, fn, false); // 默认冒泡阶段处理
    } else if (el.attachEvent) {
      el.attachEvent("on" + type, fn);
    } else {
      el["on" + type] = fn;
    }
  },
  removeEventListener: function (el, type, fn) {
    if (el.removeEventListener) {
      el.removeEventListener(type, fn, false);
    } else if (el.detachEvent) {
      el.detachEvent("on" + type, fn);
    } else {
      el["on" + type] = null;
    }
  },

  getEvent(event) {
    return event || window.event;
  },

  getTatget(event) {
    return event.target || event.srcElement;
  },

  stopPropagation() {
    if (event.stopPropagation) {
      event.stopPropagation();
    } else {
      event.cancelBubble = true;
    }
  },

  preventDefault() {
    if (event.preventDefault) {
      event.preventDefault();
    } else {
      event.returnValue = false;
    }
  },
};

