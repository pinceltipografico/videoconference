/**
 * GET DATA FUNCTION
 */
function getData (url, method, data, callback) {
  var xhr = null;

  if (typeof XMLHttpRequest !== 'undefined') {
    xhr = new XMLHttpRequest();
  } else {
    var versions = [
      'MSXML2.XmlHttp.5.0',
      'MSXML2.XmlHttp.4.0',
      'MSXML2.XmlHttp.3.0',
      'MSXML2.XmlHttp.2.0',
      'Microsoft.XmlHttp'
    ]
    for (var i = 0; i < versions.length; i++) {
      try {
        xhr = new ActiveXObject(versions[ i ])
        break;
      } catch (e) {
      }
    }
  }
  xhr.onreadystatechange = function () {
    if (xhr.readyState < 4) {
      return;
    }
    if (xhr.status !== 200) {
      console.log(xhr)
      return;
    }
    if (xhr.readyState === 4) {
      callback(xhr);
    }
  }

  xhr.open(method, url, true);
  xhr.setRequestHeader('Content-type', 'application/json')

  if (method === 'POST' || method === 'PUT') {
    xhr.send(JSON.stringify(data));
  } else if (method === 'GET') {
    xhr.send('');
  }
}

self.onmessage = function (event) {
  let {method, endPoint, data, interval} = event.data

  function callGetData () {
    getData(`/api/${endPoint}`, method, data, function (res) {
      try {
        var _res = JSON.parse(res.response);
        self.postMessage(_res);
      } catch (e) {
        console.log(e);
      }
    })
  }
  (interval) ? this.setInterval(callGetData, interval) : callGetData()
}
