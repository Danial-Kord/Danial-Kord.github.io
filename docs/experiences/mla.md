# Machine Learning Associate (MLA) - Vector Institute

## Snapshot
- CV status: Active
- Timeframe: January 2026 to March 2026
- Location: Toronto, Ontario, Canada
- Partner context: Vector Institute placement with DXTR

## Detailed Notes
- Built an MVP path for real-time VR firefighter training, centered on detecting skill deviations from headset and body telemetry.
- Worked on the DXTR RISTs pipeline, which ingests Cog3D and pose-capture data, retargets it to an NTU-25 skeleton, normalizes the poses, aligns motion windows to SOP steps, and scores deviations with MPJPE plus quaternion angular distance.
- Helped shape the coaching layer that turns deviation results into natural-language feedback using manual retrieval, FAISS indexing, and Ollama/LangChain.
- Contributed to data integration, evaluation workflows, visualizers, and debug tooling so the training team could inspect sessions instead of treating the scoring system as a black box.
- The public website still mentions an LSTM direction for prediction, but the local repo currently documents a metric-based deviation engine plus RAG feedback pipeline. Future CV edits should distinguish shipped systems from exploratory modeling.

## Tech and Systems
- Python, FAISS, Ollama, LangChain, FastAPI or Uvicorn-style API workflow
- Meta Quest telemetry, Cog3D session data, SOP-driven evaluation
- Pose retargeting, normalization, sliding-window analysis, deviation scoring

## Source Material
- CV bullet source: `CV/subsections/experiences/mla.tex`
- Portfolio site: `https://danial-kord.github.io/`
- Primary local evidence: `C:\Projects\dxtr-rists\README.md`
- Supporting local docs: `C:\Projects\dxtr-rists\docs\DEBUG_FULL_PIPELINE.md`, `C:\Projects\dxtr-rists\docs\deviation_feedback_brief.md`

## Resume Guidance
- Strongest angles: applied ML systems, human motion analysis, XR training, retrieval-grounded coaching, end-to-end evaluation tooling.
- Avoid overselling pure model training unless a future version of the repo or paper clearly documents it as delivered work.
