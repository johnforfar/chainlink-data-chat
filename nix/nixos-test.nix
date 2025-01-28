{ pkgs, system, ... }:
let
  testing = import "${toString pkgs.path}/nixos/lib/testing-python.nix" { inherit system pkgs; };
in
testing.makeTest {
  name = "chainlink-ai-search";

  nodes.machine =
    { pkgs, ... }:
    {
      imports = [ ./nixos-module.nix ];
      services.chainlink-ai-search = {
        enable = true;
        port = 8080;
      };
    };

  testScript = ''
    # Ensure the service is started and reachable
    machine.wait_for_unit("chainlink-ai-search.service")
    machine.wait_for_open_port(8080)
    machine.succeed("curl --fail http://127.0.0.1:8080")
  '';
}
