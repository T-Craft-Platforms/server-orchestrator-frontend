import { useParams, Link } from 'react-router';
import { ArrowLeft, Layers, Server, FileBox, Settings, Users, Plus } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Badge } from '../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { mockNamespaces, mockServers, mockResources } from '../data/mockData';
import { Progress } from '../components/ui/progress';
import { DeployServerDialog } from '../components/DeployServerDialog';

export function NamespaceDetail() {
  const { id } = useParams();
  const namespace = mockNamespaces.find(ns => ns.id === id);

  if (!namespace) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Project not found</h2>
          <Link to="/global/projects" className="text-blue-400 hover:text-blue-300">
            Back to projects
          </Link>
        </div>
      </div>
    );
  }

  const namespaceServers = mockServers.filter(s => s.namespaceId === id);
  const namespaceResources = mockResources.filter(r => r.namespaceId === id);
  const runningServers = namespaceServers.filter(s => s.status === 'running').length;

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      {/* Header */}
      <div className="bg-slate-900 border-b border-slate-800 p-4 sm:p-6">
        <div className="max-w-7xl mx-auto">
          <Link to="/global/projects" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to projects
          </Link>
          
          <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="flex items-start gap-4 min-w-0">
              <div className="p-3 rounded-lg bg-purple-600/20">
                <Layers className="w-8 h-8 text-purple-400" />
              </div>
              <div>
                <h1 className="text-2xl sm:text-3xl font-bold mb-2">{namespace.name}</h1>
                <p className="text-slate-400 mb-2">{namespace.description}</p>
                <div className="flex items-center gap-2 flex-wrap">
                  {namespace.labels.map((label) => (
                    <Badge key={label} variant="outline" className="border-slate-700">
                      {label}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>
            
            <DeployServerDialog
              fixedNamespaceId={namespace.id}
              triggerLabel="Deploy Server"
              triggerClassName="w-full sm:w-auto bg-blue-600 hover:bg-blue-700"
            />
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-4 sm:p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Servers</CardTitle>
              <Server className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{namespace.serverCount}</div>
              <p className="text-xs text-green-500 mt-1">{runningServers} running</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Resources</CardTitle>
              <FileBox className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{namespace.resourceCount}</div>
              <p className="text-xs text-slate-400 mt-1">Plugins, mods, configs</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Created</CardTitle>
              <Layers className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-lg font-bold">
                {new Date(namespace.createdAt).toLocaleDateString()}
              </div>
              <p className="text-xs text-slate-400 mt-1">
                {Math.floor((Date.now() - new Date(namespace.createdAt).getTime()) / (1000 * 60 * 60 * 24))} days ago
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="servers" className="space-y-4">
          <div className="overflow-x-auto pb-1">
            <TabsList className="bg-slate-900 border border-slate-800 w-max min-w-full justify-start">
              <TabsTrigger value="servers">
                <Server className="w-4 h-4 mr-2" />
                Servers
              </TabsTrigger>
              <TabsTrigger value="resources">
                <FileBox className="w-4 h-4 mr-2" />
                Resources
              </TabsTrigger>
              <TabsTrigger value="rbac">
                <Users className="w-4 h-4 mr-2" />
                RBAC
              </TabsTrigger>
              <TabsTrigger value="settings">
                <Settings className="w-4 h-4 mr-2" />
                Settings
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Servers Tab */}
          <TabsContent value="servers">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {namespaceServers.map((server) => (
                <Card key={server.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <Server className="w-5 h-5 text-blue-400" />
                        <div>
                          <Link to={`/namespace/${namespace.id}/servers/${server.id}`} className="font-semibold hover:text-blue-400">
                            {server.name}
                          </Link>
                          <p className="text-xs text-slate-500">{server.template}</p>
                        </div>
                      </div>
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
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-3">
                      <div className="text-xs">
                        <span className="text-slate-500">Players:</span>
                        <span className="ml-1 text-white">{server.players}/{server.maxPlayers}</span>
                      </div>
                      <div className="text-xs">
                        <span className="text-slate-500">Uptime:</span>
                        <span className="ml-1 text-white">{server.uptime}</span>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500">CPU</span>
                          <span className="text-slate-400">{server.cpu}%</span>
                        </div>
                        <Progress value={server.cpu} className="h-1" />
                      </div>
                      <div>
                        <div className="flex items-center justify-between text-xs mb-1">
                          <span className="text-slate-500">Memory</span>
                          <span className="text-slate-400">{server.memory}%</span>
                        </div>
                        <Progress value={server.memory} className="h-1" />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Resources Tab */}
          <TabsContent value="resources">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {namespaceResources.map((resource) => (
                <Card key={resource.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-2">
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold truncate">{resource.name}</h3>
                        <p className="text-xs text-slate-400">v{resource.version}</p>
                      </div>
                      <Badge variant="secondary" className="text-xs">
                        {resource.type}
                      </Badge>
                    </div>
                    <p className="text-xs text-slate-500 mb-3 line-clamp-2">
                      {resource.description}
                    </p>
                    <div className="flex items-center justify-between text-xs text-slate-500">
                      <span>{resource.size}</span>
                      <span>{resource.usedBy} servers</span>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* RBAC Tab */}
          <TabsContent value="rbac">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Role-Based Access Control</CardTitle>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Role
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {['Admin', 'Reader'].map((role) => (
                    <div key={role} className="p-4 rounded-lg bg-slate-800/50 border border-slate-700">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{role}</h3>
                        <Badge variant="outline" className="border-slate-600">
                          {Math.floor(Math.random() * 5) + 1} users
                        </Badge>
                      </div>
                      <p className="text-sm text-slate-400 mb-3">
                        {role === 'Admin' && 'Administrative access in this project'}
                        {role === 'Reader' && 'Read-only access in this project'}
                      </p>
                      <div className="flex gap-1 flex-wrap">
                        {role === 'Admin' && (
                          <>
                            <Badge className="text-xs bg-green-900/30 text-green-300 border-0">project:admin</Badge>
                          </>
                        )}
                        {role === 'Reader' && (
                          <Badge className="text-xs bg-slate-700 text-slate-300 border-0">project:read</Badge>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Project Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h3 className="text-sm font-medium mb-3">General</h3>
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Name</label>
                      <input
                        type="text"
                        defaultValue={namespace.name}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Description</label>
                      <textarea
                        defaultValue={namespace.description}
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-sm font-medium mb-3">Resource Quotas</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Max Servers</label>
                      <input
                        type="number"
                        defaultValue="20"
                        className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-sm"
                      />
                    </div>
                    <div>
                      <label className="text-sm text-slate-400 mb-2 block">Max Storage (GB)</label>
                      <input
                        type="number"
                        defaultValue="500"
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
                        <h4 className="font-medium text-red-400">Delete Project</h4>
                        <p className="text-sm text-slate-400 mt-1">
                          This will permanently delete the project and all associated servers and resources
                        </p>
                      </div>
                      <Button variant="destructive">Delete</Button>
                    </div>
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
