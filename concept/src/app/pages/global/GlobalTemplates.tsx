import { useState } from 'react';
import { Link } from 'react-router';
import { Plus, Search, FileCode, Cpu, HardDrive, Globe } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { mockTemplates } from '../../data/mockData';
import { versionManager } from '../../data/versionManager';
import { useVersionManagerSnapshot } from '../../data/useVersionManager';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { Textarea } from '../../components/ui/textarea';
import { Switch } from '../../components/ui/switch';
import { Checkbox } from '../../components/ui/checkbox';
import { DeployServerDialog } from '../../components/DeployServerDialog';
import type { Template } from '../../types';

export function GlobalTemplates() {
  useVersionManagerSnapshot();
  const [templates, setTemplates] = useState<Template[]>([...mockTemplates]);
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [error, setError] = useState('');
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<Template['type']>('custom');
  const [minecraftVersion, setMinecraftVersion] = useState('1.20.4');
  const [javaVersion, setJavaVersion] = useState('21');
  const [defaultMemory, setDefaultMemory] = useState('4G');
  const [defaultCpu, setDefaultCpu] = useState('2000m');
  const [icon, setIcon] = useState('FileCode');
  const [canModifyJavaArgs, setCanModifyJavaArgs] = useState(true);
  const [canInstallPlugins, setCanInstallPlugins] = useState(true);
  const [canModifyConfig, setCanModifyConfig] = useState(true);
  const [allowedResources, setAllowedResources] = useState<Array<'plugin' | 'mod' | 'config' | 'world' | 'datapack'>>(['plugin', 'config']);

  const filteredTemplates = templates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || FileCode;
    return Icon;
  };

  const resetForm = () => {
    setError('');
    setName('');
    setDescription('');
    setType('custom');
    setMinecraftVersion('1.20.4');
    setJavaVersion('21');
    setDefaultMemory('4G');
    setDefaultCpu('2000m');
    setIcon('FileCode');
    setCanModifyJavaArgs(true);
    setCanInstallPlugins(true);
    setCanModifyConfig(true);
    setAllowedResources(['plugin', 'config']);
  };

  const toggleAllowedResource = (resource: 'plugin' | 'mod' | 'config' | 'world' | 'datapack') => {
    setAllowedResources((current) =>
      current.includes(resource)
        ? current.filter((item) => item !== resource)
        : [...current, resource]
    );
  };

  const createTemplate = () => {
    if (!name.trim()) {
      setError('Template name is required.');
      return;
    }
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (allowedResources.length === 0) {
      setError('Select at least one allowed resource type.');
      return;
    }

    const nextTemplate: Template = {
      id: `tpl-${Date.now()}`,
      name: name.trim(),
      description: description.trim(),
      type,
      minecraftVersion: minecraftVersion.trim(),
      javaVersion: javaVersion.trim(),
      defaultMemory: defaultMemory.trim(),
      defaultCpu: defaultCpu.trim(),
      restrictions: {
        canModifyJavaArgs,
        canInstallPlugins,
        canModifyConfig,
        allowedResources,
      },
      icon,
      createdAt: new Date().toISOString(),
    };

    setTemplates((current) => [nextTemplate, ...current]);
    mockTemplates.unshift(nextTemplate);
    versionManager.registerTemplate(nextTemplate, 'operator');
    setIsCreateOpen(false);
    resetForm();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Globe className="w-6 h-6 text-blue-500" />
              <h1 className="text-3xl font-bold">Global Templates</h1>
            </div>
            <p className="text-slate-400">Predefined server blueprints available across all namespaces</p>
          </div>
          <Dialog
            open={isCreateOpen}
            onOpenChange={(open) => {
              setIsCreateOpen(open);
              if (!open) {
                resetForm();
              }
            }}
          >
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Template
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-2xl">
              <DialogHeader>
                <DialogTitle>Create Template</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Define a reusable server blueprint with runtime defaults and restrictions.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-name">Name</Label>
                    <Input id="template-name" value={name} onChange={(e) => setName(e.target.value)} className="bg-slate-800 border-slate-700" placeholder="Skyblock Production" />
                  </div>
                  <div className="space-y-2">
                    <Label>Type</Label>
                    <Select value={type} onValueChange={(value) => setType(value as Template['type'])}>
                      <SelectTrigger className="bg-slate-800 border-slate-700">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-slate-900 border-slate-800">
                        <SelectItem value="proxy">proxy</SelectItem>
                        <SelectItem value="lobby">lobby</SelectItem>
                        <SelectItem value="survival">survival</SelectItem>
                        <SelectItem value="creative">creative</SelectItem>
                        <SelectItem value="modded">modded</SelectItem>
                        <SelectItem value="custom">custom</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="template-description">Description</Label>
                  <Textarea id="template-description" value={description} onChange={(e) => setDescription(e.target.value)} className="bg-slate-800 border-slate-700" placeholder="Template for managed production skyblock instances." />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="template-mc">Minecraft</Label>
                    <Input id="template-mc" value={minecraftVersion} onChange={(e) => setMinecraftVersion(e.target.value)} className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-java">Java</Label>
                    <Input id="template-java" value={javaVersion} onChange={(e) => setJavaVersion(e.target.value)} className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-memory">Memory</Label>
                    <Input id="template-memory" value={defaultMemory} onChange={(e) => setDefaultMemory(e.target.value)} className="bg-slate-800 border-slate-700" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="template-cpu">CPU</Label>
                    <Input id="template-cpu" value={defaultCpu} onChange={(e) => setDefaultCpu(e.target.value)} className="bg-slate-800 border-slate-700" />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Icon</Label>
                  <Select value={icon} onValueChange={setIcon}>
                    <SelectTrigger className="bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="FileCode">FileCode</SelectItem>
                      <SelectItem value="Server">Server</SelectItem>
                      <SelectItem value="Network">Network</SelectItem>
                      <SelectItem value="Pickaxe">Pickaxe</SelectItem>
                      <SelectItem value="Wrench">Wrench</SelectItem>
                      <SelectItem value="Home">Home</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="rounded-md border border-slate-800 p-3 space-y-3">
                  <p className="text-sm font-medium text-slate-300">Restrictions</p>
                  <label className="flex items-center justify-between gap-2 text-sm">
                    <span>Allow Java arguments override</span>
                    <Switch checked={canModifyJavaArgs} onCheckedChange={setCanModifyJavaArgs} />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-sm">
                    <span>Allow plugin installation</span>
                    <Switch checked={canInstallPlugins} onCheckedChange={setCanInstallPlugins} />
                  </label>
                  <label className="flex items-center justify-between gap-2 text-sm">
                    <span>Allow config modifications</span>
                    <Switch checked={canModifyConfig} onCheckedChange={setCanModifyConfig} />
                  </label>
                </div>

                <div className="space-y-2">
                  <Label>Allowed Resource Types</Label>
                  <div className="grid grid-cols-2 md:grid-cols-5 gap-2 rounded-md border border-slate-800 p-3">
                    {(['plugin', 'mod', 'config', 'world', 'datapack'] as const).map((resourceType) => (
                      <label key={resourceType} className="flex items-center gap-2 text-sm">
                        <Checkbox
                          checked={allowedResources.includes(resourceType)}
                          onCheckedChange={() => toggleAllowedResource(resourceType)}
                        />
                        <span className="capitalize">{resourceType}</span>
                      </label>
                    ))}
                  </div>
                </div>

                {error && <p className="text-sm text-red-300">{error}</p>}
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>Cancel</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={createTemplate}>Create Template</Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = getIcon(template.icon);
            return (
              <Card key={template.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-blue-600/20">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-slate-700 capitalize"
                    >
                      {template.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    <Link to={`/global/templates/${template.id}`} className="hover:text-blue-400">
                      {template.name}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-slate-400">{template.description}</p>
                </CardHeader>
                <CardContent>
                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-slate-400">CPU</span>
                      </div>
                      <p className="text-sm font-semibold">{template.defaultCpu}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <HardDrive className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-slate-400">Memory</span>
                      </div>
                      <p className="text-sm font-semibold">{template.defaultMemory}</p>
                    </div>
                  </div>

                  {/* Version Info */}
                  <div className="mb-4 pb-4 border-b border-slate-800">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Minecraft:</span>
                        <span className="ml-1 text-slate-300">{template.minecraftVersion}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Java:</span>
                        <span className="ml-1 text-slate-300">{template.javaVersion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Restrictions */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-400 uppercase">Permissions</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.restrictions.canModifyJavaArgs && (
                        <Badge variant="secondary" className="text-xs bg-green-900/30 text-green-300 border-0">
                          Java Args
                        </Badge>
                      )}
                      {template.restrictions.canInstallPlugins && (
                        <Badge variant="secondary" className="text-xs bg-blue-900/30 text-blue-300 border-0">
                          Plugins
                        </Badge>
                      )}
                      {template.restrictions.canModifyConfig && (
                        <Badge variant="secondary" className="text-xs bg-purple-900/30 text-purple-300 border-0">
                          Config
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Allowed: {template.restrictions.allowedResources.join(', ')}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button asChild variant="outline">
                      <Link to={`/global/templates/${template.id}`}>View Details</Link>
                    </Button>
                    <DeployServerDialog
                      fixedTemplateId={template.id}
                      triggerLabel="Deploy"
                      triggerVariant="outline"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileCode className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No templates found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
