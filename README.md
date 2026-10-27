# eCOA avatar games

A small library of multiplayer browser games where everyone plays as the same little dressable avatar.

## Games

| Game | File | Status |
| --- | --- | --- |
| Race to FPI | `index.html` | Finished |

## Shared code

Every game loads the files in `shared/` and adds only its own rules, level and screens.

| File | What it gives a game |
| --- | --- |
| `style.css` | Colours, fonts, cards, buttons, touch pad, lobby panels, leaderboard and podium styles |
| `core.js` | Canvas (`cv`, `cx`), `fitCanvas`, `whenFontsReady`, drawing helpers (`rr`, `txt`, `mix`, `C`, `FD`), sound (`beep`, `SFX`, `muted`), particles (`burst`, `stepParts`, `drawParts`), `rng`, `clamp`, `fmt`, `esc`, `hashStr` |
| `avatar.js` | `drawRunner` and the outfit lists (`HATS`, `EYES`, `GLS`, `OUTS`, `PATS`, `SHOES`), `drawDressPreview` |
| `room.js` | Team rooms: `use` (rooms inside Claude), `relayJoin` (WebSocket relay elsewhere), `netMsg`, `showErr`, `copyText` |
| `lobby.js` | Player colours (`PCOL`, `SW`), the saved `look`, `randLook`, `applyLook`, the dress-up panel (`buildDress`), emote buttons (`emoBtn`) and room roster markup |
| `board.js` | Live leaderboard: `renderBoard(rows)`, `setBoardTitle`, `clearBoard`, `bdId` |
| `input.js` | Key map (`KM`), on-screen buttons (`bindBtn`), mute, exit and leave-room buttons |

The avatar look is stored in the browser under `ecoa-look`, so a player's outfit carries over from one game to the next.

## Adding a game

1. Copy the page markup from `index.html`: everything inside `<main id="app">`, the font and `shared/style.css` links, and the `shared/*.js` script tags in the same order.
2. In the game's own script, define what the shared files expect:
   - `W` and `H`, the canvas size in game units
   - `state`, with at least `screen` and `cam`
   - `inp`, the current input (`l`, `r`, `j`, `jp`)
   - `myName`, `myCol`, `room` and `roomCode`
   - `rosterRows()`, which returns `[{name, col, rd, me, host}]`
   - `leaveRoom()`
3. Write the game's level, rules, results and a `keydown` handler (using `KM`).
4. Give the game its own room-code prefix when joining, so players in different games don't land in the same room.
