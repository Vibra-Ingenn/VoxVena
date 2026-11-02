import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

export type Voice_style =
{
    voice_id: string;
    label: string;
    summary: string;
    do: string[];
    dont: string[];
    lexicon_favor: string[];
    exemplars: string[];
    rewrite_targets: Record<string, string>;
};

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const default_voice_path = path.join(__dirname, "fixtures", "example_voice_style.json");

let cached: Voice_style | null = null;

/**
 * Load the active voice pack from HUMANIZER_VOICE_PATH or ./voice/example_style.json.
 */
export function load_voice_style(voice_path = process.env.HUMANIZER_VOICE_PATH || default_voice_path): Voice_style | null
{
    if (cached)
    {
        return cached;
    }

    try
    {
        const raw = fs.readFileSync(voice_path, "utf8");
        cached = JSON.parse(raw) as Voice_style;
        return cached;
    }
    catch
    {
        return null;
    }
}

/**
 * Build a compact voice block for the LLM system prompt.
 */
export function voice_prompt_block(style: Voice_style | null): string
{
    if (!style)
    {
        return "";
    }

    const exemplars = style.exemplars.slice(0, 4).map((line) => `- ${line}`).join("\n");
    const do_lines = style.do.map((line) => `- ${line}`).join("\n");
    const dont_lines = style.dont.map((line) => `- ${line}`).join("\n");

    return [
        `TARGET VOICE (${style.label}): ${style.summary}`,
        "",
        "DO:",
        do_lines,
        "",
        "DONT:",
        dont_lines,
        "",
        "Voice samples (match cadence, not topic):",
        exemplars
    ].join("\n");
}
