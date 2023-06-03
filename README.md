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
- Setup a barebones Vue frontend + Node backend
- Melee combat
    - Backend responds with the combat log that the frontend will "play"
    - Backend records "end" of combat to prevent bypass of fignt "replay"
    - Combat is limited to x seconds after which the one with lower level withdraws
