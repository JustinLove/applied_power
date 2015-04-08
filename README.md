# Applied Power

Economy bar that focuses on how much metal is being spent, and what is limiting that spending.

## Status

Effectively early access.  Expect things to be recolored, moved, removed, or introduced. There is still a fair bit of information design to do, but the major themes are in place.

## Major features

Inspired by Elodea's [Easy cookie cutter planetary annihilation build order #7 DIY edition](https://forums.uberent.com/threads/cookie-cutter-builds-for-new-players.59452/#post-1059439)

- Central location given to spent metal (applied power)
- Metal and energy arranged in pipelines
- Limiting factor highlighted

## Elements (2015-04-08)

The element that is currently limiting spent metal/applied build power is highlighted with yellow outline.  A green background suggests "do more of this", red X "do less of this"

Supplies are solid colors, think of them as the flow between blocks.  Demands are thin white lines, think of them as pipes that limit how much you can move.

### Left (metal) side:

[Estimated Build Power]-ditto-[Energy Efficiency]-Metal Demand-[Metal Supply]-supply & demand-[Metal Storage]-spent & demand-[Build Efficiency]

### Center:

*Spent Metal*

### Right (energy) side:

[Energy Spent/Metal Spent][Radar Strength(vanilla)]-spent & demand-[Energy Storage]-supply & demand-[Energy Supply/Metal Supply]-demand-[Energy Demand/Metal Demand]

- Energy Supply/Metal Supply: do you have enough energy for the metal you have
- Energy Demand/Build Power: what you target the supply ratio to

## Notable Missing Features

Does not account for shared economy.

## Conflicts

Any other mod which replaces the economy/status bar
