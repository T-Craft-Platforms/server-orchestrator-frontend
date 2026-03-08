// Mock data for Server Orchestrator
import { Namespace, Server, Template, Resource, Role, User, RoleBinding } from '../types';

export const mockNamespaces: Namespace[] = [
  {
    id: 'ns-1',
    name: 'production-network',
    description: 'Main production Minecraft network',
    createdAt: '2024-01-15T10:00:00Z',
    serverCount: 8,
    resourceCount: 24,
    labels: ['production', 'main']
  },
  {
    id: 'ns-2',
    name: 'development-network',
    description: 'Development and testing environment',
    createdAt: '2024-02-01T14:30:00Z',
    serverCount: 3,
    resourceCount: 12,
    labels: ['development', 'testing']
  },
  {
    id: 'ns-3',
    name: 'event-servers',
    description: 'Temporary servers for special events',
    createdAt: '2024-02-20T09:15:00Z',
    serverCount: 2,
    resourceCount: 8,
    labels: ['event', 'temporary']
  }
];

export const mockServers: Server[] = [
  {
    id: 'srv-1',
    name: 'proxy-1',
    namespaceId: 'ns-1',
    namespaceName: 'production-network',
    status: 'running',
    template: 'Velocity Proxy',
    labels: ['proxy', 'production'],
    cpu: 45,
    memory: 62,
    maxCpu: 2000,
    maxMemory: 4096,
    uptime: '15d 4h 32m',
    players: 342,
    maxPlayers: 1000,
    version: '1.20.4',
    createdAt: '2024-01-15T10:30:00Z',
    lastRestart: '2024-02-15T03:00:00Z'
  },
  {
    id: 'srv-2',
    name: 'lobby-1',
    namespaceId: 'ns-1',
    namespaceName: 'production-network',
    status: 'running',
    template: 'Lobby Server',
    labels: ['lobby', 'production'],
    cpu: 28,
    memory: 45,
    maxCpu: 4000,
    maxMemory: 8192,
    uptime: '15d 4h 32m',
    players: 89,
    maxPlayers: 200,
    version: '1.20.4',
    createdAt: '2024-01-15T10:35:00Z',
    lastRestart: '2024-02-15T03:05:00Z'
  },
  {
    id: 'srv-3',
    name: 'survival-1',
    namespaceId: 'ns-1',
    namespaceName: 'production-network',
    status: 'running',
    template: 'Survival Server',
    labels: ['survival', 'production', 'paper'],
    cpu: 72,
    memory: 78,
    maxCpu: 6000,
    maxMemory: 12288,
    uptime: '8d 12h 15m',
    players: 142,
    maxPlayers: 150,
    version: '1.20.4',
    createdAt: '2024-01-15T11:00:00Z',
    lastRestart: '2024-02-22T04:00:00Z'
  },
  {
    id: 'srv-4',
    name: 'creative-1',
    namespaceId: 'ns-1',
    namespaceName: 'production-network',
    status: 'running',
    template: 'Creative Server',
    labels: ['creative', 'production'],
    cpu: 35,
    memory: 52,
    maxCpu: 4000,
    maxMemory: 8192,
    uptime: '15d 4h 32m',
    players: 34,
    maxPlayers: 100,
    version: '1.20.4',
    createdAt: '2024-01-15T11:30:00Z',
    lastRestart: '2024-02-15T03:15:00Z'
  },
  {
    id: 'srv-5',
    name: 'dev-test-1',
    namespaceId: 'ns-2',
    namespaceName: 'development-network',
    status: 'stopped',
    template: 'Development Server',
    labels: ['development', 'testing'],
    cpu: 0,
    memory: 0,
    maxCpu: 2000,
    maxMemory: 4096,
    uptime: '0d 0h 0m',
    players: 0,
    maxPlayers: 50,
    version: '1.20.4',
    createdAt: '2024-02-01T15:00:00Z',
    lastRestart: '2024-02-28T10:00:00Z'
  },
  {
    id: 'srv-6',
    name: 'modded-1',
    namespaceId: 'ns-1',
    namespaceName: 'production-network',
    status: 'running',
    template: 'Forge Modded',
    labels: ['modded', 'production', 'forge'],
    cpu: 85,
    memory: 88,
    maxCpu: 8000,
    maxMemory: 16384,
    uptime: '3d 8h 45m',
    players: 67,
    maxPlayers: 80,
    version: '1.20.1',
    createdAt: '2024-02-10T09:00:00Z',
    lastRestart: '2024-02-27T02:00:00Z'
  }
];

export const mockTemplates: Template[] = [
  {
    id: 'tpl-1',
    name: 'Velocity Proxy',
    description: 'High-performance Minecraft proxy for network management',
    type: 'proxy',
    minecraftVersion: '1.20.4',
    javaVersion: '21',
    defaultMemory: '4G',
    defaultCpu: '2000m',
    restrictions: {
      canModifyJavaArgs: false,
      canInstallPlugins: true,
      canModifyConfig: true,
      allowedResources: ['plugin', 'config']
    },
    icon: 'Network',
    createdAt: '2024-01-10T08:00:00Z'
  },
  {
    id: 'tpl-2',
    name: 'Lobby Server',
    description: 'Paper-based lobby server with custom plugins',
    type: 'lobby',
    minecraftVersion: '1.20.4',
    javaVersion: '21',
    defaultMemory: '8G',
    defaultCpu: '4000m',
    restrictions: {
      canModifyJavaArgs: true,
      canInstallPlugins: true,
      canModifyConfig: true,
      allowedResources: ['plugin', 'config', 'world']
    },
    icon: 'Home',
    createdAt: '2024-01-10T08:15:00Z'
  },
  {
    id: 'tpl-3',
    name: 'Survival Server',
    description: 'Optimized Paper survival server',
    type: 'survival',
    minecraftVersion: '1.20.4',
    javaVersion: '21',
    defaultMemory: '12G',
    defaultCpu: '6000m',
    restrictions: {
      canModifyJavaArgs: true,
      canInstallPlugins: true,
      canModifyConfig: true,
      allowedResources: ['plugin', 'config', 'world', 'datapack']
    },
    icon: 'Pickaxe',
    createdAt: '2024-01-10T08:30:00Z'
  },
  {
    id: 'tpl-4',
    name: 'Creative Server',
    description: 'Creative mode server with WorldEdit',
    type: 'creative',
    minecraftVersion: '1.20.4',
    javaVersion: '21',
    defaultMemory: '8G',
    defaultCpu: '4000m',
    restrictions: {
      canModifyJavaArgs: true,
      canInstallPlugins: true,
      canModifyConfig: true,
      allowedResources: ['plugin', 'config', 'world']
    },
    icon: 'Paintbrush',
    createdAt: '2024-01-10T08:45:00Z'
  },
  {
    id: 'tpl-5',
    name: 'Forge Modded',
    description: 'Forge modded server template',
    type: 'modded',
    minecraftVersion: '1.20.1',
    javaVersion: '17',
    defaultMemory: '16G',
    defaultCpu: '8000m',
    restrictions: {
      canModifyJavaArgs: true,
      canInstallPlugins: false,
      canModifyConfig: true,
      allowedResources: ['mod', 'config', 'world']
    },
    icon: 'Wrench',
    createdAt: '2024-01-10T09:00:00Z'
  }
];

export const mockResources: Resource[] = [
  {
    id: 'res-1',
    name: 'EssentialsX',
    type: 'plugin',
    namespaceId: 'ns-1',
    size: '2.4 MB',
    version: '2.20.1',
    description: 'Essential commands and features for Minecraft servers',
    labels: ['essential', 'commands'],
    uploadedAt: '2024-01-12T10:00:00Z',
    usedBy: 4
  },
  {
    id: 'res-2',
    name: 'WorldEdit',
    type: 'plugin',
    namespaceId: 'ns-1',
    size: '5.1 MB',
    version: '7.2.15',
    description: 'In-game map editor for Minecraft',
    labels: ['building', 'editing'],
    uploadedAt: '2024-01-12T10:15:00Z',
    usedBy: 2
  },
  {
    id: 'res-3',
    name: 'LuckPerms',
    type: 'plugin',
    namespaceId: 'ns-1',
    size: '3.8 MB',
    version: '5.4.108',
    description: 'Permissions plugin for Minecraft servers',
    labels: ['permissions', 'management'],
    uploadedAt: '2024-01-12T10:30:00Z',
    usedBy: 6
  },
  {
    id: 'res-4',
    name: 'Vault',
    type: 'plugin',
    namespaceId: 'ns-1',
    size: '1.2 MB',
    version: '1.7.3',
    description: 'Economy and permissions abstraction library',
    labels: ['economy', 'api'],
    uploadedAt: '2024-01-12T10:45:00Z',
    usedBy: 5
  },
  {
    id: 'res-5',
    name: 'PlaceholderAPI',
    type: 'plugin',
    namespaceId: 'ns-1',
    size: '892 KB',
    version: '2.11.5',
    description: 'Placeholder management for various plugins',
    labels: ['api', 'placeholders'],
    uploadedAt: '2024-01-12T11:00:00Z',
    usedBy: 4
  },
  {
    id: 'res-6',
    name: 'server.properties',
    type: 'config',
    namespaceId: 'ns-1',
    size: '4 KB',
    version: '1.0',
    description: 'Standard Minecraft server configuration',
    labels: ['config', 'default'],
    uploadedAt: '2024-01-13T09:00:00Z',
    usedBy: 8
  },
  {
    id: 'res-7',
    name: 'spigot.yml',
    type: 'config',
    namespaceId: 'ns-1',
    size: '8 KB',
    version: '1.0',
    description: 'Spigot server configuration',
    labels: ['config', 'spigot'],
    uploadedAt: '2024-01-13T09:15:00Z',
    usedBy: 6
  },
  {
    id: 'res-8',
    name: 'Create Mod',
    type: 'mod',
    namespaceId: 'ns-1',
    size: '12.5 MB',
    version: '0.5.1',
    description: 'Technology and decoration mod for Minecraft',
    labels: ['mod', 'technology'],
    uploadedAt: '2024-02-10T10:00:00Z',
    usedBy: 1
  }
];

export const mockUsers: User[] = [
  {
    id: 'usr-1',
    username: 'tadmin',
    displayName: 'T. Admin',
    email: 'tadmin@example.com',
    role: 'Global Admin',
    namespaces: ['ns-1', 'ns-2', 'ns-3'],
    status: 'active',
    lastLogin: '2026-03-03T07:42:00Z'
  },
  {
    id: 'usr-2',
    username: 'ops_julia',
    displayName: 'Julia Ops',
    email: 'julia.ops@example.com',
    role: 'Project Admin',
    namespaces: ['ns-1'],
    status: 'active',
    lastLogin: '2026-03-02T21:15:00Z'
  },
  {
    id: 'usr-3',
    username: 'dev_mark',
    displayName: 'Mark Dev',
    email: 'mark.dev@example.com',
    role: 'Project Reader',
    namespaces: ['ns-2', 'ns-3'],
    status: 'active',
    lastLogin: '2026-03-01T18:05:00Z'
  },
  {
    id: 'usr-4',
    username: 'auditor_lee',
    displayName: 'Lee Audit',
    email: 'lee.audit@example.com',
    role: 'Global Reader',
    namespaces: ['ns-1', 'ns-2', 'ns-3'],
    status: 'active',
    lastLogin: '2026-02-28T09:20:00Z'
  },
  {
    id: 'usr-5',
    username: 'contractor_nina',
    displayName: 'Nina Contractor',
    email: 'nina.contractor@example.com',
    role: 'Project Reader',
    namespaces: ['ns-3'],
    status: 'invited',
    lastLogin: undefined
  },
  {
    id: 'usr-6',
    username: 'legacy_bot',
    displayName: 'Legacy Bot',
    email: 'legacy.bot@example.com',
    role: 'Project Admin',
    namespaces: ['ns-1'],
    status: 'disabled',
    lastLogin: '2025-12-18T11:11:00Z'
  }
];

export const mockRoles: Role[] = [
  {
    id: 'role-global-admin',
    name: 'Global Admin',
    namespaceId: 'global',
    description: 'Administrative access for global scope.',
    permissions: ['global:admin']
  },
  {
    id: 'role-global-reader',
    name: 'Global Reader',
    namespaceId: 'global',
    description: 'Read-only access for global scope.',
    permissions: ['global:read']
  },
  {
    id: 'role-namespace-admin',
    name: 'Project Admin',
    namespaceId: 'project',
    description: 'Administrative access within a project.',
    permissions: ['project:admin']
  },
  {
    id: 'role-namespace-reader',
    name: 'Project Reader',
    namespaceId: 'project',
    description: 'Read-only access within a project.',
    permissions: ['project:read']
  }
];

export const mockRoleBindings: RoleBinding[] = [
  {
    id: 'rb-1',
    userId: 'usr-1',
    roleId: 'role-global-admin',
    namespaceId: 'global',
    createdAt: '2025-11-20T08:00:00Z'
  },
  {
    id: 'rb-2',
    userId: 'usr-4',
    roleId: 'role-global-reader',
    namespaceId: 'global',
    createdAt: '2025-12-02T12:00:00Z'
  },
  {
    id: 'rb-3',
    userId: 'usr-2',
    roleId: 'role-namespace-admin',
    namespaceId: 'ns-1',
    createdAt: '2026-01-08T09:30:00Z'
  },
  {
    id: 'rb-4',
    userId: 'usr-6',
    roleId: 'role-namespace-admin',
    namespaceId: 'ns-1',
    createdAt: '2025-10-14T14:10:00Z'
  },
  {
    id: 'rb-5',
    userId: 'usr-3',
    roleId: 'role-namespace-reader',
    namespaceId: 'ns-2',
    createdAt: '2026-01-22T10:00:00Z'
  },
  {
    id: 'rb-6',
    userId: 'usr-3',
    roleId: 'role-namespace-reader',
    namespaceId: 'ns-3',
    createdAt: '2026-01-22T10:10:00Z'
  },
  {
    id: 'rb-7',
    userId: 'usr-5',
    roleId: 'role-namespace-reader',
    namespaceId: 'ns-3',
    createdAt: '2026-02-26T16:45:00Z'
  }
];
