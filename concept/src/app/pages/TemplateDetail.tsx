import { Link, useParams } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import type { ComponentType } from 'react';
import * as Icons from 'lucide-react';
import {
  ArrowLeft,
  CheckCircle2,
  Cpu,
  FileCode,
  Globe,
  HardDrive,
  Layers,
  Plus,
  Rocket,
  Server,
  Terminal,
  Trash2,
  Users,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Progress } from '../components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Textarea } from '../components/ui/textarea';
import { mockNamespaces, mockServers, mockTemplates } from '../data/mockData';
import { TemplatePlaceholder, TemplatePlaceholderType } from '../types';
import {
  getTemplateBlueprintFiles,
  getTemplatePlaceholders,
  getTemplateTokenSegments,
  resolveTemplateContent,
  saveTemplateBlueprintFiles,
  saveTemplatePlaceholders,
} from '../utils/templateBlueprint';

function normalizeKey(raw: string) {
  return raw.toUpperCase().replace(/[^A-Z0-9_]/g, '_').replace(/_+/g, '_').replace(/^_+|_+$/g, '');
}

export function TemplateDetail() {
  const { id, identifier } = useParams();
  const template = mockTemplates.find((candidate) => candidate.id === id);
  const namespace = identifier ? mockNamespaces.find((candidate) => candidate.id === identifier) : null;
  const isNamespaceScope = Boolean(identifier);
  const backTo = isNamespaceScope ? `/namespace/${identifier}/templates` : '/global/templates';

  if (!template || (isNamespaceScope && !namespace)) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <FileCode className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Template not found</h2>
          <Link to={backTo} className="text-blue-400 hover:text-blue-300">Back to templates</Link>
        </div>
      </div>
    );
  }

  const Icon = (Icons as Record<string, ComponentType<{ className?: string }>>)[template.icon] ?? FileCode;
  const deployments = mockServers.filter((server) => server.template === template.name);
  const scopedDeployments = isNamespaceScope ? deployments.filter((s) => s.namespaceId === identifier) : deployments;
  const avgCpu = scopedDeployments.length ? Math.round(scopedDeployments.reduce((sum, s) => sum + s.cpu, 0) / scopedDeployments.length) : 0;
  const avgMemory = scopedDeployments.length ? Math.round(scopedDeployments.reduce((sum, s) => sum + s.memory, 0) / scopedDeployments.length) : 0;

  const [placeholders, setPlaceholders] = useState<TemplatePlaceholder[]>(() => getTemplatePlaceholders(template));
  const [files, setFiles] = useState(() => getTemplateBlueprintFiles(template));
  const [selectedFilePath, setSelectedFilePath] = useState(files[0]?.path ?? '');
  const [draft, setDraft] = useState({
    key: '',
    label: '',
    type: 'string' as TemplatePlaceholderType,
    defaultValue: '',
    required: true,
    description: '',
    options: '',
  });

  useEffect(() => saveTemplatePlaceholders(template.id, placeholders), [placeholders, template.id]);
  useEffect(() => saveTemplateBlueprintFiles(template.id, files), [files, template.id]);
  useEffect(() => {
    if (!files.some((file) => file.path === selectedFilePath)) {
      setSelectedFilePath(files[0]?.path ?? '');
    }
  }, [files, selectedFilePath]);

  const selectedFile = files.find((file) => file.path === selectedFilePath) ?? files[0];
  const knownTokens = useMemo(() => new Set(placeholders.map((placeholder) => placeholder.key)), [placeholders]);
  const tokenSegments = useMemo(() => getTemplateTokenSegments(selectedFile?.content ?? '', knownTokens), [knownTokens, selectedFile?.content]);
  const sampleValues = useMemo(() => Object.fromEntries(placeholders.map((placeholder) => [placeholder.key, placeholder.defaultValue ?? ''])), [placeholders]);

  const updatePlaceholder = (idToUpdate: string, patch: Partial<TemplatePlaceholder>) => {
    setPlaceholders((previous) => previous.map((placeholder) => {
      if (placeholder.id !== idToUpdate) {
        return placeholder;
      }
      const updated = { ...placeholder, ...patch };
      if (patch.key !== undefined) {
        updated.key = normalizeKey(patch.key);
      }
      return updated;
    }));
  };

  const addPlaceholder = () => {
    const key = normalizeKey(draft.key);
    if (!key || placeholders.some((placeholder) => placeholder.key === key)) {
      return;
    }
    const options = draft.type === 'select'
      ? draft.options.split(',').map((option) => option.trim()).filter(Boolean)
      : undefined;

    setPlaceholders((previous) => [...previous, {
      id: `ph-${Date.now()}`,
      key,
      label: draft.label || key,
      type: draft.type,
      defaultValue: draft.defaultValue,
      required: draft.required,
      description: draft.description || undefined,
      options,
    }]);
    setDraft({ key: '', label: '', type: 'string', defaultValue: '', required: true, description: '', options: '' });
  };

  const insertToken = (tokenKey: string) => {
    if (!selectedFile) {
      return;
    }
    const next = `${selectedFile.content}${selectedFile.content.endsWith('\n') ? '' : '\n'}{{${tokenKey}}}`;
    setFiles((previous) => previous.map((file) => file.path === selectedFile.path ? { ...file, content: next } : file));
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link to={backTo} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4"><ArrowLeft className="w-4 h-4" />Back to templates</Link>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className="p-3 rounded-lg bg-blue-600/20"><Icon className="w-8 h-8 text-blue-400" /></div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{template.name}</h1>
                <p className="text-slate-400 mb-3">{template.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge className="bg-slate-800 text-slate-200 border border-slate-700">Blueprint (Non-running)</Badge>
                  <Badge variant="outline" className="border-slate-700 capitalize">{template.type}</Badge>
                  <Badge variant="outline" className="border-slate-700">MC {template.minecraftVersion}</Badge>
                  <Badge variant="outline" className="border-slate-700">Java {template.javaVersion}</Badge>
                  {isNamespaceScope ? <Badge className="bg-purple-900/40 text-purple-300"><Layers className="w-3 h-3 mr-1" />{namespace?.name}</Badge> : <Badge className="bg-blue-900/40 text-blue-300"><Globe className="w-3 h-3 mr-1" />Global</Badge>}
                </div>
              </div>
            </div>
            <Button className="bg-blue-600 hover:bg-blue-700"><Rocket className="w-4 h-4 mr-2" />Deploy</Button>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-slate-900 border-slate-800"><CardContent className="pt-6"><p className="text-sm text-slate-400">CPU Budget</p><p className="text-2xl font-bold mt-1">{template.defaultCpu}</p></CardContent></Card>
          <Card className="bg-slate-900 border-slate-800"><CardContent className="pt-6"><p className="text-sm text-slate-400">Memory Budget</p><p className="text-2xl font-bold mt-1">{template.defaultMemory}</p></CardContent></Card>
          <Card className="bg-slate-900 border-slate-800"><CardContent className="pt-6"><p className="text-sm text-slate-400">Placeholders</p><p className="text-2xl font-bold mt-1">{placeholders.length}</p></CardContent></Card>
          <Card className="bg-slate-900 border-slate-800"><CardContent className="pt-6"><p className="text-sm text-slate-400">Deployments</p><p className="text-2xl font-bold mt-1">{scopedDeployments.length}</p></CardContent></Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="placeholders">Placeholders</TabsTrigger>
            <TabsTrigger value="files">Blueprint Files</TabsTrigger>
            <TabsTrigger value="deployments">Deployments</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle>Runtime Projection</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <div className="flex justify-between text-sm"><span className="text-slate-400">Expected CPU (from deployments)</span><span>{avgCpu}%</span></div>
                <Progress value={avgCpu} className="h-2" />
                <div className="flex justify-between text-sm"><span className="text-slate-400">Expected Memory (from deployments)</span><span>{avgMemory}%</span></div>
                <Progress value={avgMemory} className="h-2" />
                <div className="p-3 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-300">
                  Use placeholders to parameterize blueprint files per server instance without cloning templates.
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="placeholders" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle>Define Placeholder</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div><Label>Key</Label><Input value={draft.key} onChange={(e) => setDraft((p) => ({ ...p, key: e.target.value }))} className="mt-2 bg-slate-800 border-slate-700" placeholder="SERVER_NAME" /></div>
                  <div><Label>Label</Label><Input value={draft.label} onChange={(e) => setDraft((p) => ({ ...p, label: e.target.value }))} className="mt-2 bg-slate-800 border-slate-700" placeholder="Server Name" /></div>
                  <div><Label>Type</Label><Select value={draft.type} onValueChange={(value) => setDraft((p) => ({ ...p, type: value as TemplatePlaceholderType }))}><SelectTrigger className="mt-2 bg-slate-800 border-slate-700"><SelectValue /></SelectTrigger><SelectContent className="bg-slate-900 border-slate-800"><SelectItem value="string">String</SelectItem><SelectItem value="number">Number</SelectItem><SelectItem value="boolean">Boolean</SelectItem><SelectItem value="select">Select</SelectItem><SelectItem value="secret">Secret</SelectItem></SelectContent></Select></div>
                  <div><Label>Default</Label><Input value={draft.defaultValue} onChange={(e) => setDraft((p) => ({ ...p, defaultValue: e.target.value }))} className="mt-2 bg-slate-800 border-slate-700" /></div>
                  {draft.type === 'select' && <div className="md:col-span-2"><Label>Options</Label><Input value={draft.options} onChange={(e) => setDraft((p) => ({ ...p, options: e.target.value }))} className="mt-2 bg-slate-800 border-slate-700" placeholder="production, staging, development" /></div>}
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2"><Switch checked={draft.required} onCheckedChange={(value) => setDraft((p) => ({ ...p, required: value }))} /><span className="text-sm text-slate-300">Required</span></div>
                  <Button onClick={addPlaceholder} className="bg-blue-600 hover:bg-blue-700"><Plus className="w-4 h-4 mr-2" />Add</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle>Schema</CardTitle></CardHeader>
              <CardContent className="space-y-2">
                {placeholders.map((placeholder) => (
                  <div key={placeholder.id} className="p-3 rounded-lg bg-slate-800/40 border border-slate-700">
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-2">
                      <Input value={placeholder.key} onChange={(e) => updatePlaceholder(placeholder.id, { key: e.target.value })} className="bg-slate-800 border-slate-700 font-mono text-xs" />
                      <Input value={placeholder.label} onChange={(e) => updatePlaceholder(placeholder.id, { label: e.target.value })} className="bg-slate-800 border-slate-700" />
                      <Input value={placeholder.defaultValue ?? ''} onChange={(e) => updatePlaceholder(placeholder.id, { defaultValue: e.target.value })} className="bg-slate-800 border-slate-700" />
                      <Button variant="ghost" className="text-red-400 hover:text-red-300" onClick={() => setPlaceholders((previous) => previous.filter((p) => p.id !== placeholder.id))}><Trash2 className="w-4 h-4" /></Button>
                    </div>
                    <p className="text-xs text-slate-400 mt-2">Token: <span className="font-mono text-slate-200">{`{{${placeholder.key}}}`}</span></p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="files">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader><CardTitle>Files</CardTitle></CardHeader>
                <CardContent className="space-y-2">
                  {files.map((file) => (
                    <button key={file.path} type="button" onClick={() => setSelectedFilePath(file.path)} className={`w-full text-left rounded-md p-2 border ${selectedFilePath === file.path ? 'bg-slate-800 border-slate-600' : 'bg-slate-900 border-slate-800 hover:bg-slate-800/60'}`}>
                      <p className="font-mono text-xs">{file.path}</p>
                      <p className="text-xs text-slate-400 mt-1">{file.description}</p>
                    </button>
                  ))}
                </CardContent>
              </Card>
              <Card className="bg-slate-900 border-slate-800 lg:col-span-2">
                <CardHeader><CardTitle className="flex items-center gap-2"><Terminal className="w-4 h-4 text-blue-400" />{selectedFile?.path}</CardTitle></CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex gap-2 flex-wrap">
                    {placeholders.map((placeholder) => <Button key={placeholder.id} size="sm" variant="outline" className="h-7 border-slate-700 font-mono text-xs" onClick={() => insertToken(placeholder.key)}>{`{{${placeholder.key}}}`}</Button>)}
                  </div>
                  <Textarea value={selectedFile?.content ?? ''} onChange={(e) => selectedFile && setFiles((previous) => previous.map((file) => file.path === selectedFile.path ? { ...file, content: e.target.value } : file))} className="min-h-[220px] bg-slate-800 border-slate-700 font-mono text-xs" />
                  <div className="bg-black rounded-lg p-3 font-mono text-xs whitespace-pre-wrap break-words">
                    {tokenSegments.map((segment, index) => segment.isToken ? <span key={index} className={segment.isKnownToken ? 'bg-blue-900/40 text-blue-300 px-0.5 rounded' : 'bg-red-900/40 text-red-300 px-0.5 rounded'}>{segment.text}</span> : <span key={index} className="text-green-300">{segment.text}</span>)}
                  </div>
                  <pre className="bg-slate-900 border border-slate-700 rounded-lg p-3 text-xs text-slate-300 whitespace-pre-wrap break-words">{resolveTemplateContent(selectedFile?.content ?? '', sampleValues)}</pre>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="deployments" className="space-y-4">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader><CardTitle>Servers Using This Template</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                {scopedDeployments.length === 0 && <div className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 text-sm text-slate-400">No deployments currently linked to this template.</div>}
                {scopedDeployments.map((server) => (
                  <div key={server.id} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700 flex items-center justify-between">
                    <div>
                      <p className="font-medium">{server.name}</p>
                      <p className="text-xs text-slate-400 mt-1">{server.namespaceName} | {server.version}</p>
                    </div>
                    <Button asChild size="sm" variant="outline" className="border-slate-700"><Link to={`/namespace/${server.namespaceId}/servers/${server.id}`}>Open Server</Link></Button>
                  </div>
                ))}
              </CardContent>
            </Card>
            <Card className="bg-slate-900 border-slate-800">
              <CardContent className="pt-6">
                <div className="flex gap-3">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-emerald-200">Ready for Variable-driven Deployment</h3>
                    <p className="text-sm text-slate-400 mt-1">Servers created from this template can set placeholders instantly in server detail.</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
