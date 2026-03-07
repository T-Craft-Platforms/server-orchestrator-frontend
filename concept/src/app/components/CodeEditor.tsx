import { Editor } from '@monaco-editor/react';
import { FileNode } from '../types';
import { Save, RotateCcw } from 'lucide-react';
import { Button } from './ui/button';
import { useState } from 'react';

interface CodeEditorProps {
  file: FileNode | null;
}

// Mock file contents
const mockFileContents: Record<string, string> = {
  '/config/server.properties': `# Minecraft server properties
#Mon Mar 02 10:30:00 UTC 2024
enable-jmx-monitoring=false
rcon.port=25575
level-seed=
gamemode=survival
enable-command-block=false
enable-query=false
generator-settings={}
enforce-secure-profile=true
level-name=world
motd=A Minecraft Server
query.port=25565
pvp=true
generate-structures=true
max-chained-neighbor-updates=1000000
difficulty=easy
network-compression-threshold=256
max-tick-time=60000
require-resource-pack=false
use-native-transport=true
max-players=20
online-mode=true
enable-status=true
allow-flight=false
broadcast-rcon-to-ops=true
view-distance=10
server-ip=
resource-pack-prompt=
allow-nether=true
server-port=25565
enable-rcon=false
sync-chunk-writes=true
op-permission-level=4
prevent-proxy-connections=false
hide-online-players=false
resource-pack=
entity-broadcast-range-percentage=100
simulation-distance=10
rcon.password=
player-idle-timeout=0
force-gamemode=false
rate-limit=0
hardcore=false
white-list=false
broadcast-console-to-ops=true
spawn-npcs=true
spawn-animals=true
function-permission-level=2
level-type=minecraft\\:normal
text-filtering-config=
spawn-monsters=true
enforce-whitelist=false
spawn-protection=16
resource-pack-sha1=
max-world-size=29999984`,
  '/config/spigot.yml': `# This is the main configuration file for Spigot.
# As you can see, there's tons to configure. Some options may impact gameplay, so use
# with caution, and make sure you know what each option does before configuring.
# For a reference for any variable inside this file, check out the Spigot wiki at
# http://www.spigotmc.org/wiki/spigot-configuration/

config-version: 12
settings:
  debug: false
  save-user-cache-on-stop-only: false
  sample-count: 12
  bungeecord: false
  player-shuffle: 0
  user-cache-size: 1000
  moved-wrongly-threshold: 0.0625
  moved-too-quickly-multiplier: 10.0
  timeout-time: 60
  restart-on-crash: true
  restart-script: ./start.sh
  netty-threads: 4
  attribute:
    maxHealth:
      max: 2048.0
    movementSpeed:
      max: 2048.0
    attackDamage:
      max: 2048.0
messages:
  whitelist: You are not whitelisted on this server!
  unknown-command: Unknown command. Type "/help" for help.
  server-full: The server is full!
  outdated-client: Outdated client! Please use {0}
  outdated-server: Outdated server! I'm still on {0}
  restart: Server is restarting
advancements:
  disable-saving: false
  disabled:
  - minecraft:story/disabled
commands:
  tab-complete: 0
  log: true
  spam-exclusions:
  - /skill
  silent-commandblock-console: false
  replace-commands:
  - setblock
  - summon
  - testforblock
  - tellraw
stats:
  disable-saving: false
  forced-stats: {}
world-settings:
  default:
    verbose: false`,
  '/config/plugins/EssentialsX/config.yml': `# EssentialsX Configuration File

# General Settings
locale: en
update-check: true
debug: false

# Player Settings
player-command-teleports: true
spawn-on-join: false
teleport-safety: true
teleport-cooldown: 0
teleport-delay: 0
teleport-invulnerability: 4
heal-cooldown: 60
  
# Economy Settings
economy:
  currency-symbol: $
  max-money: 10000000000000
  min-money: -10000
  starting-balance: 1000
  
# Chat Settings
chat:
  format: '<{DISPLAYNAME}> {MESSAGE}'
  group-formats:
    Admin: '<&4{DISPLAYNAME}&r> {MESSAGE}'
    Moderator: '<&9{DISPLAYNAME}&r> {MESSAGE}'
    Default: '<&7{DISPLAYNAME}&r> {MESSAGE}'`,
  '/logs/latest.log': `[10:30:15] [Server thread/INFO]: Starting minecraft server version 1.20.4
[10:30:15] [Server thread/INFO]: Loading properties
[10:30:15] [Server thread/INFO]: Default game type: SURVIVAL
[10:30:15] [Server thread/INFO]: Generating keypair
[10:30:16] [Server thread/INFO]: Starting Minecraft server on *:25565
[10:30:16] [Server thread/INFO]: Using epoll channel type
[10:30:16] [Server thread/INFO]: Preparing level "world"
[10:30:17] [Server thread/INFO]: Preparing start region for dimension minecraft:overworld
[10:30:18] [Server thread/INFO]: Time elapsed: 1234 ms
[10:30:18] [Server thread/INFO]: Done (2.456s)! For help, type "help"
[10:30:18] [Server thread/INFO]: [EssentialsX] Loading EssentialsX v2.20.1
[10:30:18] [Server thread/INFO]: [LuckPerms] Loading LuckPerms v5.4.108
[10:30:18] [Server thread/INFO]: [WorldEdit] Loading WorldEdit v7.2.15
[10:30:19] [Server thread/INFO]: [EssentialsX] Enabling EssentialsX v2.20.1
[10:30:19] [Server thread/INFO]: [LuckPerms] Enabling LuckPerms v5.4.108
[10:30:19] [Server thread/INFO]: [WorldEdit] Enabling WorldEdit v7.2.15
[10:30:20] [User Authenticator #1/INFO]: UUID of player Steve is 069a79f4-44e9-4726-a5be-fca90e38aaf5
[10:30:20] [Server thread/INFO]: Steve joined the game
[10:30:20] [Server thread/INFO]: Steve[/127.0.0.1:54321] logged in with entity id 123 at ([world]0.5, 64.0, 0.5)`,
};

export function CodeEditor({ file }: CodeEditorProps) {
  const [hasChanges, setHasChanges] = useState(false);
  const [content, setContent] = useState('');

  if (!file) {
    return (
      <div className="h-full flex items-center justify-center bg-slate-900 rounded-lg border border-slate-800">
        <div className="text-center">
          <p className="text-slate-400">Select a file to edit</p>
        </div>
      </div>
    );
  }

  const fileContent = mockFileContents[file.path] || '# File content will appear here';
  const language = file.name.endsWith('.yml') || file.name.endsWith('.yaml') 
    ? 'yaml' 
    : file.name.endsWith('.json')
    ? 'json'
    : file.name.endsWith('.properties')
    ? 'ini'
    : file.name.endsWith('.log')
    ? 'log'
    : 'plaintext';

  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800">
      {/* Editor Header */}
      <div className="flex items-center justify-between p-3 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <span className="text-sm font-medium">{file.name}</span>
          {hasChanges && (
            <span className="text-xs text-orange-400">• Modified</span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {hasChanges && (
            <Button size="sm" variant="ghost" className="h-8 text-xs">
              <RotateCcw className="w-3 h-3 mr-1" />
              Discard
            </Button>
          )}
          <Button size="sm" className="h-8 text-xs bg-blue-600 hover:bg-blue-700">
            <Save className="w-3 h-3 mr-1" />
            Save
          </Button>
        </div>
      </div>

      {/* Monaco Editor */}
      <div className="flex-1">
        <Editor
          height="100%"
          defaultLanguage={language}
          defaultValue={fileContent}
          theme="vs-dark"
          onChange={(value) => {
            setContent(value || '');
            setHasChanges(true);
          }}
          options={{
            minimap: { enabled: false },
            fontSize: 13,
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            readOnly: file.name.endsWith('.log'),
          }}
        />
      </div>
    </div>
  );
}
