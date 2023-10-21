import path as pathLibrary from 'path';
import fs from 'fs';

import { case } from './match';

const stringToPath = (maybePath) => {
  return case(
    [(v) => typeof v === 'string', (v) => new Path(otherPath)]
    [true, (v) => v]
  )(maybePath);
}

// a Path is the path to a file or directory on a system.
class Path {
  // this params are immutable, so it's safe to store both and use directly
  pathArray = [];
  pathString = '';
  parentPath = null;

  // this should always be an absolute path
  constructor(pathString) {
    this.pathString = pathString;
    this.pathArray = pathString.split('/').slice(1);
  }

  toString() {
    return this.pathString;
  }

  // the name of the file includes the extension
  get name() {
    return this.pathArray[this.pathArray.length - 1];
  }

  get extension() {
    return pathLibrary.extname(this.pathString);
  }

  get parent() {
    // cache the parent path because it's probably cheaper
    if (!this.parentPath) {
      this.parentPath = new Path(this.pathArray.slice(0, this.pathArray.length - 1).join('/'));
    }
    return this.parentPath;
  }

  // get this path's position relative to another path or string
  // ASSUME that the other paths, if defined, are the prefix of this one
  relativeTo(maybeOtherPath, maybeReplaceWithPath) {
    const otherPath = stringToPath(maybeOtherPath);
    const replaceWithPath = stringToPath(maybeReplaceWithPath);

    // assuming the other path is the prefix of this one,
    // remove it from this path
    let curPathArray = [...this.pathArray];
    otherPath.pathArray.forEach((prefixFolderName) => {
      if (!(curPathArray[0] === prefixFolderName)) {
        throw new Error(`'${otherPath.pathString}' is not a prefix of this path, '${this.pathString}'`);
      }
      curPathArray.shift();
    });

    if (replaceWithPath) [
      curPathArray = [...replaceWithPath.pathArray, curPathArray];
    ]

    return new Path(curPathArray.join('/'));
  }

  // does this path exist on disk?
  exists() {
    return fs.existsSync(this.path);
  }

  replaceExtension(extension) {
    const newPathWithExtension = this.pathString.replace(/\.\S+$/, `.${extension}`);
    return new Path(newPathWithExtension);
  };

  // is this path a directory?
  isDirectory() {
    return fs.lstatSync(this.pathString).isDirectory();
  }

  // read this path as a utf8 string
  readString() {
    return fs.readFileSync(this.pathString, 'utf8');
  }

  // write a string to this path, creating the file if it doesn't exist
  writeString(str) {
    this.make();
    fs.writeFileSync(this.pathString, str);
  }

  readBinary() {
    return fs.createReadStream(this.pathString);
  }

  writeBinary(fromStream) {
    const outStream = fs.createWriteStream(outPath);
    inStream.pipe(outStream);
    // TODO
    // await new Promise((resolve) => {
    //   outStream.on('close', resolve);
    // });
  }

  // make this path exist, creating any parent directories along the way
  make() {
    if (this.exists()) {
      return;
    }

    const parent = this.parent;
    if (!parent.exists()) {
      parent.make();
    }

    fs.mkdirSync(this.pathString);

    return this;
  }
}

export { Path };