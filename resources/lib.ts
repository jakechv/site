import type { HtmlAttributes, HtmlTag } from "../src/types/html";

function print(...txt: any[]) {
  return console.log(txt);
}

/**
 * Run the provided function on a desktop.
 */
function runOnDesktop(fn: () => void) {
  if (window.matchMedia("(min-width: 501px)")) {
    return fn();
  }
}

/**
 * Create an html element with attributes and append it to a parent element
 */
function create(
  elementName: HtmlTag,
  attributes?: HtmlAttributes,
  parent?: HTMLElement
) {
  const elem = document.createElement(elementName);
  for (let key in Object.keys(attributes ?? {})) {
    const attributeValue = attributes?.[key];

    // If we can explicitly define it, use the assigning function.
    // Otherwise mutate the element directly.
    if (attributeValue !== undefined) {
      elem.setAttribute(key, attributeValue.toString());
    } else {
      elem[key] = attributeValue;
    }
  }

  if (parent) {
    parent.appendChild(elem);
  }

  return elem;
}

function create2(
  elementName: HtmlTag,
  attributes: HtmlAttributes,
  ...children: HTMLElement[]
) {
  const elem = document.createElement(elementName);

  for (let key in attributes) {
    // some things only work one way, so we do both
    // is this faster than a switch statement? not sure.
    elem.setAttribute(key, attributes[key] as string);
    elem[key] = attributes[key];
  }

  if (children) {
    children.forEach((child) => {
      if (typeof child === "string") {
        elem.appendChild(document.createTextNode(child));
      } else {
        elem.appendChild(child);
      }
    });
  }

  return elem;
}

var httpRequest: XMLHttpRequest;

type HttpMethod = "GET" | "POST";

function req(url: string, method: HttpMethod, then: Function) {
  if (window.XMLHttpRequest) {
    httpRequest = new XMLHttpRequest();
  } else if (window.ActiveXObject) {
    httpRequest = new ActiveXObject("Microsoft.XMLHTTP");
  }

  httpRequest.onreadystatechange = function () {
    if (httpRequest.readyState === XMLHttpRequest.DONE) {
      if (httpRequest.status === 200) {
        // All set
        var response = JSON.parse(httpRequest.responseText);
        then(response);
      } else {
        console.log("There was a problem with the last.fm request.");
      }
    }
  };

  httpRequest.open(method, url, true);
  httpRequest.send();
}

const get = (url: string, then: Function) => req(url, "GET", then);

const $ = (selector: string) => document.querySelector(selector);
const all = (selector: string) =>
  Array.from(document.querySelectorAll(selector));

/**
 * Dynamically load a script provided the src and id.
 */
function dynLoad(src: string, id: string) {
  var s = document.createElement("script");
  s.setAttribute("src", src);
  s.setAttribute("id", id);
  s.setAttribute("async", "true");
  return s;
}

export { create, create2, dynLoad, get, $, all, print, runOnDesktop };
