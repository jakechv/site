(defn main [_ _ _ _]
  {:depends-on [{:src  "/components/lastfm/lastfm.js"}
                {:src "/components/lastfm/lastfm.scss"}]
   :body [:div.lastfm-now-playing-box]})
