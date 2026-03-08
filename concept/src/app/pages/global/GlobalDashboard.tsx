import { Link } from 'react-router';
import { 
  Server, 
  Layers, 
  FileBox, 
  Activity,
  Cpu,
  HardDrive,
  TrendingUp,
  AlertCircle,
  FileCode,
  Globe
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { mockNamespaces, mockServers, mockTemplates, mockResources } from '../../data/mockData';

export function GlobalDashboard() {
  const totalServers = mockServers.length;
  const runningServers = mockServers.filter(s => s.status === 'running').length;
  const totalResources = mockResources.length;
  const avgCpu = Math.round(mockServers.reduce((sum, s) => sum + s.cpu, 0) / mockServers.length);
  const avgMemory = Math.round(mockServers.reduce((sum, s) => sum + s.memory, 0) / mockServers.length);

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-8 h-8 text-blue-500" />
            <h1 className="text-3xl font-bold">Global Dashboard</h1>
          </div>
          <p className="text-slate-400">Cluster-wide overview and management</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Namespaces</CardTitle>
              <Layers className="w-4 h-4 text-purple-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockNamespaces.length}</div>
              <p className="text-xs text-slate-400 mt-1">Active networks</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Total Servers</CardTitle>
              <Server className="w-4 h-4 text-blue-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalServers}</div>
              <p className="text-xs text-green-500 flex items-center gap-1 mt-1">
                <TrendingUp className="w-3 h-3" />
                {runningServers} running
              </p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Templates</CardTitle>
              <FileCode className="w-4 h-4 text-green-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{mockTemplates.length}</div>
              <p className="text-xs text-slate-400 mt-1">Shared blueprints</p>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-slate-400">Global Resources</CardTitle>
              <FileBox className="w-4 h-4 text-orange-500" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{totalResources}</div>
              <p className="text-xs text-slate-400 mt-1">Shared assets</p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          {/* Cluster Resources */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Activity className="w-5 h-5 text-blue-500" />
                Cluster Resources
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Cpu className="w-4 h-4 text-blue-400" />
                    <span className="text-sm text-slate-300">Average CPU Usage</span>
                  </div>
                  <span className="text-sm font-medium">{avgCpu}%</span>
                </div>
                <Progress value={avgCpu} className="h-2" />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <HardDrive className="w-4 h-4 text-purple-400" />
                    <span className="text-sm text-slate-300">Average Memory Usage</span>
                  </div>
                  <span className="text-sm font-medium">{avgMemory}%</span>
                </div>
                <Progress value={avgMemory} className="h-2" />
              </div>

              <div className="pt-4 border-t border-slate-800">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-slate-400">Total CPU</p>
                    <p className="font-semibold">48 cores</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Total RAM</p>
                    <p className="font-semibold">128 GB</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Nodes</p>
                    <p className="font-semibold">12 active</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Version</p>
                    <p className="font-semibold">v1.28.3</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Namespaces Overview */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Layers className="w-5 h-5 text-purple-500" />
                  Namespaces Overview
                </CardTitle>
                <Link to="/global/namespaces" className="text-sm text-blue-400 hover:text-blue-300">
                  View all
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mockNamespaces.map((ns) => (
                  <Link
                    key={ns.id}
                    to={`/global/namespaces/${ns.id}`}
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

        {/* Server Distribution by Namespace */}
        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle>Server Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {mockNamespaces.map((ns) => {
                const nsServers = mockServers.filter(s => s.namespaceId === ns.id);
                const running = nsServers.filter(s => s.status === 'running').length;
                const stopped = Math.max(nsServers.length - running, 0);
                const namespaceTotalPct = totalServers > 0 ? (nsServers.length / totalServers) * 100 : 0;
                const runningWithinNamespacePct = nsServers.length > 0 ? (running / nsServers.length) * 100 : 0;
                
                return (
                  <div key={ns.id}>
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">{ns.name}</span>
                        <Badge variant="outline" className="text-xs border-slate-700">
                          {running} running / {nsServers.length} total
                        </Badge>
                      </div>
                      <span className="text-sm text-slate-400">{namespaceTotalPct.toFixed(0)}% of cluster</span>
                    </div>
                    <div className="h-2 w-full overflow-hidden rounded-full bg-slate-800">
                      <div
                        className="relative h-full overflow-hidden rounded-full"
                        style={{
                          width: `${namespaceTotalPct}%`,
                          backgroundImage:
                            'repeating-linear-gradient(135deg, rgba(148,163,184,0.35) 0px, rgba(148,163,184,0.35) 6px, rgba(71,85,105,0.35) 6px, rgba(71,85,105,0.35) 12px)',
                        }}
                      >
                        <div className="h-full bg-emerald-500" style={{ width: `${runningWithinNamespacePct}%` }} />
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Alerts */}
        <Card className="bg-amber-950/20 border-amber-900/50">
          <CardContent className="pt-6">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-200 mb-1">Cluster Health Check</h4>
                <p className="text-sm text-amber-300/80">
                  All namespaces operational. Consider reviewing resource allocation for high-usage servers.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
