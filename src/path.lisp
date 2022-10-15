(defpackage path
  (:use :cl))

(in-package :path)

;; Utilities for manipulating files.

(defun remove-until (ls old-root)
  "Assumes old-root and ls parts are equal"
  (if (endp old-root)
      ls
      (remove-until (cdr ls) (cdr old-root))))

(defun remove-root (path root)
  (make-pathname
   :directory (swap-root (pathdir path) (pathdir root) '())
   :name (pathname-name path)
   :type (pathname-type path)))

(defun swap-root (cur-dirs old-root new-root)
  "Compute a new root directory given the old and the new."
  (cons :absolute (concatenate 'list new-root (remove-until cur-dirs old-root))))

(defun pathdir (path)
  (cdr (pathname-directory (merge-pathnames path))))

(defun update-struct (struct &rest bindings)
  "Update a value of a structure immutably."
  (loop
    with copy = (copy-structure struct)
    for (slot value) on bindings by #'cddr
    do (setf (slot-value copy slot) value)
    finally (return copy)))

(defun rename (cur-path new-name)
  "Rename a file immutably."
  (merge-pathnames new-name cur-path))

(defun change-file-path (current-path old-root new-root)
  "Change a file path to a new name. That name is html."
  (make-pathname
   :directory (swap-root
               (pathdir current-path)
               (pathdir old-root)
               (pathdir new-root))
   :name (pathname-name current-path)
   :type "html"))