import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Rocket } from 'lucide-react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { mockNamespaces, mockServers, mockTemplates } from '../data/mockData';
import type { Server, Template } from '../types';

interface DeployServerDialogProps {
  fixedTemplateId?: string;
  fixedNamespaceId?: string;
  triggerLabel?: string;
  triggerVariant?: 'default' | 'outline' | 'ghost';
  triggerClassName?: string;
  triggerSize?: 'default' | 'sm' | 'lg' | 'icon';
}

function parseCpuMillicores(value: string) {
  const parsed = Number.parseInt(value.replace('m', ''), 10);
  return Number.isNaN(parsed) ? 2000 : parsed;
}

function parseMemoryMb(value: string) {
  const normalized = value.trim().toUpperCase();
  if (normalized.endsWith('G')) {
    const parsed = Number.parseFloat(normalized.slice(0, -1));
    return Number.isNaN(parsed) ? 4096 : Math.round(parsed * 1024);
  }
  if (normalized.endsWith('M')) {
    const parsed = Number.parseFloat(normalized.slice(0, -1));
    return Number.isNaN(parsed) ? 4096 : Math.round(parsed);
  }
  const parsed = Number.parseInt(normalized, 10);
  return Number.isNaN(parsed) ? 4096 : parsed;
}

export function DeployServerDialog({
  fixedTemplateId,
  fixedNamespaceId,
  triggerLabel = 'Deploy',
  triggerVariant = 'outline',
  triggerClassName,
  triggerSize = 'default',
}: DeployServerDialogProps) {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [error, setError] = useState('');

  const defaultTemplateId = fixedTemplateId ?? mockTemplates[0]?.id ?? '';
  const defaultNamespaceId = fixedNamespaceId ?? mockNamespaces[0]?.id ?? '';
  const [templateId, setTemplateId] = useState(defaultTemplateId);
  const [namespaceId, setNamespaceId] = useState(defaultNamespaceId);
  const selectedTemplate = useMemo(
    () => mockTemplates.find((template) => template.id === templateId),
    [templateId]
  );
  const [name, setName] = useState('');
  const [maxPlayers, setMaxPlayers] = useState('100');

  const reset = () => {
    setError('');
    setTemplateId(fixedTemplateId ?? mockTemplates[0]?.id ?? '');
    setNamespaceId(fixedNamespaceId ?? mockNamespaces[0]?.id ?? '');
    setName('');
    setMaxPlayers('100');
  };

  const deploy = () => {
    const template: Template | undefined = mockTemplates.find((candidate) => candidate.id === templateId);
    const namespace = mockNamespaces.find((candidate) => candidate.id === namespaceId);
    const serverName = name.trim();

    if (!template) {
      setError('Template is required.');
      return;
    }
    if (!namespace) {
      setError('Namespace is required.');
      return;
    }
    if (!serverName) {
      setError('Server name is required.');
      return;
    }
    if (mockServers.some((server) => server.name.toLowerCase() === serverName.toLowerCase())) {
      setError('Server name already exists.');
      return;
    }

    const createdAt = new Date().toISOString();
    const nextServer: Server = {
      id: `srv-${Date.now()}`,
      name: serverName,
      namespaceId: namespace.id,
      namespaceName: namespace.name,
      status: 'starting',
      template: template.name,
      labels: [template.type, 'deployed'],
      cpu: 0,
      memory: 0,
      maxCpu: parseCpuMillicores(template.defaultCpu),
      maxMemory: parseMemoryMb(template.defaultMemory),
      uptime: '0d 0h 0m',
      players: 0,
      maxPlayers: Number.parseInt(maxPlayers, 10) || 100,
      version: template.minecraftVersion,
      createdAt,
      lastRestart: createdAt,
    };

    mockServers.unshift(nextServer);
    setOpen(false);
    navigate(`/namespace/${namespace.id}/servers/${nextServer.id}`);
    reset();
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(nextOpen) => {
        setOpen(nextOpen);
        if (!nextOpen) {
          reset();
        }
      }}
    >
      <DialogTrigger asChild>
        <Button variant={triggerVariant} className={triggerClassName} size={triggerSize}>
          <Rocket className="w-4 h-4 mr-2" />
          {triggerLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-lg">
        <DialogHeader>
          <DialogTitle>Deploy Server</DialogTitle>
          <DialogDescription className="text-slate-400">
            Create a new server from a template.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {!fixedTemplateId && (
            <div className="space-y-2">
              <Label>Template</Label>
              <Select value={templateId} onValueChange={setTemplateId}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select template" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  {mockTemplates.map((template) => (
                    <SelectItem key={template.id} value={template.id}>
                      {template.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          {!fixedNamespaceId && (
            <div className="space-y-2">
              <Label>Namespace</Label>
              <Select value={namespaceId} onValueChange={setNamespaceId}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Select namespace" />
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
          )}

          <div className="space-y-2">
            <Label htmlFor="server-name">Server Name</Label>
            <Input
              id="server-name"
              value={name}
              onChange={(event) => setName(event.target.value)}
              className="bg-slate-800 border-slate-700"
              placeholder={selectedTemplate ? `${selectedTemplate.type}-01` : 'server-01'}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="max-players">Max Players</Label>
            <Input
              id="max-players"
              type="number"
              min={1}
              value={maxPlayers}
              onChange={(event) => setMaxPlayers(event.target.value)}
              className="bg-slate-800 border-slate-700"
            />
          </div>

          {selectedTemplate && (
            <div className="rounded-md border border-slate-800 bg-slate-800/40 p-3 text-sm text-slate-300">
              <p>Template: {selectedTemplate.name}</p>
              <p>CPU: {selectedTemplate.defaultCpu}</p>
              <p>Memory: {selectedTemplate.defaultMemory}</p>
              <p>Minecraft: {selectedTemplate.minecraftVersion}</p>
            </div>
          )}

          {error && <p className="text-sm text-red-300">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Cancel
          </Button>
          <Button className="bg-blue-600 hover:bg-blue-700" onClick={deploy}>
            Deploy
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
