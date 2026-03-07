import { Link } from 'react-router';
import { useState } from 'react';
import { Plus, Search, Server, Play, Square, RotateCw, Cpu, HardDrive, Users, Layers } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Progress } from '../../components/ui/progress';
import { mockServers, mockNamespaces } from '../../data/mockData';
import { useNamespace } from '../../context/NamespaceContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';

export function Servers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const { selectedNamespace } = useNamespace();
  const namespace = mockNamespaces.find(ns => ns.id === selectedNamespace);

  const namespaceServers = mockServers.filter(s => s.namespaceId === selectedNamespace);
  const filteredServers = namespaceServers.filter(server => {
    const matchesSearch = server.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || server.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (!namespace) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Layers className="w-6 h-6 text-purple-500" />
              <h1 className="text-3xl font-bold">Servers</h1>
            </div>
            <p className="text-slate-400">Servers in {namespace.name}</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Deploy Server
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search servers..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800"
            />
          </div>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-800">
              <SelectValue placeholder="Filter by status" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="running">Running</SelectItem>
              <SelectItem value="stopped">Stopped</SelectItem>
              <SelectItem value="starting">Starting</SelectItem>
              <SelectItem value="error">Error</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Servers Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredServers.map((server) => (
            <Card key={server.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-6">
                {/* Server Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <Server className="w-5 h-5 text-blue-400" />
                      <Link to={`./${server.id}`} className="text-lg font-semibold hover:text-blue-400">
                        {server.name}
                      </Link>
                    </div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge 
                        variant={server.status === 'running' ? 'default' : 'secondary'}
                        className={
                          server.status === 'running' 
                            ? 'bg-green-600 hover:bg-green-700' 
                            : server.status === 'error'
                            ? 'bg-red-600 hover:bg-red-700'
                            : 'bg-slate-700'
                        }
                      >
                        {server.status}
                      </Badge>
                      <span className="text-xs text-slate-500">{server.template}</span>
                    </div>
                  </div>
                  <div className="flex gap-1">
                    {server.status === 'running' ? (
                      <>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <RotateCw className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                          <Square className="w-4 h-4" />
                        </Button>
                      </>
                    ) : (
                      <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                        <Play className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </div>

                {/* Server Stats */}
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Users className="w-4 h-4 text-green-400" />
                      <span className="text-xs text-slate-400">Players</span>
                    </div>
                    <p className="text-sm font-semibold">
                      {server.players} / {server.maxPlayers}
                    </p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <Cpu className="w-4 h-4 text-blue-400" />
                      <span className="text-xs text-slate-400">CPU</span>
                    </div>
                    <p className="text-sm font-semibold">{server.cpu}%</p>
                  </div>
                  <div className="p-3 rounded-lg bg-slate-800/50">
                    <div className="flex items-center gap-2 mb-1">
                      <HardDrive className="w-4 h-4 text-purple-400" />
                      <span className="text-xs text-slate-400">RAM</span>
                    </div>
                    <p className="text-sm font-semibold">{server.memory}%</p>
                  </div>
                </div>

                {/* Resource Usage */}
                <div className="space-y-3 mb-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">CPU</span>
                      <span className="text-xs font-medium">{server.cpu}%</span>
                    </div>
                    <Progress value={server.cpu} className="h-1.5" />
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-slate-400">Memory</span>
                      <span className="text-xs font-medium">{server.memory}%</span>
                    </div>
                    <Progress value={server.memory} className="h-1.5" />
                  </div>
                </div>

                {/* Labels and Info */}
                <div className="flex items-center justify-between">
                  <div className="flex gap-1 flex-wrap">
                    {server.labels.slice(0, 3).map((label) => (
                      <Badge key={label} variant="outline" className="text-xs border-slate-700">
                        {label}
                      </Badge>
                    ))}
                  </div>
                  <span className="text-xs text-slate-500">Uptime: {server.uptime}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {filteredServers.length === 0 && (
          <div className="text-center py-12">
            <Server className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No servers found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
