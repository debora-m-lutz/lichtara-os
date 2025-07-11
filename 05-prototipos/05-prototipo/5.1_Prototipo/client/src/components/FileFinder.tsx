import React, { useState, useEffect } from 'react';
import { Search, File, Folder, Filter } from 'lucide-react';

interface FileItem {
  path: string;
  name: string;
  type: 'file' | 'directory';
  extension?: string;
}

// Simulated file structure based on the repository
const PROJECT_FILES: FileItem[] = [
  // Root files
  { path: './README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './package.json', name: 'package.json', type: 'file', extension: 'json' },
  { path: './CODE_OF_CONDUCT.md', name: 'CODE_OF_CONDUCT.md', type: 'file', extension: 'md' },
  { path: './CONTRIBUTING.md', name: 'CONTRIBUTING.md', type: 'file', extension: 'md' },
  { path: './SECURITY.md', name: 'SECURITY.md', type: 'file', extension: 'md' },
  { path: './SERVER_MANAGER_README.md', name: 'SERVER_MANAGER_README.md', type: 'file', extension: 'md' },
  { path: './.gitignore', name: '.gitignore', type: 'file' },
  { path: './server-manager.sh', name: 'server-manager.sh', type: 'file', extension: 'sh' },
  { path: './test-branch-ancestry.sh', name: 'test-branch-ancestry.sh', type: 'file', extension: 'sh' },
  { path: './test-server-manager.sh', name: 'test-server-manager.sh', type: 'file', extension: 'sh' },
  
  // Documentation directories
  { path: './00-overview:/README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './01-fundamentos:/README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './02-manual-aurora:/README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './02-manual-aurora:/indice.md', name: 'indice.md', type: 'file', extension: 'md' },
  { path: './03-tecnica:/README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './04-legal:/README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './04-legal:/licensing-agreement.md', name: 'licensing-agreement.md', type: 'file', extension: 'md' },
  { path: './04-legal:/nda.md', name: 'nda.md', type: 'file', extension: 'md' },
  { path: './05-ai:/README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './05-ai:/integracao-modelos.md', name: 'integracao-modelos.md', type: 'file', extension: 'md' },
  
  // Prototype files
  { path: './05-prototipos/README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/package.json', name: 'package.json', type: 'file', extension: 'json' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/package-lock.json', name: 'package-lock.json', type: 'file', extension: 'json' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/README.md', name: 'README.md', type: 'file', extension: 'md' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/components.json', name: 'components.json', type: 'file', extension: 'json' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/tailwind.config.ts', name: 'tailwind.config.ts', type: 'file', extension: 'ts' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/tsconfig.json', name: 'tsconfig.json', type: 'file', extension: 'json' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/vite.config.ts', name: 'vite.config.ts', type: 'file', extension: 'ts' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/drizzle.config.ts', name: 'drizzle.config.ts', type: 'file', extension: 'ts' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/client/index.html', name: 'index.html', type: 'file', extension: 'html' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/client/src/main.tsx', name: 'main.tsx', type: 'file', extension: 'tsx' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/client/src/index.css', name: 'index.css', type: 'file', extension: 'css' },
  { path: './05-prototipos/05-prototipo/5.1_Prototipo/client/src/lib/utils.ts', name: 'utils.ts', type: 'file', extension: 'ts' },
  
  // Core directory
  { path: './core/cleanup', name: 'cleanup', type: 'file' },
  
  // Docs directory
  { path: './docs/BRANCH_ANCESTRY_VALIDATION.md', name: 'BRANCH_ANCESTRY_VALIDATION.md', type: 'file', extension: 'md' },
  
  // Many manual files (sample)
  { path: './manuais/dna-do-projeto.md', name: 'dna-do-projeto.md', type: 'file', extension: 'md' },
  { path: './manuais/FLUX.md', name: 'FLUX.md', type: 'file', extension: 'md' },
  { path: './manuais/tecnologia/Nova Tecnologia.md', name: 'Nova Tecnologia.md', type: 'file', extension: 'md' },
  { path: './manuais/conceito-geral/Conceito Geral do Projeto.md', name: 'Conceito Geral do Projeto.md', type: 'file', extension: 'md' },
  { path: './manuais/arquitetura/Manual da Arquitetura do Sistema.md', name: 'Manual da Arquitetura do Sistema.md', type: 'file', extension: 'md' },
  { path: './manuais/implementacao/Manual de Testes e Implementação do Sistema.md', name: 'Manual de Testes e Implementação do Sistema.md', type: 'file', extension: 'md' },
];

const FILE_TYPE_ICONS: Record<string, string> = {
  md: '📄',
  json: '⚙️',
  ts: '🟦',
  tsx: '⚛️',
  js: '🟨',
  jsx: '⚛️',
  html: '🌐',
  css: '🎨',
  sh: '🐚',
  default: '📄'
};

const FILE_TYPE_COLORS: Record<string, string> = {
  md: 'text-blue-600',
  json: 'text-orange-600',
  ts: 'text-blue-700',
  tsx: 'text-cyan-600',
  js: 'text-yellow-600',
  jsx: 'text-cyan-600',
  html: 'text-orange-500',
  css: 'text-pink-600',
  sh: 'text-green-600',
  default: 'text-gray-600'
};

export const FileFinder: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredFiles, setFilteredFiles] = useState<FileItem[]>(PROJECT_FILES);
  const [selectedExtension, setSelectedExtension] = useState<string>('all');
  const [showOnlyFiles, setShowOnlyFiles] = useState(true);

  // Get unique extensions for filter
  const extensions = Array.from(new Set(
    PROJECT_FILES.filter(file => file.extension).map(file => file.extension)
  )).sort();

  useEffect(() => {
    let filtered = PROJECT_FILES;

    // Filter by file type (equivalent to find . -type f)
    if (showOnlyFiles) {
      filtered = filtered.filter(item => item.type === 'file');
    }

    // Filter by extension
    if (selectedExtension !== 'all') {
      filtered = filtered.filter(item => item.extension === selectedExtension);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(item =>
        item.path.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredFiles(filtered);
  }, [searchTerm, selectedExtension, showOnlyFiles]);

  const getFileIcon = (extension?: string) => {
    return FILE_TYPE_ICONS[extension || 'default'] || FILE_TYPE_ICONS.default;
  };

  const getFileColor = (extension?: string) => {
    return FILE_TYPE_COLORS[extension || 'default'] || FILE_TYPE_COLORS.default;
  };

  return (
    <div className="w-full max-w-6xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      {/* Header */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2 flex items-center gap-2">
          <Search className="w-6 h-6" />
          File Finder - find . -type f
        </h2>
        <p className="text-gray-600">
          Explore the Lichtara OS project structure. Similar to the Unix `find . -type f` command.
        </p>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* Search */}
        <div className="relative">
          <Search className="absolute left-3 top-3 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search files..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>

        {/* Extension Filter */}
        <div>
          <select
            value={selectedExtension}
            onChange={(e) => setSelectedExtension(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="all">All Extensions</option>
            {extensions.map(ext => (
              <option key={ext} value={ext}>
                .{ext} files
              </option>
            ))}
          </select>
        </div>

        {/* Type Filter */}
        <div className="flex items-center gap-2">
          <Filter className="w-4 h-4 text-gray-500" />
          <label className="flex items-center">
            <input
              type="checkbox"
              checked={showOnlyFiles}
              onChange={(e) => setShowOnlyFiles(e.target.checked)}
              className="mr-2"
            />
            Files only (-type f)
          </label>
        </div>
      </div>

      {/* Stats */}
      <div className="mb-4 text-sm text-gray-600">
        Showing {filteredFiles.length} of {PROJECT_FILES.length} items
      </div>

      {/* File List */}
      <div className="bg-gray-50 rounded-lg p-4 max-h-96 overflow-y-auto">
        {filteredFiles.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <File className="w-12 h-12 mx-auto mb-2 opacity-50" />
            <p>No files found matching your criteria.</p>
          </div>
        ) : (
          <div className="space-y-1">
            {filteredFiles.map((file, index) => (
              <div
                key={`${file.path}-${index}`}
                className="flex items-center gap-3 p-2 hover:bg-white rounded transition-colors"
              >
                <span className="text-lg">
                  {file.type === 'directory' ? '📁' : getFileIcon(file.extension)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className={`font-mono text-sm ${getFileColor(file.extension)}`}>
                    {file.path}
                  </div>
                  {file.extension && (
                    <div className="text-xs text-gray-500">
                      .{file.extension} file
                    </div>
                  )}
                </div>
                <div className="text-xs text-gray-400 flex items-center gap-1">
                  {file.type === 'file' ? <File className="w-3 h-3" /> : <Folder className="w-3 h-3" />}
                  {file.type}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Command Info */}
      <div className="mt-6 p-4 bg-gray-100 rounded-lg">
        <h3 className="font-semibold text-gray-900 mb-2">Unix Command Equivalent:</h3>
        <code className="block bg-black text-green-400 p-2 rounded font-mono text-sm">
          find . -type f{selectedExtension !== 'all' ? ` -name "*.${selectedExtension}"` : ''}
          {searchTerm ? ` | grep "${searchTerm}"` : ''}
        </code>
        <p className="text-sm text-gray-600 mt-2">
          This interface provides the same functionality as the Unix `find` command with additional filtering capabilities.
        </p>
      </div>
    </div>
  );
};