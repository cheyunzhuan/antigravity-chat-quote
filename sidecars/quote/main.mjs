// Sidecar backend for Chat Quote & Notes panel.

import { existsSync, readFileSync, statSync } from 'node:fs';
import { homedir } from 'node:os';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Response, SidecarApp } from 'sidecar_sdk';

const HERE = dirname(fileURLToPath(import.meta.url));
const GEMINI_DIR = process.env.ANTIGRAVITY_GEMINI_DIR || join(homedir(), '.gemini');
const BRAIN_DIR = join(GEMINI_DIR, 'antigravity', 'brain');
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;

const app = new SidecarApp();

function cleanUserText(raw) {
  if (!raw) return '';
  let text = raw;
  const reqMatches = [...text.matchAll(/<USER_REQUEST>\s*([\s\S]*?)\s*<\/USER_REQUEST>/g)];
  if (reqMatches.length > 0) {
    text = reqMatches.map((m) => m[1].trim()).filter(Boolean).join('\n\n');
  } else {
    text = text
      .replace(/<ADDITIONAL_METADATA>[\s\S]*?<\/ADDITIONAL_METADATA>/g, '')
      .replace(/<SYSTEM_MESSAGE>[\s\S]*?<\/SYSTEM_MESSAGE>/g, '');
  }
  return text.trim();
}

function cleanAgentText(raw, hideCode) {
  if (!raw) return '';
  let text = raw;
  if (hideCode) {
    text = text.replace(/```[\s\S]*?```/g, '').replace(/\n{3,}/g, '\n\n');
  }
  // Simplify markdown links [label](url) -> label (unless http url is helpful, keep label for clean reading)
  text = text.replace(/\[([^\]]+)\]\((?:file|sidecar|customization):\/\/[^)]+\)/g, '$1');
  return text.trim();
}

function loadMessages(conversationId, hideCode) {
  if (!UUID.test(conversationId || '')) {
    return { error: 'no-conversation', messages: [] };
  }
  const logDir = join(BRAIN_DIR, conversationId, '.system_generated', 'logs');
  const compactPath = join(logDir, 'transcript.jsonl');
  const fullPath = join(logDir, 'transcript_full.jsonl');

  if (!existsSync(compactPath)) {
    return { error: 'no-transcript', messages: [] };
  }

  const compactLines = readFileSync(compactPath, 'utf8').split('\n').filter(Boolean);
  let fullLines = null;

  const messages = [];
  for (let i = 0; i < compactLines.length; i++) {
    let obj;
    try {
      obj = JSON.parse(compactLines[i]);
    } catch {
      continue;
    }

    const type = obj.type;
    if (type !== 'USER_INPUT' && type !== 'PLANNER_RESPONSE') continue;

    if (Array.isArray(obj.truncated_fields) && obj.truncated_fields.includes('content') && existsSync(fullPath)) {
      if (!fullLines) {
        fullLines = readFileSync(fullPath, 'utf8').split('\n').filter(Boolean);
      }
      if (fullLines[i]) {
        try {
          const fullObj = JSON.parse(fullLines[i]);
          if (fullObj.content) obj.content = fullObj.content;
        } catch { /* fallback to compact */ }
      }
    }

    const rawContent = obj.content || '';
    if (!rawContent) continue;

    if (type === 'USER_INPUT') {
      const text = cleanUserText(rawContent);
      if (text) {
        messages.push({ id: `m-${i}`, role: 'user', text, createdAt: obj.created_at || '' });
      }
    } else if (type === 'PLANNER_RESPONSE') {
      const text = cleanAgentText(rawContent, hideCode);
      if (text) {
        messages.push({ id: `m-${i}`, role: 'agent', text, createdAt: obj.created_at || '' });
      }
    }
  }

  let mtimeMs = 0;
  try { mtimeMs = statSync(compactPath).mtimeMs; } catch { /* ignore */ }
  return { messages, mtimeMs };
}

app.page('/', () => new Response(readFileSync(join(HERE, 'index.html'), 'utf8'), {
  contentType: 'text/html; charset=utf-8',
  headers: { 'Cache-Control': 'no-store' },
}));

app.api('/api/messages', async (data) => {
  try {
    const hideCode = data.hideCode !== '0' && data.hideCode !== 'false';
    return loadMessages(data.conversationId, hideCode);
  } catch (err) {
    return { error: err.message, messages: [] };
  }
}, 'GET');

app.run();
