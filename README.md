# Project Flux

A web-based, shared-world RPG based on an over-engineered backend.

Over-engineered aspects include (but is not limited to):
- Kubernetes
- API gateway
- ***true*** microservices
- message queue

Some possible microservices include:
- authentication
- location
- combat
- loot drop
- character

Inspirations:
- Ragnarok
    - slot + card system
- Diablo series
    - loot system
- Dungeons and Dragons
    - emergent narrative
- OpenKore
    - automated combat
    - action/combat logs

Timeline of Development
- :heavy_check_mark: Setup a barebones Vue frontend + Node backend
- :heavy_check_mark: Secure API endpoints
- Melee combat
    - Backend responds with the combat log that the frontend will "play"
    - Backend records "end" of combat to prevent bypass of fignt "replay"
    - Combat is limited to x seconds after which the one with lower level withdraws

Ideas
- Combat has 3 modes, in order of priority:
    - Passive mode
        - Player is online but most combat is automated
        - Player has some control over character
        - x1 experience and drop rates
        - Minimal UI, OpenKore-like experience
    - Offline mode
        - Player is logged out
        - x0.25 experience and drop rates
        - Limit of 24 hours
        - No UI, results are calculated upon logging back in
    - Active mode
        - Player is online and combat is fully manual
        - Player has full control over character
        - x3 experience and drop rates
        - Nice and fancy GUI (maybe even sprites)
