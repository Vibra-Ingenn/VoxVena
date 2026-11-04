import { chat_leftovers, phrase_replacements, structural_cleanup, type Replacement } from "./ai_tells.js";
import { rewrite_with_llm } from "./llm.js";
import { load_voice_style } from "./voice.js";
import {
    apply_contractions,
    drop_warmup_and_wrapup,
    even_out_quotes,
    flatten_manual_to_talk,
    flatten_short_lists,
    limit_repeated_openers,
    merge_one_line_paragraphs,
    spoken_replacements,
    strip_big_o_jargon,
    strip_chat_paste_junk,
    strip_leading_paste_noise,
    strip_markdown_headings,
    strip_model_leaks,
    strip_tech_plan_voice,
    unbullet_long_items,
    unwrap_hard_wrapped_lines
} from "./spoken_pass.js";

export type Intensity = "light" | "medium" | "heavy";

export type Humanize_request =
{
    text: string;
    intensity?: Intensity;
    use_llm?: boolean;
};

export type Humanize_result =
{
    output: string;
    hits: string[];
    hit_count: number;
    used_llm: boolean;
    notes: string[];
};

/**
 * Local AI-tell strip first. Light never uses the LLM (small models polish).
 * Medium/heavy may roughen with LLM if requested; the local rules then run again
 * on the LLM output, because models put their own chatbot habits back in.
 */
export async function humanize(req: Humanize_request): Promise<Humanize_result>
{
    const intensity = req.intensity ?? "light";
    const notes: string[] = [];
    let text = (req.text ?? "").replace(/^\uFEFF/, "").replace(/\r\n/g, "\n").trim();

    if (!text)
    {
        return {
            output: "",
            hits: [],
            hit_count: 0,
            used_llm: false,
            notes: ["empty_input"]
        };
    }

    const hits: string[] = [];

    const paste = strip_leading_paste_noise(text);
    if (paste.hit)
    {
        hits.push("leading paste noise");
        text = paste.text;
        notes.push("leading_paste_strip");
    }

    if (!text)
    {
        return {
            output: "",
            hits: [...new Set(hits)],
            hit_count: hits.length,
            used_llm: false,
            notes: [...notes, "empty_after_paste_strip"]
        };
    }

    const before_local = text;
    text = local_pass(text, intensity, hits, notes);

    if (text === before_local)
    {
        notes.push("no_local_changes_input_already_plain");
    }

    let used_llm = false;
    if (req.use_llm && intensity === "light")
    {
        notes.push("llm_skipped: light_is_local_only");
    }
    else if (req.use_llm)
    {
        try
        {
            const before_llm = text;
            text = await rewrite_with_llm(text, intensity);
            used_llm = true;
            text = local_pass(text, intensity, hits, []);
            if (text === before_llm)
            {
                notes.push("llm_rewrite_noop");
            }
            else
            {
                notes.push("llm_roughen");
                if (share_of_sentences_kept(before_llm, text) >= 0.7)
                {
                    notes.push("llm_barely_changed");
                }
            }
        }
        catch (err)
        {
            const message = err instanceof Error ? err.message : String(err);
            notes.push(`llm_skipped: ${message}`);
        }
    }

    const unique_hits = [...new Set(hits)];
    if (unique_hits.length === 0 && !notes.includes("no_local_changes_input_already_plain"))
    {
        notes.push("few_stock_phrases_found_input_may_already_sound_human");
    }

    if (used_llm)
    {
        const voice = load_voice_style();
        const voice_label = voice?.label?.trim() || voice?.voice_id || "none";
        notes.push(`voice_pack:${voice_label}`);
    }

    return {
        output: text,
        hits: unique_hits,
        hit_count: unique_hits.length,
        used_llm,
        notes
    };
}

// Some models hand the text back almost word for word. Share of the longer sentences that came back unchanged.
function share_of_sentences_kept(before: string, after: string): number
{
    const flat = (s: string) => s.replace(/\s+/g, " ").trim();
    const sentences = (before.match(/[^.!?\n]+[.!?]/g) || []).map(flat).filter((s) => s.split(" ").length >= 6);
    if (sentences.length === 0)
    {
        return 0;
    }
    const out = flat(after);
    return sentences.filter((s) => out.includes(s)).length / sentences.length;
}

function apply_rules(text: string, rules: Replacement[], hits: string[]): string
{
    for (const rule of rules)
    {
        const next = text.replace(rule.pattern, rule.replace_with as string);
        if (next !== text)
        {
            hits.push(rule.label);
            text = next;
        }
    }
    return text;
}

function run_step(text: string, step: (t: string) => { text: string; hit: boolean }, label: string, hits: string[], notes: string[]): string
{
    const r = step(text);
    if (r.hit)
    {
        hits.push(label);
        notes.push(label.replace(/[ -]/g, "_"));
    }
    return r.text;
}

/** Every rule that needs no model. Safe to run twice (it runs again on LLM output). */
function local_pass(text: string, intensity: Intensity, hits: string[], notes: string[]): string
{
    const structured = intensity !== "light";

    text = run_step(text, strip_model_leaks, "model leftovers", hits, notes);
    text = run_step(text, even_out_quotes, "mixed quote marks", hits, notes);
    text = run_step(text, unwrap_hard_wrapped_lines, "pdf line breaks", hits, notes);
    text = run_step(text, strip_chat_paste_junk, "chatgpt links", hits, notes);
    text = run_step(text, (t) => strip_markdown_headings(t, structured), "markdown headings", hits, notes);
    if (structured)
    {
        text = run_step(text, flatten_short_lists, "short lists", hits, notes);
        text = run_step(text, unbullet_long_items, "long bullets", hits, notes);
    }

    text = apply_rules(text, chat_leftovers, hits);
    text = apply_rules(text, phrase_replacements, hits);
    text = apply_rules(text, spoken_replacements, hits);
    text = apply_rules(text, structural_cleanup, hits);

    text = fix_articles(text);
    text = depolish_technical_labels(text, hits);

    text = run_step(text, strip_big_o_jargon, "big-O jargon", hits, notes);
    text = run_step(text, strip_tech_plan_voice, "tech plan voice", hits, notes);
    text = run_step(text, flatten_manual_to_talk, "manual-to-conversation", hits, notes);

    // Light always loosens formal wording (still no LLM).
    const contracted = apply_contractions(text);
    if (contracted !== text)
    {
        hits.push("contractions");
        text = contracted;
    }

    if (structured)
    {
        text = soften_list_cadence(text);
        text = break_uniform_paragraphs(text);
        text = run_step(text, merge_one_line_paragraphs, "one-line paragraphs", hits, notes);
    }

    if (intensity === "heavy")
    {
        text = run_step(text, drop_warmup_and_wrapup, "warm-up and wrap-up lines", hits, notes);
    }

    text = run_step(text, (t) => limit_repeated_openers(t, intensity === "heavy" ? 1 : 2), "repeated openers", hits, notes);

    text = tidy_casing_after_edits(text);
    return text.replace(/[ \t]+\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
}

function depolish_technical_labels(text: string, hits: string[]): string
{
    let out = text;
    const swaps: Array<[RegExp, string, string]> =
    [
        [/\bTime complexity:\s*/gi, "Time: ", "time complexity"],
        [/\bSpace complexity:\s*/gi, "Space: ", "space complexity"],
        [/\bIn this approach,?\s*/gi, "", "in this approach"],
        [/\bIt is important to (?:understand|note) that\s*/gi, "", "it is important"],
        [/\bThis approach is (?:considered )?optimal\.?\s*/gi, "", "approach optimal"],
        [/\befficient solution\b/gi, "fast way", "efficient solution"],
        [/\bsignificantly more efficient\b/gi, "way faster", "significantly more efficient"]
    ];

    for (const [pattern, repl, label] of swaps)
    {
        const next = out.replace(pattern, repl);
        if (next !== out)
        {
            hits.push(label);
            out = next;
        }
    }
    return out;
}

function soften_list_cadence(text: string): string
{
    // Turn rigid "First, Second, Third," openers into plainer ones sometimes.
    return text
        .replace(/^First,\s+/gim, "")
        .replace(/^Second,\s+/gim, "Next, ")
        .replace(/^Third,\s+/gim, "Then ")
        .replace(/^Fourth,\s+/gim, "")
        .replace(/^Finally,\s+/gim, "Last, ");
}

function break_uniform_paragraphs(text: string): string
{
    const parts = text.split(/\n{2,}/);
    if (parts.length < 2)
    {
        return text;
    }

    return parts.map((block, index) =>
    {
        const sentences = block.match(/[^.!?]+[.!?]+|[^.!?]+$/g);
        if (!sentences || sentences.length < 4)
        {
            return block.trim();
        }

        // Occasionally merge a short sentence into the previous one feel by
        // joining with a semicolon-less "and" style — keep simple: leave as-is
        // but trim robotic leading transitions on later paragraphs.
        let out = block.trim();
        if (index > 0)
        {
            out = out.replace(/^(?:Also|But|So),\s+/i, "");
        }
        return out;
    }).join("\n\n");
}

function tidy_casing_after_edits(text: string): string
{
    // Capitalize starts of sentences after we stripped lead-ins.
    // Not after "..." ("They're more like... clouds" stays lowercase).
    return text.replace(/(^|(?<!\.\.)[.!?]\s+)([a-z])/g, (_, left: string, ch: string) =>
    {
        return left + ch.toUpperCase();
    }).replace(/(^|\n)([a-z])/g, (_, left: string, ch: string) =>
    {
        return left + ch.toUpperCase();
    });
}

// Swaps can leave "an new" or "a idea"; put the right article back.
// "an hour", "a one-off", "a user" and "a European" stay as they are.
function fix_articles(text: string): string
{
    return text
        .replace(/\b([Aa])n (?=[bcdfgjklmnpqrstvwxyz])/g, "$1 ")
        .replace(/\b([Aa]) (?=a|i|e(?![uw]))/g, "$1n ");
}
