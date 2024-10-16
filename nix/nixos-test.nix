{ pkgs, system, ... }:
let
  testing = import "${toString pkgs.path}/nixos/lib/testing-python.nix" { inherit system pkgs; };
in
testing.makeTest {
  name = "nextjs-app";

  nodes.machine =
    { pkgs, ... }:
    {
      imports = [ ./nixos-module.nix ];
      services.nextjs-app = {
        enable = true;
        port = 8080;
      };
    };

  testScript = ''
    # Ensure the service is started and reachable
    machine.wait_for_unit("nextjs-app.service")
    machine.wait_for_open_port(8080)
    machine.succeed("curl --fail http://127.0.0.1:8080")
  '';
}
