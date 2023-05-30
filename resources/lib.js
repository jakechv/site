function print(...txt) {
    return console.log(txt);
};

function runOnDesktop(fn) {
    if (window.matchMedia("(min-width: 501px)")) {
        return fn();
    }
}

function create(elementName, attributes) {
    const elem = document.createElement(elementName);
    for (let key in attributes) {
        elem.setAttribute(key, attributes[key]);
    }
    return elem;
}

function req(url, method, then) {
    if (window.XMLHttpRequest) {
      httpRequest = new XMLHttpRequest();
    } else if (window.ActiveXObject) {
      httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
    }

    httpRequest.onreadystatechange = function() {
      if (httpRequest.readyState === XMLHttpRequest.DONE) {
        if (httpRequest.status === 200) {
          // All set
          var response = JSON.parse(httpRequest.responseText);
          then(response);
        } else {
          console.log('There was a problem with the last.fm request.');
        }
      }
    };

    httpRequest.open(method, url, true);
    httpRequest.send();
}

const get = (url, then) => req(url, 'GET', then);

const $ = (selector) => document.querySelector(selector);

function dynLoad(src, id) {
    var s = document.createElement('script');
    s.setAttribute('src', src);
    s.setAttribute('id', id);
    s.setAttribute('async', true);
    return s;
};
