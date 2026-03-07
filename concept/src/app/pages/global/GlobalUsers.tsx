import { useMemo, useState } from 'react';
import { BadgeCheck, Plus, Search, Shield, UserPlus, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { mockNamespaces, mockRoleBindings, mockRoles, mockUsers } from '../../data/mockData';

export function GlobalUsers() {
  const [searchQuery, setSearchQuery] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState<string>('all');

  const filteredUsers = useMemo(() => {
    return mockUsers.filter((user) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.displayName ?? '').toLowerCase().includes(search);
      const matchesNamespace =
        namespaceFilter === 'all' || user.namespaces.includes(namespaceFilter);
      return matchesSearch && matchesNamespace;
    });
  }, [namespaceFilter, searchQuery]);

  const globalRoles = mockRoles.filter((role) => role.namespaceId === 'global');
  const namespaceRoles = mockRoles.filter((role) => role.namespaceId !== 'global');
  const activeUsers = mockUsers.filter((user) => user.status === 'active').length;
  const globalBindings = mockRoleBindings.filter((binding) => binding.namespaceId === 'global').length;

  const namespaceNameById = Object.fromEntries(mockNamespaces.map((ns) => [ns.id, ns.name]));
  const roleById = Object.fromEntries(mockRoles.map((role) => [role.id, role]));
  const userById = Object.fromEntries(mockUsers.map((user) => [user.id, user]));

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">User Management</h1>
            </div>
            <p className="text-slate-400">Cluster-wide identity, role, and RBAC policy management</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-700">
              <BadgeCheck className="w-4 h-4 mr-2" />
              Create Role
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <UserPlus className="w-4 h-4 mr-2" />
              Invite User
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Total Users</p>
              <p className="text-2xl font-bold mt-1">{mockUsers.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Active Users</p>
              <p className="text-2xl font-bold mt-1">{activeUsers}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Global Roles</p>
              <p className="text-2xl font-bold mt-1">{globalRoles.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Global Bindings</p>
              <p className="text-2xl font-bold mt-1">{globalBindings}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardContent className="pt-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search users by name, username, or email..."
                  className="pl-10 bg-slate-800 border-slate-700"
                />
              </div>
              <Select value={namespaceFilter} onValueChange={setNamespaceFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Filter by namespace" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="all">All namespaces</SelectItem>
                  {mockNamespaces.map((ns) => (
                    <SelectItem key={ns.id} value={ns.id}>
                      {ns.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="users" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="users">Users</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="bindings">Role Bindings</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Cluster Users</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">User</TableHead>
                      <TableHead className="text-slate-400">Email</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Primary Role</TableHead>
                      <TableHead className="text-slate-400">Namespaces</TableHead>
                      <TableHead className="text-slate-400">MFA</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredUsers.map((user) => (
                      <TableRow key={user.id} className="border-slate-800 hover:bg-slate-800/40">
                        <TableCell>
                          <div className="font-medium">{user.displayName ?? user.username}</div>
                          <div className="text-xs text-slate-500">@{user.username}</div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge
                            className={
                              user.status === 'active'
                                ? 'bg-green-900/40 text-green-300'
                                : user.status === 'invited'
                                ? 'bg-amber-900/40 text-amber-300'
                                : 'bg-red-900/40 text-red-300'
                            }
                          >
                            {user.status ?? 'active'}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.role}</TableCell>
                        <TableCell>{user.namespaces.length}</TableCell>
                        <TableCell>
                          <Badge variant="outline" className="border-slate-700">
                            {user.mfaEnabled ? 'Enabled' : 'Disabled'}
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[...globalRoles, ...namespaceRoles].map((role) => {
                const isGlobalRole = role.namespaceId === 'global';
                return (
                  <Card key={role.id} className="bg-slate-900 border-slate-800">
                    <CardContent className="pt-6">
                      <div className="flex items-start justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold">{role.name}</h3>
                          <p className="text-sm text-slate-400 mt-1">{role.description}</p>
                        </div>
                        <Badge className={isGlobalRole ? 'bg-blue-900/40 text-blue-300' : 'bg-purple-900/40 text-purple-300'}>
                          {isGlobalRole ? 'Global' : namespaceNameById[role.namespaceId] ?? role.namespaceId}
                        </Badge>
                      </div>
                      <div className="flex gap-2 flex-wrap">
                        {role.permissions.map((permission) => (
                          <Badge key={permission} variant="outline" className="text-xs border-slate-700">
                            {permission}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </TabsContent>

          <TabsContent value="bindings">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Role Bindings</CardTitle>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Add Binding
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">User</TableHead>
                      <TableHead className="text-slate-400">Role</TableHead>
                      <TableHead className="text-slate-400">Scope</TableHead>
                      <TableHead className="text-slate-400">Created</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {mockRoleBindings.map((binding) => {
                      const user = userById[binding.userId];
                      const role = roleById[binding.roleId];
                      const isGlobal = binding.namespaceId === 'global';

                      return (
                        <TableRow key={binding.id} className="border-slate-800 hover:bg-slate-800/40">
                          <TableCell>{user?.displayName ?? user?.username ?? binding.userId}</TableCell>
                          <TableCell>{role?.name ?? binding.roleId}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className="border-slate-700">
                              {isGlobal ? 'Global' : namespaceNameById[binding.namespaceId] ?? binding.namespaceId}
                            </Badge>
                          </TableCell>
                          <TableCell>{new Date(binding.createdAt).toLocaleDateString()}</TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <Card className="mt-6 bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <Shield className="w-5 h-5 text-emerald-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-emerald-200">RBAC Baseline Policy</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Enforce least-privilege role templates and require MFA for all global-scope roles.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
