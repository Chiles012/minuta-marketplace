// Hook Stop. Cuando la sesión hizo cambios desde la última vez, pide UNA vez a Claude el resumen para la nota del día.
// No hay hook de cierre que pueda inyectar nada (SessionEnd sólo ejecuta), así que se usa Stop acotado a «hubo trabajo nuevo».
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { detectar, huella } from './repo.mjs';
import { archivoEstado } from './estado.mjs';

const entrada = JSON.parse(await new Response(process.stdin).text() || '{}');
if (entrada.stop_hook_active || process.env.MINUTA_SIN_CIERRE === '1') process.exit(0);

// Trabajo nuevo = el árbol git cambió desde el inicio/último aviso, o hubo más Edit/Write en la bitácora (carpetas sin git).
let transcripcion = '';
try { transcripcion = readFileSync(entrada.transcript_path, 'utf8'); } catch { process.exit(0); }
const usos = l => { try { const c = JSON.parse(l).message?.content; return Array.isArray(c) ? c.filter(b => b.type === 'tool_use' && /^(Edit|Write|MultiEdit|NotebookEdit)$/.test(b.name)).length : 0; } catch { return 0; } };
const cambios = transcripcion.split('\n').reduce((n, l) => n + usos(l), 0);

const estado = archivoEstado(entrada.session_id), cwd = entrada.cwd || process.cwd(), ahora = huella(cwd);
let previo = { huella: null, cambios: 0 }; try { previo = JSON.parse(readFileSync(estado.ruta, 'utf8')); } catch { /* sin hook de inicio: sólo cuenta Edit/Write */ }
if (cambios <= previo.cambios && (previo.huella === null || ahora === previo.huella)) process.exit(0);
mkdirSync(estado.dir, { recursive: true }); writeFileSync(estado.ruta, JSON.stringify({ huella: ahora, cambios }));

const { repo, carpeta } = detectar(entrada.cwd || process.cwd());
const T = 'mcp__plugin_minuta_minuta__';
const razon = `[Minuta] Antes de cerrar este trabajo, llama ${T}agregar_a_nota_del_dia con un resumen de 3 a 5 líneas en Markdown de lo que se hizo y decidió en ${repo ? `«${repo}»` : `«${carpeta}»`} (parámetro espacio: ${repo ? `"${repo}"` : 'el proyecto que cargaste al inicio, si hubo'}). Sin código, sin contraseñas ni tokens. Si esas herramientas aparecen como diferidas, cárgalas antes con ToolSearch. Sólo si la sesión no produjo nada que valga la pena recordar, o Minuta no está disponible, responde «listo».`;
process.stdout.write(JSON.stringify({ decision: 'block', reason: razon }));
