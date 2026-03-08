import { useMemo } from 'react';
import { Link, useParams } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileBox,
  Globe,
  Layers,
  Package,
  Server,
  Trash2,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockNamespaces, mockResources } from '../data/mockData';
import { useVersionManagerSnapshot } from '../data/useVersionManager';
import { versionManager } from '../data/versionManager';
import type { FileNode, Resource } from '../types';

function nextPatchVersion(version: string) {
  const parts = version.split('.').map((part) => Number.parseInt(part, 10));
  if (parts.some((part) => Number.isNaN(part))) {
    return `${version}.1`;
  }
  const [major = 1, minor = 0, patch = 0] = parts;
  return `${major}.${minor}.${patch + 1}`;
}

function fallbackFileTree(resource: Resource): FileNode[] {
  if (resource.type === 'plugin') {
    return [
      { name: `${resource.name}.jar`, path: `/plugins/${resource.name}.jar`, type: 'file', size: 2_400_000 },
      { name: `${resource.name}.yml`, path: `/plugins/${resource.name}.yml`, type: 'file', size: 8_000 },
    ];
  }
  if (resource.type === 'mod') {
    return [
      { name: `${resource.name}.jar`, path: `/mods/${resource.name}.jar`, type: 'file', size: 12_500_000 },
      { name: 'dependencies', path: '/mods/dependencies', type: 'folder', children: [{ name: 'corelib.jar', path: '/mods/dependencies/corelib.jar', type: 'file', size: 3_100_000 }] },
    ];
  }
  if (resource.type === 'world') {
    return [
      { name: 'level.dat', path: '/world/level.dat', type: 'file', size: 20_480 },
      { name: 'region', path: '/world/region', type: 'folder', children: [{ name: 'r.0.0.mca', path: '/world/region/r.0.0.mca', type: 'file', size: 6_200_000 }] },
      { name: 'data', path: '/world/data', type: 'folder', children: [{ name: 'map_0.dat', path: '/world/data/map_0.dat', type: 'file', size: 36_000 }] },
    ];
  }
  if (resource.type === 'datapack') {
    return [
      { name: 'pack.mcmeta', path: '/datapack/pack.mcmeta', type: 'file', size: 600 },
      { name: 'data', path: '/datapack/data', type: 'folder', children: [{ name: 'load.mcfunction', path: '/datapack/data/load.mcfunction', type: 'file', size: 1_200 }] },
    ];
  }
  return [
    { name: `${resource.name}.yml`, path: `/config/${resource.name}.yml`, type: 'file', size: 8_000 },
    { name: 'README.md', path: '/config/README.md', type: 'file', size: 1_200 },
  ];
}

function collectFiles(tree: FileNode[]): FileNode[] {
  const out: FileNode[] = [];
  const walk = (nodes: FileNode[]) => {
    nodes.forEach((node) => {
      if (node.type === 'file') {
        out.push(node);
      } else if (node.children?.length) {
        walk(node.children);
      }
    });
  };
  walk(tree);
  return out.sort((a, b) => a.path.localeCompare(b.path));
}

export function ResourceDetail() {
  useVersionManagerSnapshot();
  const { id, identifier } = useParams();
  const isNamespaceScope = Boolean(identifier);
  const namespace = identifier
    ? mockNamespaces.find((candidate) => candidate.id === identifier)
    : null;
  const resource = mockResources.find(
    (candidate) => candidate.id === id && (!identifier || candidate.namespaceId === identifier),
  );
  const resourceNamespace = resource
    ? mockNamespaces.find((candidate) => candidate.id === resource.namespaceId)
    : null;
  const backTo = isNamespaceScope
    ? `/namespace/${identifier}/resources`
    : '/global/resources';

  if (!resource || (isNamespaceScope && !namespace)) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <FileBox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Resource not found</h2>
          <Link to={backTo} className="text-blue-400 hover:text-blue-300">
            Back to resources
          </Link>
        </div>
      </div>
    );
  }

  const typeColor: Record<string, string> = {
    plugin: 'bg-blue-900/40 text-blue-300',
    mod: 'bg-purple-900/40 text-purple-300',
    config: 'bg-orange-900/40 text-orange-300',
    world: 'bg-green-900/40 text-green-300',
    datapack: 'bg-pink-900/40 text-pink-300',
  };
  const fileTree = resource.fileTree && resource.fileTree.length > 0 ? resource.fileTree : fallbackFileTree(resource);
  const files = useMemo(() => collectFiles(fileTree), [fileTree]);
  const versionHistory = resource ? versionManager.listResourceVersions(resource.id) : [];
  const activeVersion = resource ? versionManager.getActiveResourceVersion(resource.id) : null;
  const downloadResource = () => {};
  const downloadFile = (_file: FileNode) => {};

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link to={backTo} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to resources
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${typeColor[resource.type] ?? 'bg-slate-800 text-slate-200'}`}>
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{resource.name}</h1>
                <p className="text-slate-400 mb-3">{resource.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={typeColor[resource.type] ?? 'bg-slate-800 text-slate-200'}>{resource.type}</Badge>
                  <Badge variant="outline" className="border-slate-700">
                    v{resource.version}
                  </Badge>
                  {isNamespaceScope ? (
                    <Badge className="bg-purple-900/40 text-purple-300">
                      <Layers className="w-3 h-3 mr-1" />
                      {namespace?.name}
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-900/40 text-blue-300">
                      <Globe className="w-3 h-3 mr-1" />
                      {resourceNamespace?.name ?? 'Global'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-700" onClick={downloadResource}>
                <Download className="w-4 h-4 mr-2" />
                Download Resource
              </Button>
              <Button variant="ghost" className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Package className="w-4 h-4 text-blue-400" />
                Size
              </div>
              <p className="text-2xl font-bold">{resource.size}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Server className="w-4 h-4 text-purple-400" />
                Used By
              </div>
              <p className="text-2xl font-bold">{resource.usedBy} servers</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Uploaded
              </div>
              <p className="text-2xl font-bold">{new Date(resource.uploadedAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Files</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {files.map((fileNode) => {
                const fileName = fileNode.name || fileNode.path.split('/').pop() || fileNode.path;
                return (
                  <div
                    key={fileNode.path}
                    className="rounded border border-slate-800 bg-slate-800/40 px-3 py-2 flex items-center justify-between gap-2"
                  >
                    <div className="min-w-0">
                      <p className="text-sm font-medium text-slate-100 truncate">{fileName}</p>
                      <p className="text-xs text-slate-400 truncate">{fileNode.path}</p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      className="h-7 text-slate-300 hover:text-white"
                      onClick={() => downloadFile(fileNode)}
                    >
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Labels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {resource.labels.map((label) => (
                <Badge key={label} variant="outline" className="border-slate-700">
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Version Management</CardTitle>
            <Button
              size="sm"
              variant="outline"
              className="border-slate-700"
              onClick={() =>
                versionManager.createResourceVersion({
                  resourceId: resource.id,
                  version: nextPatchVersion(activeVersion?.version ?? resource.version),
                  size: resource.size,
                  changelog: 'Automated draft created from current active version',
                  labelsSnapshot: resource.labels,
                  fileTree: resource.fileTree,
                  author: 'operator',
                  status: 'draft',
                })
              }
            >
              Create Draft
            </Button>
          </CardHeader>
          <CardContent className="space-y-2">
            {versionHistory.map((version) => (
              <div key={version.id} className="rounded border border-slate-800 bg-slate-800/40 px-3 py-2">
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium">v{version.version}</p>
                    <p className="text-xs text-slate-400">{version.changelog}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={version.status === 'active' ? 'bg-emerald-900/40 text-emerald-300' : 'bg-slate-800 text-slate-300'}>
                      {version.status}
                    </Badge>
                    {version.status !== 'active' && (
                      <Button size="sm" variant="outline" className="h-7 border-slate-700" onClick={() => versionManager.activateResourceVersion(resource.id, version.id)}>
                        Promote
                      </Button>
                    )}
                    {version.status === 'draft' && (
                      <Button size="sm" variant="ghost" className="h-7 text-slate-300" onClick={() => versionManager.setResourceVersionStatus(resource.id, version.id, 'deprecated')}>
                        Deprecate
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
