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
        default = 3000;
        example = 3000;
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
    };
  };

  config = lib.mkIf cfg.enable {
    systemd.services.chainlink-ai-search = {
      wantedBy = [ "multi-user.target" ];
      description = "Nextjs App.";
      after = [ "network.target" ];
      environment = {
        HOSTNAME = cfg.hostname;
        PORT = toString cfg.port;
        NEXT_PUBLIC_SITENAME = cfg.siteName;
        NEXT_PUBLIC_SITEDESCRIPTION = cfg.siteDescription;
      };
      serviceConfig = {
        ExecStart = "${lib.getExe chainlink-ai-search}";
        DynamicUser = true;
        CacheDirectory = "nextjs-app";
      };
    };

    networking.firewall = lib.mkIf cfg.openFirewall {
      allowedTCPPorts = [ cfg.port ];
    };
  };
}
