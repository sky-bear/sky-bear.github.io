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

// ajax

let xmlHttp;
if (window.XMLHttpRequest) {
  xmlHttp = new XMLHttpRequest();
} else {
  xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
}

xmlHttp.onreadystatechange = function () {
  // readyState
  // 0	UNSENT	代理被创建，但尚未调用 open() 方法。
  // 1	OPENED	open() 方法已经被调用。
  // 2	HEADERS_RECEIVED	send() 方法已经被调用，并且头部和状态已经可获得。
  // 3	LOADING	下载中；responseText 属性已经包含部分数据。
  // 4	DONE	下载操作已完成。
  if (xmlHttp.readyState == 4 && xmlHttp.status == 200) {
    console.log(xmlHttp.responseText);
  }
};
// 处理浏览器缓存， 每次请求都带一个时间戳
xmlHttp.open("GET", "ajax-get.txt?t=" + new Date().getTime(), true);
//或
// xmlHttp.open("GET","ajax-get.txt?t=" + Math.random(),true);

xmlHttp.send();

// 封装

// ajax({
//   type: 'GET',
//   url: 'http://localhost:3000/posts',
//   timeout: 1000,
//   success: data => {
//     console.log('success', data);
//   },
//   error: err => {
//     console.log('error', err);
//   },
// });
function ajax(options) {
  const { type, url, timeout, success, error, data } = options;
  //处理obj
  const objToString = (data) => {
    data.t = new Date().getTime();
    let res = [];
    for (let key in data) {
      //需要将key和value转成非中文的形式，因为url不能有中文。使用encodeURIComponent();
      res.push(encodeURIComponent(key) + " = " + encodeURIComponent(data[key]));
    }
    return res.join("&");
  };

  let str = objToString(data || {});
  let xmlHttp,timer;
  // 1.创建对象
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  // 2.设置请求方式
  if (type.toUpperCase() === "GET") {
    xmlHttp.open(type, url + "?" + str, true);
  } else {
    xmlHttp.open(type, url, true);
    // 注意：在post请求中，必须在open和send之间添加HTTP请求头：setRequestHeader(header,value);
    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
  }
  //  3.发送请求；
  xmlHttp.send();
  // 4.处理响应
  xmlHttp.onreadystatechange = function () {
    clearTimeout(timer);
    if (xmlHttp.readyState == 4) {
      if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 304) {
        success(xmlHttp.responseText);
      } else {
        error(xmlHttp.status);
      }
    }
  };
  if (timeout) {
    timer = setTimeout(function () {
      xmlHttp.abort(); //中断请求
      clearTimeout(timer);
    }, option.timeout);
  }
}

// 改写成promise的形式

function ajax(options) {
  const { type, url, timeout, data } = options;
  return new Promise((resolve, reject) => {
    //处理obj
  const objToString = (data) => {
    data.t = new Date().getTime();
    let res = [];
    for (let key in data) {
      //需要将key和value转成非中文的形式，因为url不能有中文。使用encodeURIComponent();
      res.push(encodeURIComponent(key) + " = " + encodeURIComponent(data[key]));
    }
    return res.join("&");
  };

  let str = objToString(data || {});
  let xmlHttp,timer;
  // 1.创建对象
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }
  // 2.设置请求方式
  if (type.toUpperCase() === "GET") {
    xmlHttp.open(type, url + "?" + str, true);
  } else {
    xmlHttp.open(type, url, true);
    // 注意：在post请求中，必须在open和send之间添加HTTP请求头：setRequestHeader(header,value);
    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
  }
  //  3.发送请求；
  xmlHttp.send();
  // 4.处理响应
  xmlHttp.onreadystatechange = function () {
    clearTimeout(timer);
    if (xmlHttp.readyState == 4) {
      if ((xmlHttp.status >= 200 && xmlHttp.status < 300) || xmlHttp.status == 304)  {
        resolve(xmlHttp.responseText);
      } else {
        reject(xmlHttp.status);
      }
    }
  };
  if (timeout) {
    timer = setTimeout(function () {
      xmlHttp.abort(); //中断请求
      reject("超时");
      clearTimeout(timer);
    }, option.timeout);
  }
  })
}


