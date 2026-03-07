// Core types for Server Orchestrator

export type ServerStatus = 'running' | 'stopped' | 'starting' | 'error' | 'restarting';

export interface Namespace {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  serverCount: number;
  resourceCount: number;
  labels: string[];
}

export interface Server {
  id: string;
  name: string;
  namespaceId: string;
  namespaceName: string;
  status: ServerStatus;
  template: string;
  labels: string[];
  cpu: number;
  memory: number;
  maxCpu: number;
  maxMemory: number;
  uptime: string;
  players: number;
  maxPlayers: number;
  version: string;
  createdAt: string;
  lastRestart: string;
}

export interface Template {
  id: string;
  name: string;
  description: string;
  type: 'proxy' | 'lobby' | 'survival' | 'creative' | 'modded' | 'custom';
  minecraftVersion: string;
  javaVersion: string;
  defaultMemory: string;
  defaultCpu: string;
  restrictions: {
    canModifyJavaArgs: boolean;
    canInstallPlugins: boolean;
    canModifyConfig: boolean;
    allowedResources: string[];
  };
  icon: string;
  createdAt: string;
  placeholders?: TemplatePlaceholder[];
}

export interface Resource {
  id: string;
  name: string;
  type: 'plugin' | 'mod' | 'config' | 'world' | 'datapack';
  namespaceId: string;
  size: string;
  version: string;
  description: string;
  labels: string[];
  uploadedAt: string;
  usedBy: number;
}

export interface FileNode {
  name: string;
  path: string;
  type: 'file' | 'folder';
  size?: number;
  modified?: string;
  children?: FileNode[];
}

export interface Role {
  id: string;
  name: string;
  permissions: string[];
  namespaceId: string;
  description?: string;
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: string;
  namespaces: string[];
  displayName?: string;
  status?: 'active' | 'invited' | 'disabled';
  lastLogin?: string;
  mfaEnabled?: boolean;
}

export interface RoleBinding {
  id: string;
  userId: string;
  roleId: string;
  namespaceId: string;
  createdAt: string;
}

export type TemplatePlaceholderType = 'string' | 'number' | 'boolean' | 'select' | 'secret';

export interface TemplatePlaceholder {
  id: string;
  key: string;
  label: string;
  type: TemplatePlaceholderType;
  description?: string;
  defaultValue?: string;
  required?: boolean;
  options?: string[];
}

export interface TemplateBlueprintFile {
  path: string;
  description: string;
  content: string;
}
