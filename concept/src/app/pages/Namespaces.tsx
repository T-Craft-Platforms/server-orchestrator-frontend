import { Link } from 'react-router';
import { useState } from 'react';
import { Plus, Search, Layers, Server, FileBox } from 'lucide-react';
import { Card, CardContent } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { mockNamespaces } from '../data/mockData';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../components/ui/dialog';
import { Label } from '../components/ui/label';
import { Textarea } from '../components/ui/textarea';

export function Namespaces() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const filteredNamespaces = mockNamespaces.filter(ns =>
    ns.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    ns.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold mb-2">Namespaces</h1>
            <p className="text-slate-400">Manage your server networks and tenant boundaries</p>
          </div>
          <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Create Namespace
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-slate-900 border-slate-800 text-white">
              <DialogHeader>
                <DialogTitle>Create New Namespace</DialogTitle>
                <DialogDescription className="text-slate-400">
                  Create a new namespace to organize your servers and resources.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input
                    id="name"
                    placeholder="production-network"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea
                    id="description"
                    placeholder="Main production Minecraft network"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="labels">Labels (comma-separated)</Label>
                  <Input
                    id="labels"
                    placeholder="production, main"
                    className="bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsCreateOpen(false)}>
                  Cancel
                </Button>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Create Namespace
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search namespaces..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800"
            />
          </div>
        </div>

        {/* Namespaces Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredNamespaces.map((namespace) => (
            <Link key={namespace.id} to={`/global/projects/${namespace.id}`}>
              <Card className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors h-full">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-lg bg-purple-600/20">
                        <Layers className="w-6 h-6 text-purple-400" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-lg">{namespace.name}</h3>
                        <p className="text-xs text-slate-400">
                          Created {new Date(namespace.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-4 line-clamp-2">
                    {namespace.description}
                  </p>

                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Server className="w-4 h-4 text-blue-400" />
                        <span className="text-xs text-slate-400">Servers</span>
                      </div>
                      <p className="text-xl font-semibold">{namespace.serverCount}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <FileBox className="w-4 h-4 text-orange-400" />
                        <span className="text-xs text-slate-400">Resources</span>
                      </div>
                      <p className="text-xl font-semibold">{namespace.resourceCount}</p>
                    </div>
                  </div>

                  <div className="flex gap-1 flex-wrap">
                    {namespace.labels.map((label) => (
                      <Badge key={label} variant="outline" className="text-xs border-slate-700">
                        {label}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {filteredNamespaces.length === 0 && (
          <div className="text-center py-12">
            <Layers className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No namespaces found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
