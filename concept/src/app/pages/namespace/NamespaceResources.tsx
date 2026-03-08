import { useState } from 'react';
import { Link } from 'react-router';
import { Search, FileBox, Trash2, Package, Layers } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { mockResources, mockNamespaces } from '../../data/mockData';
import { useVersionManagerSnapshot } from '../../data/useVersionManager';
import { versionManager } from '../../data/versionManager';
import { useNamespace } from '../../context/NamespaceContext';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { ResourceUploadDialog } from '../../components/ResourceUploadDialog';
import type { Resource } from '../../types';

export function NamespaceResources() {
  useVersionManagerSnapshot();
  const [resources, setResources] = useState<Resource[]>([...mockResources]);
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const { selectedNamespace } = useNamespace();
  const namespace = mockNamespaces.find(ns => ns.id === selectedNamespace);

  const namespaceResources = resources.filter(r => r.namespaceId === selectedNamespace);
  const filteredResources = namespaceResources.filter(resource => {
    const matchesSearch = resource.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesType = typeFilter === 'all' || resource.type === typeFilter;
    return matchesSearch && matchesType;
  });

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      plugin: 'bg-blue-900/30 text-blue-300',
      mod: 'bg-purple-900/30 text-purple-300',
      config: 'bg-orange-900/30 text-orange-300',
      world: 'bg-green-900/30 text-green-300',
      datapack: 'bg-pink-900/30 text-pink-300',
    };
    return colors[type] || 'bg-slate-700';
  };

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
              <h1 className="text-3xl font-bold">Resources</h1>
            </div>
            <p className="text-slate-400">Resources in project {namespace.name}</p>
          </div>
          <ResourceUploadDialog
            fixedNamespaceId={selectedNamespace ?? undefined}
            onCreate={(resource) => {
              setResources((current) => [resource, ...current]);
              mockResources.unshift(resource);
            }}
          />
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search resources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800"
            />
          </div>
          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="bg-slate-900 border-slate-800">
              <SelectValue placeholder="Filter by type" />
            </SelectTrigger>
            <SelectContent className="bg-slate-900 border-slate-800">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="plugin">Plugins</SelectItem>
              <SelectItem value="mod">Mods</SelectItem>
              <SelectItem value="config">Configs</SelectItem>
              <SelectItem value="world">Worlds</SelectItem>
              <SelectItem value="datapack">Datapacks</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Grid View */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredResources.map((resource) => {
            const activeVersion = versionManager.getActiveResourceVersion(resource.id);
            const displayVersion = activeVersion?.version ?? resource.version;
            const displaySize = activeVersion?.size ?? resource.size;
            return (
            <Card key={resource.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
              <CardContent className="p-4">
                <div className="flex items-start gap-3 mb-3">
                  <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                    <Package className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <Link to={`./${resource.id}`} className="font-semibold truncate block hover:text-blue-400">
                      {resource.name}
                    </Link>
                    <p className="text-xs text-slate-400">v{displayVersion}</p>
                  </div>
                  <Badge 
                    variant="secondary" 
                    className={`text-xs ${getTypeColor(resource.type)} border-0`}
                  >
                    {resource.type}
                  </Badge>
                </div>

                <p className="text-sm text-slate-400 mb-3 line-clamp-2">
                  {resource.description}
                </p>

                <div className="flex items-center justify-between mb-3 text-xs text-slate-500">
                  <span>{displaySize}</span>
                  <span>Used by {resource.usedBy} servers</span>
                </div>

                <div className="flex gap-1 flex-wrap mb-3">
                  {resource.labels.map((label) => (
                    <Badge key={label} variant="outline" className="text-xs border-slate-700">
                      {label}
                    </Badge>
                  ))}
                </div>

                <div className="flex gap-2">
                  <Button asChild size="sm" variant="outline" className="flex-1 h-8">
                    <Link to={`./${resource.id}`}>Details</Link>
                  </Button>
                  <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          )})}
        </div>

        {filteredResources.length === 0 && (
          <div className="text-center py-12">
            <FileBox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No resources found</h3>
            <p className="text-sm text-slate-500">Try adjusting your filters</p>
          </div>
        )}
      </div>
    </div>
  );
}
