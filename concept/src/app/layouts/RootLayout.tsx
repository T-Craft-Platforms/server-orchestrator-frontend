import { Outlet, Link, useLocation, useNavigate } from 'react-router';
import { 
  LayoutDashboard, 
  Layers, 
  Server, 
  FileBox, 
  FileCode,
  Menu,
  X,
  Settings,
  Globe,
  Users,
  Search
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { useNamespace } from '../context/NamespaceContext';
import { mockNamespaces } from '../data/mockData';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../components/ui/dialog';
import { Input } from '../components/ui/input';

const globalNavigation = [
  { name: 'Dashboard', href: '/global/dashboard', icon: LayoutDashboard },
  { name: 'Projects', href: '/global/projects', icon: Layers },
  { name: 'Templates', href: '/global/templates', icon: FileCode },
  { name: 'Resources', href: '/global/resources', icon: FileBox },
  { name: 'Users', href: '/global/users', icon: Users },
  { name: 'Settings', href: '/global/settings', icon: Settings },
];

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isNamespaceTreeOpen, setIsNamespaceTreeOpen] = useState(false);
  const [namespaceSearch, setNamespaceSearch] = useState('');
  const { selectedNamespace, setSelectedNamespace } = useNamespace();
  const scopePathMatch = location.pathname.match(/^\/(namespace|project)\/([^/]+)(?:\/|$)/);
  const scopePrefix = (scopePathMatch?.[1] as 'namespace' | 'project' | undefined) ?? 'namespace';
  const routeNamespaceId = scopePathMatch?.[2] ?? null;
  const fallbackNamespaceId = mockNamespaces[0]?.id ?? null;
  const activeNamespaceId = routeNamespaceId ?? selectedNamespace ?? fallbackNamespaceId;
  
  const isGlobalRoute = location.pathname === '/' || location.pathname.startsWith('/global');
  const navigation = useMemo(() => {
    if (isGlobalRoute || !activeNamespaceId) {
      return globalNavigation;
    }

    const namespaceBase = `/${scopePrefix}/${activeNamespaceId}`;
    return [
      { name: 'Dashboard', href: `${namespaceBase}/dashboard`, icon: LayoutDashboard },
      { name: 'Servers', href: `${namespaceBase}/servers`, icon: Server },
      { name: 'Templates', href: `${namespaceBase}/templates`, icon: FileCode },
      { name: 'Resources', href: `${namespaceBase}/resources`, icon: FileBox },
      { name: 'Users', href: `${namespaceBase}/users`, icon: Users },
      { name: 'Settings', href: `${namespaceBase}/settings`, icon: Settings },
    ];
  }, [activeNamespaceId, isGlobalRoute, scopePrefix]);
  const namespacePreviewLimit = 2;
  const visibleNamespaces = useMemo(() => {
    const preview = mockNamespaces.slice(0, namespacePreviewLimit);
    if (!activeNamespaceId || isGlobalRoute) {
      return preview;
    }

    if (preview.some((ns) => ns.id === activeNamespaceId)) {
      return preview;
    }

    const activeNamespace = mockNamespaces.find((ns) => ns.id === activeNamespaceId);
    if (!activeNamespace) {
      return preview;
    }

    if (namespacePreviewLimit <= 1) {
      return [activeNamespace];
    }

    return [...preview.slice(0, namespacePreviewLimit - 1), activeNamespace];
  }, [activeNamespaceId, isGlobalRoute]);
  const hasHiddenNamespaces = mockNamespaces.some((ns) => !visibleNamespaces.some((visible) => visible.id === ns.id));
  const normalizedNamespaceSearch = namespaceSearch.trim().toLowerCase();
  const filteredNamespaces = useMemo(() => {
    if (!normalizedNamespaceSearch) {
      return mockNamespaces;
    }
    return mockNamespaces.filter((ns) => {
      const searchable = [ns.id, ns.name, ns.description, ...ns.labels].join(' ').toLowerCase();
      return searchable.includes(normalizedNamespaceSearch);
    });
  }, [normalizedNamespaceSearch]);

  const isActive = (href: string) => {
    if (href === '/global/dashboard' && location.pathname === '/') {
      return true;
    }
    if (href === '/global/projects') {
      return location.pathname.startsWith('/global/projects') || location.pathname.startsWith('/global/namespaces');
    }
    return location.pathname.startsWith(href);
  };

  useEffect(() => {
    if (!routeNamespaceId) {
      return;
    }

    const routeNamespaceExists = mockNamespaces.some((ns) => ns.id === routeNamespaceId);
    if (routeNamespaceExists) {
      if (selectedNamespace !== routeNamespaceId) {
        setSelectedNamespace(routeNamespaceId);
      }
      return;
    }

    if (selectedNamespace) {
      navigate(`/${scopePrefix}/${selectedNamespace}/dashboard`, { replace: true });
      return;
    }

    if (fallbackNamespaceId) {
      setSelectedNamespace(fallbackNamespaceId);
      navigate(`/${scopePrefix}/${fallbackNamespaceId}/dashboard`, { replace: true });
      return;
    }

    navigate('/global/dashboard', { replace: true });
  }, [fallbackNamespaceId, navigate, routeNamespaceId, scopePrefix, selectedNamespace, setSelectedNamespace]);

  const switchToGlobal = () => {
    setMobileMenuOpen(false);
    navigate('/global/dashboard');
  };

  const switchToNamespace = (namespaceId: string) => {
    setSelectedNamespace(namespaceId);
    setMobileMenuOpen(false);
    navigate(`/${scopePrefix}/${namespaceId}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex min-w-0 items-center gap-2">
          <Server className="w-6 h-6 text-blue-500" />
          <span className="font-semibold text-white truncate">Server Orchestrator</span>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="text-white"
        >
          {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </Button>
      </div>

      {/* Sidebar */}
      <aside className={`
        fixed top-14 left-0 bottom-0 z-40 w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-200 ease-in-out
        lg:top-0 lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="hidden lg:block p-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="font-semibold text-white">Server Orchestrator</h1>
                <p className="text-xs text-slate-400">Docker Fleet Management</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
              Namespace Tree
            </div>
            <button
              type="button"
              onClick={switchToGlobal}
              className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                isGlobalRoute ? 'bg-slate-800 text-white ring-1 ring-slate-700' : 'text-slate-200 hover:bg-slate-800'
              }`}
            >
              <Globe className="w-4 h-4 text-blue-400" />
              <span>Global</span>
            </button>
            <div className="ml-3 mt-1 border-l border-slate-700/80 pl-3 space-y-1 mb-3">
              {visibleNamespaces.map((ns) => {
                const isSelected = activeNamespaceId === ns.id && !isGlobalRoute;
                return (
                  <button
                    key={ns.id}
                    type="button"
                    onClick={() => switchToNamespace(ns.id)}
                    className={`group relative w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                      isSelected
                        ? 'bg-slate-800 text-white ring-1 ring-slate-700'
                        : 'text-slate-300 hover:bg-slate-800/90'
                    }`}
                  >
                    <span className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-purple-400" />
                      <span className="truncate">{ns.name}</span>
                    </span>
                  </button>
                );
              })}
              {hasHiddenNamespaces && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="mt-1 h-auto w-full justify-start px-2 py-1 text-slate-400 hover:bg-transparent hover:text-slate-200"
                  onClick={() => setIsNamespaceTreeOpen(true)}
                >
                  Show all ({mockNamespaces.length})
                </Button>
              )}
            </div>
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
              {isGlobalRoute ? 'Global Management' : 'Project Scope'}
            </div>
            {navigation.map((item) => {
              const active = isActive(item.href);
              return (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`
                    flex items-center gap-3 px-3 py-2 rounded-lg transition-colors
                    ${active 
                      ? 'bg-blue-600 text-white' 
                      : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }
                  `}
                >
                  <item.icon className="w-5 h-5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
          <Dialog open={isNamespaceTreeOpen} onOpenChange={setIsNamespaceTreeOpen}>
            <DialogContent className="max-w-2xl bg-slate-900 border-slate-800 text-white">
              <DialogHeader>
                <DialogTitle>All Namespaces</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    value={namespaceSearch}
                    onChange={(event) => setNamespaceSearch(event.target.value)}
                    placeholder="Search namespaces by name, id, description, or label..."
                    className="pl-10 bg-slate-950 border-slate-700"
                  />
                </div>
                <div className="max-h-[420px] overflow-y-auto rounded-md border border-slate-800 bg-slate-950/40 p-3">
                  <button
                    type="button"
                    onClick={switchToGlobal}
                    className={`w-full flex items-center gap-2 rounded-md px-3 py-2 text-left text-sm transition-colors ${
                      isGlobalRoute ? 'bg-slate-800 text-white ring-1 ring-slate-700' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Global</span>
                  </button>
                  <div className="ml-3 mt-2 border-l border-slate-700/80 pl-3 space-y-1">
                    {filteredNamespaces.map((ns) => {
                      const isSelected = activeNamespaceId === ns.id && !isGlobalRoute;
                      return (
                        <button
                          key={ns.id}
                          type="button"
                          onClick={() => {
                            switchToNamespace(ns.id);
                            setIsNamespaceTreeOpen(false);
                          }}
                          className={`w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                            isSelected
                              ? 'bg-slate-800 text-white ring-1 ring-slate-700'
                              : 'text-slate-300 hover:bg-slate-800/90'
                          }`}
                        >
                          <span className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-400" />
                            <span className="truncate">{ns.name}</span>
                          </span>
                          <span className="block text-xs text-slate-500 mt-0.5 truncate">{ns.id}</span>
                        </button>
                      );
                    })}
                    {filteredNamespaces.length === 0 && (
                      <p className="px-2 py-3 text-sm text-slate-400">No namespaces match your search.</p>
                    )}
                  </div>
                </div>
              </div>
            </DialogContent>
          </Dialog>

          {/* Footer info */}
          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Docker Fleet Status</span>
                <span className="text-xs text-green-400">Healthy</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>12 Docker Hosts</span>
                <span>Engine v27.0.3</span>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Mobile overlay */}
      {mobileMenuOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black/50 z-30"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Main content */}
      <main className="lg:ml-64 pt-16 lg:pt-0">
        <Outlet />
      </main>
    </div>
  );
}
