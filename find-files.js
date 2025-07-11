#!/usr/bin/env node

/**
 * find-files.js - A Node.js implementation of "find . -type f"
 * 
 * This utility script demonstrates the equivalent functionality of the Unix command
 * "find . -type f" in Node.js, which is used in the Lichtara OS File Finder component.
 */

import { readdir, stat } from 'fs/promises';
import { join } from 'path';

async function findFiles(dir = '.', options = {}) {
  const { includeExtensions = null, searchTerm = null } = options;
  const files = [];

  async function traverse(currentDir) {
    try {
      const entries = await readdir(currentDir);
      
      for (const entry of entries) {
        const fullPath = join(currentDir, entry);
        
        try {
          const stats = await stat(fullPath);
          
          if (stats.isFile()) {
            // Convert to relative path starting with "./"
            const relativePath = fullPath.replace(/\\/g, '/').startsWith('./') 
              ? fullPath.replace(/\\/g, '/') 
              : './' + fullPath.replace(/\\/g, '/');
            
            let include = true;
            
            // Filter by extension if specified
            if (includeExtensions && includeExtensions.length > 0) {
              const ext = relativePath.split('.').pop()?.toLowerCase();
              include = ext && includeExtensions.includes(ext);
            }
            
            // Filter by search term if specified
            if (include && searchTerm) {
              include = relativePath.toLowerCase().includes(searchTerm.toLowerCase());
            }
            
            if (include) {
              files.push(relativePath);
            }
          } else if (stats.isDirectory() && !entry.startsWith('.')) {
            // Recursively traverse subdirectories (skip hidden directories)
            await traverse(fullPath);
          }
        } catch (err) {
          // Skip files/directories that can't be accessed
          console.warn(`Warning: Cannot access ${fullPath}`);
        }
      }
    } catch (err) {
      console.error(`Error reading directory ${currentDir}:`, err.message);
    }
  }

  await traverse(dir);
  return files.sort();
}

// Command-line interface
async function main() {
  const args = process.argv.slice(2);
  let searchTerm = null;
  let includeExtensions = null;
  
  // Parse command line arguments
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--ext' && i + 1 < args.length) {
      includeExtensions = args[i + 1].split(',');
      i++;
    } else if (args[i] === '--search' && i + 1 < args.length) {
      searchTerm = args[i + 1];
      i++;
    } else if (args[i] === '--help') {
      console.log(`
Usage: node find-files.js [options]

Options:
  --ext <extensions>    Comma-separated list of file extensions to include (e.g., md,js,json)
  --search <term>       Search term to filter file paths
  --help               Show this help message

Examples:
  node find-files.js                           # Find all files (equivalent to "find . -type f")
  node find-files.js --ext md                  # Find only .md files
  node find-files.js --search package          # Find files containing "package" in path
  node find-files.js --ext md,json --search README  # Find .md and .json files containing "README"

This tool implements the same functionality as the Lichtara OS File Finder component.
      `);
      return;
    }
  }
  
  console.log('🔍 Finding files...\n');
  
  const files = await findFiles('.', { includeExtensions, searchTerm });
  
  // Display equivalent Unix command
  let command = 'find . -type f';
  if (includeExtensions && includeExtensions.length === 1) {
    command += ` -name "*.${includeExtensions[0]}"`;
  }
  if (searchTerm) {
    command += ` | grep "${searchTerm}"`;
  }
  
  console.log(`📋 Unix equivalent: ${command}\n`);
  console.log(`📊 Found ${files.length} files:\n`);
  
  files.forEach(file => {
    const ext = file.split('.').pop();
    const icon = getFileIcon(ext);
    console.log(`${icon} ${file}`);
  });
}

function getFileIcon(extension) {
  const icons = {
    md: '📄',
    json: '⚙️',
    js: '🟨',
    ts: '🟦',
    tsx: '⚛️',
    jsx: '⚛️',
    html: '🌐',
    css: '🎨',
    sh: '🐚',
    txt: '📝',
    png: '🖼️',
    jpg: '🖼️',
    gif: '🖼️',
    svg: '🎨'
  };
  return icons[extension] || '📄';
}

// Run the main function if this script is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

export { findFiles };