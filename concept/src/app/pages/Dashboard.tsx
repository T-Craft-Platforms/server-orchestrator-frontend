import { Link } from 'react-router';
import { 
  Server, 
  Layers, 
  FileBox, 
  Activity,
  Users,
  Cpu,
  HardDrive,
  TrendingUp,
  AlertCircle
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Progress } from '../components/ui/progress';
import { mockNamespaces, mockServers } from '../data/mockData';

export function Dashboard() {
  const runningServers = mockServers.filter(s => s.status === 'running').length;
  const totalPlayers = mockServers.reduce((sum, s) => sum + s.players, 0);
  const avgCpu = Math.round(mockServers.reduce((sum, s) => sum + s.cpu, 0) / mockServers.length);
  const avgMemory = Math.round(mockServers.reduce((sum, s) => sum + s.memory, 0) / mockServers.length);

  const recentServers = mockServers.slice(0, 5);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold mb-2">Dashboard</h1>
          <p className="text-slate-400">Overview of your Minecraft server infrastructure</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Servers</CardTitle>
              <Server className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockServers.length}</div>
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {runningServers} running
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Projects</CardTitle>
              <Layers className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockNamespaces.length}</div>
              <p className="text-xs text-slate-400 mt-1">Active projects</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Players</CardTitle>
              <Users className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalPlayers}</div>
              <p className="text-xs text-slate-400 mt-1">Across all servers</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Resources</CardTitle>
              <FileBox className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {mockNamespaces.reduce((sum, ns) => sum + ns.resourceCount, 0)}
              </div>
              <p className="text-xs text-slate-400 mt-1">Plugins, mods, configs</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Docker Fleet Usage */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Docker Fleet Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">CPU Usage</span>
                  </div>
                  <span className="text-sm font-medium">{avgCpu}%</span>
                </div>
                <Progress value={avgCpu} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-slate-300">Memory Usage</span>
                  </div>
                  <span className="text-sm font-medium">{avgMemory}%</span>
                </div>
                <Progress value={avgMemory} className="h-2" />
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Allocated CPU</p>
                    <p className="font-semibold">34 / 48 cores</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Allocated RAM</p>
                    <p className="font-semibold">86 / 128 GB</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Projects Quick View */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" />
                  Projects
                </CardTitle>
                <Link to="/global/projects" className="text-sm text-blue-400 hover:text-blue-300">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockNamespaces.map((ns) => (
                  <Link
                    key={ns.id}
                    to={`/global/projects/${ns.id}`}
                    className="block p-3 rounded-lg bg-slate-800/50 hover:bg-slate-800 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{ns.name}</h4>
                        <p className="text-xs text-slate-400 mt-1">{ns.description}</p>
                      </div>
                      <Badge variant="secondary" className="bg-slate-700">
                        {ns.serverCount} servers
                      </Badge>
                    </div>
                    <div className="flex gap-1 flex-wrap">
                      {ns.labels.map((label) => (
                        <Badge key={label} variant="outline" className="text-xs border-slate-600">
                          {label}
                        </Badge>
                      ))}
                    </div>
                  </Link>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Servers */}
        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Server className="w-5 h-5 text-blue-500" />
                Recent Servers
              </CardTitle>
                <Link to="/namespace/ns-1/servers" className="text-sm text-blue-400 hover:text-blue-300">
                View all
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-slate-800 text-left">
                    <th className="pb-3 text-sm font-medium text-slate-400">Name</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Status</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Project</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Players</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Resources</th>
                    <th className="pb-3 text-sm font-medium text-slate-400">Uptime</th>
                  </tr>
                </thead>
                <tbody>
                  {recentServers.map((server) => (
                    <tr key={server.id} className="border-b border-slate-800 last:border-0">
                      <td className="py-3">
                      <Link to={`/namespace/${server.namespaceId}/servers/${server.id}`} className="font-medium hover:text-blue-400">
                          {server.name}
                        </Link>
                      </td>
                      <td className="py-3">
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
                      </td>
                      <td className="py-3 text-sm text-slate-400">{server.namespaceName}</td>
                      <td className="py-3 text-sm">
                        {server.players} / {server.maxPlayers}
                      </td>
                      <td className="py-3">
                        <div className="flex gap-2">
                          <span className="text-xs px-2 py-1 rounded bg-blue-900/30 text-blue-300">
                            CPU: {server.cpu}%
                          </span>
                          <span className="text-xs px-2 py-1 rounded bg-purple-900/30 text-purple-300">
                            RAM: {server.memory}%
                          </span>
                        </div>
                      </td>
                      <td className="py-3 text-sm text-slate-400">{server.uptime}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-amber-950/20 border-amber-900/50 mt-6">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-200 mb-1">Resource Optimization Recommended</h4>
                <p className="text-sm text-amber-300/80">
                  Server "modded-1" is using 85% CPU. Consider scaling or optimizing server configuration.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
