import { mockResources, mockTemplates } from './mockData';
import type {
  FileNode,
  Resource,
  ResourceVersion,
  Template,
  TemplateVersion,
  VersionLifecycleStatus,
} from '../types';

interface VersionStoreState {
  resourceVersionsByResourceId: Record<string, ResourceVersion[]>;
  templateVersionsByTemplateId: Record<string, TemplateVersion[]>;
}

const STORAGE_KEY = 'orchestrator.version.store.v1';

type Listener = () => void;
const listeners = new Set<Listener>();

function subscribe(listener: Listener) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

function emit() {
  listeners.forEach((listener) => listener());
}

function isBrowser() {
  return typeof window !== 'undefined' && typeof window.localStorage !== 'undefined';
}

function parseVersion(version: string): number[] {
  const [main] = version.trim().split('-', 1);
  return main
    .split('.')
    .map((token) => Number.parseInt(token, 10))
    .map((value) => (Number.isNaN(value) ? 0 : value));
}

function compareVersions(a: string, b: string): number {
  const pa = parseVersion(a);
  const pb = parseVersion(b);
  const max = Math.max(pa.length, pb.length);
  for (let i = 0; i < max; i += 1) {
    const delta = (pa[i] ?? 0) - (pb[i] ?? 0);
    if (delta !== 0) {
      return delta;
    }
  }
  return 0;
}

function sortDescendingByVersion<T extends { version: string }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => compareVersions(b.version, a.version));
}

function nowIso() {
  return new Date().toISOString();
}

function buildResourceVersionFromResource(resource: Resource): ResourceVersion {
  return {
    id: `rver-${resource.id}-${resource.version.replaceAll('.', '-')}`,
    resourceId: resource.id,
    version: resource.version,
    status: 'active',
    size: resource.size,
    changelog: 'Initial imported version',
    createdAt: resource.uploadedAt,
    promotedAt: resource.uploadedAt,
    fileTree: resource.fileTree,
    labelsSnapshot: [...resource.labels],
    metadata: {
      author: 'system',
      summary: 'Seeded from static mock resource',
      createdAt: resource.uploadedAt,
    },
  };
}

function buildTemplateVersionFromTemplate(template: Template): TemplateVersion {
  return {
    id: `tver-${template.id}-${template.minecraftVersion.replaceAll('.', '-')}-${template.javaVersion}`,
    templateId: template.id,
    version: `1.0.${template.createdAt.slice(8, 10)}`,
    status: 'active',
    changelog: 'Initial imported version',
    createdAt: template.createdAt,
    promotedAt: template.createdAt,
    minecraftVersion: template.minecraftVersion,
    javaVersion: template.javaVersion,
    defaultMemory: template.defaultMemory,
    defaultCpu: template.defaultCpu,
    restrictionsSnapshot: { ...template.restrictions, allowedResources: [...template.restrictions.allowedResources] },
    placeholdersSnapshot: template.placeholders ? [...template.placeholders] : [],
    metadata: {
      author: 'system',
      summary: 'Seeded from static mock template',
      createdAt: template.createdAt,
    },
  };
}

function seedState(): VersionStoreState {
  const resourceVersionsByResourceId: Record<string, ResourceVersion[]> = {};
  mockResources.forEach((resource) => {
    resourceVersionsByResourceId[resource.id] = [buildResourceVersionFromResource(resource)];
  });

  const templateVersionsByTemplateId: Record<string, TemplateVersion[]> = {};
  mockTemplates.forEach((template) => {
    templateVersionsByTemplateId[template.id] = [buildTemplateVersionFromTemplate(template)];
  });

  return { resourceVersionsByResourceId, templateVersionsByTemplateId };
}

function cloneState(state: VersionStoreState): VersionStoreState {
  return {
    resourceVersionsByResourceId: Object.fromEntries(
      Object.entries(state.resourceVersionsByResourceId).map(([key, versions]) => [key, [...versions]]),
    ),
    templateVersionsByTemplateId: Object.fromEntries(
      Object.entries(state.templateVersionsByTemplateId).map(([key, versions]) => [key, [...versions]]),
    ),
  };
}

function loadState(): VersionStoreState {
  const fallback = seedState();
  if (!isBrowser()) {
    return fallback;
  }
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      return fallback;
    }
    const parsed = JSON.parse(raw) as VersionStoreState;
    if (!parsed || !parsed.resourceVersionsByResourceId || !parsed.templateVersionsByTemplateId) {
      return fallback;
    }
    return {
      resourceVersionsByResourceId: {
        ...fallback.resourceVersionsByResourceId,
        ...parsed.resourceVersionsByResourceId,
      },
      templateVersionsByTemplateId: {
        ...fallback.templateVersionsByTemplateId,
        ...parsed.templateVersionsByTemplateId,
      },
    };
  } catch {
    return fallback;
  }
}

let state: VersionStoreState = loadState();

function persist() {
  if (!isBrowser()) {
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function setStatus<T extends { status: VersionLifecycleStatus }>(
  versions: T[],
  predicate: (entry: T) => boolean,
  status: VersionLifecycleStatus,
): T[] {
  return versions.map((entry) => (predicate(entry) ? { ...entry, status } : entry));
}

function withStateMutated(mutator: (draft: VersionStoreState) => void) {
  const next = cloneState(state);
  mutator(next);
  state = next;
  persist();
  emit();
}

function listResourceVersions(resourceId: string): ResourceVersion[] {
  return sortDescendingByVersion(state.resourceVersionsByResourceId[resourceId] ?? []);
}

function listTemplateVersions(templateId: string): TemplateVersion[] {
  return sortDescendingByVersion(state.templateVersionsByTemplateId[templateId] ?? []);
}

function getActiveResourceVersion(resourceId: string): ResourceVersion | null {
  return listResourceVersions(resourceId).find((version) => version.status === 'active') ?? null;
}

function getActiveTemplateVersion(templateId: string): TemplateVersion | null {
  return listTemplateVersions(templateId).find((version) => version.status === 'active') ?? null;
}

function ensureResourceEntry(resourceId: string) {
  if (!state.resourceVersionsByResourceId[resourceId]) {
    state.resourceVersionsByResourceId[resourceId] = [];
  }
}

function ensureTemplateEntry(templateId: string) {
  if (!state.templateVersionsByTemplateId[templateId]) {
    state.templateVersionsByTemplateId[templateId] = [];
  }
}

function registerResource(resource: Resource, author = 'system') {
  withStateMutated((draft) => {
    if (draft.resourceVersionsByResourceId[resource.id]?.length) {
      return;
    }
    draft.resourceVersionsByResourceId[resource.id] = [{
      id: `rver-${resource.id}-${Date.now()}`,
      resourceId: resource.id,
      version: resource.version,
      status: 'active',
      size: resource.size,
      changelog: 'Initial resource upload',
      createdAt: resource.uploadedAt,
      promotedAt: resource.uploadedAt,
      fileTree: resource.fileTree,
      labelsSnapshot: [...resource.labels],
      metadata: {
        author,
        summary: 'Resource created',
        createdAt: resource.uploadedAt,
      },
    }];
  });
}

function registerTemplate(template: Template, author = 'system') {
  withStateMutated((draft) => {
    if (draft.templateVersionsByTemplateId[template.id]?.length) {
      return;
    }
    draft.templateVersionsByTemplateId[template.id] = [{
      id: `tver-${template.id}-${Date.now()}`,
      templateId: template.id,
      version: '1.0.0',
      status: 'active',
      changelog: 'Initial template creation',
      createdAt: template.createdAt,
      promotedAt: template.createdAt,
      minecraftVersion: template.minecraftVersion,
      javaVersion: template.javaVersion,
      defaultMemory: template.defaultMemory,
      defaultCpu: template.defaultCpu,
      restrictionsSnapshot: { ...template.restrictions, allowedResources: [...template.restrictions.allowedResources] },
      placeholdersSnapshot: template.placeholders ? [...template.placeholders] : [],
      metadata: {
        author,
        summary: 'Template created',
        createdAt: template.createdAt,
      },
    }];
  });
}

function createResourceVersion(input: {
  resourceId: string;
  version: string;
  size: string;
  changelog: string;
  labelsSnapshot: string[];
  fileTree?: FileNode[];
  author?: string;
  status?: VersionLifecycleStatus;
}) {
  withStateMutated((draft) => {
    const existing = draft.resourceVersionsByResourceId[input.resourceId] ?? [];
    if (existing.some((entry) => entry.version === input.version)) {
      return;
    }
    const createdAt = nowIso();
    const next: ResourceVersion = {
      id: `rver-${input.resourceId}-${Date.now()}`,
      resourceId: input.resourceId,
      version: input.version,
      status: input.status ?? 'draft',
      size: input.size,
      changelog: input.changelog,
      createdAt,
      promotedAt: input.status === 'active' ? createdAt : undefined,
      fileTree: input.fileTree,
      labelsSnapshot: [...input.labelsSnapshot],
      metadata: {
        author: input.author ?? 'system',
        summary: input.changelog,
        createdAt,
      },
    };
    const demoted = next.status === 'active'
      ? setStatus(existing, (entry) => entry.status === 'active', 'deprecated')
      : existing;
    draft.resourceVersionsByResourceId[input.resourceId] = sortDescendingByVersion([...demoted, next]);
  });
}

function createTemplateVersion(input: {
  templateId: string;
  version: string;
  changelog: string;
  minecraftVersion: string;
  javaVersion: string;
  defaultMemory: string;
  defaultCpu: string;
  restrictionsSnapshot: Template['restrictions'];
  placeholdersSnapshot?: Template['placeholders'];
  author?: string;
  status?: VersionLifecycleStatus;
}) {
  withStateMutated((draft) => {
    const existing = draft.templateVersionsByTemplateId[input.templateId] ?? [];
    if (existing.some((entry) => entry.version === input.version)) {
      return;
    }
    const createdAt = nowIso();
    const next: TemplateVersion = {
      id: `tver-${input.templateId}-${Date.now()}`,
      templateId: input.templateId,
      version: input.version,
      status: input.status ?? 'draft',
      changelog: input.changelog,
      createdAt,
      promotedAt: input.status === 'active' ? createdAt : undefined,
      minecraftVersion: input.minecraftVersion,
      javaVersion: input.javaVersion,
      defaultMemory: input.defaultMemory,
      defaultCpu: input.defaultCpu,
      restrictionsSnapshot: {
        ...input.restrictionsSnapshot,
        allowedResources: [...input.restrictionsSnapshot.allowedResources],
      },
      placeholdersSnapshot: input.placeholdersSnapshot ? [...input.placeholdersSnapshot] : [],
      metadata: {
        author: input.author ?? 'system',
        summary: input.changelog,
        createdAt,
      },
    };
    const demoted = next.status === 'active'
      ? setStatus(existing, (entry) => entry.status === 'active', 'deprecated')
      : existing;
    draft.templateVersionsByTemplateId[input.templateId] = sortDescendingByVersion([...demoted, next]);
  });
}

function activateResourceVersion(resourceId: string, versionId: string) {
  withStateMutated((draft) => {
    const versions = draft.resourceVersionsByResourceId[resourceId];
    if (!versions?.length) {
      return;
    }
    const hasTarget = versions.some((entry) => entry.id === versionId);
    if (!hasTarget) {
      return;
    }
    const now = nowIso();
    draft.resourceVersionsByResourceId[resourceId] = versions.map((entry) => {
      if (entry.id === versionId) {
        return { ...entry, status: 'active', promotedAt: now };
      }
      if (entry.status === 'active') {
        return { ...entry, status: 'deprecated' };
      }
      return entry;
    });
  });
}

function activateTemplateVersion(templateId: string, versionId: string) {
  withStateMutated((draft) => {
    const versions = draft.templateVersionsByTemplateId[templateId];
    if (!versions?.length) {
      return;
    }
    const hasTarget = versions.some((entry) => entry.id === versionId);
    if (!hasTarget) {
      return;
    }
    const now = nowIso();
    draft.templateVersionsByTemplateId[templateId] = versions.map((entry) => {
      if (entry.id === versionId) {
        return { ...entry, status: 'active', promotedAt: now };
      }
      if (entry.status === 'active') {
        return { ...entry, status: 'deprecated' };
      }
      return entry;
    });
  });
}

function setResourceVersionStatus(resourceId: string, versionId: string, status: Exclude<VersionLifecycleStatus, 'active'>) {
  withStateMutated((draft) => {
    const versions = draft.resourceVersionsByResourceId[resourceId];
    if (!versions?.length) {
      return;
    }
    draft.resourceVersionsByResourceId[resourceId] = versions.map((entry) => (
      entry.id === versionId ? { ...entry, status } : entry
    ));
  });
}

function setTemplateVersionStatus(templateId: string, versionId: string, status: Exclude<VersionLifecycleStatus, 'active'>) {
  withStateMutated((draft) => {
    const versions = draft.templateVersionsByTemplateId[templateId];
    if (!versions?.length) {
      return;
    }
    draft.templateVersionsByTemplateId[templateId] = versions.map((entry) => (
      entry.id === versionId ? { ...entry, status } : entry
    ));
  });
}

function syncMockArrays() {
  mockResources.forEach((resource) => {
    ensureResourceEntry(resource.id);
    const activeVersion = getActiveResourceVersion(resource.id);
    if (!activeVersion) {
      return;
    }
    resource.version = activeVersion.version;
    resource.size = activeVersion.size;
    resource.uploadedAt = activeVersion.createdAt;
    resource.fileTree = activeVersion.fileTree ?? resource.fileTree;
  });

  mockTemplates.forEach((template) => {
    ensureTemplateEntry(template.id);
    const activeVersion = getActiveTemplateVersion(template.id);
    if (!activeVersion) {
      return;
    }
    template.minecraftVersion = activeVersion.minecraftVersion;
    template.javaVersion = activeVersion.javaVersion;
    template.defaultMemory = activeVersion.defaultMemory;
    template.defaultCpu = activeVersion.defaultCpu;
    template.restrictions = {
      ...activeVersion.restrictionsSnapshot,
      allowedResources: [...activeVersion.restrictionsSnapshot.allowedResources],
    };
    template.placeholders = [...activeVersion.placeholdersSnapshot];
  });
}

function getSnapshotId() {
  return JSON.stringify(state);
}

// Keep flat mock arrays in sync for current consumers that still read them.
subscribe(syncMockArrays);
syncMockArrays();

export const versionManager = {
  subscribe,
  getSnapshotId,
  listResourceVersions,
  listTemplateVersions,
  getActiveResourceVersion,
  getActiveTemplateVersion,
  registerResource,
  registerTemplate,
  createResourceVersion,
  createTemplateVersion,
  activateResourceVersion,
  activateTemplateVersion,
  setResourceVersionStatus,
  setTemplateVersionStatus,
};
