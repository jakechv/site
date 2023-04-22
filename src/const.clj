(ns const)

(def source-url "https://github.com/jakeisnt/wiki")
(def source-dir "/home/jake/wiki")

(def target-url "https://jake.isnt.online")

(def current-repo "/home/jake/site")
(def target-dir (str current-repo "/docs"))

(def deployment-branch "production")

(def wiki-paths ["pages" "scripts" "journals"])

(def local-port 4242)

(def profiles
  [{:name "Are.na"
    :url "https://are.na/jake-isnt"
    :user "jake-isnt"}
   {:name "Mastodon"
    :url "https://merveilles.town/@jakeisnt"
    :user "jakeisnt"}
   {:name "Twitter"
    :url "https://twitter.com/jakeissnt"
    :user "jakeissnt"}
   {:name "GitHub"
    :url "https://github.com/jakeisnt"
    :user "jakeisnt"}
   {:name "Gitlab"
    :url "https://gitlab.com/jakeisnt"
    :user "jakeisnt"}
   {:name "sourcehut"
    :url "https://sr.ht/~jakeisnt/"
    :user "jakeisnt"}
   {:name "YouTube"
    :url "https://www.youtube.com/@jakeisnt"
    :user "jakeisnt"}
   {:name "Email"
    :url "mailto://jake+website@isnt.online"
    :user "jake @ ~"}
   {:name "Google Maps"
    :url "https://www.google.com/maps/contrib/109731430420919295575/"
    :user "Jake Chvatal"}
   {:name "OpenStreetMaps"
    :url "https://www.openstreetmap.org/user/jakeisnt"
    :user "jakeisnt"}
   {:name "Hacker News"
    :url "https://news.ycombinator.com/user?id=jakeisnt"
    :user "jakeisnt"}
   {:name "Instagram"
    :url "https://instagram.com/jakeisnt"
    :user "jakeisnt"}
   {:name "read.cv"
    :url "https://read.cv/jakeisnt"
    :user "jakeisnt"}
   {:name "LinkedIn"
    :url "https://www.linkedin.com/in/jacob-chvatal"
    :user "jacob-chvatal"
    :deprecated true}])

(def personal
  {:name "Jake Chvatal"
   :location "Boston, MA"
   :occupation "Software Engineer"
   :pronouns ["he" "him" "his"]
   :education {:degree "B.S. Computer Science"
               :school "Northeastern University"
               :url "https://www.khoury.northeastern.edu/"}})

(def site-name (:name personal))

;; records when the build was last updated
(def last-modified-file "docs/last-modified.txt")