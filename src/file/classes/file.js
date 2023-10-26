import fs from 'fs';
import { exec } from '../../utils/cmd';
import { Path } from '../../utils/path';
import { readFile } from '../index';

class File {
  // the full path to the file
  path = null;

  // make the path a full path if it's not
  // if the file doesn't exist, throw an error
  constructor(path) {
    const filePath = Path.create(path);
    if (!filePath.exists()) {
      throw new Error(`from File constructor: File at path '${path}' does not exist`);
    }

    this.path = filePath;
  }

  static create(path) {
    return new this(path);
  }

  clone() {
    return new this.constructor(this.path);
  }

  // read the file at the path
  read() {
    throw new Error('File.read() is not implemented');
  }

  get path() {
    return this.path;
  }

  // the title of the file does not
  get title() {
    return this.name.split('.')[0];
  }

  // the name of a file includes the extension
  get name() {
    return this.path.name;
  }

  // the type of the file is the extension (for now?)
  get extension() {
    return this.path.extension;
  }

  // get the mime type of the file
  get mimeType() {
    return this.path.mimeType;
  }

  // get the string of the folder the path is contained in
  get directory() {
    console.log(this.path.parent.toString());
    return readFile(this.path.parent);
  }

  // I hope the file is not a directory
  get isDirectory() {
    return false;
  }

  // get the url to the html page with this file
  htmlUrl({ rootUrl, sourceDir }) {
    return `${rootUrl}${this.path.relativeTo(sourceDir)}.html`;
  }

  get repo() {
    const repoAtPath = this.path.repo;
    if (!repoAtPath) {
      throw new Error(`from File.repo: File at path '${this.path}' is not in a repo`);
    }

    return repoAtPath;
  }

  get lastLog() {
    return this.repo.getFile(this.path).lastLog;
  }

  get log() {
    return this.repo.getFile(this.path).log;
  }

  get lastTimestamp() {
    return this.repo.getFile(this.path).lastTimestamp;
  }

  serve() {
    throw new Error('File.serve() is not implemented');
  }

  watch(callback) {
    const closeWatcher = this.path.watch((eventType, filename) => {
      callback(eventType, this);
    });

    return closeWatcher;
  }
}

export default File;
