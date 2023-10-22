// styles things that print out to the cli

const TERMINAL_COLORS = {
  red: 31,
  green: 32,
  yellow: 33,
  blue: 34,
  magenta: 35,
  cyan: 36,
  grey: 90,
};

const ESC = '\u001B[';
const OSC = '\u001B]';
const BEL = '\u0007';
const SEP = ';';

const linkText = (text, url) => [
  OSC,
  '8',
  SEP,
  SEP,
  url,
  BEL,
  text,
  OSC,
  '8',
  SEP,
  SEP,
  BEL,
].join('');

function boldText(text) {
  return `\x1b[1m${text}\x1b[0m`;
}

// change the color of the text when printing it out
function colorText(str, color) {
  return '\x1b[' + TERMINAL_COLORS[color] + 'm' + str + '\x1b[0m';
}

class PrintStyle {
  isBold = false;
  isItalic = false;
  colorName = null;
  text = '';
  url = null;

  constructor(text) {
    this.text = text;
  }

  // bold a string when printing it out
  bold() {
    this.isBold = true;
    return this;
  }

  // add a link with a url.
  // if a url is not provided, assume the text is also the url
  link(maybeUrl) {
    if (maybeUrl) {
      this.url = maybeUrl;
    } else {
      this.url = this.text;
    }
    return this;
  }

  color(colorName) {
    if (!(colorName in TERMINAL_COLORS)) {
      throw new Error(`Tried to color a terminal value. ${colorName} is not a valid color`);
    }

    this.colorName = colorName;
    return this;
  }

  // redefine toString behavior
  toString() {
    let str = this.text;
    if (this.url) {
      str = linkText(str, this.url);
    }
    if (this.isBold) {
        str = boldText(str);
    }
    if (this.colorName) {
        str = colorText(str, this.colorName);
    }

    return str;
  }
}

function style(text) {
  return new PrintStyle(text);
}

function bold(text) {
  return new PrintStyle(text).bold()
}

function color(text, colorName) {
  return new PrintStyle(text).color(colorName);
}

function link(text, url) {
  return new PrintStyle(text).link(url);
}

export {
  style,
  bold,
  color,
  link,
}
