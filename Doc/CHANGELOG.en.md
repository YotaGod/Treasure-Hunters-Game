# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added
- Environment decoration assets (`Back Palm Trees`, `Ship Helm`).
- Sprite animations for palm trees (`palm_regular`, `palm_left`, `palm_right`).
- Implementation of one-way collision on palm tree platforms allowing players to jump through them from below.

### Changed
- Expanded upper block platforms containing enemies across all stages to ease player maneuvering and coin collection.
- Lowered the Y coordinate of tree trunks by 40 pixels making them easier to reach by jumping.
- Moved and focused cannon traps to Stage 5.

### Fixed
- Cloud visibility bug where clouds did not appear due to camera zoom and misaligned Y-axis parameters.
- Fixed physical hitbox synchronization on custom platform objects (where `refreshBody()` overwrote custom `setSize()` parameters).

## [1.0.0] - Initial Release
### Added
- Levels 1-4 with basic `GameScene` progression.
- Core physics feature with gravity and basic tile systems.
- Enemies (Patrol) and combat capability using a Sword.
- Scoring system and basic user interface (coins and health/life indicators).
- Game state transition to a Game Over screen when health depletes or the player falls into the abyss.
