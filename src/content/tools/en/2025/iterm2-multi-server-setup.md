---
title: "Managing Multiple Servers with iTerm2: Profiles, Toolbelt, Password Manager, SSH config, and 1Password Integration"
description: "Manage multiple SSH servers efficiently on macOS using iTerm2 Profiles, Toolbelt, Password Manager, SSH config, and the new 3.5 integration with 1Password and LastPass for secure auto‑logins."
date: 2025-12-31
category: Tools
tags:
  - "iterm2"
  - "ssh"
  - "password-manager"
  - "macos"
draft: false
lang: en
thumbnail: "https://iterm2.com/img/logo2x.jpg"
---

If you use macOS as your main development machine, **how efficiently and safely you manage SSH connections to multiple servers** directly impacts your productivity. This post shows how to combine iTerm2’s Profiles, Toolbelt, Password Manager, and SSH config to build a workflow similar to SecureCRT’s session manager, and how to take advantage of iTerm2 3.5’s new 1Password/LastPass integration.

## Quick overview of iTerm2

iTerm2 is a powerful terminal emulator that replaces the default Terminal.app on macOS and adds tabs, split panes, profiles, triggers, a toolbelt sidebar, and more.

For developers who live in SSH sessions, these features are especially useful:

- Profiles: Save per‑server or per‑project settings like command (`ssh user@host`), colors, fonts, and working directory.
- Toolbelt: A sidebar that can show Profiles, Paste History, Jobs, Notes, and more, so you can start sessions with a single click.
- Password Manager: A built‑in password manager that stores SSH passwords securely and can auto‑fill them into login prompts.
- Triggers: Rules that match terminal output with regular expressions and react, e.g. invoke the Password Manager when a password prompt appears.

In this post we’ll combine those four features with your `~/.ssh/config` so you can quickly select, connect, and auto‑login to multiple servers.

## Managing server groups with Profiles + Toolbelt

### 1. Design your server groups (dev / staging / prod)

Start by grouping your servers logically:

- `dev-*`: development servers
- `stg-*`: staging / test servers
- `prod-*`: production servers

Create separate iTerm2 profiles for each group and make them visually distinct using profile names, colors, and badges.

For example:

- `DEV - app01`
- `STG - app01`
- `PROD - app01`

Keeping a consistent naming scheme makes search and automatic profile switching easier later.

### 2. Basic profile setup

Go to `iTerm2 → Settings (Preferences) → Profiles` and click `+` to create a new profile.

Example: development server profile

- General tab  
  - Name: `DEV - app01`  
  - Tags: `dev`, `app`, `ssh`  
  - Command: `ssh devuser@app01.dev.example.com`
- Colors tab  
  - Choose a lighter color preset (e.g. a Solarized Light variant) for dev.
- Text tab  
  - Optionally use a slightly different font or size for each environment, e.g. make production a bit larger.
- Window tab  
  - Enable **Open Toolbelt** so windows from this profile open with the toolbelt visible.
- Advanced tab  
  - Badge: set `DEV` / `STG` / `PROD` so the environment name appears as a banner in the terminal.

Repeat this for your `DEV-*`, `STG-*`, and `PROD-*` servers.

### 3. Launching profiles from the Toolbelt

Once your profiles are ready, use the Toolbelt to launch them with a click:

- Enable the Toolbelt: `View → Toolbelt → Show Toolbelt`.
- Show the Profiles tool: `View → Toolbelt → Profiles`.

You’ll now see a list of profiles on the right side of your window. Double‑click `DEV - app01` to open a new tab/window/split for that server.
This gives you a UX similar to SecureCRT’s Session Manager when jumping between multiple hosts.

## Scaling up with SSH config + Dynamic Profiles

Creating dozens or hundreds of profiles by hand doesn’t scale. A better approach is to treat `~/.ssh/config` as the single source of truth and generate iTerm2 Dynamic Profiles from it.

### 1. Example SSH config

```
Host dev-app01
  HostName app01.dev.example.com
  User devuser
  Port 22
  IdentityFile ~/.ssh/id_ed25519_dev

Host stg-app01
  HostName app01.stg.example.com
  User stguser
  Port 22
  IdentityFile ~/.ssh/id_ed25519_stg

Host prod-app01
  HostName app01.prod.example.com
  User produser
  Port 22
  IdentityFile ~/.ssh/id_ed25519_prod
```

Here, each `Host` alias (`dev-app01`, `stg-app01`, `prod-app01`) will become an iTerm2 profile name like `dev-app01`.

### 2. From ssh config to Dynamic Profiles

Tools like `ssh-to-iterm2` or `ssh2iterm2` can read your SSH config and generate iTerm2 Dynamic Profiles JSON automatically.

Typical behavior:

- Read `~/.ssh/config` (or `~/.ssh/config.d/*.conf`).
- Turn each `Host` entry into an iTerm2 profile with `Command` set to `ssh host-alias`.
- Tag profiles based on which config file they came from (e.g. `production` tag for entries in `20_production.conf`).

Benefits:

- Maintain servers and users in SSH config; profiles are derived automatically.
- Store SSH config in Git and share it within your team while letting everyone keep their iTerm2 UI settings locally.

## Using Password Manager for automatic logins

Profiles and SSH config decide **where** and **as whom** you connect. The Password Manager decides **how you type the password** without actually typing it.

### 1. Basic use of the Password Manager

- Open `Window → Password Manager`.
- Add a new account for each server:

Example:

- Name: `dev-app01`
- Username: `devuser`
- Password: `********`

By default, iTerm2 stores these passwords securely in the macOS keychain.

### 2. Automatically filling passwords with Triggers

You can create a trigger that fires when a `password:` prompt appears and tells the Password Manager which entry to use.

For a given profile (e.g. `DEV - app01`):

1. Go to `Settings → Profiles → DEV - app01 → Advanced → Triggers → Edit`.
2. Add a new trigger:
   - Regular Expression: `password:\s*$`
   - Action: `Open Password Manager`
   - Parameters: `dev-app01` (the name of the entry you created)
   - Instant: checked

Now, whenever the `password:` prompt shows up in that session, iTerm2 automatically selects `dev-app01` from the Password Manager and types the password into the terminal.

## iTerm2 3.5: using 1Password / LastPass as backend

Before 3.5, iTerm2’s Password Manager only used the Apple keychain. Starting in 3.5, it can use **1Password or LastPass** instead.
This means you can treat iTerm2 as a client of your main password vault instead of maintaining a separate “terminal‑only” store.

### 1. Enabling the 1Password / LastPass backend

1. Install the 1Password or LastPass CLI (e.g. 1Password’s `op` CLI).
2. Open `Window → Password Manager` in iTerm2.
3. Click the `…` (ellipsis) button next to the search field.
4. Change the backend from **Keychain** to **1Password** or **LastPass**.

From now on, Password Manager entries in iTerm2 are backed by your 1Password/LastPass vault rather than the local keychain.

### 2. Tagging 1Password items for iTerm2

The 1Password integration only shows items that are tagged appropriately.

- Add the tag `iTerm2` to any 1Password item you want to expose to iTerm2’s Password Manager.
- Optionally use a special tag like `iTerm2-no-otp` if you want to control whether one‑time passwords are included.

Example 1Password item:

- Name: `prod-app01`
- Username: `produser`
- Password: `********`
- Tags: `iTerm2`, `prod`, `ssh`

iTerm2 will now list `prod-app01` in the Password Manager UI and can auto‑fill it into SSH password prompts.

### 3. Triggers + 1Password in practice

Combine the previous trigger technique with 1Password items:

- Keep the `password:\s*$` trigger in your `PROD - app01` profile.
- Use `prod-app01` (the 1Password item name) as the trigger parameter.

When you SSH to the production server, iTerm2 pulls the password directly from 1Password and enters it into the prompt.

This setup gives you:

- A single place (1Password/LastPass) to change passwords for both browser and terminal.
- Full access to vault features like password health checks and breach monitoring while still enjoying terminal auto‑login.

## Visual safety: themes and badges for dev / staging / prod

To avoid accidentally running destructive commands on production, it helps to make each environment visually distinct.

### 1. Separate color presets per environment

Under `Settings → Profiles → (profile) → Colors`, assign different presets:

- DEV: light theme (e.g. Solarized Light or a soft background color).
- STG: medium‑dark gray theme.
- PROD: dark theme (e.g. Solarized Dark, Dracula, etc.).

Just glancing at the background is enough to know which environment you are in.

### 2. Using badges for obvious labels

On `Profiles → Advanced → Badge`, set a clear label:

- DEV: `DEV`
- STG: `STG`
- PROD: `PROD ⚠`

Badges appear as a semi‑transparent banner in the terminal, which makes production sessions stand out visually and encourages extra caution.

### 3. Automatic Profile Switching for remote hosts

If you use Dynamic Profiles generated from SSH config, you can leverage **Automatic Profile Switching** so that iTerm2 switches colors and badges when you SSH into certain hosts.

For example:

- DEV profile: Automatic Profile Switching → Hostnames: `*.dev.example.com`
- STG profile: Hostnames: `*.stg.example.com`
- PROD profile: Hostnames: `*.prod.example.com`

When you connect to a production host, iTerm2 automatically applies the PROD profile (dark theme, `PROD ⚠` badge), even in the same tab.

## Putting it all together

The final workflow looks like this:

1. Manage servers, users, and keys in `~/.ssh/config`.
2. Generate iTerm2 Dynamic Profiles from SSH config, or create profiles manually for key servers.
3. Use the Toolbelt’s Profiles view to connect to servers with a single click.
4. Configure Password Manager + Triggers to auto‑fill passwords on SSH login prompts.
5. On iTerm2 3.5 or later, switch the Password Manager backend to 1Password/LastPass so all credentials live in your main vault.
6. Use colors, badges, and Automatic Profile Switching to visually separate dev/staging/prod sessions.

If you’ve ever missed SecureCRT’s session manager on macOS, this combination gives you a very similar “multi‑server management + safe auto‑login” experience while staying fully native to iTerm2.
