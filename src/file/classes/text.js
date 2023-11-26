import File from './file';
import { htmlPage, header, component } from 'html';

import { renderArticle } from './utils';

const renderTextFile = ({ file, rootUrl, siteName, sourceDir }) => {
  const articleHtml = [
    "pre",
    ["code",
     { class: `language-${file.extension} has-raw-code` },
     file.text
    ]
  ];

  return renderArticle({ file, articleHtml, rootUrl, siteName, sourceDir });
}

// A text file is a file that can be read as a utf-8 string
class TextFile extends File {
  // the string contents of the file
  asString = null;

  read() {
    this.asString = this.path.readString();
    return this;
  }

  write() {
    this.path.writeString(this.asString);
    return this;
  }

  get text() {
    if (!this.asString) {
      this.read();
    }

    return this.asString;
  }

  toString() {
    return this.text;
  }

  asHtml({ siteName, rootUrl, sourceDir }) {
    const page = renderTextFile({ file: this, siteName, rootUrl, sourceDir });
    return htmlPage(page);
  }

  serve(args) {
    let contents = this.text;
    if (this.asHtml && this.mimeType === 'text/html') {
      contents = this.asHtml(args);
    }

    return { contents, mimeType: this.mimeType };
  }
}

export default TextFile;
