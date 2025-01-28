{ config, lib, pkgs, ... }:

{
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
    };
    
    authentication = ''
      host all all 127.0.0.1/32 trust
      host replication replicator all md5
    '';
  };
} 