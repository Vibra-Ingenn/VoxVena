import type { Intensity } from "./humanize.js";
import { strip_model_leaks } from "./spoken_pass.js";
import { load_voice_style, voice_prompt_block } from "./voice.js";

/**
 * Optional LLM pass. Goal is DE-polish into spoken voice.
 * Small models love polishing — this fights that and rejects essay outputs.
 */
export async function rewrite_with_llm(text: string, intensity: Intensity): Promise<string>
{
    const base_url = (process.env.HUMANIZER_BASE_URL || "http://127.0.0.1:8990/v1").replace(/\/$/, "");
    const model = process.env.HUMANIZER_MODEL || "local";
    const api_key = process.env.HUMANIZER_API_KEY || process.env.OPENROUTER_API_KEY || "janus";

    let content = await call_roughen(text, intensity, base_url, model, api_key, false);

    if (looks_more_polished(text, content) || has_new_essay_tells(text, content))
    {
        content = await call_roughen(text, intensity, base_url, model, api_key, true);
    }

    if (looks_more_polished(text, content) || has_new_essay_tells(text, content))
    {
        throw new Error("LLM polished instead of roughened — kept local cleanup only");
    }

    if (content.length > text.length * 1.45)
    {
        throw new Error("LLM expanded the draft — kept local cleanup only");
    }

    const overlap = word_overlap_ratio(text, content);
    if (overlap < 0.3)
    {
        throw new Error(`LLM drifted off-topic (overlap ${overlap.toFixed(2)}) — kept local cleanup only`);
    }

    return content;
}

async function call_roughen(
    text: string,
    intensity: Intensity,
    base_url: string,
    model: string,
    api_key: string,
    force_harder: boolean
): Promise<string>
{
    const voice = load_voice_style();
    const voice_block = voice_prompt_block(voice);

    const touch = force_harder
        ? "HARD: Make it LESS polished. Shorter blunt lines. No blog tone."
        : intensity === "heavy"
            ? "Rewrite it hard: new order, plain words, no outline. Keep facts. Kill polish."
            : "Make it a bit plainer and less polished. Keep facts.";

    const system = [
        "You REMOVE polish, tech-manual voice, and artificial AI essay structures.",
        "Rewrite it the way the person would write it themselves: plain, direct, a little uneven. Not a blog, not a textbook, not a chatbot answer.",
        "If your rewrite sounds cleaner, smarter, more labeled, or more structured than the draft, you failed.",
        "Keep facts and key technical details.",
        "",
        voice_block,
        "",
        "RULES:",
        "1. Keep the same facts, numbers, and code/pseudocode.",
        "2. Do NOT expand length or invent filler.",
        "3. Do not keep the draft's outline. No headings, no numbered sections, no bullet lists. You may put the points in a different order, and you don't have to give every point its own paragraph.",
        "4. Vary it: some sentences short, some long; paragraphs of different lengths.",
        "5. Ban: On the other hand, As for, Furthermore, Additionally, Overall, In conclusion, That said, It's worth noting, So let's, Here's how, hands down, textbook, delve, seamless, robust, which means, in other words, testament to, beacon of, cornerstone, pivotal, crucial role, double-edged sword, at its core, ultimate, in essence.",
        "6. Also ban these chatbot habits: Let me break it down, Here's the thing, The thing is, Think about it this way, Here's what happens, Here's where it gets interesting, the mind-blowing part, So you want to know...?, Okay so, any question used as a hook, any mention of 'your question' or an earlier conversation, and any ending that offers more ('you could ask', 'let me know', 'want me to', 'worth exploring next').",
        "7. Don't fake casual talk. No 'like', 'basically', 'you know', 'and stuff', 'pretty much' unless the draft already uses them.",
        "8. Output ONLY the rewritten text.",
        "",
        touch
    ].filter(Boolean).join("\n");

    const user = [
        "Rewrite this. Do not polish it. Do not keep its headings, section order, or lists.",
        "",
        "--- DRAFT ---",
        text,
        "--- END ---"
    ].join("\n");

    const temperature = force_harder ? 0.55 : intensity === "heavy" ? 0.5 : 0.4;

    const response = await fetch(`${base_url}/chat/completions`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${api_key}`
        },
        body: JSON.stringify({
            model,
            temperature,
            messages: [
                { role: "system", content: system },
                { role: "user", content: user }
            ]
        })
    });

    if (!response.ok)
    {
        const body = await response.text();
        throw new Error(`LLM HTTP ${response.status}: ${body.slice(0, 200)}`);
    }

    const data = await response.json() as {
        choices?: Array<{ message?: { content?: string } }>;
    };

    let content = data.choices?.[0]?.message?.content?.trim();
    if (!content)
    {
        throw new Error("LLM returned empty content");
    }

    content = content
        .replace(/^```(?:\w+)?\n?/, "")
        .replace(/\n?```$/, "")
        .replace(/^Here(?:'s| is) (?:a |the )?(?:edited|rewritten|humanized|stripped|roughened)[^:\n]*:\s*/i, "")
        .replace(/^(?:Edited|Stripped|Rewritten|Humanized|Roughened)(?: draft)?:?\s*/i, "")
        .trim();

    content = strip_model_leaks(content).text;
    content = restore_mangled_symbols(text, content);
    content = strip_llm_added_tells(content);
    return content;
}

function looks_more_polished(original: string, candidate: string): boolean
{
    const polish_hits = (s: string) =>
        (s.match(/\b(furthermore|additionally|moreover|overall|in conclusion|on the other hand|as for|it's worth noting|in other words|hands down|textbook|delve|seamless|robust|comprehensive|utilize|leverage|testament|cornerstone|pivotal|paramount|foster|spearhead|harness|streamline|unleash|elevate)\b/gi) || []).length;

    const spoken_hits = (s: string) =>
        (s.match(/\b(like|basically|you know|stuff|kinda|gonna|wanna|so|and|because)\b/gi) || []).length;

    return polish_hits(candidate) > polish_hits(original) && spoken_hits(candidate) <= spoken_hits(original);
}

function has_new_essay_tells(original: string, candidate: string): boolean
{
    return has_essay_openers(candidate) && !has_essay_openers(original);
}

function word_overlap_ratio(original: string, candidate: string): number
{
    const a = tokenize(original);
    const b = tokenize(candidate);
    if (a.size === 0 || b.size === 0)
    {
        return 0;
    }

    let shared = 0;
    for (const word of a)
    {
        if (b.has(word))
        {
            shared += 1;
        }
    }
    return shared / Math.max(a.size, b.size);
}

function tokenize(text: string): Set<string>
{
    return new Set(
        text
            .toLowerCase()
            .match(/[a-z0-9√]+/g) ?? []
    );
}

function has_essay_openers(text: string): boolean
{
    return /so let's break down|here's how (?:it|the three)|on the other hand|as for (?:space|time)|hands down the most/i.test(text);
}

function restore_mangled_symbols(original: string, candidate: string): string
{
    let out = candidate;
    if (original.includes("√") && !out.includes("√"))
    {
        out = out.replace(/O\(\?n\)/g, "O(√n)").replace(/\?n/g, "√n");
    }
    return out;
}

function strip_llm_added_tells(text: string): string
{
    const bans: Array<[RegExp, string]> =
    [
        [/\bOn the other hand,\s*/gi, "But "],
        [/\bAs for\s+/gi, ""],
        [/\bhands down\b/gi, "by far"],
        [/\ba huge time saver\b/gi, "way faster"],
        [/\bThis is the textbook correct way to do it\.?\s*/gi, ""],
        [/\bThat said,\s*/gi, ""],
        [/\bIt's worth noting that\s*/gi, ""],
        [/\bIn other words,\s*/gi, ""],
        [/\bSo let's break down\b/gi, "Here are"],
        [/\bHere's how (?:it|they|the three functions?) works?:?\s*/gi, ""],
        [/\bwhich means\b/gi, "so"],
        [/\bTime complexity:\s*/gi, "Time: "],
        [/\bSpace complexity:\s*/gi, "Space: "],
        [/\btestament to\b/gi, "proof of"],
        [/\bbeacon of\b/gi, "model for"],
        [/\bcornerstone\b/gi, "core part"],
        [/\bat its core,?\s*/gi, "basically, "]
    ];

    let out = text;
    for (const [pattern, repl] of bans)
    {
        out = out.replace(pattern, repl);
    }
    return out.replace(/\n{3,}/g, "\n\n").trim();
}
