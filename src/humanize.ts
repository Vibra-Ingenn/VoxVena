import { phrase_replacements, structural_cleanup } from "./ai_tells.js";
import { rewrite_with_llm } from "./llm.js";
import { load_voice_style } from "./voice.js";
import {
    apply_contractions,
    flatten_manual_to_talk,
    spoken_replacements,
    strip_big_o_jargon,
    strip_leading_paste_noise,
    strip_tech_plan_voice
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
 * Medium/heavy may roughen with LLM if requested.
 */
export async function humanize(req: Humanize_request): Promise<Humanize_result>
{
    const intensity = req.intensity ?? "light";
    const notes: string[] = [];
    let text = (req.text ?? "").replace(/^\uFEFF/, "").trim();

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

    for (const rule of phrase_replacements)
    {
        const next = text.replace(rule.pattern, rule.replace_with as string);
        if (next !== text)
        {
            hits.push(rule.label);
            text = next;
        }
    }

    for (const rule of spoken_replacements)
    {
        const next = text.replace(rule.pattern, rule.replace_with as string);
        if (next !== text)
        {
            hits.push(rule.label);
            text = next;
        }
    }

    for (const rule of structural_cleanup)
    {
        const next = text.replace(rule.pattern, rule.replace_with as string);
        if (next !== text)
        {
            hits.push(rule.label);
            text = next;
        }
    }

    text = fix_articles(text);
    text = depolish_technical_labels(text, hits);

    const big_o = strip_big_o_jargon(text);
    if (big_o.hit)
    {
        hits.push("big-O jargon");
        text = big_o.text;
        notes.push("big_o_strip");
    }

    const tech = strip_tech_plan_voice(text);
    if (tech.hit)
    {
        hits.push("tech plan voice");
        text = tech.text;
        notes.push("tech_plan_strip");
    }

    const talk = flatten_manual_to_talk(text);
    if (talk.hit)
    {
        hits.push("manual-to-conversation");
        text = talk.text;
        notes.push("conversation_shape");
    }

    // Light always loosens formal wording (still no LLM).
    const contracted = apply_contractions(text);
    if (contracted !== text)
    {
        hits.push("contractions");
        text = contracted;
        notes.push("spoken_pass");
    }

    if (intensity !== "light")
    {
        text = soften_list_cadence(text);
        text = break_uniform_paragraphs(text);
        notes.push("structure_pass");
    }

    if (intensity === "heavy")
    {
        notes.push("imperfection_pass");
    }

    text = tidy_casing_after_edits(text);
    text = text.replace(/[ \t]+\n/g, "\n").trim();

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
            if (text === before_llm)
            {
                notes.push("llm_rewrite_noop");
            }
            else
            {
                notes.push("llm_roughen");
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
    return text.replace(/(^|[.!?]\s+)([a-z])/g, (_, left: string, ch: string) =>
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
