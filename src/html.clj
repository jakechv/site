(ns html
  (:require
   path const
   [hiccup.core :as h]))

;; --- general ---

;; delimits paths in title and in body
(def ^:const path-delimiter " / ")

(defn metm [k v]
  [:meta {:name k :content v}])

(defn prop [k v]
  [:meta {:property k :content v}])

(defn script
  ([src] [:script {:src src :id src}])
  ([src body] [:script {:src src :id src} body]))

(defn css
  ([href] [:link {:rel "stylesheet" :type "text/css" :href href :id href}])
  ([href body] [:link {:rel "stylesheet" :type "text/css" :href href :id href} body]))

(defmacro favicon []
  [:link {:rel "icon" :type "image/x-icon" :href "/favicon/favicon.ico"}]
  [:link {:rel "apple-touch-icon" :href "/favicon/apple-touch-icon.png"}])

(defn make-path-list [path]
  (path/split (path/remove-prefix path const/target-dir)))

(defn collect-folder-paths-string [path-list title]
  (if (empty? (rest path-list))
    title
    (str (collect-folder-paths-string (rest path-list) title) path-delimiter (first path-list))))

(defn head
  "A page header that works for all pages"
  [path title]
  [:head
   [:meta {:charset "UTF-8"}]
   [:title (str (collect-folder-paths-string (make-path-list path) title) path-delimiter const/site-name)]
   (metm "viewport" "width=device-width,initial-scale=1.0")
   (prop "og:title" title)
   (prop "og:type" "website")
   (prop "og:url" const/target-url)
   (prop "og:site_name" const/site-name)
   (metm "description" "hi") ;; TODO
   ;; TODO pull this information from the articles
   (metm "keywords" "Operating Systems, webring, programming, languages")
   (metm "author" "Jake Chvatal")
   (metm "robots" "index,follow")

   ;; TODO: keep this synced with global theme somehow?
   [:meta {:name "theme-color" :media "(prefers-color-scheme: light)" :content "white"}]
   [:meta {:name "theme-color" :media "(prefers-color-scheme: dark)" :content "#111"}]
   (favicon)

   [:link {:rel "manifest" :href "/manifest.json"}]

   (css "/style.css")
   (css "/global.css")
   (script "/lib.js")

   (css "/elements.css")
   [:script {:src "/elements.js" :id "/elements.js" :defer true}]
   ;; TODO: highlight.js
   ])

(defn ->string
  "Serialize Hiccup-compatible data to a string"
  [hiccup-struct]
  (str "<!DOCTYPE html>" (h/html hiccup-struct)))

;; --- sidebar
