import { Path } from "utils/path";
import File from "./classes/file";

import Directory from "./filetype/directory";
import TextFile from "file/classes/text";
import JavascriptFile from "./filetype/js";
import type { PageSettings } from "../types/site";

/*
 * A standard interface for interacting with files.
 *
 * Create a file with the provided path string
 * and the specific file class should handle the rest.
 *
 * Import all the files from the 'filetype' directory
 * and associate them with their filetype names.
 */

// key: a file extension
// value: a list of extensions that can compile to that file extension
// by invoking a function with that extension's name
const compileMap: { [key: string]: string[] } = {};
type FiletypeMap = { [key: string]: typeof File };

let filetypeMap: FiletypeMap;

// obtain a map of file to filetype
const getFiletypeMap = (cfg: PageSettings) => {
  // bootstrap the process; we know we have a directory
  const dir = new Directory(Path.create(__dirname + "/filetype/"), cfg);

  const newFiletypeMap: FiletypeMap = {};

  // Problem: to bootstrap the process, we need to know what class
  // a file is before we can create it. but we need to create it
  dir
    .contents(cfg, { omitNonJSFiles: true })
    .map((file: File) => {
      // because we have a js file, we know we can require it
      const fileClass = (file as JavascriptFile).require();
      // default to using the raw 'fileClass' if there is no default export (?)
      return fileClass?.default ?? fileClass;
    })
    .forEach((fileClass: typeof File) => {
      if (!fileClass.filetypes) {
        throw new Error(
          `Filetype ${fileClass.name} does not have a 'filetypes' property`
        );
      }

      fileClass.filetypes.forEach((fileType: string) => {
        if (newFiletypeMap[fileType]) {
          throw new Error(`Filetype ${fileType} already exists`);
        }

        newFiletypeMap[fileType] = fileClass;
      });

      fileClass.targets?.forEach((target: string) => {
        compileMap[target] = (compileMap?.[target] ?? []).concat(
          fileClass.filetypes
        );
      });
    });

  return newFiletypeMap;
};

/**
 * Determine which file type class to use for our path.
 */
const getFiletypeClass = (path: Path, cfg: PageSettings) => {
  if (!filetypeMap) {
    filetypeMap = getFiletypeMap(cfg);
  }

  const extension = path.extension;
  if (!extension || !filetypeMap[extension]) {
    console.log(
      `We don't have a filetype mapping for files with extension ${extension}. Assuming plaintext for file at path '${path.toString()}'.`
    );

    return TextFile;
  }

  return filetypeMap[extension];
};

/**
 * Given the source path of a file, return the appropriate file class.
 * @param {string} incomingPath - The source path of the file.
 * @param {Object} options - Additional options.
 * @returns {Object} The appropriate file class.
 */
const readFile = (
  pathArg: Path | string,
  cfg: PageSettings
): File | undefined => {
  const path = Path.create(pathArg).normalize();

  if (!path.exists()) {
    return undefined;
  }

  const FiletypeClass = getFiletypeClass(path, cfg);

  let maybeFile = FiletypeClass.create(path, cfg);
  if (maybeFile) return maybeFile;

  // if we couldn't find the file at all, promote it to a source file.
  const targetExtension = path.extension;

  // If we have no target extension and can't find the file, assume it's a directory
  // Lop off the /index at the end
  if (!targetExtension) {
    console.log("Snagging parent", path.parent.toString());
    return readFile(path.parent, cfg);
  }

  for (const sourceExtension of compileMap[targetExtension]) {
    const nextPath = path.replaceExtension(sourceExtension);
    const sourceFile = readFile(nextPath, cfg);

    // Our custom standardizes on using target extension to index.
    // @ts-ignore
    const res = sourceFile?.[targetExtension]?.(cfg);
    if (res) return res;
  }
};

export { readFile };
