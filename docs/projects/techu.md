# Techu

## Snapshot
- CV status: Archived or optional as a standalone project entry, but active as an experience entry
- Timeframe: 2023 onward across multiple codebases
- Type: strategy card game product family

## Detailed Notes
- Techu is more than a single repo. The source set includes the original Unity game, an RL environment, and a later web implementation.
- The Unity project shows the production game: card, board, and turn systems; Photon multiplayer; PlayFab data and progression; Firebase notifications; analytics; IAP support; and AI modules including minimax and Monte Carlo Tree Search.
- `TechuRL` formalizes the rules in a Gymnasium environment and trains agents with MaskablePPO, which is useful evidence that the game logic was abstracted for RL experiments rather than only hard-coded into the client.
- `TechuOnTheWeb` recreates the game in Next.js, React, TypeScript, Tailwind, Framer Motion, and Zustand, with the rules written out clearly for a browser-based experience.

## Tech and Systems
- Unity, C#, Photon, PlayFab, Firebase
- Python, Gymnasium, Stable-Baselines3, MaskablePPO
- Next.js, React, TypeScript, Tailwind, Zustand

## Source Material
- CV bullet source: `CV/subsections/projects/techu.tex`
- Portfolio site: `https://danial-kord.github.io/`
- Product site referenced by CV: `https://techuonthechair.com`
- Unity repo: `C:\Projects\Techu`
- RL repo: `C:\Projects\TechuRL`
- Web repo: `C:\Projects\TechuOnTheWeb`

## Resume Guidance
- If space allows, treat Techu as a product family and separate game systems from AI experimentation.
- If space is tight, keep Techu in experience and let this project file serve as the deeper background note.
