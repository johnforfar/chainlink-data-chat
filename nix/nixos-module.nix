{
  config,
  pkgs,
  lib,
  ...
}:
let
  cfg = config.services.chainlink-ai-search;
  chainlink-ai-search = pkgs.callPackage ./package.nix { };
in
{
  options = {
    services.chainlink-ai-search = {
      enable = lib.mkEnableOption "Enable the nextjs app";

      hostname = lib.mkOption {
        type = lib.types.str;
        default = "0.0.0.0";
        example = "127.0.0.1";
        description = ''
          The hostname under which the app should be accessible.
        '';
      };

      port = lib.mkOption {
        type = lib.types.port;
        default = lib.toInt (builtins.getEnv "BACKEND_PORT" or "3003");
        example = 3003;
        description = ''
          The port under which the app should be accessible.
        '';
      };

      openFirewall = lib.mkOption {
        type = lib.types.bool;
        default = true;
        description = ''
          Whether to open ports in the firewall for this application.
        '';
      };

      siteName = lib.mkOption {
        type = lib.types.str;
        default = "Chainlink AI Search";
        example = "Chainlink AI Search";
        description = ''
          Title of the webpage.
        '';
      };

      siteDescription = lib.mkOption {
        type = lib.types.str;
        default = "AI-powered search for Chainlink price feeds and CCIP data.";
        example = "AI-powered search for Chainlink price feeds and CCIP data.";
        description = ''
          Description of the webpage.
        '';
      };

      llmPort = lib.mkOption {
        type = lib.types.port;
        default = 8080;
        description = "Port for the LLM service";
      };
    };
  };

  config = lib.mkIf cfg.enable {
    # Main Next.js frontend service
    systemd.services.chainlink-ai-search = {
      wantedBy = [ "multi-user.target" ];
      description = "Next.js Frontend App";
      after = [ "network.target" "chainlink-ai-llm.service" ];
      requires = [ "chainlink-ai-llm.service" ];
      
      environment = {
        BACKEND_HOST = cfg.hostname;
        BACKEND_PORT = toString cfg.port;
        NEXT_PUBLIC_SITENAME = cfg.siteName;
        NEXT_PUBLIC_SITEDESCRIPTION = cfg.siteDescription;
        LLM_SERVICE_URL = "http://localhost:${toString cfg.llmPort}";
      };

      serviceConfig = {
        ExecStart = "${lib.getExe chainlink-ai-search}";
        DynamicUser = true;
        CacheDirectory = "nextjs-app";
      };
    };

    # LLM backend service
    systemd.services.chainlink-ai-llm = {
      wantedBy = [ "multi-user.target" ];
      description = "LLM Backend Service";
      after = [ "network.target" ];
      
      environment = {
        LLM_PORT = toString cfg.llmPort;
        LLM_HOST = "0.0.0.0";
      };

      serviceConfig = {
        ExecStart = "${lib.getExe chainlink-ai-search}-llm";
        DynamicUser = true;
      };
    };

    networking.firewall = lib.mkIf cfg.openFirewall {
      allowedTCPPorts = [ cfg.port cfg.llmPort ];
    };
  };
}
