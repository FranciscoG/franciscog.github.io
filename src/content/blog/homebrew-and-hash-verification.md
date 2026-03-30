---
title: Homebrew and hash verification
date: 2026-03-30
syntax: true
tags:
  - shell scripts
  - Homebrew
---

One of the main reasons I prefer to use [Homebrew](https://brew.sh) to install applications is that it automatically handles verifying the sha256 hash of a file. Otherwise I'd have to do all of that manually, which is annoying, and you know we developers love automating those annoying samll tasks.

What I didn't realize until recently is that not all developers provide hashes for their formulae/casks. Granted it's very rare, so probably not a huge concern, but if the effort to protect yourself is trivial, then why not employ it.

## Verifying that Homebrew can verify

Below is a simple wrapper around `brew install` that first checks if a formula/cask actually has a hash. If it's missing, it will warn you and ask if you want to continue. Just add it to your `.zshrc` or `.bashrc` and you're good to go.

```sh
check_brew_pkg() {
  local type="$1"  # "cask" or "formula"
  local name="$2"

  local data
  data=$(curl -s "https://formulae.brew.sh/api/$type/$name.json")

  if [[ -z "$data" || "$data" == "null" ]]; then
    echo "❌ $type '$name' not found in Homebrew API"
    return 1
  fi

  if echo "$data" | grep -Eq '"sha256":\s*"[0-9a-fA-F]{64}"'; then
    # hash exists, can continue as normal
    return 0
  fi

  if [[ "$type" == "cask" ]] && echo "$data" | grep -q '"sha256":\s*":no_check"'; then
    echo "⚠️  $name uses sha256 :no_check (no verification)"
    return 2
  fi

  echo "⚠️  $name has no SHA-256 hashes"
  return 2
}

brew_install() {
  local type="formula"
  local name="$1"
  local install_args=("$name")

  if [[ "$1" == "--cask" ]]; then
    type="cask"
    name="$2"
    install_args=("--cask" "$name")
  fi

  if [[ -z "$name" ]]; then
    echo "Usage: brew install [--cask] <name>"
    return 1
  fi

  echo "🔍 Checking if $type: $name has a sha256 hash"
  check_brew_pkg "$type" "$name"
  local status=$?

  if [[ $status -ne 0 ]]; then
    echo ""
    read -p "Proceed anyway? (y/N): " confirm
    if [[ "$confirm" != "y" ]]; then
      echo "❌ Aborted."
      return 1
    fi
  fi

  command brew install "${install_args[@]}"
}

brew() {
  if [[ "$1" == "install" ]]; then
    brew_install "${@:2}"
  else
    command brew "$@"
  fi
}
```

## What verifying a hash won't protect you from

When an attacker has compromised a repo and release a new malicious version for downloading, along with a hash for that version. Until the compromise is discovered, it will seem like an authentic release.


## What verifying _will_ protect you from

If your download is somehow intercepted ("man in the middle" attack) and replaced with a different malicious version. The hash wouldn't match and homebrew would not install it. It also helps prevent installs from files that may have gotten corrupted somehow on the file server or in transit because of a network glitch. 
