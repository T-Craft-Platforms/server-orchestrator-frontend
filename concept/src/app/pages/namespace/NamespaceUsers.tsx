import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { AlertCircle, Plus, Search, Shield, Users } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useNamespace } from '../../context/NamespaceContext';
import { mockNamespaces, mockRoleBindings, mockRoles, mockUsers } from '../../data/mockData';

export function NamespaceUsers() {
  const navigate = useNavigate();
  const { selectedNamespace } = useNamespace();
  const namespace = mockNamespaces.find((ns) => ns.id === selectedNamespace);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('all');

  const namespaceRoles = mockRoles.filter((role) => role.namespaceId === 'project');
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
      if (!matchesSearch || !user.namespaces.includes(selectedNamespace)) {
        return false;
      }
      if (roleFilter === 'all') {
        return true;
      }
      return namespaceBindings.some((binding) => binding.userId === user.id && binding.roleId === roleFilter);
    });
  }, [namespaceBindings, roleFilter, searchQuery, selectedNamespace]);

  const accessReviewFindings = namespaceBindings.filter((binding) => {
    const user = mockUsers.find((candidate) => candidate.id === binding.userId);
    return user?.status !== 'active';
  });

  if (!namespace || !selectedNamespace) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-8 h-8 text-purple-500" />
              <h1 className="text-2xl sm:text-3xl font-bold">Project Access</h1>
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
              <p className="text-sm text-slate-400">Project Roles</p>
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <Input
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search project members..."
                  className="pl-10 bg-slate-800 border-slate-700"
                />
              </div>
              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="bg-slate-800 border-slate-700">
                  <SelectValue placeholder="Filter by role" />
                </SelectTrigger>
                <SelectContent className="bg-slate-900 border-slate-800">
                  <SelectItem value="all">All roles</SelectItem>
                  {namespaceRoles.map((role) => (
                    <SelectItem key={role.id} value={role.id}>
                      {role.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle>Project Members</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Roles In Project</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersInNamespace.map((user) => {
                  const bindings = namespaceBindings.filter((binding) => binding.userId === user.id);
                  return (
                    <TableRow
                      key={user.id}
                      className="border-slate-800 hover:bg-slate-800/40 cursor-pointer"
                      onClick={() => navigate(`/global/users/${user.id}`)}
                    >
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

        <Card className="bg-slate-900 border-slate-800 mb-6">
          <CardHeader>
            <CardTitle>Project Roles</CardTitle>
          </CardHeader>
          <CardContent>
            <Table className="min-w-[760px]">
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">Role</TableHead>
                  <TableHead className="text-slate-400">Description</TableHead>
                  <TableHead className="text-slate-400">Permissions</TableHead>
                  <TableHead className="text-slate-400">Bindings</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {namespaceRoles.map((role) => {
                  const bindingCount = namespaceBindings.filter((binding) => binding.roleId === role.id).length;
                  return (
                    <TableRow key={role.id} className="border-slate-800 hover:bg-slate-800/40">
                      <TableCell className="font-medium">{role.name}</TableCell>
                      <TableCell className="text-slate-300">{role.description ?? 'No description'}</TableCell>
                      <TableCell>
                        <div className="flex gap-1 flex-wrap">
                          {role.permissions.map((permission) => (
                            <Badge key={permission} variant="outline" className="text-xs border-slate-700">
                              {permission}
                            </Badge>
                          ))}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="border-slate-700">
                          {bindingCount}
                        </Badge>
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle>Access Review</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {accessReviewFindings.length === 0 && (
              <div className="p-4 rounded-lg border border-green-900/50 bg-green-950/20 text-sm text-green-200">
                No stale or inactive bindings detected for this project.
              </div>
            )}
            {accessReviewFindings.map((binding) => {
              const user = mockUsers.find((candidate) => candidate.id === binding.userId);
              const role = roleById[binding.roleId];

              return (
                <div key={binding.id} className="p-4 rounded-lg border border-amber-900/50 bg-amber-950/20">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="w-5 h-5 text-amber-400 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-amber-200">
                        {user?.displayName ?? user?.username ?? binding.userId} has non-active account status
                      </h4>
                      <p className="text-sm text-amber-300/80 mt-1">
                        Role "{role?.name ?? binding.roleId}" is still bound in this project. Consider removing or rotating this assignment.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
