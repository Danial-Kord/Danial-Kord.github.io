# CV Documentation Source of Truth

This folder is the working knowledge base behind the CV system in this repo. It exists so future edits can start from detailed source notes instead of rebuilding context from the website, the LaTeX files, and old project repos every time.

## How the CV is currently assembled

- `CV/resume.tex` is the top-level document.
- `CV/subsections/work_ex.tex` controls the order of experience entries.
- `CV/subsections/academic_experience.tex` currently acts as the projects section.
- `CV/subsections/experiences/*.tex` are the short resume bullets for each role.
- `CV/subsections/projects/*.tex` are the short resume bullets for each project.
- `docs/experiences/*.md` stores the detailed background for each role.
- `docs/projects/*.md` stores the detailed background for each project.

## Editing workflow

1. Update the matching file under `docs/experiences/` or `docs/projects/`.
2. Tighten that material into the short bullet version in `CV/subsections/...`.
3. Decide whether the entry should stay active, be commented out, or move order.
4. Rebuild the PDF from `CV/resume.tex`.

## Source priority

Use sources in this order when rewriting:

1. Local implementation repos and research documents.
2. Existing CV LaTeX entries.
3. Public website and portfolio copy at `https://danial-kord.github.io/`.
4. Public repo descriptions or demos.
5. LinkedIn or other high-level summaries.

## Known discrepancies to handle carefully

- `latex_cv_builder`: the current CV describes a more modern distributed document system than the older public GitHub repo description. Decide whether the entry should represent the older Java/LaTeX tool, the newer platform concept, or both.
- `mla`: the website still mentions an LSTM-based model, while the current DXTR codebase emphasizes a deviation engine, preprocessing pipeline, and RAG coaching layer. Keep implemented work separate from exploratory model ideas.
- `stone_thrower` and `sepantab`: older public wording and newer CV wording describe overlapping but not identical networking stacks. Treat the product and the internship infrastructure as related, not perfectly identical.
- `iaeste`: the website suggests a longer involvement window than the current CV. Use the CV date range unless newer evidence is confirmed.

## Indexes

- See `docs/experiences/README.md` for role ordering, status, and source references.
- See `docs/projects/README.md` for project coverage, grouped source references, and rewrite notes.
