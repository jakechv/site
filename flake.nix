{
  description = "jake website";

  inputs = {
    nixpkgs.url = "nixpkgs/nixos-unstable";
    utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, utils }:
    utils.lib.eachDefaultSystem (system:
      let
        inherit (lib) attrValues;
        pkgs = import nixpkgs { inherit system; };
        lib = pkgs.lib;

      in rec {

        devShell = with pkgs; mkShell {
          name = "site";
          buildInputs = [
            sbcl
            inotify-tools
            openssl
            sqlite
          ];
          shellHook = ''
            export LD_LIBRARY_PATH=${pkgs.lib.makeLibraryPath([pkgs.openssl])}:${pkgs.lib.makeLibraryPath([pkgs.sqlite])}
          '';
        };
      });
}