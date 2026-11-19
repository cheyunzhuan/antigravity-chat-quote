# Antigravity Chat Quote & Notes (`chat-quote`)

[简体中文](#简体中文) | [English](#english)

---

## 简体中文

为 **Google Antigravity 2.0 桌面端** 打造的侧边栏「对话引用与批注」插件。在右侧辅助面板中以纯净文本方式浏览当前会话记录，随时划选任意文字或引用整条消息，加上你的批注后一键发送给 Agent 继续追问。

### 功能特性

- **纯净对话视图**：自动读取当前会话的 `transcript.jsonl` / `transcript_full.jsonl`，以 Markdown 渲染展示 User 与 Agent 对话，并支持一键切换「隐藏代码块」以专注阅读文字内容。
- **分段加载更轻量**：默认展示最新 **5** 条对话；滚动到顶部点击 **「显示更多」**，每次增量加载 **10** 条历史记录（5 → 15 → 25 …），避免长对话卡顿。
- **划词引用 & 整条引用**：
  - 鼠标划选任意文字后，自动在选区附近弹出高对比度 **「引用文字」** 悬浮按钮（默认蓝底白字，悬停高亮为绿底白字）。
  - 每条消息右上角提供 **「引用整条」** 按钮，快速引用完整回复。
- **多条引用 + 批注追问**：支持先收集多段引用内容并分别/统一添加批注，点击 **「发送给 Agent」** 直接发送到当前对话，或点击 **「复制引用格式」** 复制 Markdown 引用块。
- **自动跟随最新对话**：对话更新时自动刷新记录，支持 **「刷新」** 手动同步。

### 环境要求

- Google Antigravity 2.0 桌面端（内置 Node.js 与 `sidecar_sdk`）

### 安装方法

1. 克隆本仓库到 Antigravity 插件目录：
   ```bash
   # macOS / Linux
   git clone https://github.com/cheyunzhuan/antigravity-chat-quote.git ~/.gemini/config/plugins/chat-quote
   ```
   ```powershell
   # Windows (PowerShell)
   git clone https://github.com/cheyunzhuan/antigravity-chat-quote.git "$HOME\.gemini\config\plugins\chat-quote"
   ```
2. 重启 Antigravity，或在 **Customizations → Installed** 中开启 **Chat Quote & Notes**。
3. 在右侧辅助面板的 **Extensions** 中打开 **对话引用与批注** 即可使用。

---

## English

A sidebar **Chat Quote & Notes** plugin for the **Google Antigravity 2.0 desktop app**. Browse a clean, text-focused view of the active conversation in the right-side auxiliary panel, highlight any snippet or quote a full message, attach your notes, and send follow-up questions directly to the Agent.

### Features

- **Clean Conversation View**: Reads the active session's `transcript.jsonl` / `transcript_full.jsonl`, renders User and Agent messages in Markdown, and includes a **Hide Code Blocks** toggle for distraction-free reading.
- **Incremental Pagination**: Displays the latest **5** messages by default; scroll to the top and click **Show More** to load **10** additional older messages at a time (5 → 15 → 25 …).
- **Text Selection & Full-Message Quoting**:
  - Highlight any text to reveal a high-contrast floating **Quote Text** button (blue background by default, crisp green highlight on hover).
  - Click **Quote Message** on any card to quote the entire turn in one click.
- **Multi-Quote & Annotation Composer**: Collect one or more quotes, write your follow-up question or note, and either **Send to Agent** directly into the active conversation or **Copy Quote Markdown**.
- **Auto-Sync**: Automatically refreshes as the conversation progresses, with a manual **Refresh** button in the toolbar.

### Requirements

- Google Antigravity 2.0 desktop app (uses the built-in Node.js runtime and `sidecar_sdk`)

### Installation

1. Clone this repository into your Antigravity plugins directory:
   ```bash
   # macOS / Linux
   git clone https://github.com/cheyunzhuan/antigravity-chat-quote.git ~/.gemini/config/plugins/chat-quote
   ```
   ```powershell
   # Windows (PowerShell)
   git clone https://github.com/cheyunzhuan/antigravity-chat-quote.git "$HOME\.gemini\config\plugins\chat-quote"
   ```
2. Restart Antigravity, or enable **Chat Quote & Notes** under **Customizations → Installed**.
3. Open **对话引用与批注** from the **Extensions** menu in the right-side auxiliary panel.

### License

MIT
