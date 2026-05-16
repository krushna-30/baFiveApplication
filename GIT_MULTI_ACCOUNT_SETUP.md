# Git Multi-Account Setup Guide

## Overview
This guide helps you push the same code to two different GitHub repositories, each tied to different accounts/emails.

## Setup Steps

### 1. Configure Git Per Repository (Frontend - c:\baFive)

Set local user configuration for this repository only:

```powershell
cd c:\baFive

# Set user.name and user.email for THIS repository only
git config --local user.name "Account 1 Name"
git config --local user.email "email1@example.com"

# Verify local config was set
git config --local --list
```

### 2. Add Multiple Remotes to Frontend Repository

```powershell
cd c:\baFive

# View current remotes
git remote -v

# Add second remote (if needed)
git remote add secondary https://github.com/account2/baFiveApplication.git

# View all remotes
git remote -v
```

Expected output:
```
origin     https://github.com/account1/baFiveApplication.git (fetch)
origin     https://github.com/account1/baFiveApplication.git (push)
secondary  https://github.com/account2/baFiveApplication.git (fetch)
secondary  https://github.com/account2/baFiveApplication.git (push)
```

### 3. Configure Git Per Repository (Backend - c:\backendBaFive)

```powershell
cd c:\backendBaFive

# Set user.name and user.email for THIS repository only
git config --local user.name "Account 2 Name"
git config --local user.email "email2@example.com"

# Verify local config was set
git config --local --list
```

### 4. Add Multiple Remotes to Backend Repository

```powershell
cd c:\backendBaFive

# View current remotes
git remote -v

# Add second remote
git remote add secondary https://github.com/account1/backendBaFive.git

# View all remotes
git remote -v
```

---

## Pushing to Different Remotes

### Push Frontend to Account 1:
```powershell
cd c:\baFive
git push origin main
```

### Push Frontend to Account 2:
```powershell
cd c:\baFive
git push secondary main
```

### Push Backend to Account 2:
```powershell
cd c:\backendBaFive
git push origin main
```

### Push Backend to Account 1:
```powershell
cd c:\backendBaFive
git push secondary main
```

---

## Verify Configuration

### Check local user config for frontend:
```powershell
cd c:\baFive
git config --local user.email
git config --local user.name
```

### Check local user config for backend:
```powershell
cd c:\backendBaFive
git config --local user.email
git config --local user.name
```

### Check all remotes:
```powershell
cd c:\baFive
git remote -v

cd c:\backendBaFive
git remote -v
```

---

## Important Notes

1. **--local flag**: Configures git ONLY for that specific repository
   - `git config --local` = repository-specific
   - `git config --global` = all repositories (not what you want here)
   - `git config --system` = system-wide (don't use)

2. **Each commit will have the correct author**: Once you set `user.email` locally, all commits from that repo will use that email

3. **SSH vs HTTPS**: 
   - If using HTTPS, you may need to authenticate each time
   - If using SSH, set up SSH keys for both GitHub accounts

4. **SSH Key Setup (Optional but recommended)**:
   ```powershell
   # Generate two SSH keys (one per account)
   ssh-keygen -t ed25519 -C "email1@example.com" -f ~/.ssh/id_ed25519_account1
   ssh-keygen -t ed25519 -C "email2@example.com" -f ~/.ssh/id_ed25519_account2
   
   # Add to SSH config (~/.ssh/config)
   Host github-account1
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_ed25519_account1
   
   Host github-account2
       HostName github.com
       User git
       IdentityFile ~/.ssh/id_ed25519_account2
   
   # Use in remotes:
   git remote add origin git@github-account1:account1/baFiveApplication.git
   git remote add secondary git@github-account2:account2/baFiveApplication.git
   ```

5. **Verify commits show correct author**:
   ```powershell
   git log --oneline -n 3
   # Should show commits with the configured email
   ```

---

## Quick Reference Cheat Sheet

| Task | Command |
|------|---------|
| Set local email | `git config --local user.email "email@example.com"` |
| Set local name | `git config --local user.name "Your Name"` |
| View local config | `git config --local --list` |
| Add remote | `git remote add name url` |
| List remotes | `git remote -v` |
| Remove remote | `git remote remove name` |
| Push to origin | `git push origin main` |
| Push to secondary | `git push secondary main` |
| Fetch from secondary | `git fetch secondary` |
| Pull from secondary | `git pull secondary main` |

---

## Your Specific Setup

**Replace these with your actual values:**

- `Account 1 Name` → Your first account's name
- `email1@example.com` → Your first GitHub account email
- `Account 2 Name` → Your second account's name
- `email2@example.com` → Your second GitHub account email
- `https://github.com/account1/baFiveApplication.git` → Actual repo URL
- `https://github.com/account2/baFiveApplication.git` → Actual repo URL

---

## Testing Your Setup

After configuration, test with a small change:

```powershell
cd c:\baFive

# Make a small change
echo "# Test" > test.txt

# Stage and commit
git add test.txt
git commit -m "Test commit from Account 1"

# Check commit author
git log -1 --format="%an <%ae>"

# Should show: Account 1 Name <email1@example.com>

# Push to specific remote
git push origin main

# Or push to secondary
git push secondary main
```

---

## Troubleshooting

**Problem**: Commit shows wrong email
- **Solution**: Check local config with `git config --local user.email`
- Make sure you're not using `--global` config which overrides `--local`

**Problem**: "Permission denied (publickey)"
- **Solution**: 
  - If using SSH, set up SSH keys for both accounts
  - If using HTTPS, ensure credentials are correct
  - Try: `git config --global credential.helper store`

**Problem**: Can't remember which email is for which remote
- **Solution**: Use `git config --local --list` and `git remote -v` to verify

**Problem**: Want to change a remote URL
- **Solution**: `git remote set-url origin new-url` or `git remote remove name && git remote add name new-url`

