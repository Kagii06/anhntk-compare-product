import { readFileSync, writeFileSync } from 'fs';
import path from 'path';

export function readJsonFile<T = any>(filePath: string, env?: string): T {
  const resolvedPath = path.resolve(filePath);
  const rawData = readFileSync(resolvedPath, 'utf8');

  const data = JSON.parse(rawData);

  if (!env) {
    return data as T;
  }
  return data[env.toLowerCase()] as T;
}

export function writeJsonFile<T = any>(filePath: string, data: T): void {
  const resolvedPath = path.resolve(filePath);
  const jsonData = JSON.stringify(data, null, 2);
  writeFileSync(resolvedPath, jsonData, 'utf8');
}
