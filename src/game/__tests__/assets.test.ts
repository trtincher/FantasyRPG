import { describe, it, expect } from 'vitest';
import { readFileSync, readdirSync, existsSync } from 'node:fs';
import { join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { TILE_SIZE, MAP_WIDTH, MAP_HEIGHT } from '../utils/Constants';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ASSETS_DIR = join(__dirname, '../../../public/assets');
const MAPS_DIR = join(ASSETS_DIR, 'maps');
const SPRITES_DIR = join(ASSETS_DIR, 'sprites');

describe('tilemap assets', () => {
  const mapFiles = readdirSync(MAPS_DIR).filter((f) => f.endsWith('.json'));

  it('contains at least one map file', () => {
    expect(mapFiles.length).toBeGreaterThan(0);
  });

  mapFiles.forEach((file) => {
    describe(file, () => {
      let map: Record<string, unknown>;

      it('is valid JSON', () => {
        const raw = readFileSync(join(MAPS_DIR, file), 'utf-8');
        map = JSON.parse(raw);
        expect(map).toBeDefined();
      });

      it('has required Tiled fields', () => {
        const raw = readFileSync(join(MAPS_DIR, file), 'utf-8');
        map = JSON.parse(raw);

        expect(map).toHaveProperty('width');
        expect(map).toHaveProperty('height');
        expect(map).toHaveProperty('tilewidth');
        expect(map).toHaveProperty('tileheight');
        expect(map).toHaveProperty('layers');
        expect(map).toHaveProperty('tilesets');
        expect(map.type).toBe('map');
      });

      it('has layers with correct tile count', () => {
        const raw = readFileSync(join(MAPS_DIR, file), 'utf-8');
        map = JSON.parse(raw);

        const layers = map.layers as Array<{
          type: string;
          data?: number[];
        }>;
        const width = map.width as number;
        const height = map.height as number;

        for (const layer of layers) {
          if (layer.type !== 'tilelayer') continue;
          expect(layer.data).toBeDefined();
          expect(layer.data!.length).toBe(width * height);

          for (const tile of layer.data!) {
            expect(Number.isInteger(tile)).toBe(true);
            expect(tile).toBeGreaterThanOrEqual(0);
          }
        }
      });

      it('has tilesets with valid image references', () => {
        const raw = readFileSync(join(MAPS_DIR, file), 'utf-8');
        map = JSON.parse(raw);

        const tilesets = map.tilesets as Array<{
          image: string;
          firstgid: number;
          tilewidth: number;
          tileheight: number;
        }>;
        expect(tilesets.length).toBeGreaterThan(0);

        for (const tileset of tilesets) {
          expect(tileset).toHaveProperty('image');
          expect(tileset).toHaveProperty('firstgid');
          expect(tileset.tilewidth).toBe(map.tilewidth);
          expect(tileset.tileheight).toBe(map.tileheight);

          const imagePath = join(MAPS_DIR, tileset.image);
          expect(existsSync(imagePath)).toBe(true);
        }
      });

      it('dimensions match game constants', () => {
        const raw = readFileSync(join(MAPS_DIR, file), 'utf-8');
        map = JSON.parse(raw);

        expect(map.tilewidth).toBe(TILE_SIZE);
        expect(map.width).toBe(MAP_WIDTH);
        expect(map.height).toBe(MAP_HEIGHT);
      });
    });
  });
});

describe('sprite assets', () => {
  it('player sprite exists', () => {
    expect(existsSync(join(SPRITES_DIR, 'player.png'))).toBe(true);
  });

  it('slime sprite exists', () => {
    expect(existsSync(join(SPRITES_DIR, 'slime.png'))).toBe(true);
  });
});
