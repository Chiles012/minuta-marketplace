---
name: minuta-memoria
description: Memoria de proyectos de Minuta. Úsala al empezar a trabajar en un repo o proyecto, cuando la persona mencione un proyecto («el de Bloom», «apolen»), pregunte por decisiones o pendientes pasados, o cuando se tome una decisión que valga la pena recordar.
---

# Memoria de Minuta

Minuta guarda los proyectos (espacios), notas, pendientes y juntas de la persona. Las herramientas son las del servidor `minuta` (`mcp__plugin_minuta_minuta__*`).

## Cuándo cargar contexto
- Al abrir sesión, el hook de inicio te da el repo detectado: llama `buscar_proyecto` con `repo` y luego `contexto_proyecto`. Resume en 5 líneas o menos.
- Si la persona nombra un proyecto distinto («apolen», «el de Bloom»), usa `buscar_proyecto` con `nombre`; los alias y apodos funcionan. Si hay varios candidatos parecidos, pregunta cuál.
- Para algo puntual usa `buscar` (texto), `leer_nota`, `leer_junta` o `listar_pendientes`; no cargues todo.
- Si no hay proyecto, no inventes uno. Ofrece `ligar_repo` sólo si la persona lo quiere.

## Qué guardar
- Decisiones y su porqué, acuerdos, hallazgos que costó trabajo encontrar, pendientes con fecha, y cómo se resolvió algo no obvio.
- Todo es **personal por defecto** (`escribir_nota` sin `visibilidad`). Usa `visibilidad: "espacio"` sólo si la persona pide compartirlo con el equipo.
- Decisiones duraderas: `escribir_nota` en `Decisiones/<tema>.md` del proyecto. Cosas por hacer: `crear_pendiente`.
- `escribir_nota` **reemplaza** la nota completa: lee antes con `leer_nota` y conserva lo que ya estaba.

## Al cerrar
Usa `agregar_a_nota_del_dia` con el `espacio` del proyecto: 3 a 5 líneas de lo hecho y decidido, en Markdown. No repitas lo que ya está en la nota del día.

## Qué nunca guardar
- Secretos: contraseñas, tokens, llaves de API, cadenas de conexión, contenido de `.env`, cookies, claves privadas.
- Código ni diffs (eso vive en git): describe el cambio en palabras y deja la ruta o el commit.
- Datos personales de terceros, ni nada que la persona pida no guardar.
Si algo de lo que ibas a guardar contiene un secreto, quítalo o no lo guardes.
