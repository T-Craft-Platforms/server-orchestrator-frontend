import { Settings as SettingsIcon, Globe, Shield, Database, Bell } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Label } from '../../components/ui/label';
import { Switch } from '../../components/ui/switch';

export function GlobalSettings() {
  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-2 mb-2">
            <Globe className="w-8 h-8 text-blue-500" />
            <h1 className="text-2xl sm:text-3xl font-bold">Global Settings</h1>
          </div>
          <p className="text-slate-400">Docker platform configuration and preferences</p>
        </div>

        <div className="space-y-6">
          {/* Docker Control Plane */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="w-5 h-5 text-blue-500" />
                Docker Control Plane
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="fleet-name">Fleet Name</Label>
                  <Input
                    id="fleet-name"
                    defaultValue="production-docker-fleet"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="docker-engine-version">Docker Engine Version</Label>
                  <Input
                    id="docker-engine-version"
                    defaultValue="v27.0.3"
                    className="mt-2 bg-slate-800 border-slate-700"
                    disabled
                  />
                </div>
              </div>
              <div>
                <Label htmlFor="api-endpoint">Docker API Endpoint</Label>
                <Input
                  id="api-endpoint"
                  defaultValue="tcp://docker-api.internal:2376"
                  className="mt-2 bg-slate-800 border-slate-700"
                />
              </div>
            </CardContent>
          </Card>

          {/* Resource Quotas */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="w-5 h-5 text-purple-500" />
                Default Resource Quotas
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="default-cpu">Default Container CPU Limit (cores)</Label>
                  <Input
                    id="default-cpu"
                    type="text"
                    defaultValue="2.0"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="default-memory">Default Container Memory Limit</Label>
                  <Input
                    id="default-memory"
                    type="text"
                    defaultValue="4G"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="max-servers">Max Servers per Project</Label>
                  <Input
                    id="max-servers"
                    type="number"
                    defaultValue="20"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>
                <div>
                  <Label htmlFor="max-storage">Max Volume Storage per Project (GB)</Label>
                  <Input
                    id="max-storage"
                    type="number"
                    defaultValue="500"
                    className="mt-2 bg-slate-800 border-slate-700"
                  />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-500" />
                Security & RBAC
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Enforce Default Seccomp Profile</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Apply baseline container hardening on every host
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Enable Bridge Network Isolation</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Isolate project traffic by default
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Require Image Signatures</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Only allow signed container images
                  </p>
                </div>
                <Switch />
              </div>
            </CardContent>
          </Card>

          {/* Notifications */}
          <Card className="bg-slate-900 border-slate-800">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5 text-orange-500" />
                Notifications
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Server Failures</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Get notified when servers crash or fail
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Resource Warnings</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Alert when resources exceed thresholds
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-slate-800/50">
                <div>
                  <h4 className="font-medium">Security Alerts</h4>
                  <p className="text-sm text-slate-400 mt-1">
                    Notify on security policy violations
                  </p>
                </div>
                <Switch defaultChecked />
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="flex justify-end gap-3">
            <Button variant="outline" className="border-slate-700">
              Reset to Defaults
            </Button>
            <Button className="bg-blue-600 hover:bg-blue-700">
              Save Changes
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
