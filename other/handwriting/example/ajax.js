// 封装一个ajax

function ajax(options) {
  const { url, method, data, success, fail, timeout } = options;
  let xmlHttp, timer;
  const objToString = (data) => {
    let str = "";
    for (let key in data) {
      str += `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}&`;
    }
    return str;
  };
  const str = objToString(data || {});
  if (window.XMLHttpRequest) {
    xmlHttp = new XMLHttpRequest();
  } else {
    xmlHttp = new ActiveXObject("Microsoft.XMLHTTP");
  }

  if (method.toUpperCase === "GET") {
    xmlHttp.open(method, `${url}?${str}`, true);
  } else {
    xmlHttp.open(method, url, true);
    xmlHttp.setRequestHeader(
      "Content-type",
      "application/x-www-form-urlencoded"
    );
  }

  xmlHttp.send();

  xmlHttp.onreadystatechange = function () {
    if (xmlHttp.readyState === 4) {
      if (
        xmlHttp.status >= 200 ||
        xmlHttp.status < 300 ||
        xmlHttp.status === 304
      ) {
        success(xmlHttp.responseText);
      } else {
        fail(xmlHttp.responseText);
      }
    } else {
      fail(xmlHttp.responseText);
    }
  };

  if (timeout) {
    timer = setTimeout(() => {
      xmlHttp.abort();
      fail("请求超时");
      clearTimeout(timer);
    }, timeout);
  }
}
