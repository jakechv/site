(load "~/quicklisp/setup.lisp")
(load "./src/util.lisp")
(load "./src/path.lisp")
(load "./src/contract.lisp")

(ql:quickload :spinneret)
(ql:quickload 'css-lite)
(ql:quickload :parenscript)

(defpackage comp
  (:use :cl :contract))

(in-package :comp)

(defun checkbox-menu ()
  "An interactive menu that allows the user to optionally enable js features."
  (spinneret::with-html
      (:div :class "checkbox-menu"
            (:input
             :type "checkbox"
             :id "hypothesis-checkbox"
             :checked "false"
             :onclick (parenscript:ps (toggle-hypothesis))
             "hypothes.is"))))


;; i want this site to feel like the navigation of a file system;
;; view version control, depth, what's in current dir;
;; support files of all types;
;; ideally this just doubles as a source code viewer, honestly
;; should mousing over reveal alternative things for this path? is that right?

;; can mouse over to view three options; can click '...' (or scroll?) to view more?

;; idea: route editor!
;; sidebar allows you to interactively add parts to your url
;; press some '+' button
;; adds a slash and a box
;; shows a list of all the possible things taht could go there
;; you type and search or just click on one of them and you're taken to that route,

;; i would love to actually have this in the browser,
;; but for now this is fine

;; also, for the parser to work properly with this page,
;; we might want to group some things into paragraphs
;; we might also want to see what we can do about that url thing on mobile;
;; maybe it's a good idea to move it to the top of the screen and fix it there

;; also: the name of the website should reflect the path. how?
;; it shouldn't be literal, but it should be aesthetically similar.

(defun collect-folder-paths-help (root ls)
  "
   Convert a list of folder paths into a list of links.

   Examples:
    () -> (:a :href jake/indexx)
    (\"filename\") -> (:a :href jake/filename)
    (\"p\" \"filename\") -> (:a :href jake/p/index) (:a :href jake/p/filename)
    (\"a\" \"p\" \"filename\")  -> (:a :href jake/a/index) (:a :href jake/a/p/index) (:a :href jake/a/p/filename)
  "
  (cond
    ((endp ls) nil)
    ((consp ls)
     (let* ((fst (car ls))
            (next-root (concatenate 'string root "/" fst)))
       (spinneret::with-html
           (:span " / ")
         (:a :href (concatenate 'string next-root "/" "index.html") fst)
         (collect-folder-paths-help next-root (cdr ls)))))))

(defun collect-folder-paths (root path)
  (collect-folder-paths-help (string-right-trim "/" root) (fp::pathdir path)))

(defun concat-around (ls around-char)
  "Concatenate the elements of a list of strings around a character."
  (cond
    ((endp ls) nil)
    ((endp (cdr ls)) (car ls))
    (t (concatenate
        'string
        (car ls)
        around-char
        (concat-around (cdr ls) around-char)))))

(defun final-path (root path)
  "Construct a final path link for the page."
  (print path)
  (concatenate
   'string
   root
   (concat-around (fp::pathdir path) "/")
   "/"
   (pathname-name path)
   "."
   (pathname-type path)))

;; "Display a sidebar for a page, given its root path."
(contract::defcontract sidebar (path root)
    (lambda (path root) (and (pathnamep path) (stringp root)))
  (print root)


  (let ((path (fp::remove-root path root)))
    (spinneret::with-html
      (:div
       :class "sidebar"
       (:a :href (concatenate 'string root "/index.html") " ~ ")
       (concatenate
        'list
        (collect-folder-paths root path)
        (list
         (:span " / ")
         (:a :href (final-path root path) (pathname-name path))))))))
