import TextFile from "./text";
import { HtmlPage } from "../../html";
import type { PageSettings } from "../../types/site";

/**
 * A source code file.
 */
class SourceFile extends TextFile {
  // If this file is 'pretending' to be another file,
  // the file that this was wrapped around is accessible here.

  // This allows us to pull tricks like asking questions about a
  // javascript file when the actual file is written in typescript,
  // converting configuration files into others on the fly,
  // reading SCSS as CSS, etc.
  public fakeFileOf?: SourceFile;

  // The source file types that this file represents.
  public static filetypes: string[] = [];

  // The supported target file types of this file, if any.
  // If a file class supports a specific target <t>,
  // the file must also have a function <t>() to call
  // that produces a file with the type of that target.
  public static targets: string[] = [];

  asHtml(settings: PageSettings) {
    return HtmlPage.create(
      ["Article", { file: this, ...settings }, ["SourceBlock", { file: this }]],
      settings
    );
  }
}

export default SourceFile;
