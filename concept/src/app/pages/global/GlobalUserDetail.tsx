import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft, Search, Trash2, User } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Badge } from '../../components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { mockNamespaces, mockRoleBindings, mockRoles, mockUsers } from '../../data/mockData';
import type { RoleBinding } from '../../types';

export function GlobalUserDetail() {
  const { id } = useParams();
  const user = mockUsers.find((candidate) => candidate.id === id);
  const [displayName, setDisplayName] = useState(user?.displayName ?? user?.username ?? '');
  const [email, setEmail] = useState(user?.email ?? '');
  const [userStatus, setUserStatus] = useState<'active' | 'invited' | 'disabled'>(user?.status ?? 'active');
  const [deleteRequestedAt, setDeleteRequestedAt] = useState<string | null>(null);
  const [namespaceSearch, setNamespaceSearch] = useState('');
  const [draggedNamespaceId, setDraggedNamespaceId] = useState<string | null>(null);
  const [bindings, setBindings] = useState<RoleBinding[]>(
    user ? mockRoleBindings.filter((binding) => binding.userId === user.id) : []
  );

  const globalRoles = mockRoles.filter((role) => role.namespaceId === 'global');
  const namespaceRoles = mockRoles.filter((role) => role.namespaceId === 'project');

  const globalBinding = bindings.find((binding) => binding.namespaceId === 'global');
  const namespaceBindings = bindings.filter((binding) => binding.namespaceId !== 'global');

  const searchableNamespaces = useMemo(() => {
    const search = namespaceSearch.toLowerCase().trim();
    return mockNamespaces.filter((ns) => {
      if (!search) {
        return true;
      }
      return (
        ns.name.toLowerCase().includes(search) ||
        ns.description.toLowerCase().includes(search) ||
        ns.id.toLowerCase().includes(search)
      );
    });
  }, [namespaceSearch]);

  const assignedNamespaceIdSet = new Set(namespaceBindings.map((binding) => binding.namespaceId));
  const availableNamespaces = searchableNamespaces
    .filter((ns) => !assignedNamespaceIdSet.has(ns.id))
    .sort((a, b) => a.name.localeCompare(b.name));
  const currentAssignments = namespaceBindings
    .map((binding) => ({
      binding,
      namespace: mockNamespaces.find((ns) => ns.id === binding.namespaceId),
    }))
    .filter((item) => {
      if (!namespaceSearch.trim()) {
        return true;
      }
      const search = namespaceSearch.toLowerCase().trim();
      const namespace = item.namespace;
      return Boolean(
        namespace &&
          (namespace.name.toLowerCase().includes(search) ||
            namespace.description.toLowerCase().includes(search) ||
            namespace.id.toLowerCase().includes(search))
      );
    })
    .sort((a, b) => (a.namespace?.name ?? a.binding.namespaceId).localeCompare(b.namespace?.name ?? b.binding.namespaceId));

  const deleteScheduledFor = deleteRequestedAt
    ? new Date(new Date(deleteRequestedAt).getTime() + 15 * 24 * 60 * 60 * 1000)
    : null;

  if (!user) {
    return (
      <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">User not found</h2>
          <Link to="/global/users" className="text-blue-400 hover:text-blue-300">
            Back to users
          </Link>
        </div>
      </div>
    );
  }

  const setGlobalRole = (roleId: string) => {
    setBindings((current) => {
      const existing = current.find((binding) => binding.namespaceId === 'global');
      if (roleId === 'none') {
        return current.filter((binding) => binding !== existing);
      }
      if (existing) {
        return current.map((binding) =>
          binding === existing ? { ...binding, roleId } : binding
        );
      }
      return [
        ...current,
        {
          id: `rb-${Date.now()}-global-${user.id}`,
          userId: user.id,
          roleId,
          namespaceId: 'global',
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  const setNamespaceRole = (namespaceId: string, roleId: string) => {
    setBindings((current) =>
      current.map((binding) =>
        binding.namespaceId === namespaceId ? { ...binding, roleId } : binding
      )
    );
  };

  const deleteNamespaceAssignment = (namespaceId: string) => {
    setBindings((current) => current.filter((binding) => binding.namespaceId !== namespaceId));
  };

  const addNamespaceAssignment = (namespaceId: string) => {
    setBindings((current) => {
      const exists = current.some((binding) => binding.namespaceId === namespaceId);
      if (exists) {
        return current;
      }
      return [
        ...current,
        {
          id: `rb-${Date.now()}-${namespaceId}-${user.id}`,
          userId: user.id,
          roleId: 'role-namespace-reader',
          namespaceId,
          createdAt: new Date().toISOString(),
        },
      ];
    });
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-5xl mx-auto space-y-6">
        <div>
          <Link to="/global/users" className="inline-flex items-center gap-2 text-slate-400 hover:text-white mb-3">
            <ArrowLeft className="w-4 h-4" />
            Back to users
          </Link>
          <div className="flex items-center gap-2">
            <User className="w-7 h-7 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-bold">{user.displayName ?? user.username}</h1>
          </div>
          <p className="text-slate-400 mt-1">Edit user profile and role assignments</p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>User Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="display-name">Display Name</Label>
                <Input
                  id="display-name"
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-2 bg-slate-800 border-slate-700"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="mt-2 bg-slate-800 border-slate-700"
                />
              </div>
            </div>
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Username:</span>
              <span className="text-slate-200">@{user.username}</span>
              <span className="mx-2 text-slate-600">|</span>
              <span>Status:</span>
              <Badge
                className={
                  userStatus === 'active'
                    ? 'bg-green-900/40 text-green-300'
                    : userStatus === 'invited'
                    ? 'bg-amber-900/40 text-amber-300'
                    : 'bg-red-900/40 text-red-300'
                }
              >
                {userStatus}
              </Badge>
            </div>
            {deleteRequestedAt && deleteScheduledFor && (
              <div className="rounded-md border border-amber-900/40 bg-amber-950/20 p-3 text-sm text-amber-200">
                Delete requested on {new Date(deleteRequestedAt).toLocaleDateString()}.
                Scheduled for {deleteScheduledFor.toLocaleDateString()} (15-day window).
              </div>
            )}
            <div className="rounded-md border border-slate-800 p-3">
              <p className="text-sm font-medium text-slate-300 mb-3">User Lifecycle</p>
              <div className="flex flex-wrap gap-2">
                {userStatus === 'disabled' ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-green-700 text-green-300 hover:bg-green-950/30"
                    onClick={() => setUserStatus('active')}
                  >
                    Enable User
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-amber-700 text-amber-300 hover:bg-amber-950/30"
                    onClick={() => setUserStatus('disabled')}
                  >
                    Disable User
                  </Button>
                )}
                {!deleteRequestedAt ? (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-700 text-red-300 hover:bg-red-950/30"
                    onClick={() => setDeleteRequestedAt(new Date().toISOString())}
                  >
                    Request Delete (15d)
                  </Button>
                ) : (
                  <Button
                    type="button"
                    variant="outline"
                    className="border-slate-700"
                    onClick={() => setDeleteRequestedAt(null)}
                  >
                    Cancel Delete Request
                  </Button>
                )}
              </div>
            </div>
            <div className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">Save User</Button>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Global Assignment</CardTitle>
          </CardHeader>
          <CardContent>
            <Select value={globalBinding?.roleId ?? 'none'} onValueChange={setGlobalRole}>
              <SelectTrigger className="bg-slate-800 border-slate-700 max-w-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-900 border-slate-800">
                <SelectItem value="none">No Global Role</SelectItem>
                {globalRoles.map((role) => (
                  <SelectItem key={role.id} value={role.id}>
                    {role.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Project Assignments</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={namespaceSearch}
                onChange={(e) => setNamespaceSearch(e.target.value)}
                placeholder="Search all projects to add assignments..."
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              <div
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 space-y-2 min-h-52"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (!draggedNamespaceId) {
                    return;
                  }
                  deleteNamespaceAssignment(draggedNamespaceId);
                  setDraggedNamespaceId(null);
                }}
              >
                <p className="text-sm font-medium text-slate-300">Available</p>
                {availableNamespaces.length === 0 && (
                  <div className="text-sm text-slate-500">No available projects.</div>
                )}
                {availableNamespaces.map((ns) => (
                  <div
                    key={ns.id}
                    draggable
                    onDragStart={() => setDraggedNamespaceId(ns.id)}
                    className="rounded-md border border-slate-800 bg-slate-800/50 p-2 cursor-grab active:cursor-grabbing"
                  >
                    <div className="text-sm font-medium">{ns.name}</div>
                    <div className="text-xs text-slate-500">{ns.description}</div>
                  </div>
                ))}
              </div>

              <div
                className="rounded-lg border border-slate-800 bg-slate-900/40 p-3 space-y-2 min-h-52"
                onDragOver={(event) => event.preventDefault()}
                onDrop={() => {
                  if (!draggedNamespaceId) {
                    return;
                  }
                  addNamespaceAssignment(draggedNamespaceId);
                  setDraggedNamespaceId(null);
                }}
              >
                <p className="text-sm font-medium text-slate-300">Current Assignments</p>
                {currentAssignments.length === 0 && (
                  <div className="text-sm text-slate-500">No project assignments.</div>
                )}
                {currentAssignments.map(({ binding, namespace }) => {
                  return (
                    <div
                      key={binding.id}
                      draggable
                      onDragStart={() => setDraggedNamespaceId(binding.namespaceId)}
                      className="grid grid-cols-[1fr_auto_auto] gap-2 items-center rounded-md border border-slate-800 bg-slate-800/40 p-2 cursor-grab active:cursor-grabbing"
                    >
                      <div className="text-sm">{namespace?.name ?? binding.namespaceId}</div>
                      <Select
                        value={binding.roleId}
                        onValueChange={(roleId) => setNamespaceRole(binding.namespaceId, roleId)}
                      >
                        <SelectTrigger className="w-48 bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                          {namespaceRoles.map((role) => (
                            <SelectItem key={`${binding.id}-${role.id}`} value={role.id}>
                              {role.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="text-red-400 hover:text-red-300 hover:bg-red-950/30"
                        onClick={() => deleteNamespaceAssignment(binding.namespaceId)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="flex justify-end">
              <Button className="bg-blue-600 hover:bg-blue-700">Save Assignments</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
