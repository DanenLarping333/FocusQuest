# FocusQuest

**One thing at a time.** A lightweight, public-friendly focus timer with tasks and a seven-day activity view. Built with plain HTML, CSS and JavaScript; no account, API key, package installation or build step.

Link:https://danenlarping333.github.io/FocusQuest/

## Features

- Configurable focus, short break and long break timers (25 / 5 / 15 minutes by default).
- Start, pause, resume, reset and skip. The next session starts manually.
- A long break after every four completed focus sessions.
- Add, select, complete and delete tasks; clear completed tasks.
- Daily completed sessions, focus minutes and task totals, plus a seven-day chart.
- Optional completion chime, keyboard controls through standard buttons, accessible labels and responsive layout.
- Browser-local persistence, including an active or paused timer.
- No third-party assets, analytics or network requests from the application itself.

## Try it

Extract the project, then double-click **index.html**. No installation is needed. Browser storage for file URLs varies; for dependable persistence, use the hosted HTTPS version or a local web server. No sample tasks or fabricated activity are included.

## Publish on GitHub Pages

1. Create a new public repository named `focusquest` in your GitHub account.
2. Upload the **contents** of this folder to the repository root on branch `main`, including `.github/workflows/pages.yml`. Do not upload the ZIP itself.
3. Under **Settings → Pages → Build and deployment**, select **GitHub Actions**.
4. Under **Actions → Deploy FocusQuest**, choose **Run workflow**. Future pushes to `main` deploy automatically.
5. Wait for the workflow to succeed and use the link shown in its deployment output. For `DanenLarping333/focusquest`, the expected address is `https://danenlarping333.github.io/focusquest/` once successfully deployed.

This package has not created a GitHub repository or published a live site. If your default branch has another name, update `branches: [main]` in the workflow.

If browser uploads omit the hidden `.github` folder, use GitHub's **Add file → Create new file**, enter `.github/workflows/pages.yml`, and paste the included workflow.

Reference: [GitHub Pages custom workflows](https://docs.github.com/en/pages/getting-started-with-github-pages/using-custom-workflows-with-github-pages).

## Data and timer behavior

Data is kept in `localStorage` under `focusquest.v1`, on each visitor's own browser. It is not shared between people or synced across devices. Clearing site data or private browsing can erase it. If storage is blocked, an in-page warning appears and the app remains usable for the current visit.

The timer uses an absolute end timestamp to recover after tab throttling or reload. If a session elapsed while closed, reopening records that single session on its completion date and prepares the next mode without starting it. Audio needs a user interaction and an open tab; sleeping devices and browser throttling may delay the chime. Changing the system clock affects the timer. Use one active tab for reliable progress; simultaneous edits in multiple tabs are not transactionally merged.

Only completed focus sessions count toward minutes and sessions. Skipped/reset sessions add no time. Selecting a mode or saving preferences resets the timer. Completing a task records it on that local calendar date; unchecking reverses it. Deleting or clearing a completed task preserves its historical completion count. A focus session never automatically marks a task done.

## Development and checks

Open the files in any code editor. With Node.js installed, run:

```sh
node --check app.js
node core.test.cjs
node app.test.cjs
```

The tests cover timing, expiry, break rotation, settings validation, local dates, restored sessions, duplicate-completion prevention, task text safety and completion totals. App integration tests use a small simulated DOM; they do not replace a real-browser visual or audio test.

Manual browser checklist: add and select a task; check/uncheck it; start/pause/resume; reload during a timer; try a one-minute focus session; verify sound after clicking Start; inspect mobile layout; close/reopen to check persistence.

## Files

- `index.html`: page structure and preferences dialog.
- `style.css`: responsive design.
- `core.js`: pure timer and validation helpers.
- `app.js`: interaction, history, audio and persistence.
- `*.test.cjs`: zero-dependency checks.
- `.github/workflows/pages.yml`: test and publish.

## License

MIT — you may use, modify and share this project. See LICENSE.

## Mochi, your cat companion

An original pixel-style SVG cat lives below the activity chart. Click it (or focus it with Tab and press Enter) to pet it. **Toss a ball** makes it chase a toy. During a running focus session it naps and ball play is disabled; pausing or starting a break wakes it. **Hide cat / Show cat** remembers your preference in this browser. Reduced-motion preferences disable the walking animation and use instant position changes. The companion needs no network, image downloads or permissions.

`pet.js` handles the companion independently of timer storage. Include this file when uploading the project. To try the update, reload the page and scroll below **Your last 7 days**.

Mochi movement update: eased acceleration/braking, alternating feet, breathing, blinking, tail sway, a bouncing ball and a catch hop. Run `node pet.test.cjs` for simulated animation-state checks, including reduced motion. Visual appearance still requires a real-browser check.
