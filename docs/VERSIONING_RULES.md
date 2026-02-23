# 版本管理规范 (Versioning Rules)

Minor-bump-only 版本管理策略和 Conventional Commits 提交规范。

---

## 1. 版本格式

```
MAJOR.MINOR.PATCH
```

| 位置 | 规则 |
|------|------|
| **PATCH** | **始终为 `0`**，永不修改 |
| **MINOR** | **任何变更都升级**（新功能、修复、改进） |
| **MAJOR** | **仅通过显式人工决策**变更，正常开发保持不变 |

### 版本示例

```
✅ 0.68.0 → 0.69.0 → 0.70.0
❌ 0.68.1  (不允许)
```

---

## 2. Conventional Commits 规范

### 格式

```
<type>(<scope>): <subject>

[optional body]

[optional footer(s)]
```

### Commit Types

| Type | 描述 | 示例 |
|------|------|------|
| `feat` | 新功能 | `feat(auth): add OAuth2 login` |
| `fix` | Bug 修复 | `fix(api): handle null response` |
| `docs` | 文档变更 | `docs(readme): update install steps` |
| `style` | 代码格式 | `style(lint): fix trailing whitespace` |
| `refactor` | 重构 | `refactor(db): simplify query logic` |
| `perf` | 性能优化 | `perf(cache): reduce memory usage` |
| `test` | 测试相关 | `test(unit): add edge case coverage` |
| `build` | 构建系统 | `build(deps): upgrade numpy to 1.24` |
| `ci` | CI/CD 配置 | `ci(actions): add matrix builds` |
| `chore` | 其他杂务 | `chore(release): bump version` |
| `revert` | 回滚变更 | `revert(auth): revert OAuth2 changes` |

### 编写规范

```bash
# ✅ 正确
feat(auth): add OAuth login
fix(parser): handle empty input
docs: update API reference

# ❌ 错误
feat(auth): Added OAuth login        # 过去时
fix(parser): Handle empty input.     # 大写开头，句尾有句号
docs: Update API reference.          # 句尾有句号
```

**规则：**
- 使用祈使语气、现在时（"add" 而非 "added"）
- 首字母不大写
- 末尾不加句号
- 主题不超过 50 个字符

### 作用域 (Scope)

```bash
# 模块/组件名
feat(api): ...
fix(ui): ...
chore(db): ...

# 多作用域用 *
feat(*): ...

# 可省略（项目级变更）
chore: update dependencies
```

### 破坏性变更

```bash
# 方式一：使用 !
feat(api)!: remove deprecated endpoints

# 方式二：BREAKING CHANGE footer
feat(api): change authentication flow

BREAKING CHANGE: The API now requires Bearer token
```

---

## 3. Release Workflow

### 完整流程

#### 1. 准备

```bash
# 确保 main 分支最新
git checkout main
git pull origin main
```

#### 2. 创建发布分支

```bash
# 分支命名: bump-X.XX
git checkout -b bump-0.69
```

#### 3. 更新 Changelog

```markdown
## [0.69] - 2024-01-15

### Added
- New feature X
- New feature Y

### Fixed
- Bug Z

## [0.68] - 2024-01-01
...
```

#### 4. 升级版本号

**pyproject.toml:**
```toml
[project]
version = "0.69.0"
```

**或使用脚本:**
```bash
python scripts/bump_version.py        # 自动 bump: 0.68.0 → 0.69.0
python scripts/bump_version.py 0.70.0 # 指定版本
```

#### 5. 同步依赖

```bash
uv sync
```

#### 6. 提交并推送

```bash
git add -A
git commit -m "chore(release): bump version to 0.69.0"
git push origin bump-0.69
```

#### 7. 创建并合并 PR

在 GitHub 上创建 Pull Request，审核通过后合并到 `main`。

#### 8. 打标签并推送

```bash
git checkout main
git pull origin main
git tag 0.69
git push --tags
```

GitHub Actions 会自动处理发布。

---

## 4. 多包发布

对于包含多个包的项目（`packages/*`, `sdks/*`）：

### 独立版本管理

```
kimi-cli:     0.68.0 → 0.69.0
kosong:       0.12.0 → 0.13.0
pykaos:       0.5.0  → 0.5.0  (无变更，不发布)
```

### 发布步骤

```bash
# 1. 更新包版本
# packages/kosong/pyproject.toml
version = "0.13.0"

# 2. 同步依赖
uv sync

# 3. 提交
git commit -m "chore(release): bump kosong to 0.13.0"

# 4. 打标签（带包名前缀）
git tag kosong-0.13.0
git push --tags
```

### 标签格式

| 类型 | 标签示例 |
|------|----------|
| 根项目 | `0.69` |
| 子包 | `pykaos-0.5.3` |

---

## 5. 检查清单

### Pre-Release

- [ ] Pull latest from main: `git checkout main && git pull`
- [ ] Create release branch: `git checkout -b bump-X.XX`
- [ ] Update `CHANGELOG.md`: Rename `[Unreleased]` to `[X.XX] - YYYY-MM-DD`
- [ ] Bump version in `pyproject.toml`
- [ ] Sync dependencies: `uv sync`
- [ ] Run tests: `make test` or `uv run pytest`
- [ ] Run linting: `make check` or `uv run ruff check`

### Commit and PR

- [ ] Stage changes: `git add -A`
- [ ] Commit: `git commit -m "chore(release): bump version to X.XX.0"`
- [ ] Push branch: `git push origin bump-X.XX`
- [ ] Create PR on GitHub
- [ ] Get PR reviewed and approved
- [ ] Merge PR to main

### Tag and Release

- [ ] Pull latest main: `git checkout main && git pull`
- [ ] Create tag: `git tag X.XX`
- [ ] Push tag: `git push --tags`
- [ ] Verify GitHub Actions release workflow runs successfully

### Post-Release (Optional)

- [ ] Verify release artifacts are published
- [ ] Update documentation if needed
- [ ] Announce release if applicable

---

## 6. FAQ

**Q: 我做了 bugfix，应该 bump patch 吗？**

A: 不。bump minor：`0.68.0` → `0.69.0`

---

**Q: 我做了小的文档变更，应该 bump minor 吗？**

A: 是。任何变更都触发 minor bump。

---

**Q: patch 版本什么时候会变？**

A: 在这个策略中永远不会。它始终保持在 `0`。

---

**Q: 如何表示破坏性变更？**

A: 在 commit 中使用 `!`：`feat(api)!: remove deprecated endpoint`。仍然 bump minor 版本。

---

**Q: 不同包可以有不同的版本吗？**

A: 可以。每个包独立版本管理。

---

**Q: 什么时候 bump major？**

A: 仅在显式业务/组织决策时。正常开发保持 major 不变（如 `0.x.0`）。

---

## 7. 脚本工具

### bump_version.py

自动升级版本号，遵循 minor-bump-only 规则：

```python
#!/usr/bin/env python3
"""
Bump version in pyproject.toml following minor-bump-only strategy.

Usage:
    python bump_version.py [NEW_VERSION]
    
If NEW_VERSION is not provided, the current minor version is automatically bumped.
"""

import re
import sys
from pathlib import Path


def read_version(content: str) -> str | None:
    """Extract version from pyproject.toml content."""
    match = re.search(r'^version\s*=\s*"([^"]+)"', content, re.MULTILINE)
    return match.group(1) if match else None


def bump_minor(version: str) -> str:
    """Bump minor version, keeping patch at 0."""
    parts = version.split('.')
    if len(parts) != 3:
        raise ValueError(f"Invalid version format: {version}. Expected MAJOR.MINOR.PATCH")
    
    major, minor, _ = parts
    new_minor = int(minor) + 1
    return f"{major}.{new_minor}.0"


def update_version(content: str, new_version: str) -> str:
    """Replace version in content."""
    return re.sub(
        r'^(version\s*=\s*")[^"]+("[^\n]*)$',
        rf'\g<1>{new_version}\2',
        content,
        flags=re.MULTILINE
    )


def main():
    pyproject_path = Path("pyproject.toml")
    
    if not pyproject_path.exists():
        print("Error: pyproject.toml not found in current directory", file=sys.stderr)
        sys.exit(1)
    
    content = pyproject_path.read_text()
    current_version = read_version(content)
    
    if not current_version:
        print("Error: Could not find version in pyproject.toml", file=sys.stderr)
        sys.exit(1)
    
    if len(sys.argv) > 1:
        new_version = sys.argv[1]
        if not re.match(r'^\d+\.\d+\.0$', new_version):
            print(f"Error: Invalid version format: {new_version}. Must end with .0 (patch=0)", file=sys.stderr)
            sys.exit(1)
    else:
        new_version = bump_minor(current_version)
    
    if new_version == current_version:
        print(f"Version already at {current_version}, no change needed")
        sys.exit(0)
    
    new_content = update_version(content, new_version)
    pyproject_path.write_text(new_content)
    
    print(f"Version bumped: {current_version} -> {new_version}")


if __name__ == "__main__":
    main()
```

### validate_commit.py

验证 commit message 格式：

```python
#!/usr/bin/env python3
"""
Validate commit message follows Conventional Commits format.

Usage:
    python validate_commit.py "feat(auth): add OAuth login"
    
Exit codes:
    0 - Valid
    1 - Invalid
"""

import re
import sys

VALID_TYPES = {
    'feat', 'fix', 'docs', 'style', 'refactor',
    'perf', 'test', 'build', 'ci', 'chore', 'revert'
}


def validate_commit_message(message: str) -> tuple[bool, str]:
    message = message.strip()
    
    if not message:
        return False, "Empty commit message"
    
    if message.startswith('Merge '):
        return True, "Merge commit (allowed)"
    
    pattern = r'^(\w+)(?:\(([^)]+)\))?(!)??: (.+)$'
    match = re.match(pattern, message)
    
    if not match:
        return False, (
            "Invalid format. Expected: type(scope): subject\n"
            "Examples:\n"
            "  feat: add new feature\n"
            "  fix(api): handle error\n"
            "  feat(auth)!: breaking change"
        )
    
    commit_type, scope, breaking, subject = match.groups()
    
    if commit_type not in VALID_TYPES:
        return False, (
            f"Invalid type '{commit_type}'. "
            f"Valid types: {', '.join(sorted(VALID_TYPES))}"
        )
    
    if subject.endswith('.'):
        return False, "Subject should not end with a period"
    
    if subject[0].isupper():
        return False, "Subject should not start with a capital letter"
    
    return True, "Valid commit message"


def main():
    if len(sys.argv) < 2:
        print("Usage: python validate_commit.py '<commit-message>'", file=sys.stderr)
        sys.exit(1)
    
    message = sys.argv[1]
    is_valid, result = validate_commit_message(message)
    
    if is_valid:
        print(f"✓ {result}")
        sys.exit(0)
    else:
        print(f"✗ {result}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()
```

---

## 8. 扩展到其他项目

这套版本管理规则可以应用于：

| 项目类型 | 版本文件 | 依赖同步 |
|----------|----------|----------|
| Python (uv) | `pyproject.toml` | `uv sync` |
| Python (poetry) | `pyproject.toml` | `poetry lock` |
| Node.js | `package.json` | `npm install` |
| Rust | `Cargo.toml` | `cargo update` |
| Go | `version.go` | `go mod tidy` |

对于 Node.js 项目，只需调整版本读取和更新逻辑：

```javascript
// bump-version.js (Node.js 版本)
const fs = require('fs');
const path = require('path');

const packagePath = path.join(process.cwd(), 'package.json');
const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));

const [major, minor] = pkg.version.split('.').map(Number);
const newVersion = `${major}.${minor + 1}.0`;

pkg.version = newVersion;
fs.writeFileSync(packagePath, JSON.stringify(pkg, null, 2) + '\n');

console.log(`Version bumped: ${pkg.version} -> ${newVersion}`);
```
