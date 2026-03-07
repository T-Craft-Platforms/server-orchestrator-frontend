import { Template, TemplateBlueprintFile, TemplatePlaceholder } from '../types';

const TEMPLATE_PLACEHOLDER_KEY = 'orchestrator.template.placeholders.v1';
const TEMPLATE_FILES_KEY = 'orchestrator.template.files.v1';
const SERVER_PLACEHOLDER_VALUES_KEY = 'orchestrator.server.placeholder.values.v1';

type PlaceholderStore = Record<string, TemplatePlaceholder[]>;
type FileStore = Record<string, TemplateBlueprintFile[]>;
type ServerValueStore = Record<string, Record<string, string>>;

function hasWindow() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function readJson<T>(key: string, fallback: T): T {
  if (!hasWindow()) {
    return fallback;
  }

  try {
    const raw = window.localStorage.getItem(key);
    if (!raw) {
      return fallback;
    }
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function writeJson<T>(key: string, value: T) {
  if (!hasWindow()) {
    return;
  }
  window.localStorage.setItem(key, JSON.stringify(value));
}

function estimatedPlayersByTemplateType(type: Template['type']) {
  const map: Record<Template['type'], number> = {
    proxy: 800,
    lobby: 200,
    survival: 150,
    creative: 120,
    modded: 80,
    custom: 100,
  };
  return map[type] ?? 100;
}

function slugifyTemplateName(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

export function createDefaultTemplatePlaceholders(template: Template): TemplatePlaceholder[] {
  return [
    {
      id: `${template.id}-ph-server-name`,
      key: 'SERVER_NAME',
      label: 'Server Name',
      type: 'string',
      description: 'Unique server deployment name.',
      defaultValue: `${slugifyTemplateName(template.name)}-01`,
      required: true,
    },
    {
      id: `${template.id}-ph-namespace`,
      key: 'NAMESPACE',
      label: 'Namespace',
      type: 'string',
      description: 'Kubernetes namespace target.',
      defaultValue: 'default',
      required: true,
    },
    {
      id: `${template.id}-ph-max-players`,
      key: 'MAX_PLAYERS',
      label: 'Max Players',
      type: 'number',
      description: 'Max concurrent players.',
      defaultValue: String(estimatedPlayersByTemplateType(template.type)),
      required: true,
    },
    {
      id: `${template.id}-ph-memory`,
      key: 'MEMORY_LIMIT',
      label: 'Memory Limit',
      type: 'string',
      description: 'Memory override for this server.',
      defaultValue: template.defaultMemory,
      required: true,
    },
    {
      id: `${template.id}-ph-env`,
      key: 'ENVIRONMENT',
      label: 'Environment',
      type: 'select',
      description: 'Deployment environment class.',
      defaultValue: 'production',
      options: ['production', 'staging', 'development'],
      required: true,
    },
    {
      id: `${template.id}-ph-whitelist`,
      key: 'ENABLE_WHITELIST',
      label: 'Enable Whitelist',
      type: 'boolean',
      description: 'Toggles whitelist mode.',
      defaultValue: 'false',
      required: false,
    },
    {
      id: `${template.id}-ph-rcon-password`,
      key: 'RCON_PASSWORD',
      label: 'RCON Password',
      type: 'secret',
      description: 'Remote console password.',
      defaultValue: '',
      required: false,
    },
  ];
}

export function createDefaultTemplateFiles(template: Template): TemplateBlueprintFile[] {
  return [
    {
      path: 'template.yaml',
      description: 'Main deployment blueprint.',
      content: `apiVersion: orchestrator/v1
kind: ServerInstance
metadata:
  name: "{{SERVER_NAME}}"
spec:
  templateRef: "${template.id}"
  namespace: "{{NAMESPACE}}"
  environment: "{{ENVIRONMENT}}"
  resources:
    memory: "{{MEMORY_LIMIT}}"
  config:
    maxPlayers: "{{MAX_PLAYERS}}"
    whitelist: "{{ENABLE_WHITELIST}}"`,
    },
    {
      path: 'server.properties',
      description: 'Runtime server properties.',
      content: `motd=${template.name}
max-players={{MAX_PLAYERS}}
online-mode=true
enable-rcon=true
rcon.password={{RCON_PASSWORD}}
white-list={{ENABLE_WHITELIST}}`,
    },
    {
      path: 'startup.sh',
      description: 'Container startup bootstrap script.',
      content: `#!/usr/bin/env sh
set -eu
echo "Starting {{SERVER_NAME}} in {{NAMESPACE}} ({{ENVIRONMENT}})"
exec java -Xms2G -Xmx{{MEMORY_LIMIT}} -jar server.jar --nogui`,
    },
  ];
}

export function getTemplatePlaceholders(template: Template): TemplatePlaceholder[] {
  const store = readJson<PlaceholderStore>(TEMPLATE_PLACEHOLDER_KEY, {});
  return store[template.id] ?? template.placeholders ?? createDefaultTemplatePlaceholders(template);
}

export function saveTemplatePlaceholders(templateId: string, placeholders: TemplatePlaceholder[]) {
  const store = readJson<PlaceholderStore>(TEMPLATE_PLACEHOLDER_KEY, {});
  store[templateId] = placeholders;
  writeJson(TEMPLATE_PLACEHOLDER_KEY, store);
}

export function getTemplateBlueprintFiles(template: Template): TemplateBlueprintFile[] {
  const store = readJson<FileStore>(TEMPLATE_FILES_KEY, {});
  return store[template.id] ?? createDefaultTemplateFiles(template);
}

export function saveTemplateBlueprintFiles(templateId: string, files: TemplateBlueprintFile[]) {
  const store = readJson<FileStore>(TEMPLATE_FILES_KEY, {});
  store[templateId] = files;
  writeJson(TEMPLATE_FILES_KEY, store);
}

export function getServerPlaceholderValues(serverId: string): Record<string, string> {
  const store = readJson<ServerValueStore>(SERVER_PLACEHOLDER_VALUES_KEY, {});
  return store[serverId] ?? {};
}

export function saveServerPlaceholderValues(serverId: string, values: Record<string, string>) {
  const store = readJson<ServerValueStore>(SERVER_PLACEHOLDER_VALUES_KEY, {});
  store[serverId] = values;
  writeJson(SERVER_PLACEHOLDER_VALUES_KEY, store);
}

export function resolveTemplateContent(content: string, values: Record<string, string>) {
  return content.replace(/\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g, (_, key: string) => {
    const value = values[key];
    if (value === undefined || value === '') {
      return `<${key}:unset>`;
    }
    return value;
  });
}

export interface TokenSegment {
  text: string;
  isToken: boolean;
  tokenKey?: string;
  isKnownToken?: boolean;
}

export function getTemplateTokenSegments(content: string, knownKeys: Set<string>): TokenSegment[] {
  const segments: TokenSegment[] = [];
  const regex = /\{\{\s*([A-Za-z0-9_.-]+)\s*\}\}/g;

  let cursor = 0;
  let match = regex.exec(content);

  while (match) {
    const token = match[0];
    const key = match[1];
    const start = match.index;

    if (start > cursor) {
      segments.push({
        text: content.slice(cursor, start),
        isToken: false,
      });
    }

    segments.push({
      text: token,
      isToken: true,
      tokenKey: key,
      isKnownToken: knownKeys.has(key),
    });

    cursor = start + token.length;
    match = regex.exec(content);
  }

  if (cursor < content.length) {
    segments.push({
      text: content.slice(cursor),
      isToken: false,
    });
  }

  return segments;
}

