import { useState } from 'react';
import { ChevronRight, ChevronDown, File, Folder, FolderOpen, Upload, FilePlus, FolderPlus, Download, Trash2 } from 'lucide-react';
import { FileNode } from '../types';
import { Button } from './ui/button';
import { ScrollArea } from './ui/scroll-area';

interface FileManagerProps {
  onFileSelect: (file: FileNode) => void;
  selectedFile: FileNode | null;
}

// Mock file tree
const mockFileTree: FileNode[] = [
  {
    name: 'plugins',
    path: '/plugins',
    type: 'folder',
    children: [
      { name: 'EssentialsX.jar', path: '/plugins/EssentialsX.jar', type: 'file', size: 2457600, modified: '2024-02-28' },
      { name: 'LuckPerms.jar', path: '/plugins/LuckPerms.jar', type: 'file', size: 3891200, modified: '2024-02-27' },
      { name: 'WorldEdit.jar', path: '/plugins/WorldEdit.jar', type: 'file', size: 5242880, modified: '2024-02-26' },
    ]
  },
  {
    name: 'config',
    path: '/config',
    type: 'folder',
    children: [
      { name: 'server.properties', path: '/config/server.properties', type: 'file', size: 4096, modified: '2024-03-01' },
      { name: 'spigot.yml', path: '/config/spigot.yml', type: 'file', size: 8192, modified: '2024-02-28' },
      { name: 'bukkit.yml', path: '/config/bukkit.yml', type: 'file', size: 6144, modified: '2024-02-28' },
      {
        name: 'plugins',
        path: '/config/plugins',
        type: 'folder',
        children: [
          { name: 'EssentialsX', path: '/config/plugins/EssentialsX', type: 'folder', children: [
            { name: 'config.yml', path: '/config/plugins/EssentialsX/config.yml', type: 'file', size: 16384, modified: '2024-03-01' }
          ]},
          { name: 'LuckPerms', path: '/config/plugins/LuckPerms', type: 'folder', children: [
            { name: 'config.yml', path: '/config/plugins/LuckPerms/config.yml', type: 'file', size: 12288, modified: '2024-02-28' }
          ]},
        ]
      }
    ]
  },
  {
    name: 'world',
    path: '/world',
    type: 'folder',
    children: [
      { name: 'level.dat', path: '/world/level.dat', type: 'file', size: 20480, modified: '2024-03-02' },
      { name: 'region', path: '/world/region', type: 'folder', children: [] },
    ]
  },
  {
    name: 'logs',
    path: '/logs',
    type: 'folder',
    children: [
      { name: 'latest.log', path: '/logs/latest.log', type: 'file', size: 1048576, modified: '2024-03-02' },
      { name: '2024-03-01.log.gz', path: '/logs/2024-03-01.log.gz', type: 'file', size: 524288, modified: '2024-03-01' },
    ]
  },
];

function FileTreeItem({ 
  node, 
  level = 0, 
  onSelect, 
  selectedPath 
}: { 
  node: FileNode; 
  level?: number; 
  onSelect: (file: FileNode) => void;
  selectedPath: string | null;
}) {
  const [expanded, setExpanded] = useState(level === 0);
  const isSelected = selectedPath === node.path;

  return (
    <div>
      <div
        className={`
          flex items-center gap-2 py-1.5 px-2 rounded cursor-pointer hover:bg-slate-800
          ${isSelected ? 'bg-slate-800' : ''}
        `}
        style={{ paddingLeft: `${level * 16 + 8}px` }}
        onClick={() => {
          if (node.type === 'folder') {
            setExpanded(!expanded);
          } else {
            onSelect(node);
          }
        }}
      >
        {node.type === 'folder' && (
          <span className="text-slate-400">
            {expanded ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </span>
        )}
        {node.type === 'folder' ? (
          expanded ? (
            <FolderOpen className="w-4 h-4 text-blue-400" />
          ) : (
            <Folder className="w-4 h-4 text-blue-400" />
          )
        ) : (
          <File className="w-4 h-4 text-slate-400" />
        )}
        <span className="text-sm flex-1">{node.name}</span>
        {node.type === 'file' && node.size && (
          <span className="text-xs text-slate-500">
            {(node.size / 1024).toFixed(0)} KB
          </span>
        )}
      </div>
      {node.type === 'folder' && expanded && node.children && (
        <div>
          {node.children.map((child) => (
            <FileTreeItem
              key={child.path}
              node={child}
              level={level + 1}
              onSelect={onSelect}
              selectedPath={selectedPath}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export function FileManager({ onFileSelect, selectedFile }: FileManagerProps) {
  return (
    <div className="h-full flex flex-col bg-slate-900 rounded-lg border border-slate-800">
      {/* Toolbar */}
      <div className="flex items-center gap-1 p-2 border-b border-slate-800">
        <Button size="sm" variant="ghost" className="h-8 text-xs">
          <Upload className="w-3 h-3 mr-1" />
          Upload
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs">
          <FilePlus className="w-3 h-3 mr-1" />
          New File
        </Button>
        <Button size="sm" variant="ghost" className="h-8 text-xs">
          <FolderPlus className="w-3 h-3 mr-1" />
          New Folder
        </Button>
        <div className="flex-1" />
        {selectedFile && (
          <>
            <Button size="sm" variant="ghost" className="h-8 text-xs">
              <Download className="w-3 h-3 mr-1" />
              Download
            </Button>
            <Button size="sm" variant="ghost" className="h-8 text-xs text-red-400 hover:text-red-300">
              <Trash2 className="w-3 h-3 mr-1" />
              Delete
            </Button>
          </>
        )}
      </div>

      {/* File Tree */}
      <ScrollArea className="flex-1 p-2">
        {mockFileTree.map((node) => (
          <FileTreeItem
            key={node.path}
            node={node}
            onSelect={onFileSelect}
            selectedPath={selectedFile?.path || null}
          />
        ))}
      </ScrollArea>
    </div>
  );
}
