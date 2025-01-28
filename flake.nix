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
      nixosModules.default = { config, lib, pkgs, ... }: {
        imports = [ ./nix/postgresql.nix ./nix/vector-search.nix ./nix/llm.nix ];
        
        services.chainlink-ai-search = {
          enable = lib.mkEnableOption "Enable the AI chatbot service";
          
          database = {
            host = lib.mkOption {
              type = lib.types.str;
              default = "localhost";
              description = "PostgreSQL database host";
            };
            
            port = lib.mkOption {
              type = lib.types.port;
              default = 5432;
              description = "PostgreSQL database port";
            };
          };
          
          llm = {
            model = lib.mkOption {
              type = lib.types.str;
              default = "unsloth/DeepSeek-R1-GGUF";
              description = "DeepSeek R1 model path";
            };
            
            quantization = lib.mkOption {
              type = lib.types.str;
              default = "UD-IQ1_S";
              description = "Quantization type (UD-IQ1_S for 1.58-bit)";
            };
            
            gpuLayers = lib.mkOption {
              type = lib.types.int;
              default = 61;
              description = "Number of layers to offload to GPU";
            };
          };
        };
      };
    };
}
