import type { Replacement } from "./ai_tells.js";
import { verb } from "./ai_tells.js";

/**
 * Local spoken-voice swaps. No model.
 * Goal: kill AI / tech-plan voice so it sounds like a person talking.
 */
export const spoken_replacements: Replacement[] =
[
    // Stiff connectors
    { pattern: /\bin order to\b/gi, replace_with: "to", label: "in order to" },
    { pattern: /\bdue to the fact that\b/gi, replace_with: "because", label: "due to the fact that" },
    { pattern: /\bfor the purpose of\b/gi, replace_with: "to", label: "for the purpose of" },
    { pattern: /\ba large number of\b/gi, replace_with: "a lot of", label: "a large number of" },
    { pattern: /\ba significant (?:amount|number) of\b/gi, replace_with: "a lot of", label: "significant amount" },
    { pattern: /\bin the event that\b/gi, replace_with: "if", label: "in the event that" },
    { pattern: /\bprior to\b/gi, replace_with: "before", label: "prior to" },
    { pattern: /\bsubsequent to\b/gi, replace_with: "after", label: "subsequent to" },
    { pattern: /\bwith regard to\b/gi, replace_with: "about", label: "with regard to" },
    { pattern: /\bwith respect to\b/gi, replace_with: "about", label: "with respect to" },
    { pattern: /\bin terms of\b/gi, replace_with: "for", label: "in terms of" },
    { pattern: /\bit should be noted that\b/gi, replace_with: "", label: "it should be noted" },
    { pattern: /\bone can (?:see|observe) that\b/gi, replace_with: "", label: "one can see that" },
    { pattern: /\bit can be seen that\b/gi, replace_with: "", label: "it can be seen that" },
    { pattern: /\bthis ensures that\b/gi, replace_with: "so", label: "this ensures that" },
    { pattern: /\bthis allows (?:us|you) to\b/gi, replace_with: "so you can", label: "this allows you to" },
    { pattern: /\bis considered (?:to be )?the\b/gi, replace_with: "is the", label: "is considered the" },
    { pattern: /\bneedless to say,?\s*/gi, replace_with: "", label: "needless to say" },
    { pattern: /\bwhen it comes to\b/gi, replace_with: "for", label: "when it comes to" },
    { pattern: /\bat this point in time\b/gi, replace_with: "now", label: "at this point in time" },
    { pattern: /\bin close proximity to\b/gi, replace_with: "near", label: "in close proximity" },
    { pattern: /\bhas the ability to\b/gi, replace_with: "can", label: "has the ability to" },
    { pattern: /\bin the process of\b/gi, replace_with: "", label: "in the process of" },
    { pattern: /\baforementioned\b/gi, replace_with: "above", label: "aforementioned" },
    { pattern: /\bherein\b/gi, replace_with: "here", label: "herein" },
    { pattern: /\bthereof\b/gi, replace_with: "of it", label: "thereof" },
    { pattern: /\bLet's (?:take a look at|examine|analyze)\b/gi, replace_with: "Look at", label: "let's examine" },
    { pattern: /\bWe can observe that\b/gi, replace_with: "", label: "we can observe" },
    { pattern: /\bIt is clear that\b/gi, replace_with: "", label: "it is clear that" },
    { pattern: /\bHave you ever wondered\s+[^?]+\?\s*/gi, replace_with: "", label: "rhetorical question opener" },
    // Kept when the answer starts "Because ...", or that answer would be left hanging.
    { pattern: /\bWhy does this matter\?(?!\s*Because\b)\s*/gi, replace_with: "", label: "rhetorical why does this matter" },
    { pattern: /\bTaking everything into account,?\s*/gi, replace_with: "So, ", label: "taking everything into account" },

    // Tech-plan / CS-doc voice -> human talk
    { pattern: /\bTime complexity:\s*/gi, replace_with: "Time: ", label: "time complexity" },
    { pattern: /\bSpace complexity:\s*/gi, replace_with: "Space: ", label: "space complexity" },
    { pattern: /\basymptotic complexity\b/gi, replace_with: "how fast it scales", label: "asymptotic complexity" },
    { pattern: /\bcomputational complexity\b/gi, replace_with: "how expensive it is to run", label: "computational complexity" },
    { pattern: /\bthe most efficient (?:approach|method|solution|algorithm)\b/gi, replace_with: "the fastest way", label: "most efficient approach" },
    { pattern: /\boptimal (?:approach|solution|method|algorithm)\b/gi, replace_with: "best way", label: "optimal approach" },
    { pattern: /\befficient solution\b/gi, replace_with: "fast way", label: "efficient solution" },
    { pattern: /\bsignificantly more efficient\b/gi, replace_with: "way faster", label: "significantly more efficient" },
    { pattern: /\bunnecessary (?:overhead|work|computation)\b/gi, replace_with: "extra work", label: "unnecessary overhead" },
    { pattern: /\bmemory consumption\b/gi, replace_with: "memory use", label: "memory consumption" },
    { pattern: /\bmemory footprint\b/gi, replace_with: "how much memory it uses", label: "memory footprint" },
    { pattern: /\bcomputational(?:ly)? (?:expensive|costly)\b/gi, replace_with: "slow and expensive", label: "computationally expensive" },
    { pattern: /\bperforms (?:a )?(?:check|checks) against\b/gi, replace_with: "checks", label: "performs checks against" },
    { pattern: /\biterates (?:over|through)\b/gi, replace_with: "loops through", label: "iterates over" },
    { pattern: /\bimplements (?:a |an )?/gi, replace_with: "does ", label: "implements" },
    { pattern: /\bimplementation detail(?:s)?\b/gi, replace_with: "how it's built", label: "implementation details" },
    { pattern: /\bthe following (?:approach|method|algorithm|steps)\b/gi, replace_with: "this", label: "the following approach" },
    { pattern: /\bstep[- ]by[- ]step (?:process|approach|guide)\b/gi, replace_with: "walkthrough", label: "step-by-step" },
    { pattern: /\bhigh-level overview\b/gi, replace_with: "quick overview", label: "high-level overview" },
    { pattern: /\bin constant time\b/gi, replace_with: "basically instantly", label: "constant time" },
    { pattern: /\bin constant space\b/gi, replace_with: "barely any memory", label: "constant space" },
    { pattern: /\bconstant space\b/gi, replace_with: "barely any memory", label: "constant space bare" },
    { pattern: /\blinear time\b/gi, replace_with: "time that grows with the size", label: "linear time" },
    { pattern: /\blinear space\b/gi, replace_with: "memory that grows with the size", label: "linear space" },
    { pattern: /\bin the worst[- ]case(?: scenario)?\b/gi, replace_with: "worst case", label: "worst-case scenario" },
    { pattern: /\bin the best[- ]case(?: scenario)?\b/gi, replace_with: "best case", label: "best-case scenario" },
    { pattern: /\bThis is the textbook correct way to do it\.?\s*/gi, replace_with: "", label: "textbook correct" },
    { pattern: /\bThis is the (?:standard|canonical) (?:approach|way)\.?/gi, replace_with: "This is the normal way.", label: "canonical approach" },
    { pattern: /\bFunction ([A-Z]) is (?:by far )?the most efficient\b/gi, replace_with: "This one is all about Function $1 - by far the most efficient", label: "function most efficient" },
    { pattern: /\bpseudocode\b/gi, replace_with: "rough code", label: "pseudocode" },
    { pattern: /\balgorithmic (?:approach|solution)\b/gi, replace_with: "way to do it", label: "algorithmic approach" },
    { pattern: /\bdata structure\b/gi, replace_with: "structure", label: "data structure" },
    { pattern: /\butilize(?:s|d)?\b/gi, replace_with: "use", label: "utilize spoken" },
    verb("leverag", "es|ed|ing|e", ["use", "uses", "used", "using"], "leverage spoken"),
    { pattern: /\bfacilitate(?:s|d)?\b/gi, replace_with: "help", label: "facilitate" },
    { pattern: /\bmethodology\b/gi, replace_with: "method", label: "methodology" },
    { pattern: /\bcomprehensive\b/gi, replace_with: "full", label: "comprehensive" },
    { pattern: /\bsubsequently,?\s*/gi, replace_with: "Then ", label: "subsequently" },
    { pattern: /\baccordingly,?\s*/gi, replace_with: "So ", label: "accordingly" },
    { pattern: /\brespectively\b/gi, replace_with: "", label: "respectively" },
    { pattern: /\bvia\b/gi, replace_with: "through", label: "via" },
    { pattern: /\bthusly\b/gi, replace_with: "so", label: "thusly" },
    { pattern: /\bhereby\b/gi, replace_with: "", label: "hereby" },
    { pattern: /\bnote that\b/gi, replace_with: "", label: "note that" },
    { pattern: /\bplease note that\b/gi, replace_with: "", label: "please note that" },
    { pattern: /\bkey takeaway(?:s)?:?\s*/gi, replace_with: "", label: "key takeaway" },
    { pattern: /\bin summary,?\s*/gi, replace_with: "", label: "in summary spoken" },
    { pattern: /\bto summarize,?\s*/gi, replace_with: "", label: "to summarize spoken" }
];

/**
 * Apply contractions so formal bot phrasing loosens up.
 */
export function apply_contractions(text: string): string
{
    return text
        .replace(/\bdo not\b/gi, "don't")
        .replace(/\bdoes not\b/gi, "doesn't")
        .replace(/\bdid not\b/gi, "didn't")
        .replace(/\bis not\b/gi, "isn't")
        .replace(/\bare not\b/gi, "aren't")
        .replace(/\bwas not\b/gi, "wasn't")
        .replace(/\bwere not\b/gi, "weren't")
        .replace(/\bwill not\b/gi, "won't")
        .replace(/\bcannot\b/gi, "can't")
        .replace(/\bit is\b/gi, "it's")
        .replace(/\bthat is\b/gi, "that's")
        .replace(/\bthere is\b/gi, "there's")
        .replace(/\bwe are\b/gi, "we're")
        .replace(/\byou are\b/gi, "you're")
        .replace(/\bI am\b/g, "I'm");
}

/**
 * Strip Big-O / CS-notation jargon that normal people bounce off.
 * Keeps the plain explanation after the dash when present.
 */
export function strip_big_o_jargon(text: string): { text: string; hit: boolean }
{
    let out = text;
    const before = out;

    // "Time: O(√n) - explanation" -> "How long it takes - explanation"
    out = out.replace(/\bTime:\s*O\([^)]+\)\s*[-–—:]\s*/gi, "How long it takes - ");
    out = out.replace(/\bSpace:\s*O\([^)]+\)\s*[-–—:]\s*/gi, "Memory - ");
    out = out.replace(/\bTime:\s*O\([^)]+\)/gi, "How long it takes");
    out = out.replace(/\bSpace:\s*O\([^)]+\)/gi, "Memory");

    // Bare labels without O()
    out = out.replace(/\bTime:\s*/gi, "How long it takes - ");
    out = out.replace(/\bSpace:\s*/gi, "Memory - ");

    // Inline complexity tokens (order matters: longer patterns first)
    out = out.replace(/\bis\s+O\s*\(\s*√\s*n\s*\)/gi, "only goes up to the square root");
    out = out.replace(/\bis\s+O\s*\(\s*sqrt\s*\(\s*n\s*\)\s*\)/gi, "only goes up to the square root");
    out = out.replace(/\bis\s+O\s*\(\s*n\s*\^\s*2\s*\)/gi, "gets slow fast");
    out = out.replace(/\bis\s+O\s*\(\s*n\s*log\s*n\s*\)/gi, "grows a bit faster than the size");
    out = out.replace(/\bis\s+O\s*\(\s*n\s*\)/gi, "grows with the size");
    out = out.replace(/\bis\s+O\s*\(\s*1\s*\)/gi, "barely costs anything");
    out = out.replace(/\bis\s+O\s*\(\s*log\s*n\s*\)/gi, "grows real slow");

    out = out.replace(/\bO\s*\(\s*√\s*n\s*\)/gi, "only up to the square root");
    out = out.replace(/\bO\s*\(\s*sqrt\s*\(\s*n\s*\)\s*\)/gi, "only up to the square root");
    out = out.replace(/\bO\s*\(\s*n\s*\^\s*2\s*\)/gi, "gets slow fast");
    out = out.replace(/\bO\s*\(\s*n\s*log\s*n\s*\)/gi, "grows a bit faster than the size");
    out = out.replace(/\bO\s*\(\s*n\s*\)/gi, "grows with the size");
    out = out.replace(/\bO\s*\(\s*1\s*\)/gi, "barely costs anything");
    out = out.replace(/\bO\s*\(\s*log\s*n\s*\)/gi, "grows real slow");
    // Any leftover O(...)
    out = out.replace(/\bO\s*\([^)]*\)/g, "scales with that");

    // Cleanup doubled dashes / grammar leftovers from stripping
    out = out.replace(/\s*[-–—]\s*[-–—]\s*/g, " - ");
    out = out.replace(/How long it takes - How long it takes -/gi, "How long it takes - ");
    out = out.replace(/Memory - Memory -/gi, "Memory - ");
    out = out.replace(/\bis grows with\b/gi, "grows with");
    out = out.replace(/\bAlso constant\b/gi, "Also tiny");

    return { text: out, hit: out !== before };
}

const leading_url_line = /^\s*https?:\/\/\S+\s*$/i;
const leading_paste_chrome =
    /^\s*(?:copy(?:\s+code)?|copied(?:\s+to\s+clipboard)?|source:\s*https?:\/\/\S+)\s*$/i;

/**
 * ChatGPT / browser pastes often start with a share URL or "Copy code" line.
 * Drop that noise so the rest of the pipeline sees the actual draft.
 */
export function strip_leading_paste_noise(text: string): { text: string; hit: boolean }
{
    const lines = text.split("\n");
    let i = 0;
    let hit = false;

    while (i < lines.length)
    {
        const trimmed = lines[i].trim();
        if (!trimmed)
        {
            i += 1;
            hit = true;
            continue;
        }
        if (leading_url_line.test(trimmed) || leading_paste_chrome.test(trimmed))
        {
            i += 1;
            hit = true;
            continue;
        }
        break;
    }

    return { text: lines.slice(i).join("\n").trim(), hit };
}

/**
 * Turn manual / blueprint layout into conversation shape:
 * no "option 1 / option 2 / option 3" labels — just talk through the choices.
 */
export function flatten_manual_to_talk(text: string): { text: string; hit: boolean }
{
    const before = text;
    const lines = text.split("\n");
    const out: string[] = [];
    let i = 0;
    let hit = false;
    let choice_count = 0;

    while (i < lines.length)
    {
        const raw = lines[i];
        const trimmed = raw.trim();

        if (!trimmed)
        {
            if (out.length && out[out.length - 1] !== "")
            {
                out.push("");
            }
            i += 1;
            continue;
        }

        if (/^here are the \d+ broken down:?$/i.test(trimmed))
        {
            out.push("Here's how they compare.");
            hit = true;
            i += 1;
            continue;
        }

        // Function A - BEST  => natural talk, NOT "item 1 / item 2 / item 3"
        const rank = trimmed.match(/^Function\s+([A-Z])\s*[-–—]\s*(.+)$/i);
        if (rank)
        {
            choice_count += 1;
            out.push(spoken_choice_opener(rank[1], rank[2].trim(), choice_count));
            hit = true;
            i += 1;
            continue;
        }

        // Drop blueprint labels
        if (/^(rough code|pseudocode|code|algorithm)\s*:?$/i.test(trimmed))
        {
            hit = true;
            i += 1;
            const code_lines: string[] = [];
            while (i < lines.length)
            {
                const next = lines[i].trim();
                if (!next)
                {
                    break;
                }
                if (is_codeish_line(next) || /^\s{2,}/.test(lines[i]))
                {
                    code_lines.push(next);
                    i += 1;
                    continue;
                }
                break;
            }
            if (code_lines.length)
            {
                out.push(paraphrase_code_lines(code_lines));
                hit = true;
            }
            continue;
        }

        // Standalone code block without a label
        if (is_codeish_line(trimmed))
        {
            const code_lines: string[] = [trimmed];
            i += 1;
            while (i < lines.length)
            {
                const next = lines[i].trim();
                if (!next || !is_codeish_line(next))
                {
                    break;
                }
                code_lines.push(next);
                i += 1;
            }
            out.push(paraphrase_code_lines(code_lines));
            hit = true;
            continue;
        }

        let line = trimmed
            .replace(/^How long it takes\s*[-–—:]\s*/i, "SPEED::")
            .replace(/^Memory\s*[-–—:]\s*/i, "MEM::")
            .replace(/^Time\s*[-–—:]\s*/i, "SPEED::")
            .replace(/^Space\s*[-–—:]\s*/i, "MEM::")
            .replace(/^Speed-wise,\s*/i, "SPEED::")
            .replace(/^Memory-wise,\s*/i, "MEM::");

        if (line.startsWith("SPEED::"))
        {
            line = soften_speed_lead(line.slice("SPEED::".length));
            hit = true;
        }
        else if (line.startsWith("MEM::"))
        {
            line = soften_memory_lead(line.slice("MEM::".length));
            hit = true;
        }

        out.push(line);
        i += 1;
    }

    let joined = out.join("\n");
    joined = joined.replace(/\n{3,}/g, "\n\n");
    // Keep related talk together instead of schematic blocks
    joined = joined.replace(/([.!?])\n(Basically |On speed|It |And |But |Then )/g, "$1 $2");
    joined = joined.replace(/\bFunction ([A-Z])\b/g, "$1");
    joined = joined.replace(/\bcreating the array\b/gi, "building that list");
    joined = joined.replace(/\bremoving from an array\b/gi, "knocking stuff out of a list");
    joined = joined.replace(/\bentire array\b/gi, "huge list");
    joined = joined.replace(/\ban huge\b/gi, "a huge");
    joined = joined.replace(/\bif i\s*!=\s*1 and i\s*!=\s*n\b/gi, "to skip the ends");

    return { text: joined.trim(), hit: hit || joined !== before.trim() };
}

function spoken_choice_opener(name: string, tag: string, index: number): string
{
    const lower = tag.toLowerCase();

    if (index === 1)
    {
        if (/^best$/i.test(tag))
        {
            return `The one I'd go with is ${name}.`;
        }
        return `Start with ${name} - ${lower}.`;
    }

    if (/^worst$/i.test(tag))
    {
        return `And ${name}? Don't do that one.`;
    }

    if (/wasteful|ok\b|okay/i.test(tag))
    {
        return `${name} works, but it's wasteful if they use that instead.`;
    }

    if (index === 2)
    {
        return `Then there's ${name} - ${lower}.`;
    }

    return `And ${name} is ${lower}.`;
}

function soften_speed_lead(rest: string): string
{
    const t = rest.trim();
    if (/^but\b/i.test(t))
    {
        return t.charAt(0).toUpperCase() + t.slice(1);
    }
    if (/^(checks|creates|loops|does)\b/i.test(t))
    {
        return `It ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
    }
    if (/^if\b/i.test(t))
    {
        return `On speed, ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
    }
    return `On speed, ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
}

function soften_memory_lead(rest: string): string
{
    const t = rest.trim();
    if (/^this is the killer\b/i.test(t))
    {
        return `And that's the killer on memory. ${t.replace(/^this is the killer\.?\s*/i, "")}`.trim();
    }
    if (/^just\b/i.test(t) || /^also\b/i.test(t))
    {
        return `And memory-wise, ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
    }
    return `And memory-wise, ${t.charAt(0).toLowerCase()}${t.slice(1)}`;
}

// Only real pseudocode counts. "For example:" or "If you push..." is a sentence, not code.
function is_codeish_line(line: string): boolean
{
    if (/[.!?]$/.test(line) || /^(?:for|if)\s+(?:example|instance)\b/i.test(line))
    {
        return false;
    }
    return /^(?:for|while)\s+\w+\s+(?:in|from)\b/i.test(line)
        || (/^if\s/i.test(line) && /==|!=|<=|>=|\bmod\b|\breturn\b/.test(line))
        || /^(?:return\s|else\b|factors\s*=|\/\/)/i.test(line)
        || (/^[a-z_][a-z0-9_]*\s*=/.test(line) && !/\b(is|are|was|the)\b/i.test(line));
}

function paraphrase_code_lines(lines: string[]): string
{
    const bits: string[] = [];
    for (const line of lines)
    {
        let s = line.trim();
        s = s.replace(/^for\s+(\w+)\s+from\s+(.+?)\s+to\s+(.+?)(?:\s+inclusive)?$/i, "you loop $1 from $2 to $3");
        s = s.replace(/^for\s+(\w+)\s+in\s+(\w+)$/i, "you walk through that list");
        s = s.replace(/^if\s+(.+?)\s+return\s+false$/i, "and if $1 you know it's not prime");
        s = s.replace(/^if\s+(.+?)\s+remove\s+(\w+)\s+from\s+(\w+)$/i, "and if $1 you knock it out of the list");
        s = s.replace(/^return\s+true$/i, "otherwise you're good");
        s = s.replace(/^return\s+false$/i, "then it's a no");
        s = s.replace(/^factors\s*=\s*array from\s+(.+)$/i, "it builds a whole list from $1");
        s = s.replace(/\bn mod i\s*==\s*0\b/gi, "something divides evenly");
        s = s.replace(/\bn mod i\s*!=\s*0\b/gi, "it doesn't divide evenly");
        s = s.replace(/\bi\s*!=\s*1 and i\s*!=\s*n\b/gi, "you're not on the ends");
        s = s.replace(/\byou loop i from\b/gi, "you loop from");
        bits.push(s);
    }

    const spoken = bits.join(", ");
    return `Basically ${spoken}.`;
}

/**
 * Soften leftover tech-plan sentence wrappers without touching code-looking lines.
 */
export function strip_tech_plan_voice(text: string): { text: string; hit: boolean }
{
    const lines = text.split("\n");
    let hit = false;
    const out = lines.map((line) =>
    {
        const trimmed = line.trim();
        if (!trimmed)
        {
            return line;
        }

        // Leave indented / code-ish lines alone.
        if (/^(for |if |return |while |factors\s*=|\/\/|#|\*|\{|\}|\()/i.test(trimmed)
            || /^[a-z_]+\s*=/.test(trimmed)
            || /^\s{2,}/.test(line))
        {
            return line;
        }

        let next = line
            .replace(/\bThis (?:approach|method|algorithm) (?:works by|operates by)\b/gi, "It works by")
            .replace(/\bThe (?:primary|main) advantage of this (?:approach|method) is\b/gi, "The good part is")
            .replace(/\bThe (?:primary|main) disadvantage of this (?:approach|method) is\b/gi, "The bad part is")
            .replace(/\bIt is recommended (?:that|to)\b/gi, "You should")
            .replace(/\bOne should\b/gi, "You should")
            .replace(/\bA key consideration is that\b/gi, "")
            .replace(/\bFrom a performance perspective,?\s*/gi, "")
            .replace(/\bFrom a memory perspective,?\s*/gi, "")
            .replace(/\bIn practical terms,?\s*/gi, "")
            .replace(/\bIn practice,?\s*/gi, "");

        if (next !== line)
        {
            hit = true;
        }
        return next;
    });

    return { text: out.join("\n"), hit };
}

const chat_link_line = /^\s*!?\[[^\]\n]*\]\((?:https?:\/\/images\.openai\.com\/[^)\s]*|https?:\/\/www\.google\.com\/s2\/favicons[^)\s]*|[^)\s]*utm_source=chatgpt\.com[^)\s]*)\)\s*$/i;

/**
 * Leftovers from the model itself: Gemma's thinking-channel tags, <think> blocks, chat tokens,
 * and "---ROUGH---" style markers. Notes after a closing marker are the model talking to itself (Qwen3), so they go too.
 */
export function strip_model_leaks(text: string): { text: string; hit: boolean }
{
    let out = text
        .replace(/<think>[\s\S]*?<\/think>\s*/gi, "")
        .replace(/<\|channel>[\s\S]*?<channel\|>\s*/g, "")
        .replace(/<\|(?:im_start|im_end|end|eot_id|start_header_id|end_header_id)\|>/g, "");

    const parts = out.split(/^[ \t]*-{2,}[ \t]*(?:ROUGH(?:ENED)?|DRAFT|END|REWRITE|OUTPUT)[ \t]*-{2,}[ \t]*$/im);
    if (parts.length > 1)
    {
        out = parts[0].trim() ? parts[0] : parts[1];
    }

    out = out.trim();
    return { text: out, hit: out !== text.trim() };
}

/** Models mix curly and straight apostrophes in one answer ("He’s" next to "it's"); people type one kind. Mixed -> straight. */
export function even_out_quotes(text: string): { text: string; hit: boolean }
{
    if (!/[’‘“”]/.test(text) || !/['"]/.test(text))
    {
        return { text, hit: false };
    }
    const out = text.replace(/[’‘]/g, "'").replace(/[“”]/g, "\"");
    return { text: out, hit: out !== text };
}

/**
 * Pasted ChatGPT answers carry its web-search leftovers: image cards from images.openai.com and
 * source links tagged utm_source=chatgpt.com. Drop those lines and the tag; other links stay.
 */
export function strip_chat_paste_junk(text: string): { text: string; hit: boolean }
{
    const before = text;
    let out = text
        .split("\n")
        .filter((line) => !chat_link_line.test(line))
        .join("\n");

    // Inline citation chips: "([site.com](https://...utm_source=chatgpt.com))"
    out = out.replace(/\s*\(\[[^\]\n]*\]\([^)\s]*utm_source=chatgpt\.com[^)\s]*\)\)/gi, "");
    // The tag itself on any link that's left, "?utm_source=..." or "&utm_source=..." (also "\&")
    out = out.replace(/\\?&utm_source=chatgpt\.com/gi, "");
    out = out.replace(/\?utm_source=chatgpt\.com(?:\\?&)?/gi, (m) => (m.endsWith("&") ? "?" : ""));
    // HTML space codes left by copy buttons
    out = out.replace(/&#x20;|&#32;|&nbsp;/gi, " ").replace(/[ \t]+$/gm, "");
    out = out.replace(/\n{3,}/g, "\n\n");

    return { text: out, hit: out !== before };
}

/**
 * Markdown headings ("# 1. What is an atom?") are the outline readers notice first.
 * Light keeps the words as a plain line; Medium and Heavy drop the heading line.
 * Runs before flatten_manual_to_talk, which would read "#" as a code comment.
 */
export function strip_markdown_headings(text: string, drop: boolean): { text: string; hit: boolean }
{
    let hit = false;
    const out: string[] = [];
    const lines = text.split("\n");
    for (let i = 0; i < lines.length; i++)
    {
        const line = lines[i];
        const m = line.match(/^\s{0,3}#{1,6}\s+(.*?)\s*#*\s*$/);
        if (!m)
        {
            // Medium/Heavy: a short title line with blank lines around it is a heading too.
            const standalone = (i === 0 || !lines[i - 1].trim()) && (i + 1 >= lines.length || !lines[i + 1].trim());
            const title = /^[A-Z0-9"][^.!?:;,]*$/.test(line.trim()) && line.trim().split(/\s+/).length <= 8;
            if (drop && i > 0 && standalone && title)
            {
                hit = true;
                continue;
            }
            out.push(line);
            continue;
        }
        hit = true;
        if (!drop)
        {
            out.push(m[1].replace(/^\d+[.)]\s+/, ""));
        }
    }
    return { text: out.join("\n").replace(/\n{3,}/g, "\n\n"), hit };
}

const list_item = /^\s*(?:[-*+•]|\d+[.)])\s+(.+)$/;

/**
 * Bullet and numbered lists of short items become plain sentences in one paragraph.
 * Long items (a paragraph each) stay as they are.
 */
export function flatten_short_lists(text: string): { text: string; hit: boolean }
{
    const lines = text.split("\n");
    const out: string[] = [];
    let hit = false;
    let i = 0;

    while (i < lines.length)
    {
        if (!list_item.test(lines[i]))
        {
            out.push(lines[i]);
            i += 1;
            continue;
        }

        const items: string[] = [];
        let j = i;
        while (j < lines.length)
        {
            const m = lines[j].match(list_item);
            if (m)
            {
                items.push(m[1].trim());
                j += 1;
                continue;
            }
            // Blank lines between items don't end the list.
            if (!lines[j].trim() && j + 1 < lines.length && list_item.test(lines[j + 1]))
            {
                j += 1;
                continue;
            }
            break;
        }

        const short = items.every((s) => s.split(/\s+/).length <= 25);
        if (items.length < 2 || !short)
        {
            out.push(...lines.slice(i, j));
            i = j;
            continue;
        }

        const sentences = items.map((s) =>
        {
            const t = s.charAt(0).toUpperCase() + s.slice(1);
            return /[.!?:;]$/.test(t) ? t.replace(/[:;]$/, ".") : `${t}.`;
        });
        out.push(sentences.join(" "));
        hit = true;
        i = j;
    }

    return { text: out.join("\n"), hit };
}

/**
 * "So ... So ... So ..." and "Also ... Also ..." openers read like hidden section headings.
 * Keep the first few, then drop the marker word (the sentence itself stays).
 */
export function limit_repeated_openers(text: string, keep: number): { text: string; hit: boolean }
{
    const before = text;
    let so_seen = 0;
    let out = text.replace(/(^|[.!?]\s+|\n)(?:Okay,?\s+)?So,?\s+(?=[A-Za-z])/g, (m, lead: string) =>
    {
        so_seen += 1;
        return so_seen <= keep ? m : lead;
    });

    // Two "Also," sentences in a row: the second becomes "And".
    out = out.replace(/(\bAlso, [^.!?\n]*[.!?]\s+)Also,\s+/g, "$1And ");

    return { text: out, hit: out !== before };
}

/**
 * Heavy only: delete warm-up and wrap-up sentences that carry no facts
 * ("This is actually one of the most fascinating things in physics...", "The thought I'd like you to take away").
 */
export function drop_warmup_and_wrapup(text: string): { text: string; hit: boolean }
{
    const before = text;
    const out = text
        .replace(/^This is (?:actually )?one of the most (?:fascinating|interesting|important|amazing) [^.:\n]*[:.]\s*/gim, "")
        .replace(/^(?:The (?:thought|one thing|big idea) I'd like you to take away|Here's the big picture|The bottom line)[:.]?\s*$/gim, "")
        .replace(/(?:^|\s)And (?:that's|this is) (?:one of )?the most (?:extraordinary|fascinating|amazing|remarkable|beautiful) [^.!\n]*[.!]/gim, "")
        .replace(/\n{3,}/g, "\n\n")
        .trim();

    return { text: out, hit: out !== before.trim() };
}

const paragraph_sizes = [3, 2, 4, 2, 3];

function is_one_liner(block: string): boolean
{
    const t = block.trim();
    // Must end like a sentence: a bare title line ("The Garden Survey Results") is never joined.
    return !t.includes("\n")
        && t.length < 240
        && /[.!?:]["')]?$/.test(t)
        && !list_item.test(t)
        && (t.match(/[.!?]+(?:\s|$)/g) || []).length <= 1;
}

/**
 * ChatGPT puts every sentence in its own paragraph. Join runs of one-sentence paragraphs
 * into paragraphs of different sizes. Only joins lines, never edits a sentence.
 */
export function merge_one_line_paragraphs(text: string): { text: string; hit: boolean }
{
    const blocks = text.split(/\n{2,}/);
    const out: string[] = [];
    let hit = false;
    let size_at = 0;
    let i = 0;

    while (i < blocks.length)
    {
        if (!is_one_liner(blocks[i]))
        {
            out.push(blocks[i]);
            i += 1;
            continue;
        }

        let j = i;
        while (j < blocks.length && is_one_liner(blocks[j]))
        {
            j += 1;
        }
        const run = blocks.slice(i, j).map((b) => b.trim());
        if (run.length < 2)
        {
            out.push(...run);
            i = j;
            continue;
        }

        const run_start = out.length;
        let group: string[] = [];
        let want = paragraph_sizes[size_at % paragraph_sizes.length];
        for (const line of run)
        {
            group.push(line);
            // A line ending in ":" always stays with the line after it.
            if (group.length >= want && !line.endsWith(":"))
            {
                out.push(group.join(" "));
                group = [];
                size_at += 1;
                want = paragraph_sizes[size_at % paragraph_sizes.length];
            }
        }
        if (group.length)
        {
            // One line left over joins the run's last paragraph instead of standing alone.
            if (group.length === 1 && out.length > run_start)
            {
                out[out.length - 1] += " " + group[0];
            }
            else
            {
                out.push(group.join(" "));
            }
        }
        hit = true;
        i = j;
    }

    // "For example:" at the end of a paragraph joins the paragraph it introduces.
    // Not when the next paragraph opens with its own "Label:" (that would read "setup: The Board: ...").
    const joined = out.join("\n\n").replace(/:\n\n(?=[A-Z])(?![^.:\n]{0,50}:)/g, ": ");
    return { text: joined, hit: hit || joined !== text };
}

/**
 * Text copied out of a PDF breaks every line in the middle of a sentence. Join those lines back up,
 * or the casing tidy would capitalize each one. Short lines (code, lists, addresses) are left alone.
 */
export function unwrap_hard_wrapped_lines(text: string): { text: string; hit: boolean }
{
    const lines = text.split("\n");
    const out: string[] = [];
    let hit = false;

    for (const line of lines)
    {
        const prev = out.length ? out[out.length - 1] : "";
        if (prev.length >= 50 && !/[.!?:]["')]?\s*$/.test(prev) && /^[a-z(]/.test(line))
        {
            out[out.length - 1] = prev.replace(/\s+$/, "") + " " + line;
            hit = true;
            continue;
        }
        out.push(line);
    }

    return { text: out.join("\n"), hit };
}

/** Medium/Heavy: long bullet items (a paragraph each) lose the bullet and become plain paragraphs. */
export function unbullet_long_items(text: string): { text: string; hit: boolean }
{
    let hit = false;
    const out = text.split("\n").map((line) =>
    {
        const m = line.match(/^\s*(?:[-*+•]|\d+[.)])\s+(.+)$/);
        if (m && m[1].split(/\s+/).length > 25)
        {
            hit = true;
            return "\n" + m[1].trim() + "\n";
        }
        return line;
    });
    return { text: out.join("\n").replace(/\n{3,}/g, "\n\n"), hit };
}
