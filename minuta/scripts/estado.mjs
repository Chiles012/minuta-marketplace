// Dónde guardan los hooks su estado por sesión (sobrevive a actualizaciones del plugin).
import { chmodSync, mkdirSync } from 'node:fs';
import { homedir } from 'node:os';
import { join } from 'node:path';

// Sin CLAUDE_PLUGIN_DATA: carpeta propia del usuario con permisos 700, nunca un /tmp compartido.
const raiz = () => { const d = process.env.CLAUDE_PLUGIN_DATA; if (d) return d; const p = join(homedir(), '.cache', 'minuta-plugin'); mkdirSync(p, { recursive: true, mode: 0o700 }); chmodSync(p, 0o700); return p; };
export const archivoEstado = id => { const dir = join(raiz(), 'minuta-cierre'); return { dir, ruta: join(dir, String(id || 'sesion').replace(/[^\w-]/g, '_')) }; };
