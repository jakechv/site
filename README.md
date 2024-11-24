# jake.isnt.online

This is the index of my personal website found [here](https://jake.isnt.online).
It can be thought of as a projection of my wiki and github repos!
100% score on the [Lighthouse audit](https://www.foo.software/lighthouse).

## Goals
- Personal landing page with links
- No external resources loaded 
- SEO Optimized
- Ten packets (to load instantly)

## Why JS?
Javascript is the language of the internet.
Code should run on the client, on the server, at build time, and anywhere in between.
This infrastructure facilitates that.

## Running
Dependencies are managed with Nix. Install `nix` and `direnv`. Open the folder in your system of choice, and all dependencies will install.

The flake has one command: `site`. The CLI will tell you what you can do with it :  )

## Other principles
[originally here](https://github.com/jakeisnt/site/issues/71)

- markup-first. any javascript should operate on static markup to augment it. the website should look just fine if viewed as a plain html page without external dependencies.
- transparent. as much of the external build process of data flow should be visualized. any data available about files should be made visible to the end user.
- communicative. all data presented should be beautiful and functional.
- creative and streamlined. the site should express lots of carefully chosen and honed details that make it feel perfect.

visualize information; don't store it. the site should never be the source of truth for data. data should come from markup, from clojure, from postgres, from other data sources, and visualized via this site.

To test file generation: `serve ./docs --config ../.serve.json`
