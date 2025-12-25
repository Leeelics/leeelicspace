import { get } from '@vercel/edge-config';

export interface EdgeConfigItems {
  greeting?: string;
  // Add more Edge Config items as needed
}

export async function getEdgeConfigItem<T extends keyof EdgeConfigItems>(
  key: T
): Promise<EdgeConfigItems[T] | undefined> {
  try {
    return await get(key);
  } catch (error) {
    console.error(`Failed to get Edge Config item '${key}':`, error);
    return undefined;
  }
}

export async function getGreeting(): Promise<string | undefined> {
  return getEdgeConfigItem('greeting');
}