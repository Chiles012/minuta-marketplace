// Detecta el repo git de una carpeta: devuelve { repo: 'dueño/repo' | null, carpeta }.
import { execFileSync } from 'node:child_process';
import { basename } from 'node:path';

const git = (cwd, ...args) => { try { return execFileSync('git', ['-C', cwd, ...args], { encoding: 'utf8', timeout: 3000, stdio: ['ignore', 'pipe', 'ignore'] }).trim(); } catch { return ''; } };

// «git@github.com:Org/Repo.git» y «https://github.com/Org/Repo/» → «org/repo» (igual que ligar_repo en el servidor).
export const normalizarRepo = url => {
  const m = url.trim().replace(/\.git$/i, '').replace(/\/+$/, '').match(/[:/]([^/:]+)\/([^/:]+)$/);
  return m ? `${m[1]}/${m[2]}`.toLowerCase() : null;
};

// Lo detectado se interpola en una instrucción para Claude: sólo pasan caracteres inocuos.
const REPO_OK = /^[a-z0-9._-]+\/[a-z0-9._-]+$/;
const sanear = c => c.toLowerCase().replace(/[^a-z0-9._-]+/g, '-').replace(/^-+|-+$/g, '') || 'carpeta';

export function detectar(cwd) {
  const raiz = git(cwd, 'rev-parse', '--show-toplevel');
  const remoto = raiz && (git(cwd, 'remote', 'get-url', 'origin') || git(cwd, 'remote', 'get-url', git(cwd, 'remote').split('\n')[0] || 'origin'));
  const repo = remoto ? normalizarRepo(remoto) : null;
  return { repo: repo && REPO_OK.test(repo) ? repo : null, carpeta: sanear(basename(raiz || cwd)) };
}

// Huella del árbol de trabajo (HEAD + cambios sin confirmar): detecta trabajo hecho aunque sea por Bash.
export const huella = cwd => git(cwd, 'rev-parse', 'HEAD') + '\n' + git(cwd, 'status', '--porcelain');
