# DSH 配置文件示例

本目录包含 One-Prime 的 DSH 完整配置文件，用于复现相同的插件环境。

## 文件说明

| 文件 | 说明 |
|------|------|
| `cordis.patch.yml` | 核心插件配置（插件列表、补丁、设置） |
| `package.json` | npm 依赖清单（注入到 profile 的插件包） |
| `pnpm-workspace.yaml` | pnpm 构建设置（allowBuilds 等） |
| `plugins/` | 本地自定义插件源码 |

## 自定义插件

| 插件 | 说明 |
|------|------|
| `dsh-plugin-preflight` | 安装预检闸（配置语法/依赖完整性/干运行测试） |
| `dsh-web-search-wigolo` | Wigolo 搜索提供商适配（免费本地搜索） |

## 使用方法

```bash
# 1. 创建 profile
mkdir -p ~/.dsh/profiles/web

# 2. 复制配置
cp cordis.patch.yml ~/.dsh/profiles/web/
cp package.json ~/.dsh/profiles/web/
cp pnpm-workspace.yaml ~/.dsh/profiles/web/

# 3. 复制自定义插件
cp -r plugins/ ~/.dsh/profiles/web/plugins/

# 4. 安装依赖
cd ~/.dsh/profiles/web
pnpm install

# 5. 启动
npx @deepseek-ai/dsh --profile web --port 3080
```