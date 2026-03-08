import { useState } from 'react';
import { Layers, Settings as SettingsIcon, Shield, Database, Network, Container } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../components/ui/select';
import { useNamespace } from '../../context/NamespaceContext';
import { mockNamespaces } from '../../data/mockData';

export function NamespaceSettings() {
  const { selectedNamespace } = useNamespace();
  const namespace = mockNamespaces.find((ns) => ns.id === selectedNamespace);
  const [runtimeProfile, setRuntimeProfile] = useState('paper');
  const [volumeDriver, setVolumeDriver] = useState('local');

  if (!namespace) {
    return null;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Layers className="w-8 h-8 text-purple-500" />
            <h1 className="text-3xl font-bold">Project Settings</h1>
          </div>
          <p className="text-slate-400">Docker runtime and policy defaults for {namespace.name}</p>
        </div>

        <div className="space-y-6">
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-blue-500" />
                Runtime Defaults
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-image">Default Image</Label>
                  <Input
                    id="default-image"
                    defaultValue="itzg/minecraft-server:java21"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label>Runtime Profile</Label>
                  <Select value={runtimeProfile} onValueChange={setRuntimeProfile}>
                    <SelectTrigger className="mt-2 bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="paper">paper</SelectItem>
                      <SelectItem value="velocity">velocity</SelectItem>
                      <SelectItem value="forge">forge</SelectItem>
                      <SelectItem value="fabric">fabric</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="default-cpu">Default CPU Limit (cores)</Label>
                  <Input id="default-cpu" defaultValue="2.0" className="mt-2 bg-slate-800 border-slate-700" />
                </div>
                <div>
                  <Label htmlFor="default-memory">Default Memory Limit</Label>
                  <Input id="default-memory" defaultValue="4G" className="mt-2 bg-slate-800 border-slate-700" />
                </div>
                <div>
                  <Label htmlFor="max-servers">Max Servers</Label>
                  <Input id="max-servers" type="number" defaultValue="20" className="mt-2 bg-slate-800 border-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Container className="w-5 h-5 text-green-500" />
                Container Lifecycle
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Auto-Restart Containers</h4>
                  <p className="text-sm text-slate-400 mt-1">Use restart policy `unless-stopped` for deployed servers.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="stop-timeout">Stop Timeout (seconds)</Label>
                  <Input id="stop-timeout" type="number" defaultValue="25" className="mt-2 bg-slate-800 border-slate-700" />
                </div>
                <div>
                  <Label htmlFor="log-retention">Log Retention (days)</Label>
                  <Input id="log-retention" type="number" defaultValue="14" className="mt-2 bg-slate-800 border-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Network className="w-5 h-5 text-purple-500" />
                Network And Storage
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Dedicated Bridge Network</h4>
                  <p className="text-sm text-slate-400 mt-1">Attach all project containers to a dedicated network segment.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Default Volume Driver</Label>
                  <Select value={volumeDriver} onValueChange={setVolumeDriver}>
                    <SelectTrigger className="mt-2 bg-slate-800 border-slate-700">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-slate-900 border-slate-800">
                      <SelectItem value="local">local</SelectItem>
                      <SelectItem value="nfs">nfs</SelectItem>
                      <SelectItem value="ceph">ceph</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="volume-quota">Volume Quota (GB)</Label>
                  <Input id="volume-quota" type="number" defaultValue="500" className="mt-2 bg-slate-800 border-slate-700" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-500" />
                Security Policies
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Require Signed Images</h4>
                  <p className="text-sm text-slate-400 mt-1">Only allow images with trusted signatures.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Block Privileged Containers</h4>
                  <p className="text-sm text-slate-400 mt-1">Prevent privileged mode unless explicitly approved.</p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Allow Custom Docker Args</h4>
                  <p className="text-sm text-slate-400 mt-1">Permit project admins to pass custom runtime args.</p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-cyan-500" />
                Backup Defaults
              </CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="backup-schedule">Backup Schedule</Label>
                <Input id="backup-schedule" defaultValue="0 */6 * * *" className="mt-2 bg-slate-800 border-slate-700" />
              </div>
              <div>
                <Label htmlFor="backup-retention">Retention (days)</Label>
                <Input id="backup-retention" type="number" defaultValue="30" className="mt-2 bg-slate-800 border-slate-700" />
              </div>
              <div>
                <Label htmlFor="backup-target">Backup Target</Label>
                <Input id="backup-target" defaultValue="s3://mc-backups/projects" className="mt-2 bg-slate-800 border-slate-700" />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-slate-700">
              Reset to Project Defaults
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Project Settings
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
