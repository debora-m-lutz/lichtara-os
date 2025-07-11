#!/usr/bin/env node

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

const RESET = '\x1b[0m';
const BOLD = '\x1b[1m';
const GREEN = '\x1b[32m';
const BLUE = '\x1b[34m';
const YELLOW = '\x1b[33m';
const RED = '\x1b[31m';
const CYAN = '\x1b[36m';

function formatTitle(text) {
  return `${BOLD}${BLUE}${text}${RESET}`;
}

function formatSection(text) {
  return `${BOLD}${CYAN}${text}${RESET}`;
}

function formatSuccess(text) {
  return `${GREEN}✅ ${text}${RESET}`;
}

function formatWarning(text) {
  return `${YELLOW}⚠️  ${text}${RESET}`;
}

function formatError(text) {
  return `${RED}❌ ${text}${RESET}`;
}

function getPackageInfo(packagePath) {
  try {
    const packageJson = JSON.parse(readFileSync(packagePath, 'utf8'));
    return packageJson;
  } catch (error) {
    return null;
  }
}

function checkNodeModules(prototypePath) {
  const nodeModulesPath = join(prototypePath, 'node_modules');
  return existsSync(nodeModulesPath);
}

function getDependencyCount(packageInfo) {
  const deps = Object.keys(packageInfo.dependencies || {}).length;
  const devDeps = Object.keys(packageInfo.devDependencies || {}).length;
  const optionalDeps = Object.keys(packageInfo.optionalDependencies || {}).length;
  return { deps, devDeps, optionalDeps, total: deps + devDeps + optionalDeps };
}

function checkGitStatus() {
  try {
    const status = execSync('git status --porcelain', { encoding: 'utf8' });
    const branch = execSync('git branch --show-current', { encoding: 'utf8' }).trim();
    return {
      branch,
      hasChanges: status.length > 0,
      changes: status.split('\n').filter(line => line.trim()).length
    };
  } catch (error) {
    return null;
  }
}

function main() {
  console.log(formatTitle('🚀 Lichtara OS - Project Status'));
  console.log('='.repeat(50));
  console.log();

  // Git status
  const gitStatus = checkGitStatus();
  if (gitStatus) {
    console.log(formatSection('📁 Repository Status:'));
    console.log(`   Branch: ${gitStatus.branch}`);
    if (gitStatus.hasChanges) {
      console.log(formatWarning(`Changes detected: ${gitStatus.changes} file(s) modified`));
    } else {
      console.log(formatSuccess('Working directory clean'));
    }
    console.log();
  }

  // Prototype v1 status
  const v1Path = '05-prototipos/05-prototipo/05_Prototipo';
  const v1PackagePath = join(v1Path, 'package.json');
  const v1Package = getPackageInfo(v1PackagePath);
  
  console.log(formatSection('🔧 Prototype v1 (lichtara-prototype-v1):'));
  if (v1Package) {
    console.log(`   Name: ${v1Package.name}`);
    console.log(`   Version: ${v1Package.version}`);
    console.log(`   Description: ${v1Package.description}`);
    
    const v1Deps = getDependencyCount(v1Package);
    console.log(`   Dependencies: ${v1Deps.deps} runtime, ${v1Deps.devDeps} dev, ${v1Deps.optionalDeps} optional (${v1Deps.total} total)`);
    
    if (checkNodeModules(v1Path)) {
      console.log(formatSuccess('Dependencies installed'));
    } else {
      console.log(formatWarning('Dependencies not installed (run npm run install:v1)'));
    }
    
    console.log(`   Location: ${v1Path}`);
  } else {
    console.log(formatError('package.json not found'));
  }
  console.log();

  // Prototype v2 status
  const v2Path = '05-prototipos/05-prototipo/5.1_Prototipo';
  const v2PackagePath = join(v2Path, 'package.json');
  const v2Package = getPackageInfo(v2PackagePath);
  
  console.log(formatSection('🔧 Prototype v2 (lichtara-prototype-v2):'));
  if (v2Package) {
    console.log(`   Name: ${v2Package.name}`);
    console.log(`   Version: ${v2Package.version}`);
    console.log(`   Description: ${v2Package.description}`);
    
    const v2Deps = getDependencyCount(v2Package);
    console.log(`   Dependencies: ${v2Deps.deps} runtime, ${v2Deps.devDeps} dev, ${v2Deps.optionalDeps} optional (${v2Deps.total} total)`);
    
    if (checkNodeModules(v2Path)) {
      console.log(formatSuccess('Dependencies installed'));
    } else {
      console.log(formatWarning('Dependencies not installed (run npm run install:v2)'));
    }
    
    console.log(`   Location: ${v2Path}`);
  } else {
    console.log(formatError('package.json not found'));
  }
  console.log();

  // Available commands
  console.log(formatSection('📋 Available Commands:'));
  console.log('   npm run install:prototypes  - Install dependencies for both prototypes');
  console.log('   npm run install:v1          - Install dependencies for v1 only');
  console.log('   npm run install:v2          - Install dependencies for v2 only');
  console.log('   npm run dev:v1               - Start v1 development server');
  console.log('   npm run dev:v2               - Start v2 development server (recommended)');
  console.log('   npm run status               - Show this status information');
  console.log();

  // System info
  try {
    const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
    const npmVersion = execSync('npm --version', { encoding: 'utf8' }).trim();
    console.log(formatSection('💻 System Information:'));
    console.log(`   Node.js: ${nodeVersion}`);
    console.log(`   npm: ${npmVersion}`);
  } catch (error) {
    // Ignore if commands fail
  }
}

main();