import { Link, useParams } from 'react-router';
import {
  ArrowLeft,
  Calendar,
  Download,
  FileBox,
  Globe,
  Layers,
  Package,
  Server,
  Trash2,
} from 'lucide-react';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import { mockNamespaces, mockResources } from '../data/mockData';

export function ResourceDetail() {
  const { id, identifier } = useParams();
  const isNamespaceScope = Boolean(identifier);
  const namespace = identifier
    ? mockNamespaces.find((candidate) => candidate.id === identifier)
    : null;
  const resource = mockResources.find(
    (candidate) => candidate.id === id && (!identifier || candidate.namespaceId === identifier),
  );
  const resourceNamespace = resource
    ? mockNamespaces.find((candidate) => candidate.id === resource.namespaceId)
    : null;
  const backTo = isNamespaceScope
    ? `/namespace/${identifier}/resources`
    : '/global/resources';

  if (!resource || (isNamespaceScope && !namespace)) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-6 flex items-center justify-center">
        <div className="text-center">
          <FileBox className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-xl font-semibold mb-2">Resource not found</h2>
          <Link to={backTo} className="text-blue-400 hover:text-blue-300">
            Back to resources
          </Link>
        </div>
      </div>
    );
  }

  const typeColor: Record<string, string> = {
    plugin: 'bg-blue-900/40 text-blue-300',
    mod: 'bg-purple-900/40 text-purple-300',
    config: 'bg-orange-900/40 text-orange-300',
    world: 'bg-green-900/40 text-green-300',
    datapack: 'bg-pink-900/40 text-pink-300',
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white">
      <div className="bg-slate-900 border-b border-slate-800 p-6">
        <div className="max-w-6xl mx-auto">
          <Link to={backTo} className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to resources
          </Link>
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-4">
              <div className={`p-3 rounded-lg ${typeColor[resource.type] ?? 'bg-slate-800 text-slate-200'}`}>
                <Package className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-3xl font-bold mb-2">{resource.name}</h1>
                <p className="text-slate-400 mb-3">{resource.description}</p>
                <div className="flex gap-2 flex-wrap">
                  <Badge className={typeColor[resource.type] ?? 'bg-slate-800 text-slate-200'}>{resource.type}</Badge>
                  <Badge variant="outline" className="border-slate-700">
                    v{resource.version}
                  </Badge>
                  {isNamespaceScope ? (
                    <Badge className="bg-purple-900/40 text-purple-300">
                      <Layers className="w-3 h-3 mr-1" />
                      {namespace?.name}
                    </Badge>
                  ) : (
                    <Badge className="bg-blue-900/40 text-blue-300">
                      <Globe className="w-3 h-3 mr-1" />
                      {resourceNamespace?.name ?? 'Global'}
                    </Badge>
                  )}
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" className="border-slate-700">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button variant="ghost" className="text-red-400 hover:text-red-300">
                <Trash2 className="w-4 h-4 mr-2" />
                Remove
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto p-6 space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Package className="w-4 h-4 text-blue-400" />
                Size
              </div>
              <p className="text-2xl font-bold">{resource.size}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Server className="w-4 h-4 text-purple-400" />
                Used By
              </div>
              <p className="text-2xl font-bold">{resource.usedBy} servers</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-slate-400 mb-1">
                <Calendar className="w-4 h-4 text-emerald-400" />
                Uploaded
              </div>
              <p className="text-2xl font-bold">{new Date(resource.uploadedAt).toLocaleDateString()}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Labels</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-2 flex-wrap">
              {resource.labels.map((label) => (
                <Badge key={label} variant="outline" className="border-slate-700">
                  {label}
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
