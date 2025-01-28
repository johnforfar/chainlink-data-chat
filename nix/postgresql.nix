{ config, lib, pkgs, ... }:

let
  cfg = config.services.chainlink-ai-search;
in {
  config = lib.mkIf cfg.enable {
    services.postgresql = {
      enable = true;
      package = pkgs.postgresql_15;
      enableTCPIP = true;
      
      extraPlugins = with pkgs.postgresql15Packages; [
        pgvector
      ];
      
      settings = {
        shared_buffers = "4GB";
        work_mem = "64MB";
        maintenance_work_mem = "512MB";
        max_parallel_workers = "8";  # Match CPU cores
        effective_cache_size = "12GB";  # 75% of available RAM
        random_page_cost = "1.1";  # Assuming SSD storage
        listen_addresses = "*";
      };
      
      authentication = pkgs.lib.mkForce ''
        local all all trust
        host all all 127.0.0.1/32 trust
        host all all ::1/128 trust
      '';

      # Add performance-related settings
      initdbArgs = [
        "--data-checksums"
        "--locale=C"
      ];

      # Add vector-search configurations
      ensureDatabases = [ "chainlink_data" ];
      ensureUsers = [
        {
          name = "chainlink";
          ensureDBOwnership = true;
        }
      ];

      # Initialize pgvector extension
      initialScript = pkgs.writeText "vector-search-init.sql" ''
        \c chainlink_data;
        CREATE EXTENSION IF NOT EXISTS vector;
        
        CREATE TABLE IF NOT EXISTS price_feeds (
          id SERIAL PRIMARY KEY,
          data JSONB NOT NULL,
          embedding vector(384)
        );
        
        CREATE INDEX IF NOT EXISTS price_feeds_embedding_idx ON price_feeds 
        USING ivfflat (embedding vector_cosine_ops)
        WITH (lists = 100);
      '';
    };

    # Ensure the chainlink user exists
    users.users.chainlink = {
      isSystemUser = true;
      group = "chainlink";
      createHome = true;
    };

    users.groups.chainlink = {};
  };
} 