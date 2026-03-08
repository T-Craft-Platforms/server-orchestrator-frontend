import { useRef, useState } from 'react';
import { Upload } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import { Badge } from './ui/badge';
import { mockNamespaces } from '../data/mockData';
import type { FileNode, Resource } from '../types';

interface ResourceUploadDialogProps {
  triggerLabel?: string;
  triggerClassName?: string;
  fixedNamespaceId?: string;
  onCreate: (resource: Resource) => void;
}

function toHumanSize(bytes: number) {
  if (bytes <= 0) {
    return '0 B';
  }
  const units = ['B', 'KB', 'MB', 'GB'];
  let value = bytes;
  let unitIdx = 0;
  while (value >= 1024 && unitIdx < units.length - 1) {
    value /= 1024;
    unitIdx += 1;
  }
  return `${value.toFixed(value >= 10 ? 0 : 1)} ${units[unitIdx]}`;
}

function buildFileTreeFromFileList(files: File[]): FileNode[] {
  const root: FileNode[] = [];

  const getOrCreateFolder = (nodes: FileNode[], name: string, path: string) => {
    let folder = nodes.find((node) => node.type === 'folder' && node.name === name && node.path === path);
    if (!folder) {
      folder = { name, path, type: 'folder', children: [] };
      nodes.push(folder);
    }
    return folder;
  };

  files.forEach((file) => {
    const relativePath = (file.webkitRelativePath || file.name).replaceAll('\\', '/');
    const parts = relativePath.split('/').filter(Boolean);
    let currentNodes = root;
    let currentPath = '';

    parts.forEach((part, index) => {
      currentPath = currentPath ? `${currentPath}/${part}` : `/${part}`;
      const isLast = index === parts.length - 1;
      if (isLast) {
        currentNodes.push({
          name: part,
          path: currentPath,
          type: 'file',
          size: file.size,
          modified: new Date(file.lastModified).toISOString(),
        });
      } else {
        const folder = getOrCreateFolder(currentNodes, part, currentPath);
        if (!folder.children) {
          folder.children = [];
        }
        currentNodes = folder.children;
      }
    });
  });

  const sortTree = (nodes: FileNode[]) => {
    nodes.sort((a, b) => {
      if (a.type === b.type) {
        return a.name.localeCompare(b.name);
      }
      return a.type === 'folder' ? -1 : 1;
    });
    nodes.forEach((node) => {
      if (node.children?.length) {
        sortTree(node.children);
      }
    });
  };
  sortTree(root);

  return root;
}

export function ResourceUploadDialog({
  triggerLabel = 'Upload Resource',
  triggerClassName = 'bg-blue-600 hover:bg-blue-700',
  fixedNamespaceId,
  onCreate,
}: ResourceUploadDialogProps) {
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [type, setType] = useState<Resource['type']>('plugin');
  const [version, setVersion] = useState('1.0.0');
  const [namespaceId, setNamespaceId] = useState(fixedNamespaceId ?? mockNamespaces[0]?.id ?? 'ns-1');
  const [description, setDescription] = useState('');
  const [labels, setLabels] = useState('');
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [error, setError] = useState('');

  const clearForm = () => {
    setName('');
    setType('plugin');
    setVersion('1.0.0');
    setNamespaceId(fixedNamespaceId ?? mockNamespaces[0]?.id ?? 'ns-1');
    setDescription('');
    setLabels('');
    setSelectedFiles([]);
    setError('');
  };

  const submit = () => {
    if (!name.trim()) {
      setError('Resource name is required.');
      return;
    }
    if (!version.trim()) {
      setError('Version is required.');
      return;
    }
    if (!namespaceId) {
      setError('Namespace is required.');
      return;
    }
    if (selectedFiles.length === 0) {
      setError('Select at least one file or folder.');
      return;
    }

    const totalBytes = selectedFiles.reduce((sum, file) => sum + file.size, 0);
    const fileTree = buildFileTreeFromFileList(selectedFiles);
    const nextResource: Resource = {
      id: `res-${Date.now()}`,
      name: name.trim(),
      type,
      namespaceId,
      size: toHumanSize(totalBytes),
      version: version.trim(),
      description: description.trim() || 'Uploaded resource',
      labels: labels
        .split(',')
        .map((value) => value.trim())
        .filter(Boolean),
      uploadedAt: new Date().toISOString(),
      usedBy: 0,
      fileTree,
    };

    onCreate(nextResource);
    setOpen(false);
    clearForm();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          clearForm();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className={triggerClassName}>
          <Upload className="w-4 h-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
        <DialogHeader>
          <DialogTitle>Upload Resource</DialogTitle>
          <DialogDescription className="text-slate-400">
            Upload one or more files and store them as a resource package.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resource-name">Name</Label>
              <Input
                id="resource-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                className="bg-slate-800 border-slate-700"
                placeholder="Economy Pack"
              />
            </div>
            <div className="space-y-2">
              <Label>Type</Label>
              <Select value={type} onValueChange={(value) => setType(value as Resource['type'])}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="plugin">plugin</SelectItem>
                  <SelectItem value="mod">mod</SelectItem>
                  <SelectItem value="config">config</SelectItem>
                  <SelectItem value="world">world</SelectItem>
                  <SelectItem value="datapack">datapack</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="resource-version">Version</Label>
              <Input
                id="resource-version"
                value={version}
                onChange={(event) => setVersion(event.target.value)}
                className="bg-slate-800 border-slate-700"
              />
            </div>
            <div className="space-y-2">
              <Label>Namespace</Label>
              <Select
                value={namespaceId}
                onValueChange={setNamespaceId}
                disabled={Boolean(fixedNamespaceId)}
              >
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  {mockNamespaces.map((namespace) => (
                    <SelectItem key={namespace.id} value={namespace.id}>
                      {namespace.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-description">Description</Label>
            <Textarea
              id="resource-description"
              value={description}
              onChange={(event) => setDescription(event.target.value)}
              className="bg-slate-800 border-slate-700"
              placeholder="What this resource contains and where it should be used."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="resource-labels">Labels (comma-separated)</Label>
            <Input
              id="resource-labels"
              value={labels}
              onChange={(event) => setLabels(event.target.value)}
              className="bg-slate-800 border-slate-700"
              placeholder="economy, stable, production"
            />
          </div>

          <div className="space-y-2">
            <Label>Files / Folder</Label>
            <input
              ref={fileInputRef}
              type="file"
              multiple
              className="hidden"
              onChange={(event) => {
                const files = Array.from(event.target.files ?? []);
                setSelectedFiles(files);
              }}
            />
            <Button
              type="button"
              variant="outline"
              className="border-slate-700"
              onClick={() => fileInputRef.current?.click()}
            >
              Select Files
            </Button>
            {selectedFiles.length > 0 && (
              <div className="rounded-md border border-slate-800 bg-slate-800/40 p-3 space-y-2 max-h-36 overflow-y-auto">
                {selectedFiles.map((file) => (
                  <div key={`${file.name}-${file.size}-${file.lastModified}`} className="flex items-center justify-between text-sm">
                    <span className="truncate">{file.webkitRelativePath || file.name}</span>
                    <Badge variant="outline" className="border-slate-700 ml-2">
                      {toHumanSize(file.size)}
                    </Badge>
                  </div>
                ))}
              </div>
            )}
          </div>

          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={submit}>
            Upload Resource
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
