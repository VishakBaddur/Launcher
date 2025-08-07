import * as fs from 'fs';
import * as path from 'path';

interface CacheEntry<T> {
  data: T;
  timestamp: number;
  ttl: number; // Time to live in milliseconds
}

export class CacheManager {
  private cacheDir: string;
  private cache: Map<string, CacheEntry<any>>;

  constructor() {
    this.cacheDir = path.join(process.cwd(), '.cache');
    this.cache = new Map();
    this.ensureCacheDir();
  }

  private ensureCacheDir(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  async get<T>(key: string): Promise<T | null> {
    // Check memory cache first
    const memoryEntry = this.cache.get(key);
    if (memoryEntry && this.isValid(memoryEntry)) {
      return memoryEntry.data;
    }

    // Check file cache
    const filePath = path.join(this.cacheDir, `${key}.json`);
    if (fs.existsSync(filePath)) {
      try {
        const fileContent = fs.readFileSync(filePath, 'utf8');
        const entry: CacheEntry<T> = JSON.parse(fileContent);
        
        if (this.isValid(entry)) {
          // Update memory cache
          this.cache.set(key, entry);
          return entry.data;
        } else {
          // Remove expired cache
          fs.unlinkSync(filePath);
        }
      } catch (error) {
        console.error(`Error reading cache file ${key}:`, error);
      }
    }

    return null;
  }

  async set<T>(key: string, data: T, ttl: number = 24 * 60 * 60 * 1000): Promise<void> {
    const entry: CacheEntry<T> = {
      data,
      timestamp: Date.now(),
      ttl
    };

    // Update memory cache
    this.cache.set(key, entry);

    // Update file cache
    const filePath = path.join(this.cacheDir, `${key}.json`);
    try {
      fs.writeFileSync(filePath, JSON.stringify(entry, null, 2));
    } catch (error) {
      console.error(`Error writing cache file ${key}:`, error);
    }
  }

  private isValid(entry: CacheEntry<any>): boolean {
    return Date.now() - entry.timestamp < entry.ttl;
  }

  async clear(): Promise<void> {
    this.cache.clear();
    
    // Clear file cache
    if (fs.existsSync(this.cacheDir)) {
      const files = fs.readdirSync(this.cacheDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          fs.unlinkSync(path.join(this.cacheDir, file));
        }
      }
    }
  }

  async clearExpired(): Promise<void> {
    const now = Date.now();
    
    // Clear expired memory cache
    for (const [key, entry] of this.cache.entries()) {
      if (!this.isValid(entry)) {
        this.cache.delete(key);
      }
    }

    // Clear expired file cache
    if (fs.existsSync(this.cacheDir)) {
      const files = fs.readdirSync(this.cacheDir);
      for (const file of files) {
        if (file.endsWith('.json')) {
          const filePath = path.join(this.cacheDir, file);
          try {
            const fileContent = fs.readFileSync(filePath, 'utf8');
            const entry: CacheEntry<any> = JSON.parse(fileContent);
            
            if (!this.isValid(entry)) {
              fs.unlinkSync(filePath);
            }
          } catch (error) {
            // Remove corrupted cache files
            fs.unlinkSync(filePath);
          }
        }
      }
    }
  }

  getStats(): { memorySize: number; fileCount: number } {
    const fileCount = fs.existsSync(this.cacheDir) 
      ? fs.readdirSync(this.cacheDir).filter(f => f.endsWith('.json')).length 
      : 0;
    
    return {
      memorySize: this.cache.size,
      fileCount
    };
  }
}

// Cache TTL constants
export const CACHE_TTL = {
  GOOGLE_TRENDS: 24 * 60 * 60 * 1000, // 24 hours
  REDDIT_DATA: 6 * 60 * 60 * 1000,    // 6 hours
  WEB_SCRAPING: 12 * 60 * 60 * 1000,  // 12 hours
  NEWS_DATA: 2 * 60 * 60 * 1000,      // 2 hours
  MARKET_DATA: 24 * 60 * 60 * 1000    // 24 hours
};

// Global cache instance
export const cacheManager = new CacheManager(); 