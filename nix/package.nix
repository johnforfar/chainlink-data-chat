{ pkgs, lib, system ? pkgs.system, optimizeFor ? "x86" }:
let
  # Define supported systems
  supportedSystems = [ "x86_64-linux" "aarch64-linux" "aarch64-darwin" ];
in
pkgs.buildNpmPackage {
  pname = "chainlink-ai-search";
  version = "1.0.0";
  src = ../nextjs-app;

  # Add both nodejs and makeWrapper
  nativeBuildInputs = with pkgs; [ 
    makeWrapper 
  ];

  buildInputs = with pkgs; [
    nodejs_20
    cacert
  ];

  #npmDepsHash = lib.fakeHash;
  npmDepsHash = "sha256-2a3a6kVxySv7xO+NQ2bVGXzJ5r6W6sVnrE8AYLadXLk=";

  NEXT_TELEMETRY_DISABLED = "1";
  NODE_OPTIONS = "--max_old_space_size=4096";
  SSL_CERT_FILE = "${pkgs.cacert}/etc/ssl/certs/ca-bundle.crt";

  # Modify the build phase to handle path resolution
  buildPhase = ''
    runHook preBuild
    export HOME=$(mktemp -d)
    npm run build
    runHook postBuild
  '';

  postBuild = ''
    # Add a shebang to the server js file, then patch the shebang to use a
    # nixpkgs nodes binary
    sed -i '1s|^|#!/usr/bin/env node\n|' .next/standalone/server.js
    patchShebangs .next/standalone/server.js
  '';

  installPhase = ''
    runHook preInstall

    mkdir -p $out/{share,bin}

    cp -r .next/standalone $out/share/homepage/
    # cp -r .env $out/share/homepage/
    cp -r public $out/share/homepage/public

    mkdir -p $out/share/homepage/.next
    cp -r .next/static $out/share/homepage/.next/static

    # https://github.com/vercel/next.js/discussions/58864
    ln -s /var/cache/nextjs-app $out/share/homepage/.next/cache

    chmod +x $out/share/homepage/server.js

    # we set a default port to support "nix run ..."
    makeWrapper $out/share/homepage/server.js $out/bin/chainlink-ai-search \
      --set BACKEND_PORT "3003" \
      --set BACKEND_HOST "0.0.0.0" \
      --set-default NODE_ENV "production"

    runHook postInstall
  '';

  doDist = false;

  meta = {
    mainProgram = "chainlink-ai-search";
    platforms = supportedSystems;
  };
}
