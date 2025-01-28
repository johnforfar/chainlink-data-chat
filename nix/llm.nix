{ config, lib, pkgs, ... }:

let
  cfg = config.services.chainlink-ai-search;
  modelFiles = [
    "DeepSeek-R1-UD-IQ1_S-00001-of-00003.gguf"
    "DeepSeek-R1-UD-IQ1_S-00002-of-00003.gguf"
    "DeepSeek-R1-UD-IQ1_S-00003-of-00003.gguf"
  ];
  modelConfig = if pkgs.stdenv.isAarch64 then {
    gpuLayers = 0;
    contextSize = 4096;
  } else {
    gpuLayers = cfg.llm.gpuLayers;
    contextSize = cfg.llm.contextSize;
  };
in {
  options = {
    services.chainlink-ai-search.llm = {
      enable = lib.mkEnableOption "Enable local LLM service";
      
      modelDir = lib.mkOption {
        type = lib.types.str;
        default = "/var/lib/chainlink-llm";
        description = "Directory to store model files";
      };

      temperature = lib.mkOption {
        type = lib.types.float;
        default = 0.6;
        description = "Sampling temperature";
      };
      
      contextSize = lib.mkOption {
        type = lib.types.int;
        default = 8192;
        description = "Context window size";
      };

      gpuLayers = lib.mkOption {
        type = lib.types.int;
        default = 61;
        description = "Number of layers to offload to GPU";
      };
    };
  };

  config = lib.mkIf cfg.llm.enable {
    systemd.services.chainlink-llm-setup = {
      description = "Download and setup DeepSeek R1 model";
      before = [ "chainlink-llm.service" ];
      script = ''
        mkdir -p ${cfg.llm.modelDir}
        cd ${cfg.llm.modelDir}
        
        ${lib.concatMapStrings (file: ''
          if [ ! -f "${file}" ]; then
            ${pkgs.curl}/bin/curl -L -o ${file} \
              "https://huggingface.co/unsloth/DeepSeek-R1-GGUF/resolve/main/DeepSeek-R1-UD-IQ1_S/${file}"
          fi
        '') modelFiles}

        ${pkgs.llama-cpp}/bin/llama-gguf-split --merge \
          ${cfg.llm.modelDir}/${builtins.head modelFiles} \
          ${cfg.llm.modelDir}/merged_model.gguf
      '';
      serviceConfig = {
        Type = "oneshot";
        User = "chainlink";
      };
    };

    systemd.services.chainlink-llm = {
      description = "DeepSeek R1 LLM Service";
      wantedBy = [ "multi-user.target" ];
      after = [ "network.target" "chainlink-llm-setup.service" ];
      requires = [ "chainlink-llm-setup.service" ];
      
      serviceConfig = {
        ExecStart = ''
          ${pkgs.llama-cpp}/bin/llama-server \
            --model ${cfg.llm.modelDir}/merged_model.gguf \
            --ctx-size ${toString modelConfig.contextSize} \
            --n-gpu-layers ${toString modelConfig.gpuLayers} \
            --temp ${toString cfg.llm.temperature} \
            --port 8080
        '';
        Restart = "always";
        User = "chainlink";
        WorkingDirectory = cfg.llm.modelDir;
      };
    };

    users.users.chainlink = {
      isSystemUser = true;
      group = "chainlink";
      home = cfg.llm.modelDir;
      createHome = true;
    };

    users.groups.chainlink = {};
  };
} 