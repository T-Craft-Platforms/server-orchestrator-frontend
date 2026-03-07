import { Link } from 'react-router';
import { 
  Server, 
  Layers, 
  FileBox, 
  Activity,
  Users,
  Cpu,
  HardDrive,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { useNamespace } from '../../context/NamespaceContext';
import { mockNamespaces, mockServers, mockResources } from '../../data/mockData';

export function NamespaceDashboard() {
  const { selectedNamespace } = useNamespace();
  const namespace = mockNamespaces.find(ns => ns.id === selectedNamespace);
  
  if (!namespace || !selectedNamespace) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Namespace Selected</h2>
          <p className="text-slate-400">Please select a namespace from the dropdown</p>
        </div>
      </div>
    );
  }

  const namespaceServers = mockServers.filter(s => s.namespaceId === selectedNamespace);
  const namespaceResources = mockResources.filter(r => r.namespaceId === selectedNamespace);
  const runningServers = namespaceServers.filter(s => s.status === 'running').length;
  const totalPlayers = namespaceServers.reduce((sum, s) => sum + s.players, 0);
  const maxPlayers = namespaceServers.reduce((sum, s) => sum + s.maxPlayers, 0);
  const avgCpu = namespaceServers.length > 0 
    ? Math.round(namespaceServers.reduce((sum, s) => sum + s.cpu, 0) / namespaceServers.length)
    : 0;
  const avgMemory = namespaceServers.length > 0
    ? Math.round(namespaceServers.reduce((sum, s) => sum + s.memory, 0) / namespaceServers.length)
    : 0;

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">{namespace.name}</h1>
          </div>
          <p className="text-slate-400">{namespace.description}</p>
          <div className="flex gap-2 mt-3">
            {namespace.labels.map((label) => (
              <Badge key={label} variant="outline" className="border-slate-700">
                {label}
              </Badge>
            ))}
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Servers</CardTitle>
              <Server className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{namespaceServers.length}</div>
              <p className="text-xs text-green-500 mt-1">{runningServers} running</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Players</CardTitle>
              <Users className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlayers}</div>
              <p className="text-xs text-slate-400 mt-1">of {maxPlayers} max</p>
              <Progress value={(totalPlayers / maxPlayers) * 100} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg CPU</CardTitle>
              <Cpu className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgCpu}%</div>
              <Progress value={avgCpu} className="h-1 mt-2" />
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Avg Memory</CardTitle>
              <HardDrive className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{avgMemory}%</div>
              <Progress value={avgMemory} className="h-1 mt-2" />
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Active Servers */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5 text-blue-500" />
                  Active Servers
                </CardTitle>
                <Link to="../servers" className="text-sm text-blue-400 hover:text-blue-300">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {namespaceServers.slice(0, 4).map((server) => (
                  <Link
                    key={server.id}
                    to={`../servers/${server.id}`}
                    className="block p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{server.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{server.template}</p>
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
                    <div className="grid grid-cols-3 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Players:</span>
                        <span className="ml-1 text-white">{server.players}/{server.maxPlayers}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">CPU:</span>
                        <span className="ml-1 text-white">{server.cpu}%</span>
                      </div>
                      <div>
                        <span className="text-slate-500">RAM:</span>
                        <span className="ml-1 text-white">{server.memory}%</span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Resource Usage */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Resource Usage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {namespaceServers.slice(0, 5).map((server) => (
                <div key={server.id}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">{server.name}</span>
                    <div className="flex gap-2 text-xs">
                      <span className="text-blue-400">CPU: {server.cpu}%</span>
                      <span className="text-purple-400">RAM: {server.memory}%</span>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <Progress value={server.cpu} className="h-1.5" />
                    <Progress value={server.memory} className="h-1.5" />
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Resources Overview */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileBox className="w-5 h-5 text-orange-500" />
                Resources
              </CardTitle>
              <Link to="../resources" className="text-sm text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {['plugin', 'mod', 'config', 'world'].map((type) => {
                const count = namespaceResources.filter(r => r.type === type).length;
                return (
                  <div key={type} className="p-4 rounded-lg bg-slate-800/50">
                    <p className="text-2xl font-bold mb-1">{count}</p>
                    <p className="text-xs text-slate-400 capitalize">{type}s</p>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Status Alert */}
        {avgCpu > 70 || avgMemory > 70 ? (
          <Card className="bg-amber-950/20 border-amber-900/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-200 mb-1">High Resource Usage</h4>
                  <p className="text-sm text-amber-300/80">
                    Some servers in this namespace are experiencing high resource usage. Consider scaling or optimization.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        ) : (
          <Card className="bg-green-950/20 border-green-900/50">
            <CardContent className="pt-6">
              <div className="flex gap-3">
                <Activity className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-200 mb-1">Namespace Healthy</h4>
                  <p className="text-sm text-green-300/80">
                    All servers are running smoothly with optimal resource usage.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
