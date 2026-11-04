# minuta-marketplace

Marketplace de Claude Code con el plugin **minuta** (memoria de proyectos: conector MCP + skill + hooks).
Esta carpeta (`packages/claude-plugin`) es la raíz del repo `minuta-marketplace`; el plugin vive en `minuta/`.

## Instalar (usuarios)
```
/plugin marketplace add <org>/minuta-marketplace
/plugin install minuta@minuta-marketplace
/mcp        # elegir «minuta» → Authenticate: abre el navegador, entras con tu cuenta de Minuta
```
Al abrir una sesión en un repo ligado a un proyecto, Claude carga su resumen. Liga un repo en Minuta (Conexiones del espacio) o pídeselo a Claude (`ligar_repo`).

## Qué hace
- `.mcp.json`: servidor `minuta` (HTTP + OAuth) en `https://minuta.asteron.com.mx/mcp`. Para pruebas locales: `MINUTA_URL=http://127.0.0.1:PUERTO claude …` (la variable reemplaza el origen).
- `skills/minuta-memoria`: cuándo cargar contexto, qué guardar y qué nunca (secretos, código).
- `SessionStart`: detecta el remoto git (o la carpeta) e inyecta la instrucción de llamar `buscar_proyecto` + `contexto_proyecto`. Un hook no puede llamar al MCP (OAuth, y `mcp_tool` no corre al arrancar), por eso la llamada la hace Claude.
- `Stop`: si el árbol git cambió (o hubo Edit/Write) desde el inicio o el último aviso, pide **una vez** el resumen a la nota del día (`agregar_a_nota_del_dia`). `MINUTA_SIN_CIERRE=1` lo apaga. `SessionEnd` no se usa: no puede inyectar nada.

## Publicar (lo hace una persona; no se ha publicado)
1. Crear el repo vacío `minuta-marketplace` en GitHub y copiar el contenido de esta carpeta a su raíz (`.claude-plugin/`, `minuta/`, `README.md`):
   `cp -r packages/claude-plugin/. /ruta/minuta-marketplace/ && rm -rf /ruta/minuta-marketplace/test` (o `git subtree split --prefix=packages/claude-plugin`).
2. `claude plugin validate /ruta/minuta-marketplace --strict` y `claude plugin validate /ruta/minuta-marketplace/minuta --strict`.
3. Subir a GitHub. Para nuevas versiones sube `version` en `minuta/.claude-plugin/plugin.json`.

## Pruebas
- `nice -n 10 npx vitest run packages/claude-plugin` (hooks).
- `nice -n 10 npm run test:claude-plugin`: API + Postgres + OAuth reales y una sesión `claude -p` con el plugin (ver el encabezado del script para lo que no cubre).
