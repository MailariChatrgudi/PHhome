import fs from 'node:fs';
import path from 'node:path';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();

export async function resolve(specifier, context, nextResolve) {
  if (specifier === 'next/server') {
    const fullPath = path.resolve(ROOT, 'node_modules/next/server.js');
    return {
      url: pathToFileURL(fullPath).href,
      shortCircuit: true,
    };
  }

  if (specifier === 'next/navigation') {
    const fullPath = path.resolve(ROOT, 'node_modules/next/navigation.js');
    return {
      url: pathToFileURL(fullPath).href,
      shortCircuit: true,
    };
  }

  if (specifier.startsWith('@/')) {
    const relativePath = specifier.slice(2);
    let fullPath = path.resolve(ROOT, relativePath);
    if (!fs.existsSync(fullPath)) {
      if (fs.existsSync(fullPath + '.ts')) fullPath += '.ts';
      else if (fs.existsSync(fullPath + '.tsx')) fullPath += '.tsx';
      else if (fs.existsSync(fullPath + '.js')) fullPath += '.js';
      else if (fs.existsSync(path.join(fullPath, 'index.ts'))) fullPath = path.join(fullPath, 'index.ts');
    }
    return {
      url: pathToFileURL(fullPath).href,
      shortCircuit: true,
    };
  }

  if (specifier.startsWith('.') && context.parentURL) {
    let parentPath = new URL(context.parentURL).pathname;
    if (process.platform === 'win32' && /^\/[A-Za-z]:/.test(parentPath)) {
      parentPath = parentPath.slice(1);
    }
    const parentDir = path.dirname(parentPath);
    let fullPath = path.resolve(parentDir, specifier);
    if (!fs.existsSync(fullPath)) {
      if (fs.existsSync(fullPath + '.ts')) fullPath += '.ts';
      else if (fs.existsSync(fullPath + '.tsx')) fullPath += '.tsx';
      else if (fs.existsSync(fullPath + '.js')) fullPath += '.js';
      else if (fs.existsSync(path.join(fullPath, 'index.ts'))) fullPath = path.join(fullPath, 'index.ts');
    }
    if (fs.existsSync(fullPath)) {
      return {
        url: pathToFileURL(fullPath).href,
        shortCircuit: true,
      };
    }
  }

  return nextResolve(specifier, context);
}
