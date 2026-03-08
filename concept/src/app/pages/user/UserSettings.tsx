import { Palette, Settings, UserCircle2 } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Switch } from '../../components/ui/switch';
import { useUserPreferences } from '../../context/UserPreferencesContext';

export function UserSettings() {
  const { preferences, setNamespaceBackdropEnabled } = useUserPreferences();

  return (
    <div className="min-h-screen bg-slate-950 text-white p-4 sm:p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <UserCircle2 className="w-8 h-8 text-cyan-400" />
            <h1 className="text-2xl sm:text-3xl font-bold">User Settings</h1>
          </div>
          <p className="text-slate-400">Personal UI preferences and workspace behavior.</p>
        </div>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="w-5 h-5 text-cyan-400" />
              Visual Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between rounded-lg border border-slate-800 bg-slate-800/40 p-4">
              <div>
                <h3 className="font-medium">Namespace backdrop</h3>
                <p className="text-sm text-slate-400 mt-1">
                  Show a blurred namespace-specific background on namespace pages and subpages.
                </p>
              </div>
              <Switch
                checked={preferences.namespaceBackdropEnabled}
                onCheckedChange={setNamespaceBackdropEnabled}
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-slate-900 border-slate-800">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-5 h-5 text-blue-400" />
              Account
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="rounded-lg border border-slate-800 bg-slate-800/40 p-4">
              <p className="font-medium">Admin-1</p>
              <p className="text-sm text-slate-400 mt-1">admin@example.com</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
