# Tenkay invitation resolver

This deliberately small public site keeps Tenkay invitation links stable while
the development server remains behind a rotating LocalTunnel address.

The invitation token is stored in the URL fragment, which browsers do not send
to GitHub Pages. The page reads the endpoint document in this repository,
accepts only an HTTPS `*.loca.lt` address, and forwards the browser to the
matching invitation page.

`tenkay-endpoint.json` is also Tenkay's endpoint-discovery document. The local
tunnel manager updates it whenever the development server receives a new
LocalTunnel address.

This repository contains no Tenkay application source, credentials, user data,
analytics, or private configuration.
