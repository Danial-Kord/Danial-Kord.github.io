"""
Daniel Kordmodanlou — 5-min Talk Deck
Focus: Agentic AI · LLMs · System Design
~12 slides @ ~25s each
"""
import os
from pptx import Presentation
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor
from pptx.enum.shapes import MSO_SHAPE
from pptx.enum.text import PP_ALIGN, MSO_ANCHOR
from pptx.oxml.ns import qn
from lxml import etree

# Midnight Executive palette
NAVY     = RGBColor(0x0F, 0x17, 0x2A)
INDIGO   = RGBColor(0x1E, 0x2A, 0x55)
ROYAL    = RGBColor(0x2E, 0x42, 0x82)
AMBER    = RGBColor(0xF5, 0x9E, 0x0B)
GOLD     = RGBColor(0xFB, 0xBF, 0x24)
TEAL     = RGBColor(0x14, 0xB8, 0xA6)
IVORY    = RGBColor(0xF8, 0xFA, 0xFC)
SLATE    = RGBColor(0x94, 0xA3, 0xB8)
DARK_TEXT = RGBColor(0x1F, 0x29, 0x37)
LIGHT_GREY = RGBColor(0xE2, 0xE8, 0xF0)

MEDIA = "extracted/ppt/media"
H_FONT = "Calibri"
B_FONT = "Calibri Light"
SLIDE_W = Inches(13.333)
SLIDE_H = Inches(7.5)

prs = Presentation()
prs.slide_width = SLIDE_W
prs.slide_height = SLIDE_H
blank_layout = prs.slide_layouts[6]


# ---- helpers (compact subset reused from main CV builder) ----
def add_rect(slide, x, y, w, h, fill, line=None):
    shp = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, x, y, w, h)
    shp.fill.solid(); shp.fill.fore_color.rgb = fill
    if line is None: shp.line.fill.background()
    else: shp.line.color.rgb = line; shp.line.width = Pt(0.75)
    spPr = shp.fill._xPr
    for el in spPr.findall(qn('a:effectLst')): spPr.remove(el)
    etree.SubElement(spPr, qn('a:effectLst'))
    return shp


def add_round_rect(slide, x, y, w, h, fill, radius=0.08, line=None):
    shp = slide.shapes.add_shape(MSO_SHAPE.ROUNDED_RECTANGLE, x, y, w, h)
    shp.fill.solid(); shp.fill.fore_color.rgb = fill
    if line is None: shp.line.fill.background()
    else: shp.line.color.rgb = line; shp.line.width = Pt(1)
    try: shp.adjustments[0] = radius
    except Exception: pass
    spPr = shp.fill._xPr
    for el in spPr.findall(qn('a:effectLst')): spPr.remove(el)
    etree.SubElement(spPr, qn('a:effectLst'))
    return shp


def add_oval(slide, x, y, w, h, fill):
    shp = slide.shapes.add_shape(MSO_SHAPE.OVAL, x, y, w, h)
    shp.fill.solid(); shp.fill.fore_color.rgb = fill
    shp.line.fill.background()
    spPr = shp.fill._xPr
    for el in spPr.findall(qn('a:effectLst')): spPr.remove(el)
    etree.SubElement(spPr, qn('a:effectLst'))
    return shp


def _split_bold(s):
    out, i = [], 0
    while i < len(s):
        start = s.find("[b]", i)
        if start == -1: out.append((s[i:], False)); break
        if start > i: out.append((s[i:start], False))
        end = s.find("[/b]", start)
        if end == -1: out.append((s[start:], False)); break
        out.append((s[start+3:end], True))
        i = end + 4
    return out


def add_text(slide, x, y, w, h, text, *, font=H_FONT, size=14, bold=False,
             color=DARK_TEXT, align=PP_ALIGN.LEFT, anchor=MSO_ANCHOR.TOP,
             italic=False, line_spacing=None):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.margin_left = Pt(0); tf.margin_right = Pt(0)
    tf.margin_top = Pt(0); tf.margin_bottom = Pt(0)
    tf.word_wrap = True
    tf.vertical_anchor = anchor
    p = tf.paragraphs[0]
    p.alignment = align
    if line_spacing: p.line_spacing = line_spacing
    parts = _split_bold(text)
    for txt, is_bold in parts:
        run = p.add_run()
        run.text = txt
        run.font.name = font
        run.font.size = Pt(size)
        run.font.bold = bold or is_bold
        run.font.italic = italic
        run.font.color.rgb = color
    return tb


def add_bullets(slide, x, y, w, h, bullets, *, font=B_FONT, size=14,
                color=DARK_TEXT, line_spacing=1.25, bullet_char="▸",
                spacing_after=6):
    tb = slide.shapes.add_textbox(x, y, w, h)
    tf = tb.text_frame
    tf.margin_left = Pt(0); tf.margin_right = Pt(0)
    tf.margin_top = Pt(0); tf.margin_bottom = Pt(0)
    tf.word_wrap = True
    for i, b in enumerate(bullets):
        p = tf.paragraphs[0] if i == 0 else tf.add_paragraph()
        p.line_spacing = line_spacing
        p.space_after = Pt(spacing_after)
        if bullet_char:
            run = p.add_run()
            run.text = bullet_char + "  "
            run.font.name = font
            run.font.size = Pt(size)
            run.font.color.rgb = color
        for txt, is_bold in _split_bold(b):
            run = p.add_run()
            run.text = txt
            run.font.name = font
            run.font.size = Pt(size)
            run.font.bold = is_bold
            run.font.color.rgb = color
    return tb


def fill_slide(slide, color):
    bg = slide.shapes.add_shape(MSO_SHAPE.RECTANGLE, 0, 0, SLIDE_W, SLIDE_H)
    bg.fill.solid(); bg.fill.fore_color.rgb = color
    bg.line.fill.background()
    spPr = bg.fill._xPr
    for el in spPr.findall(qn('a:effectLst')): spPr.remove(el)
    etree.SubElement(spPr, qn('a:effectLst'))
    return bg


def add_image(slide, path, x, y, w=None, h=None):
    if not os.path.exists(path): return None
    if w and h: return slide.shapes.add_picture(path, x, y, w, h)
    if w: return slide.shapes.add_picture(path, x, y, width=w)
    if h: return slide.shapes.add_picture(path, x, y, height=h)
    return slide.shapes.add_picture(path, x, y)


def light_footer(s, num, total):
    add_text(s, Inches(0.5), Inches(7.05), Inches(8), Inches(0.4),
             "Danial Kordmodanlou  ·  Agentic AI / LLMs / System Design",
             font=B_FONT, size=9, color=RGBColor(0x94, 0xA3, 0xB8))
    add_text(s, Inches(11.6), Inches(7.05), Inches(1.3), Inches(0.4),
             f"{num:02d}  /  {total:02d}", font=B_FONT, size=9,
             color=RGBColor(0x94, 0xA3, 0xB8), align=PP_ALIGN.RIGHT)


def page_footer(s, num, total):
    add_text(s, Inches(0.5), Inches(7.05), Inches(8), Inches(0.4),
             "Danial Kordmodanlou  ·  Agentic AI / LLMs / System Design",
             font=B_FONT, size=9, color=SLATE)
    add_text(s, Inches(11.6), Inches(7.05), Inches(1.3), Inches(0.4),
             f"{num:02d}  /  {total:02d}", font=B_FONT, size=9, color=SLATE,
             align=PP_ALIGN.RIGHT)


def corner_marker(s, label):
    add_rect(s, Inches(0.5), Inches(0.5), Inches(0.06), Inches(0.5), AMBER)
    add_text(s, Inches(0.7), Inches(0.5), Inches(6), Inches(0.5),
             label, font=H_FONT, size=11, bold=True, color=AMBER,
             anchor=MSO_ANCHOR.MIDDLE)


def chip_row(s, x_start, y, items, color_fill=NAVY, text_color=GOLD,
             size=10, max_x=None):
    cx = x_start
    if max_x is None: max_x = Inches(13.0)
    for t in items:
        cw = Inches(0.3 + 0.09 * len(t))
        if cx + cw > max_x:
            cx = x_start
            y += Inches(0.45)
        add_round_rect(s, cx, y, cw, Inches(0.34), color_fill, radius=0.4)
        add_text(s, cx, y + Inches(0.045), cw, Inches(0.3),
                 t, font=B_FONT, size=size, bold=True, color=text_color,
                 align=PP_ALIGN.CENTER)
        cx += cw + Inches(0.1)
    return y


# ====================================================================
# ANIMATIONS  ·  inject OOXML <p:transition> and <p:timing> trees
# ====================================================================
_PNS = "http://schemas.openxmlformats.org/presentationml/2006/main"

# Effect preset registry (PowerPoint built-in entrance effects).
# (presetID, presetClass, presetSubtype) — see ECMA-376 §19.5.51.
_EFFECTS = {
    "fade":         (10, "entr", 0),
    "float_up":     (42, "entr", 0),
    "zoom":         (23, "entr", 0),
    "wipe_up":      (22, "entr", 4),
    "fly_from_bot": (2,  "entr", 4),
}


def apply_fade_transition(slide, speed="med"):
    """Add a fade transition (inserted in correct schema slot: after cSld/clrMapOvr)."""
    sld = slide.element
    for el in sld.findall(qn('p:transition')):
        sld.remove(el)
    transition_el = etree.fromstring(
        f'<p:transition xmlns:p="{_PNS}" spd="{speed}"><p:fade/></p:transition>'
    )
    csld = sld.find(qn('p:cSld'))
    idx = list(sld).index(csld) + 1
    while idx < len(sld) and sld[idx].tag == qn('p:clrMapOvr'):
        idx += 1
    sld.insert(idx, transition_el)


def _shape_anim_ids(slide):
    """Shape IDs in z-order, skipping full-slide background fills."""
    out = []
    for sp in slide.shapes:
        try:
            l = int(sp.left or 0); t = int(sp.top or 0)
            w = int(sp.width or 0); h = int(sp.height or 0)
        except Exception:
            l = t = w = h = 0
        if l == 0 and t == 0 and w == int(SLIDE_W) and h == int(SLIDE_H):
            continue  # full-slide background — keep visible from slide load
        out.append(sp.shape_id)
    return out


# Manual section breaks: id(slide) -> list of shape_ids that END a section.
_SLIDE_BREAKS = {}


def mark_break(slide):
    """Mark the most recently added shape as the end of an animation section.

    On playback the cascade plays up to and including this shape, then waits
    for a click/space before revealing the next section. Use it in slide
    builders between logical blocks (header, each card, footer, ...).
    """
    if len(slide.shapes) == 0:
        return
    last_sid = slide.shapes[-1].shape_id
    _SLIDE_BREAKS.setdefault(id(slide), []).append(last_sid)


def _detect_group_boundaries(slide):
    """Auto-detect shape_ids that should START a new animation section.

    Heuristic: a rounded rectangle larger than ~2.5"x1.5" is treated as a
    'card' container and starts a fresh section. Smaller rounded rects
    (chips, buttons) are ignored.
    """
    THRESH_W = int(Inches(2.5))
    THRESH_H = int(Inches(1.5))
    boundary_ids = set()
    for sp in slide.shapes:
        try:
            if sp.auto_shape_type != MSO_SHAPE.ROUNDED_RECTANGLE:
                continue
            if int(sp.width or 0) >= THRESH_W and int(sp.height or 0) >= THRESH_H:
                boundary_ids.add(sp.shape_id)
        except Exception:
            continue
    return boundary_ids


def _split_into_groups(slide, animated_ids):
    """Partition animated shape_ids into ordered groups using manual breaks
    and auto-detected card boundaries."""
    manual_after = set(_SLIDE_BREAKS.get(id(slide), []))
    auto_before = _detect_group_boundaries(slide)
    groups, current = [], []
    for sid in animated_ids:
        if sid in auto_before and current:
            groups.append(current)
            current = []
        current.append(sid)
        if sid in manual_after:
            groups.append(current)
            current = []
    if current:
        groups.append(current)
    return groups


def apply_cascade_anim(slide, *, effects=("fade",), step_ms=120, dur_ms=420):
    """
    Section-aware cascade entrance animations.

    Animated shapes are partitioned into sections (manual breaks via
    mark_break() + auto-detected card containers). The first section plays
    automatically when the slide enters; each subsequent section waits for
    a click/space. Within a section the cascade overlaps so it finishes in
    ~(N-1)*step_ms + dur_ms.

    `effects` is a tuple of effect names from _EFFECTS; cycled per shape.
    """
    animated_ids = _shape_anim_ids(slide)
    if not animated_ids:
        return
    groups = _split_into_groups(slide, animated_ids)
    sld = slide.element
    for el in sld.findall(qn('p:timing')):
        sld.remove(el)
    xml = _cascade_timing_xml(groups, effects, step_ms, dur_ms)
    sld.append(etree.fromstring(xml))


def _anim_par_xml(spid, preset_id, preset_class, preset_sub,
                  node_type, offset_ms, dur_ms, nid):
    """Build the <p:par> for a single entrance animation on one shape."""
    ctn_id = nid(); set_id = nid(); anim_id = nid()
    return (
        f'<p:par><p:cTn id="{ctn_id}" presetID="{preset_id}" '
        f'presetClass="{preset_class}" presetSubtype="{preset_sub}" '
        f'fill="hold" grpId="0" nodeType="{node_type}">'
        f'<p:stCondLst><p:cond delay="{offset_ms}"/></p:stCondLst>'
        f'<p:childTnLst>'
        f'<p:set><p:cBhvr>'
        f'<p:cTn id="{set_id}" dur="1" fill="hold">'
        f'<p:stCondLst><p:cond delay="0"/></p:stCondLst></p:cTn>'
        f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'
        f'<p:attrNameLst><p:attrName>style.visibility</p:attrName></p:attrNameLst>'
        f'</p:cBhvr><p:to><p:strVal val="visible"/></p:to></p:set>'
        f'<p:anim calcmode="lin" valueType="num">'
        f'<p:cBhvr additive="base">'
        f'<p:cTn id="{anim_id}" dur="{dur_ms}" fill="hold"/>'
        f'<p:tgtEl><p:spTgt spid="{spid}"/></p:tgtEl>'
        f'<p:attrNameLst><p:attrName>style.opacity</p:attrName></p:attrNameLst>'
        f'</p:cBhvr><p:tavLst>'
        f'<p:tav tm="0"><p:val><p:fltVal val="0"/></p:val></p:tav>'
        f'<p:tav tm="100000"><p:val><p:fltVal val="1"/></p:val></p:tav>'
        f'</p:tavLst></p:anim>'
        f'</p:childTnLst></p:cTn></p:par>'
    )


def _cascade_timing_xml(groups, effects, step_ms, dur_ms):
    """Build <p:timing> with one click step per section.

    Section 0: auto-starts on slide enter (cond delay='0').
    Sections 1+: each waits for a click event (cond delay='indefinite').
    """
    counter = [3]  # 1=tmRoot, 2=mainSeq; click step + inner par ids issued below
    def nid():
        v = counter[0]; counter[0] += 1; return v

    click_steps_xml = []
    builds = []
    eff_idx = 0
    for gi, group in enumerate(groups):
        click_id = nid()
        inner_id = nid()
        anims = []
        for i, spid in enumerate(group):
            eff_name = effects[eff_idx % len(effects)]
            preset_id, preset_class, preset_sub = _EFFECTS.get(eff_name, _EFFECTS["fade"])
            eff_idx += 1
            # First anim in each section is tied to the click trigger; the
            # rest run "with" it but offset for an overlapping cascade.
            node_type = "clickEffect" if i == 0 else "withEffect"
            offset = i * step_ms
            anims.append(_anim_par_xml(
                spid, preset_id, preset_class, preset_sub,
                node_type, offset, dur_ms, nid))
            builds.append(f'<p:bldP spid="{spid}" grpId="0"/>')

        step_delay = "0" if gi == 0 else "indefinite"
        click_steps_xml.append(
            f'<p:par>'
            f'<p:cTn id="{click_id}" fill="hold">'
            f'<p:stCondLst><p:cond delay="{step_delay}"/></p:stCondLst>'
            f'<p:childTnLst><p:par>'
            f'<p:cTn id="{inner_id}" fill="hold">'
            f'<p:stCondLst><p:cond delay="0"/></p:stCondLst>'
            f'<p:childTnLst>{"".join(anims)}</p:childTnLst>'
            f'</p:cTn></p:par></p:childTnLst></p:cTn></p:par>'
        )

    return (
        f'<p:timing xmlns:p="{_PNS}">'
        f'<p:tnLst><p:par>'
        f'<p:cTn id="1" dur="indefinite" restart="never" nodeType="tmRoot">'
        f'<p:childTnLst><p:seq concurrent="1" nextAc="seek">'
        f'<p:cTn id="2" dur="indefinite" nodeType="mainSeq">'
        f'<p:childTnLst>{"".join(click_steps_xml)}</p:childTnLst></p:cTn>'
        f'<p:prevCondLst><p:cond evt="onPrev" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:prevCondLst>'
        f'<p:nextCondLst><p:cond evt="onNext" delay="0"><p:tgtEl><p:sldTgt/></p:tgtEl></p:cond></p:nextCondLst>'
        f'</p:seq></p:childTnLst></p:cTn></p:par></p:tnLst>'
        f'<p:bldLst>{"".join(builds)}</p:bldLst>'
        f'</p:timing>'
    )


TOTAL = 13


# ====================================================================
# 1 — TITLE
# ====================================================================
def slide_title():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, NAVY)
    add_rect(s, Inches(0.6), Inches(0.9), Inches(0.12), Inches(5.7), AMBER)
    # decorative dots
    add_oval(s, Inches(11.6), Inches(0.7), Inches(0.5), Inches(0.5), AMBER)
    add_oval(s, Inches(11.85), Inches(0.95), Inches(0.5), Inches(0.5), INDIGO)
    # tag line
    add_text(s, Inches(1.0), Inches(0.95), Inches(11), Inches(0.4),
             "5-MINUTE TALK  ·  AGENTIC AI  ·  LLM SYSTEMS  ·  2026",
             font=H_FONT, size=12, bold=True, color=AMBER)
    # name
    add_text(s, Inches(1.0), Inches(1.65), Inches(12), Inches(1.6),
             "Danial Kordmodanlou",
             font=H_FONT, size=70, bold=True, color=IVORY)
    # role line
    add_text(s, Inches(1.0), Inches(3.4), Inches(11), Inches(0.7),
             "Building agentic AI systems  ·  grounded LLMs  ·  production at scale",
             font=B_FONT, size=22, color=GOLD)
    # divider
    add_rect(s, Inches(1.0), Inches(4.4), Inches(2.5), Inches(0.04), AMBER)
    # identity
    add_text(s, Inches(1.0), Inches(4.6), Inches(11), Inches(0.4),
             "Machine Learning Associate  ·  Vector Institute, Toronto",
             font=B_FONT, size=15, color=IVORY)
    add_text(s, Inches(1.0), Inches(5.05), Inches(11), Inches(0.4),
             "M.Sc. Computer Science  ·  York University",
             font=B_FONT, size=14, italic=True, color=SLATE)
    # contact strip
    add_text(s, Inches(1.0), Inches(6.2), Inches(12), Inches(0.4),
             "danielkordm@gmail.com   ·   linkedin.com/in/danial-kord   ·   github.com/Danial-Kord",
             font=B_FONT, size=12, color=SLATE)


# ====================================================================
# 2 — ABOUT  /  Why I'm here
# ====================================================================
def slide_about():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    # left panel
    add_rect(s, 0, 0, Inches(5.0), SLIDE_H, NAVY)
    add_image(s, f"{MEDIA}/image39.jpg", Inches(0.9), Inches(1.4), w=Inches(3.2))
    add_rect(s, Inches(0.9), Inches(5.0), Inches(0.6), Inches(0.06), AMBER)
    add_text(s, Inches(0.9), Inches(5.1), Inches(4), Inches(0.4),
             "DANIAL KORDMODANLOU", font=H_FONT, size=13, bold=True, color=IVORY)
    add_text(s, Inches(0.9), Inches(5.45), Inches(4), Inches(0.4),
             "ML Associate — Vector Institute", font=B_FONT, size=11, color=GOLD)
    add_text(s, Inches(0.9), Inches(5.75), Inches(4), Inches(0.4),
             "M.Sc. Computer Science — York", font=B_FONT, size=11, color=SLATE)
    mark_break(s)  # — pause after left identity panel

    # right side
    corner_marker_x = Inches(5.4)
    add_text(s, corner_marker_x, Inches(0.7), Inches(7), Inches(0.5),
             "WHO I AM", font=H_FONT, size=12, bold=True, color=AMBER)
    add_rect(s, corner_marker_x, Inches(1.05), Inches(0.6), Inches(0.06), AMBER)

    add_text(s, corner_marker_x, Inches(1.3), Inches(8), Inches(1.2),
             "Hi, I'm Danial.",
             font=H_FONT, size=44, bold=True, color=NAVY)
    add_text(s, corner_marker_x, Inches(2.3), Inches(8), Inches(0.5),
             "I build [b]agentic AI systems[/b] grounded in real-world data.",
             font=B_FONT, size=17, italic=True, color=ROYAL)
    mark_break(s)  # — pause before bullets

    bullets = [
        "Currently a [b]Machine Learning Associate at the Vector Institute[/b], shipping a real-time VR firefighter training system: skeletal-telemetry deviation detection + an LLM coaching layer grounded in training manuals.",
        "Hackathon track record: [b]3rd place[/b] (Legal-Tech, Toronto 2026) and [b]semi-finals[/b] (Boson AI × MScAC 2025) — both multi-agent, source-grounded AI systems.",
        "Open-source: [b]DigiHuman[/b] (500⭐), a real-time 3D avatar animation pipeline.",
    ]
    add_bullets(s, corner_marker_x, Inches(3.0), Inches(7.6), Inches(3.5),
                bullets, size=13, color=DARK_TEXT, line_spacing=1.3,
                bullet_char="●")
    light_footer(s, 2, TOTAL)


# ====================================================================
# 3 — THE THREE PILLARS
# ====================================================================
def slide_pillars():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    corner_marker(s, "FOCUS")
    add_text(s, Inches(0.7), Inches(1.05), Inches(11), Inches(0.9),
             "What I build", font=H_FONT, size=40, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(1.95), Inches(12), Inches(0.4),
             "Three pillars that cut through every project I take on.",
             font=B_FONT, size=15, italic=True, color=ROYAL)

    pillars = [
        ("01",  "Agentic AI",
         "Multi-agent planning, tool-use orchestration, and per-claim verification.",
         ["LangChain", "LangGraph", "Multi-Agent", "n8n", "Cursor IDE"],
         AMBER),
        ("02",  "LLM Systems",
         "Grounded LLMs with RAG over hybrid retrieval, voice + vision modalities.",
         ["RAG", "FAISS", "Chroma", "Ollama", "GPT-4o", "Higgs Audio"],
         GOLD),
        ("03",  "System Design",
         "Microservices, CI/CD, containers and observability — built to ship.",
         ["Docker", "AWS", "Spring Boot", ".NET / Azure", "Streaming UI"],
         AMBER),
    ]
    sx = Inches(0.7); sy = Inches(2.7)
    cw = Inches(4.05); ch = Inches(3.95); gap = Inches(0.15)
    for i, (num, title, body, chips, color) in enumerate(pillars):
        x = sx + i * (cw + gap)
        add_round_rect(s, x, sy, cw, ch, NAVY, radius=0.05)
        # left color band
        add_rect(s, x, sy, Inches(0.08), ch, color)
        add_text(s, x + Inches(0.35), sy + Inches(0.25), Inches(2), Inches(0.5),
                 num, font=H_FONT, size=22, bold=True, color=color)
        add_text(s, x + Inches(0.35), sy + Inches(0.85), cw - Inches(0.5), Inches(0.6),
                 title, font=H_FONT, size=22, bold=True, color=IVORY)
        add_text(s, x + Inches(0.35), sy + Inches(1.55), cw - Inches(0.5), Inches(1.4),
                 body, font=B_FONT, size=12, color=LIGHT_GREY,
                 line_spacing=1.3)
        # chips
        cy = sy + Inches(2.7)
        cx = x + Inches(0.35)
        max_x = x + cw - Inches(0.3)
        for c in chips:
            chip_w = Inches(0.28 + 0.085 * len(c))
            if cx + chip_w > max_x:
                cx = x + Inches(0.35); cy += Inches(0.4)
            add_round_rect(s, cx, cy, chip_w, Inches(0.32), INDIGO, radius=0.5)
            add_text(s, cx, cy + Inches(0.04), chip_w, Inches(0.28),
                     c, font=B_FONT, size=9, bold=True, color=GOLD,
                     align=PP_ALIGN.CENTER)
            cx += chip_w + Inches(0.08)
    light_footer(s, 3, TOTAL)


# ====================================================================
# 4 — VECTOR INSTITUTE  (current role headline)
# ====================================================================
def slide_vector():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    corner_marker(s, "CURRENT ROLE")
    add_text(s, Inches(0.7), Inches(1.0), Inches(8), Inches(0.4),
             "JANUARY 2026 — MAY 2026  ·  VECTOR INSTITUTE",
             font=H_FONT, size=12, bold=True, color=AMBER)
    add_text(s, Inches(0.7), Inches(1.4), Inches(12), Inches(0.9),
             "VR firefighter coaching — grounded LLMs in real time",
             font=H_FONT, size=32, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(2.25), Inches(12), Inches(0.5),
             "Partnered with [b]DXTR[/b] to detect skill deviations from headset telemetry and explain them in plain language.",
             font=B_FONT, size=14, italic=True, color=ROYAL)

    # two-column: Deviation Engine and Coaching Layer
    cw = Inches(5.95)
    sy = Inches(3.05)
    ch = Inches(3.7)

    # left card — Deviation Engine
    add_round_rect(s, Inches(0.7), sy, cw, ch, NAVY, radius=0.06)
    add_rect(s, Inches(0.7), sy, Inches(0.1), ch, AMBER)
    add_text(s, Inches(0.95), sy + Inches(0.2), cw, Inches(0.4),
             "DEVIATION ENGINE", font=H_FONT, size=11, bold=True, color=AMBER)
    add_text(s, Inches(0.95), sy + Inches(0.55), cw, Inches(0.5),
             "Skeletal-telemetry analysis", font=H_FONT, size=20, bold=True, color=IVORY)
    add_bullets(s, Inches(0.95), sy + Inches(1.2), cw - Inches(0.4), Inches(2.5),
                [
                    "Sliding windows of 3D skeletal telemetry",
                    "[b]MPJPE[/b] + quaternion angular distance vs. ground truth",
                    "Cross-platform [b]NTU-25 skeleton[/b] normalization",
                ],
                size=12, line_spacing=1.3, bullet_char="▸", color=IVORY)

    # right card — Coaching Layer
    rx = Inches(6.85)
    add_round_rect(s, rx, sy, cw, ch, NAVY, radius=0.06)
    add_rect(s, rx, sy, Inches(0.1), ch, GOLD)
    add_text(s, rx + Inches(0.25), sy + Inches(0.2), cw, Inches(0.4),
             "LLM COACHING LAYER", font=H_FONT, size=11, bold=True, color=GOLD)
    add_text(s, rx + Inches(0.25), sy + Inches(0.55), cw, Inches(0.5),
             "Grounded natural-language feedback", font=H_FONT, size=20, bold=True, color=IVORY)
    add_bullets(s, rx + Inches(0.25), sy + Inches(1.2), cw - Inches(0.4), Inches(2.5),
                [
                    "[b]RAG[/b] over training-manual excerpts ([b]FAISS[/b] similarity)",
                    "[b]Ollama / LangChain[/b] for local & remote LLM orchestration",
                    "Structured evaluation of generative-AI training pipelines",
                ],
                size=12, line_spacing=1.3, bullet_char="▸", color=IVORY)
    light_footer(s, 4, TOTAL)


# ====================================================================
# 5 — CASELOGIC  (3rd place hackathon)
# ====================================================================
def slide_caselogic():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    corner_marker(s, "HACKATHON  ·  3RD PLACE")
    add_text(s, Inches(0.7), Inches(1.0), Inches(8), Inches(0.4),
             "TORONTO LEGAL-TECH HACKATHON  ·  2026",
             font=H_FONT, size=12, bold=True, color=AMBER)
    add_text(s, Inches(0.7), Inches(1.4), Inches(12), Inches(1.0),
             "CaseLogic — source-grounded legal research",
             font=H_FONT, size=32, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(2.3), Inches(12), Inches(0.5),
             "Built end-to-end in 24 hours. Every claim traced back to a paragraph.",
             font=B_FONT, size=14, italic=True, color=ROYAL)

    # bullets left
    add_text(s, Inches(0.7), Inches(3.1), Inches(7), Inches(0.4),
             "WHY IT WON", font=H_FONT, size=11, bold=True, color=AMBER)
    bullets = [
        "[b]Hybrid retrieval[/b]: Chroma vector DB + SQLite FTS5 keyword search — vector recall plus literal-term precision for legal lookups.",
        "[b]Per-claim verification[/b]: every assertion grounded back to the originating source paragraph — no hallucinated citations.",
        "[b]Multi-agent planning workspace[/b]: orchestrated research, drafting, and verification agents in parallel.",
        "[b]Shipped end-to-end[/b] in 24h — UI + multi-agent backend, all deployed.",
    ]
    add_bullets(s, Inches(0.7), Inches(3.55), Inches(7.5), Inches(3.2),
                bullets, size=12, line_spacing=1.3, bullet_char="▸",
                color=DARK_TEXT)

    # right column: badge + stack
    add_round_rect(s, Inches(8.6), Inches(3.1), Inches(4.2), Inches(3.7), NAVY, radius=0.06)  # CaseLogic
    add_rect(s, Inches(8.6), Inches(3.1), Inches(0.1), Inches(3.7), AMBER)

    # big "3rd"
    add_text(s, Inches(8.85), Inches(3.25), Inches(3.8), Inches(0.5),
             "RESULT", font=H_FONT, size=11, bold=True, color=AMBER)
    add_text(s, Inches(8.85), Inches(3.55), Inches(3.8), Inches(1.4),
             "3rd",
             font=H_FONT, size=88, bold=True, color=AMBER)
    add_text(s, Inches(8.85), Inches(5.0), Inches(3.8), Inches(0.4),
             "out of all Toronto Legal-Tech teams",
             font=B_FONT, size=11, color=IVORY)

    add_text(s, Inches(8.85), Inches(5.55), Inches(3.8), Inches(0.4),
             "STACK", font=H_FONT, size=10, bold=True, color=AMBER)
    chip_row(s, Inches(8.85), Inches(5.95),
             ["Chroma", "SQLite FTS5", "LangChain", "Multi-Agent", "RAG"],
             color_fill=INDIGO, text_color=GOLD, size=9,
             max_x=Inches(12.7))
    light_footer(s, 7, TOTAL)


# ====================================================================
# 6 — SAFEZONE AI
# ====================================================================
def slide_safezone():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    corner_marker(s, "HACKATHON  ·  SEMI-FINALIST")
    add_text(s, Inches(0.7), Inches(1.0), Inches(8), Inches(0.4),
             "BOSON AI × UofT MScAC HACKATHON  ·  2025",
             font=H_FONT, size=12, bold=True, color=AMBER)
    add_text(s, Inches(0.7), Inches(1.4), Inches(12), Inches(1.0),
             "SAFEZone AI — voice-first therapist agent",
             font=H_FONT, size=32, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(2.3), Inches(12), Inches(0.5),
             "A multi-stage agent pipeline that listens, reasons, and responds in a cloned voice with synced facial animation.",
             font=B_FONT, size=14, italic=True, color=ROYAL)

    # pipeline as steps
    steps = [
        ("ASR",        "Higgs Audio Understanding", "Transcript + emotional tone", AMBER),
        ("Reasoning",  "GPT-4o LLM",                "Onboarding-grounded reply", GOLD),
        ("TTS",        "Higgs Audio Generation",    "Cloned voice", AMBER),
        ("Avatar",     "Unity 3D therapist",        "Lip-sync + expressions", GOLD),
    ]
    sx = Inches(0.7); sy = Inches(3.15); cw = Inches(2.95); ch = Inches(3.4)
    gap = Inches(0.1)
    for i, (stage, name, desc, color) in enumerate(steps):
        x = sx + i * (cw + gap)
        add_round_rect(s, x, sy, cw, ch, NAVY, radius=0.05)
        add_rect(s, x, sy, Inches(0.08), ch, color)
        # step number
        add_text(s, x + Inches(0.3), sy + Inches(0.2), cw - Inches(0.4), Inches(0.4),
                 f"STEP {i+1}", font=H_FONT, size=10, bold=True, color=color)
        add_text(s, x + Inches(0.3), sy + Inches(0.55), cw - Inches(0.4), Inches(0.5),
                 stage, font=H_FONT, size=20, bold=True, color=IVORY)
        add_rect(s, x + Inches(0.3), sy + Inches(1.1), Inches(0.4), Inches(0.04), color)
        add_text(s, x + Inches(0.3), sy + Inches(1.3), cw - Inches(0.4), Inches(0.6),
                 name, font=H_FONT, size=13, bold=True, color=GOLD)
        add_text(s, x + Inches(0.3), sy + Inches(1.85), cw - Inches(0.4), Inches(1.0),
                 desc, font=B_FONT, size=11, color=IVORY, line_spacing=1.3)
        # arrow indicator between cards
        if i < len(steps) - 1:
            arrow_x = x + cw + Inches(-0.02)
            add_text(s, arrow_x, sy + Inches(1.5), Inches(0.15), Inches(0.4),
                     "▸", font=H_FONT, size=18, bold=True, color=AMBER,
                     align=PP_ALIGN.CENTER)
    light_footer(s, 8, TOTAL)


# ====================================================================
# 7 — SAFEZONE ARCHITECTURE (image)
# ====================================================================
def slide_safezone_arch():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, NAVY)
    add_text(s, Inches(0.7), Inches(0.5), Inches(8), Inches(0.4),
             "SAFEZONE AI  ·  ARCHITECTURE",
             font=H_FONT, size=11, bold=True, color=AMBER)
    add_rect(s, Inches(0.7), Inches(0.85), Inches(0.4), Inches(0.04), AMBER)
    add_text(s, Inches(0.7), Inches(1.05), Inches(12), Inches(0.8),
             "End-to-end agent loop",
             font=H_FONT, size=30, bold=True, color=IVORY)
    add_text(s, Inches(0.7), Inches(1.85), Inches(12), Inches(0.4),
             "Voice  →  ASR + emotion  →  LLM grounded in APA PsycInfo  →  cloned-voice TTS  →  blend-shape lip-sync.",
             font=B_FONT, size=13, italic=True, color=GOLD)
    mark_break(s)  # — pause before architecture diagram

    add_image(s, f"{MEDIA}/image26.png", Inches(0.7), Inches(2.45), w=Inches(12))
    page_footer(s, 9, TOTAL)


# ====================================================================
# 10 — PROJECT PORTFOLIO  (more projects at a glance)
# ====================================================================
def slide_more_projects():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    corner_marker(s, "MORE PROJECTS")
    add_text(s, Inches(0.7), Inches(1.05), Inches(12), Inches(0.9),
             "And there's more",
             font=H_FONT, size=40, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(1.95), Inches(12), Inches(0.4),
             "A snapshot of what else I've shipped — across AI, vision, games and systems.",
             font=B_FONT, size=14, italic=True, color=ROYAL)

    # color-coded legend
    legend = [
        ("AI / ML / VISION", AMBER),
        ("GAMES + CLASSICAL AI", GOLD),
        ("SYSTEMS / IR", TEAL),
    ]
    lx = Inches(0.7); ly = Inches(2.4)
    for label, color in legend:
        add_oval(s, lx, ly + Inches(0.08), Inches(0.16), Inches(0.16), color)
        add_text(s, lx + Inches(0.25), ly, Inches(2.5), Inches(0.3),
                 label, font=H_FONT, size=9, bold=True, color=DARK_TEXT)
        lx += Inches(2.55)
    mark_break(s)  # — pause before first row of project cards

    # 4 cols × 3 rows = 12 mini cards
    projects = [
        # Row 1 — AI / ML / Vision (AMBER)
        ("DigiHuman  ⭐ 500",   "Open-source 3D avatar animation from monocular video.", AMBER),
        ("GauGan Painter",      "Semantic-segmentation → photoreal scenes.",             AMBER),
        ("AI Algorithms Viz",   "Manim animations of A*, BFS / DFS, iterative deepening.", AMBER),
        ("CV: Panorama + 3D",   "SIFT + RANSAC + PoinTr point-cloud upsampling.",         AMBER),
        # Row 2 — Games + classical AI (GOLD)
        ("Techu",               "Cross-platform card game — DQN + MCTS opponents.",       GOLD),
        ("Backgammon 3D",       "Monte-Carlo AI with online matchmaking.",                GOLD),
        ("HYPERVIGILANCE",      "Generative video + Unity psychological-horror short.",   GOLD),
        ("Mobile Games",        "Unity titles shipped to App Store / Google Play.",       GOLD),
        # Row 3 — Systems / IR (TEAL)
        ("Search Engine",       "tf-idf · champion lists · KNN · K-means — from scratch.", TEAL),
        ("URL Shortener SaaS",  "Java · MySQL · Docker · K8s · AWS · Hadoop.",            TEAL),
        ("XV6 Kernel",          "Custom syscalls + CPU scheduling modifications.",        TEAL),
        ("Multi-Core C",        "Optimized C with OpenMP + CUDA on CPU & GPU.",           TEAL),
    ]

    sx = Inches(0.7); sy = Inches(2.95)
    cw = Inches(3.0); ch = Inches(1.32)
    gap_x = Inches(0.13); gap_y = Inches(0.13)
    for i, (name, desc, color) in enumerate(projects):
        r = i // 4
        c = i % 4
        x = sx + c * (cw + gap_x)
        y = sy + r * (ch + gap_y)
        add_round_rect(s, x, y, cw, ch, NAVY, radius=0.06)
        add_rect(s, x, y, Inches(0.08), ch, color)
        add_text(s, x + Inches(0.22), y + Inches(0.2), cw - Inches(0.35), Inches(0.4),
                 name, font=H_FONT, size=12, bold=True, color=color)
        add_text(s, x + Inches(0.22), y + Inches(0.6), cw - Inches(0.35), Inches(0.7),
                 desc, font=B_FONT, size=9.5, color=LIGHT_GREY, line_spacing=1.25)
        # pause after every row of 4 cards (except the final row — let footer ride along)
        if (i + 1) % 4 == 0 and (i + 1) < len(projects):
            mark_break(s)
    light_footer(s, 10, TOTAL)


# ====================================================================
# 8 — LATEX CV BUILDER  (System design + RAG)
# ====================================================================
def slide_latex_cv():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    corner_marker(s, "SYSTEM DESIGN")
    add_text(s, Inches(0.7), Inches(1.0), Inches(8), Inches(0.4),
             "PERSONAL PROJECT  ·  2022 — PRESENT",
             font=H_FONT, size=12, bold=True, color=AMBER)
    add_text(s, Inches(0.7), Inches(1.4), Inches(12), Inches(1.0),
             "LaTeX CV Builder — RAG over documents",
             font=H_FONT, size=32, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(2.3), Inches(12), Inches(0.5),
             "A distributed document generator: LLM agents parse old CVs and emit role-tailored LaTeX.",
             font=B_FONT, size=14, italic=True, color=ROYAL)

    # left: stack
    add_text(s, Inches(0.7), Inches(3.1), Inches(7), Inches(0.4),
             "WHAT'S INSIDE", font=H_FONT, size=11, bold=True, color=AMBER)
    bullets = [
        "[b]Next.js (App Router + Server Components)[/b] with streaming UI patterns.",
        "[b]LangChain[/b] LLM agents for automated CV parsing and structuring.",
        "[b]RAG[/b] pipeline for context-aware formatting from prior versions.",
        "[b]Spring Boot[/b] orchestration with [b]Docker + AWS[/b] microservices.",
        "[b]Nginx[/b] service for LaTeX → PDF rendering.",
    ]
    add_bullets(s, Inches(0.7), Inches(3.55), Inches(7), Inches(3.2),
                bullets, size=12, line_spacing=1.3, bullet_char="▸",
                color=DARK_TEXT)
    mark_break(s)  # — pause before right-side architecture panel

    # right: arch image inside a dark frame
    add_rect(s, Inches(8.0), Inches(3.1), Inches(4.85), Inches(3.7), NAVY)
    add_image(s, f"{MEDIA}/image22.png", Inches(8.15), Inches(3.4), w=Inches(4.55))
    light_footer(s, 5, TOTAL)


# ====================================================================
# 9 — DREAMFORGE  (AI tooling)
# ====================================================================
def slide_dreamforge():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    corner_marker(s, "INDUSTRY  ·  AGENTIC TOOLING")
    add_text(s, Inches(0.7), Inches(1.0), Inches(8), Inches(0.4),
             "DECEMBER 2025 — FEBRUARY 2026  ·  DREAMFORGE",
             font=H_FONT, size=12, bold=True, color=AMBER)
    add_text(s, Inches(0.7), Inches(1.4), Inches(12), Inches(1.0),
             "Claude-assisted dev tools that fix themselves",
             font=H_FONT, size=30, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(2.3), Inches(12), Inches(0.5),
             "AI-driven engine for procedural generation — with autonomous build-health agents.",
             font=B_FONT, size=14, italic=True, color=ROYAL)

    # 3 callouts
    cards = [
        ("Auto-intercept",
         "Custom Claude tooling that watches CI/CD streams and intercepts thrown exceptions in real time.",
         AMBER),
        ("Auto-investigate",
         "Agents reproduce, isolate root causes across C# / Python / Docker layers, and gather evidence.",
         GOLD),
        ("Auto-resolve",
         "When confidence is high, the agent commits a permanent codebase fix straight into the repo.",
         AMBER),
    ]
    sx = Inches(0.7); sy = Inches(3.1); cw = Inches(4.15); ch = Inches(3.7); gap = Inches(0.1)
    for i, (title, desc, color) in enumerate(cards):
        x = sx + i * (cw + gap)
        add_round_rect(s, x, sy, cw, ch, NAVY, radius=0.06)
        add_rect(s, x, sy, Inches(0.1), ch, color)
        add_text(s, x + Inches(0.35), sy + Inches(0.3), cw, Inches(0.5),
                 f"0{i+1}", font=H_FONT, size=28, bold=True, color=color)
        add_text(s, x + Inches(0.35), sy + Inches(0.95), cw - Inches(0.5), Inches(0.5),
                 title, font=H_FONT, size=22, bold=True, color=IVORY)
        add_rect(s, x + Inches(0.35), sy + Inches(1.55), Inches(0.4), Inches(0.04), color)
        add_text(s, x + Inches(0.35), sy + Inches(1.75), cw - Inches(0.6), Inches(1.7),
                 desc, font=B_FONT, size=12, color=LIGHT_GREY, line_spacing=1.35)
    light_footer(s, 6, TOTAL)


# ====================================================================
# 10 — STACK / TOOLKIT
# ====================================================================
def slide_stack():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, NAVY)
    add_text(s, Inches(0.7), Inches(0.5), Inches(8), Inches(0.4),
             "THE TOOLKIT",
             font=H_FONT, size=11, bold=True, color=AMBER)
    add_rect(s, Inches(0.7), Inches(0.85), Inches(0.4), Inches(0.04), AMBER)
    add_text(s, Inches(0.7), Inches(1.05), Inches(12), Inches(0.9),
             "Stack I reach for", font=H_FONT, size=38, bold=True, color=IVORY)
    add_text(s, Inches(0.7), Inches(1.9), Inches(12), Inches(0.4),
             "Battle-tested across the projects above.",
             font=B_FONT, size=14, italic=True, color=GOLD)

    cols = [
        ("Agentic AI",     AMBER,
         ["LangChain", "LangGraph", "Multi-Agent", "Ollama", "n8n", "Cursor IDE", "Claude API"]),
        ("LLM & Retrieval", GOLD,
         ["RAG", "FAISS", "Chroma", "SQLite FTS5", "GPT-4o", "Higgs Audio", "Embeddings"]),
        ("System Design",  AMBER,
         ["Docker", "Kubernetes", "AWS (ECR)", "Spring Boot", ".NET / Azure",
          "GitHub Actions", "Next.js", "FastAPI", "MySQL", "Firebase"]),
    ]
    sx = Inches(0.7); sy = Inches(2.8); cw = Inches(4.1); ch = Inches(3.7); gap = Inches(0.15)
    for i, (label, color, items) in enumerate(cols):
        x = sx + i * (cw + gap)
        add_round_rect(s, x, sy, cw, ch, INDIGO, radius=0.05)
        add_rect(s, x, sy, cw, Inches(0.55), ROYAL)
        add_text(s, x + Inches(0.25), sy + Inches(0.1), cw, Inches(0.4),
                 label.upper(), font=H_FONT, size=14, bold=True, color=color,
                 anchor=MSO_ANCHOR.MIDDLE)
        cx = x + Inches(0.25); cy = sy + Inches(0.75)
        max_x = x + cw - Inches(0.2)
        for it in items:
            chip_w = Inches(0.28 + 0.085 * len(it))
            if cx + chip_w > max_x:
                cx = x + Inches(0.25); cy += Inches(0.45)
            add_round_rect(s, cx, cy, chip_w, Inches(0.34), NAVY, radius=0.4)
            add_text(s, cx, cy + Inches(0.05), chip_w, Inches(0.28),
                     it, font=B_FONT, size=10, bold=True, color=IVORY,
                     align=PP_ALIGN.CENTER)
            cx += chip_w + Inches(0.08)
    page_footer(s, 11, TOTAL)


# ====================================================================
# 11 — RECOGNITION
# ====================================================================
def slide_recognition():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, IVORY)
    corner_marker(s, "RECOGNITION")
    add_text(s, Inches(0.7), Inches(1.05), Inches(11), Inches(0.9),
             "Track record", font=H_FONT, size=40, bold=True, color=NAVY)
    add_text(s, Inches(0.7), Inches(1.95), Inches(12), Inches(0.4),
             "Funded, ranked, and shipped — selected highlights.",
             font=B_FONT, size=14, italic=True, color=ROYAL)

    cards = [
        ("3rd",      "Legal-Tech Hackathon",
         "Toronto, 2026 — built CaseLogic in 24h.", AMBER),
        ("Semi-Finals", "Boson AI × MScAC",
         "UofT, 2025 — built SAFEZone AI in 48h.", GOLD),
        ("$10K",     "L2M Lab to Market",
         "Accepted into the program (2025).", AMBER),
        ("$10K",     "Mitacs Funding",
         "Additional research funding (2024).", GOLD),
        ("500⭐",    "DigiHuman (OSS)",
         "Open-source 3D character animation pipeline.", AMBER),
        ("Top 0.5%", "AI Graduate Exam",
         "Iranian national exam (2023).", GOLD),
    ]
    cw = Inches(4.1); ch = Inches(2.05); sx = Inches(0.7); sy = Inches(2.65)
    gap_x = Inches(0.15); gap_y = Inches(0.18)
    for i, (big, title, desc, color) in enumerate(cards):
        r, c = i // 3, i % 3
        x = sx + c * (cw + gap_x); y = sy + r * (ch + gap_y)
        add_round_rect(s, x, y, cw, ch, NAVY, radius=0.05)
        add_rect(s, x, y, Inches(0.1), ch, color)
        add_text(s, x + Inches(0.3), y + Inches(0.15), cw - Inches(0.5), Inches(0.8),
                 big, font=H_FONT, size=32, bold=True, color=color)
        add_text(s, x + Inches(0.3), y + Inches(1.0), cw - Inches(0.5), Inches(0.4),
                 title, font=H_FONT, size=14, bold=True, color=IVORY)
        add_text(s, x + Inches(0.3), y + Inches(1.45), cw - Inches(0.5), Inches(0.5),
                 desc, font=B_FONT, size=10, color=LIGHT_GREY, line_spacing=1.25)
    light_footer(s, 12, TOTAL)


# ====================================================================
# 12 — THANKS / CONTACT
# ====================================================================
def slide_thanks():
    s = prs.slides.add_slide(blank_layout)
    fill_slide(s, NAVY)
    add_rect(s, Inches(0.6), Inches(0.9), Inches(0.12), Inches(5.7), AMBER)
    add_text(s, Inches(1.0), Inches(1.05), Inches(11), Inches(0.5),
             "Q & A", font=H_FONT, size=14, bold=True, color=AMBER)
    add_text(s, Inches(1.0), Inches(1.7), Inches(12), Inches(2.0),
             "Thank you.",
             font=H_FONT, size=88, bold=True, color=IVORY)
    add_text(s, Inches(1.0), Inches(3.85), Inches(11), Inches(0.5),
             "Happy to dig into any of these in more depth.",
             font=B_FONT, size=18, italic=True, color=GOLD)
    mark_break(s)  # — pause before contact cards

    # contact strip
    contacts = [
        ("Email",    "danielkordm@gmail.com",       AMBER),
        ("LinkedIn", "linkedin.com/in/danial-kord", GOLD),
        ("GitHub",   "github.com/Danial-Kord",      AMBER),
        ("Website",  "danial-kord.github.io",       GOLD),
    ]
    cw = Inches(3.0); ch = Inches(1.05); sx = Inches(1.0); sy = Inches(5.2)
    gap_x = Inches(0.1)
    for i, (label, value, color) in enumerate(contacts):
        x = sx + i * (cw + gap_x)
        add_round_rect(s, x, sy, cw, ch, INDIGO, radius=0.08)
        add_rect(s, x, sy, Inches(0.08), ch, color)
        add_text(s, x + Inches(0.25), sy + Inches(0.18), cw - Inches(0.4), Inches(0.3),
                 label.upper(), font=H_FONT, size=9, bold=True, color=color)
        add_text(s, x + Inches(0.25), sy + Inches(0.5), cw - Inches(0.4), Inches(0.45),
                 value, font=H_FONT, size=12, bold=True, color=IVORY)


# ====================================================================
# BUILD
# ====================================================================
def build():
    slide_title()           # 1
    slide_about()           # 2
    slide_pillars()         # 3
    slide_vector()          # 4  — current role
    slide_latex_cv()        # 5  — RAG over docs
    slide_dreamforge()      # 6  — agentic tooling
    slide_caselogic()       # 7  — multi-agent legal
    slide_safezone()        # 8  — voice-first agent
    slide_safezone_arch()   # 9  — architecture
    slide_more_projects()   # 10 — portfolio at a glance
    slide_stack()           # 11
    slide_recognition()     # 12
    slide_thanks()          # 13

    # --- Animations + transitions ---------------------------------------
    # Per-slide effect mix; cycled per shape in z-order. fade is the
    # workhorse; float_up + zoom add subtle variation on key moments.
    effect_mix = {
        0:  ("fade", "float_up"),                 # title — calm
        1:  ("fade",),                            # about — readable
        2:  ("zoom", "fade"),                     # pillars — punchy
        3:  ("fade", "wipe_up"),                  # vector
        4:  ("fade", "float_up"),                 # latex CV
        5:  ("fade", "wipe_up"),                  # dreamforge
        6:  ("fade", "float_up"),                 # caselogic
        7:  ("fade", "fly_from_bot"),             # safezone
        8:  ("fade", "wipe_up"),                  # safezone arch
        9:  ("zoom", "fade"),                     # more projects — grid pop
        10: ("fade", "float_up"),                 # stack
        11: ("zoom", "fade"),                     # recognition — punchy
        12: ("fade", "float_up"),                 # thanks
    }
    for i, slide in enumerate(prs.slides):
        apply_fade_transition(slide, speed="med")
        apply_cascade_anim(slide, effects=effect_mix.get(i, ("fade",)),
                           step_ms=110, dur_ms=420)

    out = "Daniel-CV-5min-Talk.pptx"
    prs.save(out)
    print(f"Saved {out} with {len(prs.slides)} slides")


if __name__ == "__main__":
    build()
