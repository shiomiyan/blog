{
  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs =
    {
      nixpkgs,
      flake-utils,
      ...
    }:
    flake-utils.lib.eachDefaultSystem (
      system:
      let
        pkgs = import nixpkgs { inherit system; };
      in
      {
        devShells.default = pkgs.mkShell {
          # Keep the shell focused on replacing mise. Project tooling still
          # comes from package.json so Node ecosystem versions stay centralized.
          packages = with pkgs; [
            nodejs_24
            pnpm
          ];
        };
      }
    );
}
