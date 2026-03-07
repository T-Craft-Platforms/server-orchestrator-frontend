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
  ChevronDown,
  Users
} from 'lucide-react';
import { Button } from '../components/ui/button';
import { useEffect, useMemo, useState } from 'react';
import { useNamespace } from '../context/NamespaceContext';
import { mockNamespaces } from '../data/mockData';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '../components/ui/popover';

const globalNavigation = [
  { name: 'Dashboard', href: '/global/dashboard', icon: LayoutDashboard },
  { name: 'Namespaces', href: '/global/namespaces', icon: Layers },
  { name: 'Templates', href: '/global/templates', icon: FileCode },
  { name: 'Resources', href: '/global/resources', icon: FileBox },
  { name: 'Users', href: '/global/users', icon: Users },
  { name: 'Settings', href: '/global/settings', icon: Settings },
];

export function RootLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [contextPopoverOpen, setContextPopoverOpen] = useState(false);
  const { selectedNamespace, setSelectedNamespace } = useNamespace();
  const namespacePathMatch = location.pathname.match(/^\/namespace\/([^/]+)(?:\/|$)/);
  const routeNamespaceId = namespacePathMatch?.[1] ?? null;
  const fallbackNamespaceId = mockNamespaces[0]?.id ?? null;
  const activeNamespaceId = routeNamespaceId ?? selectedNamespace ?? fallbackNamespaceId;
  
  const isGlobalRoute = location.pathname === '/' || location.pathname.startsWith('/global');
  const navigation = useMemo(() => {
    if (isGlobalRoute || !activeNamespaceId) {
      return globalNavigation;
    }

    const namespaceBase = `/namespace/${activeNamespaceId}`;
    return [
      { name: 'Dashboard', href: `${namespaceBase}/dashboard`, icon: LayoutDashboard },
      { name: 'Servers', href: `${namespaceBase}/servers`, icon: Server },
      { name: 'Templates', href: `${namespaceBase}/templates`, icon: FileCode },
      { name: 'Resources', href: `${namespaceBase}/resources`, icon: FileBox },
      { name: 'Users', href: `${namespaceBase}/users`, icon: Users },
    ];
  }, [activeNamespaceId, isGlobalRoute]);
  const selectedNs = mockNamespaces.find(ns => ns.id === activeNamespaceId);

  const isActive = (href: string) => {
    if (href === '/global/dashboard' && location.pathname === '/') {
      return true;
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
      navigate(`/namespace/${selectedNamespace}/dashboard`, { replace: true });
      return;
    }

    if (fallbackNamespaceId) {
      setSelectedNamespace(fallbackNamespaceId);
      navigate(`/namespace/${fallbackNamespaceId}/dashboard`, { replace: true });
      return;
    }

    navigate('/global/dashboard', { replace: true });
  }, [fallbackNamespaceId, navigate, routeNamespaceId, selectedNamespace, setSelectedNamespace]);

  const switchToGlobal = () => {
    setContextPopoverOpen(false);
    setMobileMenuOpen(false);
    navigate('/global/dashboard');
  };

  const switchToNamespace = (namespaceId: string) => {
    setSelectedNamespace(namespaceId);
    setContextPopoverOpen(false);
    setMobileMenuOpen(false);
    navigate(`/namespace/${namespaceId}/dashboard`);
  };

  return (
    <div className="min-h-screen bg-slate-950">
      {/* Mobile menu button */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-slate-900 border-b border-slate-800 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Server className="w-6 h-6 text-blue-500" />
          <span className="font-semibold text-white">Server Orchestrator</span>
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
        fixed top-0 left-0 bottom-0 z-40 w-64 bg-slate-900 border-r border-slate-800
        transform transition-transform duration-200 ease-in-out
        lg:translate-x-0
        ${mobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <Server className="w-8 h-8 text-blue-500" />
              <div>
                <h1 className="font-semibold text-white">Server Orchestrator</h1>
                <p className="text-xs text-slate-400">Kubernetes Management</p>
              </div>
            </div>
          </div>

          {/* Context Selector */}
          <div className="p-4 border-b border-slate-800">
            <Popover open={contextPopoverOpen} onOpenChange={setContextPopoverOpen}>
              <PopoverTrigger className="inline-flex h-9 w-full items-center justify-between gap-2 rounded-md border border-slate-700 bg-transparent px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 disabled:pointer-events-none disabled:opacity-50">
                  <div className="flex items-center gap-2">
                    {isGlobalRoute ? (
                      <>
                        <Globe className="w-4 h-4 text-blue-400" />
                        <span className="text-sm">Global</span>
                      </>
                    ) : (
                      <>
                        <Layers className="w-4 h-4 text-purple-400" />
                        <span className="text-sm truncate">{selectedNs?.name || 'Select Namespace'}</span>
                      </>
                    )}
                  </div>
                  <ChevronDown className="w-4 h-4 text-slate-400" />
              </PopoverTrigger>
              <PopoverContent
                align="start"
                className="w-72 bg-slate-900 border-slate-800 p-2"
              >
                <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider px-2 py-1">
                  Switch Context
                </div>
                <div className="mt-1 space-y-1">
                  <button
                    type="button"
                    onClick={switchToGlobal}
                    className={`w-full flex items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                      isGlobalRoute ? 'bg-slate-800 text-white' : 'text-slate-200 hover:bg-slate-800'
                    }`}
                  >
                    <Globe className="w-4 h-4 text-blue-400" />
                    <span>Global</span>
                  </button>
                  <div className="ml-2 border-l border-slate-700/80 pl-4">
                    {mockNamespaces.map((ns) => {
                      const isSelected = selectedNamespace === ns.id && !isGlobalRoute;
                      return (
                        <button
                          key={ns.id}
                          type="button"
                          onClick={() => switchToNamespace(ns.id)}
                          className={`group relative mt-1 w-full rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
                            isSelected
                              ? 'bg-slate-800 text-white ring-1 ring-slate-700'
                              : 'text-slate-300 hover:bg-slate-800/90'
                          }`}
                        >
                          <span className="pointer-events-none absolute -left-4 top-1/2 h-px w-3 -translate-y-1/2 bg-slate-700/80" />
                          <span className="flex items-center gap-2">
                            <Layers className="w-4 h-4 text-purple-400" />
                            <span className="truncate">{ns.name}</span>
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              </PopoverContent>
            </Popover>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
            <div className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2 px-3">
              {isGlobalRoute ? 'Global Management' : 'Namespace Scope'}
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

          {/* Footer info */}
          <div className="p-4 border-t border-slate-800">
            <div className="bg-slate-800 rounded-lg p-3">
              <div className="flex items-center justify-between mb-1">
                <span className="text-xs text-slate-400">Cluster Status</span>
                <span className="text-xs text-green-400">Healthy</span>
              </div>
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span>12 Nodes</span>
                <span>v1.28.3</span>
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
