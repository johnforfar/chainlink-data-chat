{ config, lib, pkgs, ... }:

let
  cfg = config.services.chainlink-ai-search;
in {
  config = lib.mkIf cfg.enable {
    systemd.services.chainlink-ai-search = lib.mkMerge [
      {
        after = [ "postgresql.service" ];
        requires = [ "postgresql.service" ];
        environment = {
          POSTGRES_HOST = cfg.database.host;
          POSTGRES_PORT = toString cfg.database.port;
          POSTGRES_USER = "chainlink";
          POSTGRES_PASSWORD = "";  # Using trust auth for localhost
          POSTGRES_DB = "chainlink_data";
        };
      }
    ];
  };
} 