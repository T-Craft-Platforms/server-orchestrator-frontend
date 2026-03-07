import { useMemo, useState } from 'react';
import { AlertCircle, Plus, Search, Shield, Users } from 'lucide-react';
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
import { useNamespace } from '../../context/NamespaceContext';
import { mockNamespaces, mockRoleBindings, mockRoles, mockUsers } from '../../data/mockData';

export function NamespaceUsers() {
  const { selectedNamespace } = useNamespace();
  const namespace = mockNamespaces.find((ns) => ns.id === selectedNamespace);
  const [searchQuery, setSearchQuery] = useState('');

  const namespaceRoles = mockRoles.filter((role) => role.namespaceId === selectedNamespace);
  const namespaceBindings = mockRoleBindings.filter((binding) => binding.namespaceId === selectedNamespace);

  const roleById = Object.fromEntries(mockRoles.map((role) => [role.id, role]));
  const usersInNamespace = useMemo(() => {
    if (!selectedNamespace) {
      return [];
    }

    return mockUsers.filter((user) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.displayName ?? '').toLowerCase().includes(search);
      return user.namespaces.includes(selectedNamespace) && matchesSearch;
    });
  }, [searchQuery, selectedNamespace]);

  const accessReviewFindings = namespaceBindings.filter((binding) => {
    const user = mockUsers.find((candidate) => candidate.id === binding.userId);
    return user?.status !== 'active';
  });

  if (!namespace || !selectedNamespace) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-8 h-8 text-purple-500" />
              <h1 className="text-3xl font-bold">Namespace Access</h1>
            </div>
            <p className="text-slate-400">Members and RBAC policies for {namespace.name}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" className="border-slate-700">
              <Shield className="w-4 h-4 mr-2" />
              Create Role
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Add Member
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Members</p>
              <p className="text-2xl font-bold mt-1">{usersInNamespace.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Custom Roles</p>
              <p className="text-2xl font-bold mt-1">{namespaceRoles.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Role Bindings</p>
              <p className="text-2xl font-bold mt-1">{namespaceBindings.length}</p>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search namespace members..."
                className="pl-10 bg-slate-800 border-slate-700"
              />
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="members" className="space-y-4">
          <TabsList className="bg-slate-900 border border-slate-800">
            <TabsTrigger value="members">Members</TabsTrigger>
            <TabsTrigger value="roles">Roles</TabsTrigger>
            <TabsTrigger value="review">Access Review</TabsTrigger>
          </TabsList>

          <TabsContent value="members">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Namespace Members</CardTitle>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow className="border-slate-800 hover:bg-transparent">
                      <TableHead className="text-slate-400">User</TableHead>
                      <TableHead className="text-slate-400">Email</TableHead>
                      <TableHead className="text-slate-400">Status</TableHead>
                      <TableHead className="text-slate-400">Roles In Namespace</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {usersInNamespace.map((user) => {
                      const bindings = namespaceBindings.filter((binding) => binding.userId === user.id);
                      return (
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
                          <TableCell>
                            <div className="flex gap-1 flex-wrap">
                              {bindings.length === 0 ? (
                                <Badge variant="outline" className="border-slate-700">
                                  No direct role
                                </Badge>
                              ) : (
                                bindings.map((binding) => (
                                  <Badge key={binding.id} variant="outline" className="border-slate-700">
                                    {roleById[binding.roleId]?.name ?? binding.roleId}
                                  </Badge>
                                ))
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="roles">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {namespaceRoles.map((role) => (
                <Card key={role.id} className="bg-slate-900 border-slate-800">
                  <CardContent className="pt-6">
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="font-semibold">{role.name}</h3>
                      <Badge className="bg-purple-900/40 text-purple-300">{namespace.name}</Badge>
                    </div>
                    <p className="text-sm text-slate-400 mb-3">{role.description}</p>
                    <div className="flex gap-2 flex-wrap">
                      {role.permissions.map((permission) => (
                        <Badge key={permission} variant="outline" className="text-xs border-slate-700">
                          {permission}
                        </Badge>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="review">
            <Card className="bg-slate-900 border-slate-800">
              <CardHeader>
                <CardTitle>Access Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {accessReviewFindings.length === 0 && (
                  <div className="p-4 rounded-lg border border-green-900/50 bg-green-950/20 text-sm text-green-200">
                    No stale or inactive bindings detected for this namespace.
                  </div>
                )}
                {accessReviewFindings.map((binding) => {
                  const user = mockUsers.find((candidate) => candidate.id === binding.userId);
                  const role = roleById[binding.roleId];

                  return (
                    <div
                      key={binding.id}
                      className="p-4 rounded-lg border border-amber-900/50 bg-amber-950/20"
                    >
                      <div className="flex items-start gap-3">
                        <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                        <div>
                          <h4 className="font-medium text-amber-200">
                            {user?.displayName ?? user?.username ?? binding.userId} has non-active account status
                          </h4>
                          <p className="text-sm text-amber-300/80 mt-1">
                            Role "{role?.name ?? binding.roleId}" is still bound in this namespace. Consider removing or
                            rotating this assignment.
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
