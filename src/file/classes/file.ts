import { Path } from "../../utils/path";
import { readFile } from "file";
import Directory from "../filetype/directory";
import { PageSettings } from "../../types/site";

/**
 * Any file on the system.
 */
class File {
  // the full path to the file
  public path: Path = null;

  /**
   * Make the path a full path if it's not.
   * If the file doesn't exist at all, throw an error.
   * Otherwise, construct a file.
   */
  constructor(pathArg: Path) {
    const filePath = Path.create(pathArg);

    if (!filePath.exists()) {
      throw new Error(
        `from File constructor: File at path '${pathArg}' does not exist`
      );
    }

    this.path = filePath;
  }

  static create(path: Path) {
    return new this(path);
  }

  /**
   * Two files are equal if their paths are equal.
   */
  equals(file: File) {
    return this.path.equals(file.path);
  }

  clone(): typeof this {
    // note: `this.constructor` is always callable as a constructor,
    // but TypeScript doesn't seem to have a special notion of a 'constructor'
    // function that can be invoked like an arbitrary function.
    // Not even sure it's possible with the JS spec.
    return new (this.constructor as any)(this.path);
  }

  // read the file at the path
  read() {
    throw new Error("File.read() is not implemented");
  }

  // the title of the file does not
  get title() {
    return this.name.split(".")[0];
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

  /**
   * Get the parent directory of this file.
   */
  get directory(): Directory {
    // A `parent` file, by definition, is a directory that contains this one.
    return readFile(this.path.parent) as any as Directory;
  }

  /**
   * Determine if the file is a directory.
   * Always false here; directory subclass reimplements this.
   */
  isDirectory(): this is Directory {
    return false;
  }

  write(config: PageSettings): typeof this {
    console.error(
      `file.write() is not implemented for file at '${this.path.toString()}'`
    );

    return this;
  }

  // get the url to the html page with this file
  // if provided a directory, get the url to the directory with index.html postfixed (?)
  htmlUrl({ rootUrl, sourceDir }) {
    const relativeToSource = this.path.relativeTo(sourceDir);

    const isRootPath =
      !relativeToSource.toString().length ||
      relativeToSource?.toString() === "/";

    if (isRootPath) {
      return rootUrl + "/index.html";
    }

    return rootUrl + relativeToSource.toString() + ".html";
  }

  get repo() {
    const repoAtPath = this.path.repo;
    if (!repoAtPath) {
      console.log(
        `From File.repo: File at path '${this.path}' is not in a repo`
      );
      return null;
    }

    return repoAtPath;
  }

  get lastLog() {
    return this.repo?.getFile(this.path)?.lastLog;
  }

  get log() {
    return this.repo?.getFile(this.path)?.log ?? [];
  }

  get lastTimestamp() {
    return this.repo?.getFile(this.path).lastTimestamp;
  }

  // by default, files do not depend on any other files.
  dependencies(settings, filesSeenSoFar) {
    return [];
  }

  /**
   * Serve the file.
   * By default, this should serve the file as a binary?
   */
  serve(args: PageSettings): { contents: string; mimeType: string } {
    throw new Error("File.serve() is not implemented");
  }

  /**
   * Watch the file for any listeners.
   */
  watch(callback) {
    const closeWatcher = this.path.watch((eventType, filename) => {
      callback(eventType, this);
    });

    return closeWatcher;
  }
}

export default File;
