# eCOA avatar games

A small library of multiplayer browser games where everyone plays as the same little dressable avatar.

## Games

`index.html` is the game picker. Old invite links (`index.html?room=<code>`) are forwarded to Race to FPI; links with `&game=stomp` go to Stomp the Findings.

| Game | File | Room prefix | Status |
| --- | --- | --- | --- |
| Race to FPI | `race.html` | none | Finished |
| Stomp the Findings | `stomp.html` | `stomp-` | First version |

### Stomp the Findings

A single-screen stomp arena for up to 16 players, in the style of the arcade Mario Bros.

- UAT findings (typos, broken skip logic, "alarm will not fire") walk the platforms. Land on one to squash it. Touch one from the side and you are knocked down for a second.
- Critical findings are big and purple and take two stomps.
- Whoever squashes the most findings wins. A critical finding counts once, for the player who lands the second stomp. Ties go to whoever reached that number first.
- Stomping another player bounces you high and squashes them for a moment. It doesn't change anyone's score.
- Four waves, each faster than the last: UAT Round 1, UAT Round 2, Site Training and Go-Live. A Protocol Amendment boss ends the last wave, and its health grows with the number of players.
- Power-ups: coffee (speed boost) and a compliance coin (short shield).
- A shared go-live bar fills as the team stomps. Squashing the amendment takes the study live. Boss stomps don't score, and the podium ranks players by findings squashed.

In a team room the earliest player in the game is the host. The host runs the findings, boss, power-ups, waves and scores, and sends a snapshot ten times a second. Each player runs their own avatar and reports stomps and pickups to the host. If the host leaves, the next earliest player carries on from the last snapshot. Solo play adds five bots.

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

1. Copy the page markup from `race.html` or `stomp.html`: everything inside `<main id="app">`, the font and `shared/style.css` links, and the `shared/*.js` script tags in the same order.
2. In the game's own script, define what the shared files expect:
   - `W` and `H`, the canvas size in game units
   - `state`, with at least `screen` and `cam`
   - `inp`, the current input (`l`, `r`, `j`, `jp`)
   - `myName`, `myCol`, `room` and `roomCode`
   - `rosterRows()`, which returns `[{name, col, rd, me, host}]`
   - `leaveRoom()`
3. Write the game's level, rules, results and a `keydown` handler (using `KM`).
4. Give the game its own room-code prefix when joining, so players in different games don't land in the same room.
5. Add a card for it to `index.html`.
