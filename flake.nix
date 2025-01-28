{
  description = "AI-driven Chainlink Price Feed Insights with PostgreSQL and Vector Search";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs?ref=nixos-unstable";
    systems.url = "github:nix-systems/default";
    llama-cpp.url = "github:ggerganov/llama.cpp";
  };

  outputs = { self, nixpkgs, systems, llama-cpp }:
    let
      eachSystem = f:
        nixpkgs.lib.genAttrs (import systems) (
          system:
          f {
            inherit system;
            pkgs = nixpkgs.legacyPackages.${system};
          }
        );
    in
    {
      nixosModules.default = { config, ... }: {
        imports = [
          ./nix/nixos-module.nix
          ./nix/postgresql.nix
          ./nix/llm.nix
        ];

        services.chainlink-ai-search = {
          enable = true;
          llm.enable = true;
          database = {
            host = "localhost";
            port = 5432;
          };
        };
      };

      packages = eachSystem (
        { system, pkgs }: {
          default = pkgs.callPackage ./nix/package.nix { inherit system; };
        }
      );

      apps = eachSystem (
        { system, pkgs }: {
          default = {
            type = "app";
            program = "${self.packages.${system}.default}/bin/chainlink-ai-search";
          };
        }
      );
    };
}
