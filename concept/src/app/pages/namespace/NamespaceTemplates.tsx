import { useState } from 'react';
import { Link } from 'react-router';
import { Search, FileCode, Cpu, HardDrive, Layers } from 'lucide-react';
import * as Icons from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { mockTemplates } from '../../data/mockData';
import { useNamespace } from '../../context/NamespaceContext';
import { mockNamespaces } from '../../data/mockData';
import { DeployServerDialog } from '../../components/DeployServerDialog';

export function NamespaceTemplates() {
  const [searchQuery, setSearchQuery] = useState('');
  const { selectedNamespace } = useNamespace();
  const namespace = mockNamespaces.find(ns => ns.id === selectedNamespace);

  const filteredTemplates = mockTemplates.filter(template =>
    template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    template.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getIcon = (iconName: string) => {
    const Icon = (Icons as any)[iconName] || FileCode;
    return Icon;
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
              <h1 className="text-3xl font-bold">Templates</h1>
            </div>
            <p className="text-slate-400">Available templates for {namespace.name}</p>
          </div>
          <DeployServerDialog
            fixedNamespaceId={selectedNamespace ?? undefined}
            triggerLabel="Deploy Server"
            triggerClassName="bg-blue-600 hover:bg-blue-700"
          />
        </div>

        {/* Search */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <Input
              placeholder="Search templates..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 bg-slate-900 border-slate-800"
            />
          </div>
        </div>

        {/* Templates Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTemplates.map((template) => {
            const Icon = getIcon(template.icon);
            return (
              <Card key={template.id} className="bg-slate-900 border-slate-800 hover:border-slate-700 transition-colors">
                <CardHeader>
                  <div className="flex items-start justify-between mb-3">
                    <div className="p-2 rounded-lg bg-blue-600/20">
                      <Icon className="w-6 h-6 text-blue-400" />
                    </div>
                    <Badge 
                      variant="outline" 
                      className="border-slate-700 capitalize"
                    >
                      {template.type}
                    </Badge>
                  </div>
                  <CardTitle className="text-lg">
                    <Link to={`./${template.id}`} className="hover:text-blue-400">
                      {template.name}
                    </Link>
                  </CardTitle>
                  <p className="text-sm text-slate-400">{template.description}</p>
                </CardHeader>
                <CardContent>
                  {/* Specs */}
                  <div className="grid grid-cols-2 gap-3 mb-4">
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <Cpu className="w-3 h-3 text-blue-400" />
                        <span className="text-xs text-slate-400">CPU</span>
                      </div>
                      <p className="text-sm font-semibold">{template.defaultCpu}</p>
                    </div>
                    <div className="p-3 rounded-lg bg-slate-800/50">
                      <div className="flex items-center gap-2 mb-1">
                        <HardDrive className="w-3 h-3 text-purple-400" />
                        <span className="text-xs text-slate-400">Memory</span>
                      </div>
                      <p className="text-sm font-semibold">{template.defaultMemory}</p>
                    </div>
                  </div>

                  {/* Version Info */}
                  <div className="mb-4 pb-4 border-b border-slate-800">
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div>
                        <span className="text-slate-500">Minecraft:</span>
                        <span className="ml-1 text-slate-300">{template.minecraftVersion}</span>
                      </div>
                      <div>
                        <span className="text-slate-500">Java:</span>
                        <span className="ml-1 text-slate-300">{template.javaVersion}</span>
                      </div>
                    </div>
                  </div>

                  {/* Restrictions */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-medium text-slate-400 uppercase">Permissions</h4>
                    <div className="flex flex-wrap gap-1">
                      {template.restrictions.canModifyJavaArgs && (
                        <Badge variant="secondary" className="text-xs bg-green-900/30 text-green-300 border-0">
                          Java Args
                        </Badge>
                      )}
                      {template.restrictions.canInstallPlugins && (
                        <Badge variant="secondary" className="text-xs bg-blue-900/30 text-blue-300 border-0">
                          Plugins
                        </Badge>
                      )}
                      {template.restrictions.canModifyConfig && (
                        <Badge variant="secondary" className="text-xs bg-purple-900/30 text-purple-300 border-0">
                          Config
                        </Badge>
                      )}
                    </div>
                    <div className="text-xs text-slate-500 mt-2">
                      Allowed: {template.restrictions.allowedResources.join(', ')}
                    </div>
                  </div>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Button asChild variant="outline">
                      <Link to={`./${template.id}`}>View Details</Link>
                    </Button>
                    <DeployServerDialog
                      fixedTemplateId={template.id}
                      fixedNamespaceId={selectedNamespace ?? undefined}
                      triggerLabel="Deploy"
                      triggerClassName="bg-blue-600 hover:bg-blue-700"
                    />
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredTemplates.length === 0 && (
          <div className="text-center py-12">
            <FileCode className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-slate-400 mb-2">No templates found</h3>
            <p className="text-sm text-slate-500">Try adjusting your search query</p>
          </div>
        )}
      </div>
    </div>
  );
}
