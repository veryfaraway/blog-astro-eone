---
title: "Git Merge vs Rebase: Complete Guide to Understanding Branch Integration"
description: Master Git merge and rebase commands with visual comparisons. Learn when and how to use each command effectively in different scenarios.
date: 2025-12-29
category: DevOps
tags:
  - "git"
  - "merge"
  - "rebase"
  - "git-workflow"
  - "version-control"
  - "devops"
draft: false
lang: en
thumbnail: "https://images.unsplash.com/photo-1556075798-4825dfaaf498?q=80&w=2676&auto=format&fit=crop"
---

Have you ever wondered when to use `merge` vs `rebase` in Git? Both commands integrate branches, but they work very differently and produce different results. In this comprehensive guide, we'll explore both approaches with visual examples and learn how to make the right choice in different situations.

---

## 1. What are Git Merge and Rebase?

### 1.1 Git Merge (Combining branches)

**Merge** integrates two branches by creating a new "merge commit" that combines all changes. The original branch history is completely preserved.

**Characteristics:**

- ✅ Complete preservation of original branch history
- ✅ Clear tracking of the integration process
- ⚠️ Commit history can become complex

### 1.2 Git Rebase (Rebasing)

**Rebase** changes the base of one branch to the latest commit of another branch. It "rewrites" the commit history to create a linear timeline.

**Characteristics:**

- ✅ Clean, linear commit history
- ✅ Easier to follow the development flow
- ⚠️ Can be dangerous on shared branches

---

## 2. Visual Comparison: Merge vs Rebase

### 2.1 Initial State

Let's look at the branch structure before integration:

```text
main    A---B---C
         \
feature   D---E
```

**Explanation:**

- `main` branch: contains commits A, B, C
- `feature` branch: contains commits D, E (created from A)

### 2.2 Integration with Merge

Running `git merge feature` from the `main` branch:

```text
main    A---B---C---M (merge commit)
         \       /
feature   D-----E
```

**Result:**

- Creates a new **merge commit M**
- Preserves the order of all commits
- Records the branch's existence in history
- Creates a diamond-shaped pattern

**Commit Log:**

```text
M - Merge branch 'feature' into 'main'
C - Commit C
E - Commit E
D - Commit D
B - Commit B
A - Commit A
```

### 2.3 Integration with Rebase

Running `git rebase main` from the `feature` branch:

```text
main    A---B---C
         \
feature   D'--E'
```

Then running `git merge feature` from `main`:

```text
main    A---B---C---D'---E'
```

**Result:**

- Creates **new commits D', E'** (different hashes from original D, E)
- Creates a linear history
- All commits appear in a single line
- Branch integration is completely invisible

**Commit Log:**

```text
E' - Commit E (rebased)
D' - Commit D (rebased)
C - Commit C
B - Commit B
A - Commit A
```

---

## 3. Detailed Command Guide

### 3.1 Merge Usage

#### Basic merge

```bash
# Merge feature branch into current branch (main)
git merge feature
```

#### Fast-Forward Merge

If the main branch has no new commits:

```text
main    A---B
         \
feature   C---D
```

In this case, `git merge feature` automatically performs a fast-forward merge:

```text
main    A---B---C---D
```

**No merge commit is created**

#### Prevent Fast-Forward

```bash
# Always create a merge commit
git merge --no-ff feature
```

#### 3-way Merge (typical merge)

```text
main    A---B---C
         \     /
feature   D---E
```

This automatically performs a 3-way merge and creates a merge commit.

### 3.2 Rebase Usage

#### Basic rebase

```bash
# Rebase feature branch on top of main
git rebase main feature
```

Or:

```bash
# From feature branch
git checkout feature
git rebase main
```

#### Interactive Rebase

Rebase multiple commits while organizing them:

```bash
# Interactively rebase last 3 commits
git rebase -i HEAD~3
```

**Available Options:**

```text
pick   ef12345  Commit message 1
reword d4a6789  Commit message 2
squash a2b3456  Commit message 3
```

- `pick`: Keep the commit
- `reword`: Edit commit message
- `squash`: Merge with previous commit
- `fixup`: Merge with previous commit (discard message)
- `drop`: Delete the commit

---

## 4. Real-World Scenarios: When to Use What

### 4.1 Working on Shared Repository

**❌ Never use Rebase!**

```bash
# Never do this (causes team confusion)
git push origin feature
git rebase main
git push origin feature --force  # Dangerous!
```

**✅ Use Merge instead:**

```bash
# Correct approach
git merge main
git push origin feature
```

**Why:**

- Rewriting history on shared branches conflicts with others' work
- `git push --force` can overwrite other developers' changes

### 4.2 Working on Local Personal Branch

**✅ Rebase is recommended:**

```bash
# Maintain clean history
git checkout feature
git rebase main
git checkout main
git merge --ff-only feature
```

**Why:**

- Only your work is affected
- Main branch history stays clean

### 4.3 Long-Lived Branches

**✅ Use Merge:**

```bash
# Example: release/v1.0 branch
git merge main
git push origin release/v1.0
```

**Why:**

- Multiple developers may work on the branch
- Branch integration process should be clear

### 4.4 Cleaning Up Commits Before Merging to Main

**✅ First Rebase to clean up, then Merge:**

```bash
# On local feature branch
git rebase -i main feature

# On main branch
git merge --no-ff feature
```

Result:

```text
main    A---B---C---M
                 \  /
feature           D'---E'
```

---

## 5. Conflict Resolution in Merge and Rebase

### 5.1 Merge Conflict

```bash
$ git merge feature
Auto-merging file.txt
CONFLICT (content): Merge conflict in file.txt
Automatic merge failed; fix conflicts and then commit the result.
```

**Conflict Markers:**

```javascript
// Contents of file.txt
function example() {
<<<<<<< HEAD
  return "main branch version";  // Current branch (main)
=======
  return "feature branch version";  // Merging branch (feature)
>>>>>>> feature
}
```

**Resolution:**

```bash
# 1. Resolve conflict
# Edit file.txt to choose the desired version

# 2. Stage the file
git add file.txt

# 3. Commit
git commit -m "Merge branch 'feature': resolve conflicts"
```

### 5.2 Rebase Conflict

```bash
$ git rebase main
First, rewinding head to replay your work on top of main...
Applying: Commit D
error: could not apply d123456... Commit D
hint: Resolve all conflicts manually
```

**Conflict Markers:**

```javascript
// Conflicts are marked the same as in merge
<<<<<<< HEAD
  ...
=======
  ...
>>>>>>> branch-name
```

**Resolution:**

```bash
# 1. Resolve conflict (edit files)

# 2. Stage files
git add file.txt

# 3. Continue rebase
git rebase --continue

# Automatically commits after all conflicts are resolved
```

**Abort Rebase:**

```bash
# Cancel the rebase
git rebase --abort
```

---

## 6. Real-World Workflow Examples

### 6.1 Pull Request-Style Merge Workflow

This style is recommended by GitHub, GitLab, and similar platforms:

```bash
# 1. Create feature branch
git checkout -b feature/new-auth
git commit -m "Add authentication"
git commit -m "Add JWT support"

# 2. Sync with main locally
git fetch origin
git rebase origin/main

# 3. Push to remote
git push origin feature/new-auth

# 4. Create Pull Request (via UI)
# After review, merge via merge commit

# 5. Sync local main
git checkout main
git pull origin main

# 6. Delete local feature branch
git branch -d feature/new-auth
```

**Result:**

```text
main    A---B---C---M (PR merge commit)
```

### 6.2 When You Want Clean History

```bash
# 1. Create feature branch
git checkout -b feature/optimization
git commit -m "Fix performance issue"
git commit -m "Add caching"
git commit -m "Optimize query"

# 2. Clean up locally
git rebase -i main

# In interactive rebase:
# pick d1 Fix performance issue
# squash d2 Add caching  
# squash d3 Optimize query

# 3. Results in one combined commit

# 4. Merge to main
git checkout main
git merge --ff-only feature/optimization
```

**Result:**

```text
main    A---B---C---D' (single optimization commit)
```

---

## 7. Best Practices

### ✅ Use Merge When:

1. **Working on shared branches** (main, develop, release)
2. **Multiple developers work on the branch**
3. **Integration history must be preserved**
4. **Using Pull Request-based workflow**
5. **Working with long-lived branches** (release, hotfix)

### ✅ Use Rebase When:

1. **Working only on a local personal branch**
2. **Cleaning up commits that haven't been shared**
3. **You want a linear history**
4. **You need to edit past commit messages**
5. **You want to combine commits (squash)**

### ⚠️ Important Rebase Safety Tips

**Never do this:**

```bash
# Rebase a shared branch and force push
git rebase main
git push --force  # Dangerous!
```

**Safer approach:**

```bash
# Only rebase local branches
git push --force-with-lease  # Safer
# Or just use merge
```

---

## 8. Useful Git Configuration

### 8.1 Set Default Merge Strategy

```bash
# Always create merge commit on pull
git config --global pull.ff false
```

### 8.2 Set Rebase as Default

```bash
# Auto-rebase on pull (local repos only)
git config pull.rebase true
```

### 8.3 Make Git Log More Readable

```bash
# Display log in graph format
git log --graph --oneline --all
git log --graph --oneline --decorate --all

# Create an alias
git config --global alias.lg "log --graph --oneline --all"
git lg  # Use it simply
```

---

## 9. Frequently Asked Questions (FAQ)

### Q1: Should I use merge or rebase?

**A:** Use **merge** on shared branches, **rebase** on personal branches.

### Q2: Can I undo a rebase?

**A:** Yes, use `git reflog` to find the original commit:

```bash
git reflog
git checkout <original-commit-hash>
```

### Q3: Can I mix merge and rebase?

**A:** Possible but complicated. Establish and follow team rules for consistency.

### Q4: I pushed rebased commits to a public repository. What should I do?

**A:** Use `git revert` to undo:

```bash
git revert <original-commit-hash>
git push origin main
```

---

## 10. Conclusion

Git's `merge` and `rebase` are tools with different purposes:

- **Merge**: A **history-preserving** approach that records "what was integrated and when"
- **Rebase**: A **history-linearizing** approach that cleanly presents "how we got here"

Choosing the right tool for the right situation will make collaboration with your team much more efficient and clear. I hope this guide helps you use Git with greater confidence!

---

## References

- [Git Official Documentation - Merge](https://git-scm.com/docs/git-merge)
- [Git Official Documentation - Rebase](https://git-scm.com/docs/git-rebase)
- [Git Official Tutorial - Branching and Merging](https://git-scm.com/book/en/v2/Git-Branching-Basic-Branching-and-Merging)
- [Atlassian Git Tutorial](https://www.atlassian.com/git/tutorials/merging-vs-rebasing)
