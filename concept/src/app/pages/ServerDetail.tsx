import { useParams, Link } from 'react-router';
import { useEffect, useMemo, useState } from 'react';
import { 
  ArrowLeft, 
  Play, 
  Square, 
  RotateCw,
  Cpu,
  HardDrive,
  Users,
  Clock,
  Server as ServerIcon,
  Settings,
  FileText,
  Activity,
  Terminal,
  SlidersHorizontal
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Progress } from '../components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../components/ui/select';
import { Switch } from '../components/ui/switch';
import { mockServers, mockTemplates } from '../data/mockData';
import { FileManager } from '../components/FileManager';
import { CodeEditor } from '../components/CodeEditor';
import { FileNode } from '../types';
import { ScrollArea } from '../components/ui/scroll-area';
import {
  getServerPlaceholderValues,
  getTemplateBlueprintFiles,
  getTemplatePlaceholders,
  resolveTemplateContent,
  saveServerPlaceholderValues,
} from '../utils/templateBlueprint';

export function ServerDetail() {
  const { id } = useParams();
  const server = mockServers.find(s => s.id === id);
  const serverTemplate = mockTemplates.find((template) => template.name === server?.template);
  const [selectedFile, setSelectedFile] = useState<FileNode | null>(null);
  const templatePlaceholders = useMemo(
    () => (serverTemplate ? getTemplatePlaceholders(serverTemplate) : []),
    [serverTemplate?.id],
  );
  const templateFiles = useMemo(
    () => (serverTemplate ? getTemplateBlueprintFiles(serverTemplate) : []),
    [serverTemplate?.id],
  );
  const [templateValues, setTemplateValues] = useState<Record<string, string>>({});
  const [previewFilePath, setPreviewFilePath] = useState('');

  useEffect(() => {
    if (!server || !serverTemplate) {
      return;
    }

    const saved = getServerPlaceholderValues(server.id);
    const seeded = Object.fromEntries(
      templatePlaceholders.map((placeholder) => [
        placeholder.key,
        saved[placeholder.key] ?? placeholder.defaultValue ?? '',
      ]),
    );
    setTemplateValues(seeded);
    setPreviewFilePath(templateFiles[0]?.path ?? '');
  }, [server?.id, serverTemplate?.id, templateFiles, templatePlaceholders]);

  if (!server) {
    return (
      <div className="min-h-screen bg-transparent text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <ServerIcon className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Server not found</h2>
          <Link to=".." relative="path" className="text-blue-400 hover:text-blue-300">
            Back to servers
          </Link>
        </div>
      </div>
    );
  }

  const selectedPreviewFile = templateFiles.find((file) => file.path === previewFilePath) ?? templateFiles[0];

  const applyTemplateValues = () => {
    saveServerPlaceholderValues(server.id, templateValues);
  };

  const resetTemplateValues = () => {
    const defaults = Object.fromEntries(
      templatePlaceholders.map((placeholder) => [
        placeholder.key,
        placeholder.defaultValue ?? '',
      ]),
    );
    setTemplateValues(defaults);
    saveServerPlaceholderValues(server.id, defaults);
  };

  return (
    <div className="min-h-screen bg-transparent text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Link to=".." relative="path" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to servers
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4 min-w-0">
              <div className="p-3 rounded-lg bg-blue-600/20">
                <ServerIcon className="w-8 h-8 text-blue-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{server.name}</h1>
                <div className="flex items-center gap-2 flex-wrap">
                  <Badge 
                    variant={server.status === 'running' ? 'default' : 'secondary'}
                    className={
                      server.status === 'running' 
                        ? 'bg-green-600 hover:bg-green-700' 
                        : 'bg-slate-700'
                    }
                  >
                    {server.status}
                  </Badge>
                  <Badge variant="outline" className="border-slate-700">
                    {server.namespaceName}
                  </Badge>
                  <Badge variant="outline" className="border-slate-700">
                    {server.template}
                  </Badge>
                  <span className="text-sm text-slate-400">v{server.version}</span>
                </div>
              </div>
            </div>
            
            <div className="flex w-full sm:w-auto gap-2">
              {server.status === 'running' ? (
                <>
                  <Button variant="outline" className="border-slate-700 flex-1 sm:flex-none">
                    <RotateCw className="w-4 h-4 mr-2" />
                    Restart
                  </Button>
                  <Button variant="outline" className="border-slate-700 flex-1 sm:flex-none">
                    <Square className="w-4 h-4 mr-2" />
                    Stop
                  </Button>
                </>
              ) : (
                <Button className="bg-green-600 hover:bg-green-700 w-full sm:w-auto">
                  <Play className="w-4 h-4 mr-2" />
                  Start
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Players</CardTitle>
              <Users className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{server.players} / {server.maxPlayers}</div>
              <Progress value={(server.players / server.maxPlayers) * 100} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">CPU Usage</CardTitle>
              <Cpu className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{server.cpu}%</div>
              <Progress value={server.cpu} className="h-1 mt-2" />
              <p className="text-xs text-slate-500 mt-1">{server.maxCpu}m allocated</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Memory</CardTitle>
              <HardDrive className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{server.memory}%</div>
              <Progress value={server.memory} className="h-1 mt-2" />
              <p className="text-xs text-slate-500 mt-1">{server.maxMemory}MB allocated</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Uptime</CardTitle>
              <Clock className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{server.uptime.split(' ')[0]}</div>
              <p className="text-xs text-slate-500 mt-1">
                Last restart: {new Date(server.lastRestart).toLocaleDateString()}
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="overview" className="space-y-4">
          <div className="overflow-x-auto pb-1">
            <TabsList className="bg-slate-900 border border-slate-800 w-max min-w-full justify-start">
              <TabsTrigger value="overview">
                <Activity className="w-4 h-4 mr-2" />
                Overview
              </TabsTrigger>
              <TabsTrigger value="files">
                <FileText className="w-4 h-4 mr-2" />
                Files
              </TabsTrigger>
              <TabsTrigger value="console">
                <Terminal className="w-4 h-4 mr-2" />
                Console
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
              <TabsTrigger value="template-vars">
                <SlidersHorizontal className="w-4 h-4 mr-2" />
                Template Vars
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Server Information</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Server ID</span>
                    <span className="font-mono text-sm">{server.id}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Template</span>
                    <span>{server.template}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Minecraft Version</span>
                    <span>{server.version}</span>
                  </div>
                  <div className="flex justify-between py-2 border-b border-slate-800">
                    <span className="text-slate-400">Created</span>
                    <span>{new Date(server.createdAt).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-slate-400">Labels</span>
                    <div className="flex gap-1 flex-wrap">
                      {server.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs border-slate-700">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-slate-900 border-slate-800">
                <CardHeader>
                  <CardTitle>Resource Allocation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-400">CPU Cores</span>
                      <span className="text-sm font-medium">{server.maxCpu}m</span>
                    </div>
                    <Progress value={server.cpu} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">Currently using {server.cpu}%</p>
                  </div>
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm text-slate-400">Memory</span>
                      <span className="text-sm font-medium">{server.maxMemory}MB</span>
                    </div>
                    <Progress value={server.memory} className="h-2" />
                    <p className="text-xs text-slate-500 mt-1">Currently using {server.memory}%</p>
                  </div>
                  <div className="pt-4 border-t border-slate-800">
                    <h4 className="text-sm font-medium mb-3">Container Details</h4>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-400">Image</span>
                        <span className="font-mono text-xs">minecraft:paper-1.20.4</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Project</span>
                        <span className="font-mono text-xs">{server.namespaceName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">Container Status</span>
                        <Badge className="bg-green-600">Running</Badge>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Files Tab */}
          <TabsContent value="files">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 h-[600px]">
              <div className="lg:col-span-1">
                <FileManager onFileSelect={setSelectedFile} selectedFile={selectedFile} />
              </div>
              <div className="lg:col-span-2">
                <CodeEditor file={selectedFile} />
              </div>
            </div>
          </TabsContent>

          {/* Console Tab */}
          <TabsContent value="console">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Server Console</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-black rounded-lg p-4 font-mono text-sm">
                  <ScrollArea className="h-[400px]">
                    <div className="space-y-1 text-green-400">
                      <div>[10:30:15] [Server thread/INFO]: Starting minecraft server version 1.20.4</div>
                      <div>[10:30:15] [Server thread/INFO]: Loading properties</div>
                      <div>[10:30:15] [Server thread/INFO]: Default game type: SURVIVAL</div>
                      <div>[10:30:16] [Server thread/INFO]: Starting Minecraft server on *:25565</div>
                      <div>[10:30:17] [Server thread/INFO]: Preparing level "world"</div>
                      <div>[10:30:18] [Server thread/INFO]: Done (2.456s)! For help, type "help"</div>
                      <div className="text-blue-400">[10:30:18] [Server thread/INFO]: [EssentialsX] Enabling EssentialsX v2.20.1</div>
                      <div className="text-blue-400">[10:30:19] [Server thread/INFO]: [LuckPerms] Enabling LuckPerms v5.4.108</div>
                      <div className="text-yellow-400">[10:30:20] [User Authenticator #1/INFO]: UUID of player Steve is 069a79f4-44e9-4726-a5be-fca90e38aaf5</div>
                      <div className="text-green-300">[10:30:20] [Server thread/INFO]: Steve joined the game</div>
                    </div>
                  </ScrollArea>
                </div>
                <div className="mt-4 flex gap-2">
                  <input
                    type="text"
                    placeholder="Type command..."
                    className="flex-1 bg-slate-800 border border-slate-700 rounded-lg px-4 py-2 text-sm font-mono"
                  />
                  <Button>Execute</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Server Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">Resource Limits</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">CPU Limit (millicores)</label>
                      <input
                        type="number"
                        defaultValue={server.maxCpu}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Memory Limit (MB)</label>
                      <input
                        type="number"
                        defaultValue={server.maxMemory}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium mb-3">Danger Zone</h3>
                  <div className="border border-red-900/50 rounded-lg p-4 bg-red-950/20">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium text-red-400">Delete Server</h4>
                        <p className="text-sm text-slate-400 mt-1">
                          Permanently delete this server and all its data
                        </p>
                      </div>
                      <Button variant="destructive">Delete</Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="template-vars">
            <div className="space-y-4">
              {!serverTemplate && (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-6 text-slate-400">
                    This server has no linked template definition for placeholder configuration.
                  </CardContent>
                </Card>
              )}

              {serverTemplate && templatePlaceholders.length === 0 && (
                <Card className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-6 text-slate-400">
                    No template placeholders defined yet. Open the template detail to define variables first.
                  </CardContent>
                </Card>
              )}

              {serverTemplate && templatePlaceholders.length > 0 && (
                <>
                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Instant Template Configuration</CardTitle>
                        <div className="flex gap-2">
                          <Button variant="outline" className="border-slate-700" onClick={resetTemplateValues}>
                            Reset Defaults
                          </Button>
                          <Button className="bg-blue-600 hover:bg-blue-700" onClick={applyTemplateValues}>
                            Apply to Server
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {templatePlaceholders.map((placeholder) => (
                        <div key={placeholder.id} className="p-3 rounded-lg bg-slate-800/50 border border-slate-700">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <p className="font-medium">{placeholder.label}</p>
                              <p className="text-xs text-slate-400 font-mono">{`{{${placeholder.key}}}`}</p>
                            </div>
                            <Badge variant="outline" className="border-slate-700 text-xs">
                              {placeholder.type}
                            </Badge>
                          </div>

                          {placeholder.type === 'boolean' && (
                            <div className="flex items-center gap-2">
                              <Switch
                                checked={templateValues[placeholder.key] === 'true'}
                                onCheckedChange={(value) =>
                                  setTemplateValues((previous) => ({
                                    ...previous,
                                    [placeholder.key]: value ? 'true' : 'false',
                                  }))
                                }
                              />
                              <span className="text-sm text-slate-300">
                                {templateValues[placeholder.key] === 'true' ? 'Enabled' : 'Disabled'}
                              </span>
                            </div>
                          )}

                          {placeholder.type === 'select' && (
                            <Select
                              value={templateValues[placeholder.key] ?? placeholder.defaultValue ?? ''}
                              onValueChange={(value) =>
                                setTemplateValues((previous) => ({
                                  ...previous,
                                  [placeholder.key]: value,
                                }))
                              }
                            >
                              <SelectTrigger className="bg-slate-800 border-slate-700">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent className="bg-slate-900 border-slate-800">
                                {(placeholder.options ?? []).map((option) => (
                                  <SelectItem key={option} value={option}>
                                    {option}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}

                          {placeholder.type !== 'boolean' && placeholder.type !== 'select' && (
                            <input
                              type={placeholder.type === 'secret' ? 'password' : placeholder.type === 'number' ? 'number' : 'text'}
                              value={templateValues[placeholder.key] ?? ''}
                              onChange={(event) =>
                                setTemplateValues((previous) => ({
                                  ...previous,
                                  [placeholder.key]: event.target.value,
                                }))
                              }
                              className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                            />
                          )}

                          {placeholder.description && (
                            <p className="text-xs text-slate-500 mt-2">{placeholder.description}</p>
                          )}
                        </div>
                      ))}
                    </CardContent>
                  </Card>

                  <Card className="bg-slate-900 border-slate-800">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Rendered Blueprint Preview</CardTitle>
                        <div className="w-72">
                          <Select value={selectedPreviewFile?.path ?? ''} onValueChange={setPreviewFilePath}>
                            <SelectTrigger className="bg-slate-800 border-slate-700">
                              <SelectValue placeholder="Select file" />
                            </SelectTrigger>
                            <SelectContent className="bg-slate-900 border-slate-800">
                              {templateFiles.map((file) => (
                                <SelectItem key={file.path} value={file.path}>
                                  {file.path}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <pre className="bg-black rounded-lg p-4 text-xs text-green-300 whitespace-pre-wrap break-words overflow-x-auto">
                        {resolveTemplateContent(selectedPreviewFile?.content ?? '', templateValues)}
                      </pre>
                    </CardContent>
                  </Card>
                </>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
