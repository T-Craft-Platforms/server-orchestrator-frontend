import { useState } from 'react';
import { Plus, Search, FileBox, Download, Trash2, Package } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { mockResources } from '../data/mockData';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../components/ui/table';

export function Resources() {
  const [searchQuery, setSearchQuery] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  const filteredResources = mockResources.filter(resource => {
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

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Resources</h1>
            <p className="text-slate-400">Shared assets organized in project buckets</p>
          </div>
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Upload Resource
          </Button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="md:col-span-2 relative">
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

        {/* View Toggle */}
        <div className="flex justify-end mb-4">
          <div className="flex gap-1 bg-slate-900 border border-slate-800 rounded-lg p-1">
            <Button
              size="sm"
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              onClick={() => setViewMode('grid')}
              className="h-8"
            >
              Grid
            </Button>
            <Button
              size="sm"
              variant={viewMode === 'table' ? 'default' : 'ghost'}
              onClick={() => setViewMode('table')}
              className="h-8"
            >
              Table
            </Button>
          </div>
        </div>

        {/* Grid View */}
        {viewMode === 'grid' && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredResources.map((resource) => (
              <Card key={resource.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3 mb-3">
                    <div className={`p-2 rounded-lg ${getTypeColor(resource.type)}`}>
                      <Package className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold truncate">{resource.name}</h3>
                      <p className="text-xs text-slate-400">v{resource.version}</p>
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
                    <span>{resource.size}</span>
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
                    <Button size="sm" variant="outline" className="flex-1 h-8">
                      <Download className="w-3 h-3 mr-1" />
                      Download
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                      <Trash2 className="w-3 h-3" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="p-0">
              <Table className="min-w-[760px]">
                <TableHeader>
                  <TableRow className="border-slate-800 hover:bg-transparent">
                    <TableHead>Name</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Version</TableHead>
                    <TableHead>Size</TableHead>
                    <TableHead>Used By</TableHead>
                    <TableHead>Uploaded</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredResources.map((resource) => (
                    <TableRow key={resource.id} className="border-slate-800">
                      <TableCell>
                        <div>
                          <div className="font-medium">{resource.name}</div>
                          <div className="text-xs text-slate-500">{resource.description}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge 
                          variant="secondary" 
                          className={`text-xs ${getTypeColor(resource.type)} border-0`}
                        >
                          {resource.type}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-sm">{resource.version}</TableCell>
                      <TableCell className="text-sm text-slate-400">{resource.size}</TableCell>
                      <TableCell className="text-sm">
                        <span className="text-blue-400">{resource.usedBy} servers</span>
                      </TableCell>
                      <TableCell className="text-sm text-slate-400">
                        {new Date(resource.uploadedAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                            <Download className="w-4 h-4" />
                          </Button>
                          <Button size="sm" variant="ghost" className="h-8 w-8 p-0 text-red-400 hover:text-red-300">
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        )}

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
