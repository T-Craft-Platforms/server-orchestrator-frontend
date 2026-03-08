import { useMemo, useState } from 'react';
import { useNavigate } from 'react-router';
import { Layers, Search, UserPlus, Users } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';
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
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '../../components/ui/dialog';
import { Label } from '../../components/ui/label';
import { Checkbox } from '../../components/ui/checkbox';
import { mockNamespaces, mockRoleBindings, mockUsers } from '../../data/mockData';
import type { RoleBinding, User } from '../../types';

export function GlobalUsers() {
  const navigate = useNavigate();
  const [users, setUsers] = useState<User[]>([...mockUsers]);
  const [roleBindings, setRoleBindings] = useState<RoleBinding[]>([...mockRoleBindings]);
  const [isAddUserOpen, setIsAddUserOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [namespaceFilter, setNamespaceFilter] = useState<string>('all');
  const [newDisplayName, setNewDisplayName] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newEmail, setNewEmail] = useState('');
  const [newStatus, setNewStatus] = useState<'active' | 'invited' | 'disabled'>('active');
  const [newGlobalRole, setNewGlobalRole] = useState<'none' | 'role-global-admin' | 'role-global-reader'>('none');
  const [newNamespaces, setNewNamespaces] = useState<string[]>([]);
  const [namespaceSearch, setNamespaceSearch] = useState('');
  const [formError, setFormError] = useState('');

  const activeUsers = users.filter((user) => user.status === 'active').length;

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const search = searchQuery.toLowerCase();
      const matchesSearch =
        user.username.toLowerCase().includes(search) ||
        user.email.toLowerCase().includes(search) ||
        (user.displayName ?? '').toLowerCase().includes(search);
      const matchesNamespace =
        namespaceFilter === 'all' || user.namespaces.includes(namespaceFilter);
      return matchesSearch && matchesNamespace;
    });
  }, [namespaceFilter, searchQuery, users]);

  const roleLabelForUser = (userId: string) => {
    const userBindings = roleBindings.filter((binding) => binding.userId === userId);
    const globalBinding = userBindings.find((binding) => binding.namespaceId === 'global');
    const namespacedBindings = userBindings.filter((binding) => binding.namespaceId !== 'global');

    if (globalBinding?.roleId === 'role-global-admin') {
      return 'admin';
    }
    if (globalBinding?.roleId === 'role-global-reader') {
      return 'reader';
    }
    if (namespacedBindings.length > 0) {
      return 'user';
    }
    return 'none';
  };

  const toggleNamespace = (namespaceId: string) => {
    setNewNamespaces((current) =>
      current.includes(namespaceId)
        ? current.filter((id) => id !== namespaceId)
        : [...current, namespaceId]
    );
  };

  const resetAddUserForm = () => {
    setNewDisplayName('');
    setNewUsername('');
    setNewEmail('');
    setNewStatus('active');
    setNewGlobalRole('none');
    setNewNamespaces([]);
    setNamespaceSearch('');
    setFormError('');
  };

  const createUser = () => {
    const username = newUsername.trim();
    const email = newEmail.trim();
    const displayName = newDisplayName.trim();

    if (!displayName || !username || !email) {
      setFormError('Display name, username, and email are required.');
      return;
    }
    if (!email.includes('@')) {
      setFormError('Please enter a valid email address.');
      return;
    }
    if (users.some((candidate) => candidate.username.toLowerCase() === username.toLowerCase())) {
      setFormError('Username already exists.');
      return;
    }
    if (users.some((candidate) => candidate.email.toLowerCase() === email.toLowerCase())) {
      setFormError('Email already exists.');
      return;
    }

    const userId = `usr-${Date.now()}`;
    const userRole =
      newGlobalRole === 'role-global-admin'
        ? 'Global Admin'
        : newGlobalRole === 'role-global-reader'
        ? 'Global Reader'
        : newNamespaces.length > 0
        ? 'Namespace Reader'
        : 'Unassigned';

    const newUser: User = {
      id: userId,
      username,
      email,
      role: userRole,
      namespaces: [...newNamespaces],
      displayName,
      status: newStatus,
      lastLogin: undefined,
    };

    const newBindings: RoleBinding[] = [];
    if (newGlobalRole !== 'none') {
      newBindings.push({
        id: `rb-${Date.now()}-global-${userId}`,
        userId,
        roleId: newGlobalRole,
        namespaceId: 'global',
        createdAt: new Date().toISOString(),
      });
    }
    newNamespaces.forEach((namespaceId, index) => {
      newBindings.push({
        id: `rb-${Date.now()}-${index}-${namespaceId}-${userId}`,
        userId,
        roleId: 'role-namespace-reader',
        namespaceId,
        createdAt: new Date().toISOString(),
      });
    });

    setUsers((current) => [newUser, ...current]);
    setRoleBindings((current) => [...current, ...newBindings]);
    mockUsers.unshift(newUser);
    if (newBindings.length > 0) {
      mockRoleBindings.push(...newBindings);
    }

    setIsAddUserOpen(false);
    resetAddUserForm();
  };

  const filteredInitialNamespaces = mockNamespaces.filter((namespace) => {
    const search = namespaceSearch.toLowerCase().trim();
    if (!search) {
      return true;
    }
    return (
      namespace.name.toLowerCase().includes(search) ||
      namespace.description.toLowerCase().includes(search) ||
      namespace.id.toLowerCase().includes(search)
    );
  });

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-8 h-8 text-blue-500" />
              <h1 className="text-3xl font-bold">User Management</h1>
            </div>
            <p className="text-slate-400">Global and namespace role assignments</p>
          </div>
          <div className="flex gap-2">
            <Dialog
              open={isAddUserOpen}
              onOpenChange={(open) => {
                setIsAddUserOpen(open);
                if (!open) {
                  resetAddUserForm();
                }
              }}
            >
              <DialogTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  <UserPlus className="w-4 h-4 mr-2" />
                  Add User
                </Button>
              </DialogTrigger>
              <DialogContent className="bg-slate-900 border-slate-800 text-white max-w-xl">
                <DialogHeader>
                  <DialogTitle>Add User</DialogTitle>
                  <DialogDescription className="text-slate-400">
                    Create a new user and set initial global scope access.
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-2">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="new-display-name">Display Name</Label>
                      <Input
                        id="new-display-name"
                        value={newDisplayName}
                        onChange={(e) => setNewDisplayName(e.target.value)}
                        className="bg-slate-800 border-slate-700"
                        placeholder="Jane Admin"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="new-username">Username</Label>
                      <Input
                        id="new-username"
                        value={newUsername}
                        onChange={(e) => setNewUsername(e.target.value)}
                        className="bg-slate-800 border-slate-700"
                        placeholder="jane_admin"
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-email">Email</Label>
                    <Input
                      id="new-email"
                      type="email"
                      value={newEmail}
                      onChange={(e) => setNewEmail(e.target.value)}
                      className="bg-slate-800 border-slate-700"
                      placeholder="jane.admin@example.com"
                    />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label>Status</Label>
                      <Select value={newStatus} onValueChange={(value) => setNewStatus(value as 'active' | 'invited' | 'disabled')}>
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                          <SelectItem value="active">active</SelectItem>
                          <SelectItem value="invited">invited</SelectItem>
                          <SelectItem value="disabled">disabled</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label>Global Role</Label>
                      <Select value={newGlobalRole} onValueChange={(value) => setNewGlobalRole(value as 'none' | 'role-global-admin' | 'role-global-reader')}>
                        <SelectTrigger className="bg-slate-800 border-slate-700">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="bg-slate-900 border-slate-800">
                          <SelectItem value="none">none</SelectItem>
                          <SelectItem value="role-global-admin">global admin</SelectItem>
                          <SelectItem value="role-global-reader">global reader</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label>Initial Namespaces</Label>
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                      <Input
                        value={namespaceSearch}
                        onChange={(e) => setNamespaceSearch(e.target.value)}
                        placeholder="Search namespaces..."
                        className="pl-10 bg-slate-800 border-slate-700"
                      />
                    </div>
                    <div className="max-h-40 overflow-y-auto space-y-2 rounded-md border border-slate-800 bg-slate-800/40 p-3">
                      {filteredInitialNamespaces.map((namespace) => (
                        <label key={namespace.id} className="flex items-center gap-2 text-sm">
                          <Checkbox
                            checked={newNamespaces.includes(namespace.id)}
                            onCheckedChange={() => toggleNamespace(namespace.id)}
                          />
                          <span>{namespace.name}</span>
                        </label>
                      ))}
                      {filteredInitialNamespaces.length === 0 && (
                        <p className="text-sm text-slate-500">No namespaces found.</p>
                      )}
                    </div>
                  </div>
                  {formError && (
                    <p className="text-sm text-red-300">{formError}</p>
                  )}
                </div>
                <DialogFooter>
                  <Button variant="outline" onClick={() => setIsAddUserOpen(false)}>
                    Cancel
                  </Button>
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={createUser}>
                    Add User
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Total Users</p>
              <p className="text-2xl font-bold mt-1">{users.length}</p>
            </CardContent>
          </Card>
          <Card className="bg-slate-900 border-slate-800">
            <CardContent className="pt-6">
              <p className="text-sm text-slate-400">Active Users</p>
              <p className="text-2xl font-bold mt-1">{activeUsers}</p>
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

        <Card className="bg-slate-900 border-slate-800">
          <CardContent className="pt-6">
            <Table>
              <TableHeader>
                <TableRow className="border-slate-800 hover:bg-transparent">
                  <TableHead className="text-slate-400">User</TableHead>
                  <TableHead className="text-slate-400">Email</TableHead>
                  <TableHead className="text-slate-400">Status</TableHead>
                  <TableHead className="text-slate-400">Global Role</TableHead>
                  <TableHead className="text-slate-400">Namespaces</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
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
                    <TableCell>{roleLabelForUser(user.id)}</TableCell>
                    <TableCell>
                      <div className="inline-flex items-center gap-2 text-slate-300">
                        <Layers className="w-4 h-4 text-purple-400" />
                        <span>{user.namespaces.length}</span>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
