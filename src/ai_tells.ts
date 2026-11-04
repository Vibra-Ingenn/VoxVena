// Phrases and patterns that commonly mark machine-written prose.

export type Replacement =
{
    pattern: RegExp;
    replace_with: string | ((match: string, ...groups: string[]) => string);
    label: string;
};

// [plain, -s, -ed, -ing]
type Verb_forms = [string, string, string, string];

function pick_form(forms: Verb_forms, ending?: string): string
{
    const e = (ending || "").toLowerCase();
    if (e === "ing") return forms[3];
    if (e === "ed" || e === "d") return forms[2];
    if (e === "s" || e === "es") return forms[1];
    return forms[0];
}

// A verb swap that keeps the tense: "fostering" -> "building", "empowers" -> "helps".
export function verb(stem: string, endings: string, forms: Verb_forms, label: string, tail = "", tail_out = ""): Replacement
{
    return {
        pattern: new RegExp(`\\b${stem}(${endings})?${tail}\\b`, "gi"),
        replace_with: (_m: string, ending?: string) => pick_form(forms, ending) + tail_out,
        label
    };
}

export const phrase_replacements: Replacement[] =
[
    // Multi-word phrases first (avoid single-word swaps that change meaning).
    { pattern: /\b(?:leverage|harness|create|unlock) (?:the )?synerg(?:y|ies) between (.+?) and (\w+(?: \w+)?)/gi, replace_with: "get $1 and $2 working together", label: "synergies between" },
    { pattern: /\bleverage synerg(?:y|ies)\b/gi, replace_with: "work together", label: "leverage synergies" },
    { pattern: /\bharness synerg(?:y|ies)\b/gi, replace_with: "work together", label: "harness synergies" },
    verb("unlock", "s|ed|ing", ["get", "gets", "got", "getting"], "unlock the potential of", " the potential of", " more from"),
    { pattern: /\bcreate synerg(?:y|ies)\b/gi, replace_with: "work together", label: "create synergy" },
    { pattern: /\bunlock synerg(?:y|ies)\b/gi, replace_with: "work better together", label: "unlock synergy" },
    // AI vocabulary & buzzwords
    { pattern: /\bdelve(?:s|d)? into\b/gi, replace_with: "look at", label: "delve into" },
    { pattern: /\bdelve(?:s|d)?\b/gi, replace_with: "dig", label: "delve" },
    { pattern: /\btapestry of\b/gi, replace_with: "mix of", label: "tapestry of" },
    { pattern: /\bIn today's (?:fast-paced |ever-changing |rapidly evolving )*(?:digital |modern |tech )?(?:world|landscape|age|era|environment),\s*/gi, replace_with: "", label: "in today's fast-paced world" },
    { pattern: /\blandscape of\b/gi, replace_with: "world of", label: "landscape of" },
    { pattern: /\brealm of\b/gi, replace_with: "area of", label: "realm of" },
    { pattern: /\bunderscores?\b/gi, replace_with: "shows", label: "underscores" },
    { pattern: /\bshowcases?\b/gi, replace_with: "shows", label: "showcases" },
    verb("leverag", "es|ed|ing|e", ["use", "uses", "used", "using"], "leverage"),
    { pattern: /\butilize(?:s|d)?\b/gi, replace_with: "use", label: "utilize" },
    { pattern: /\butilization\b/gi, replace_with: "use", label: "utilization" },
    { pattern: /\brobust\b/gi, replace_with: "solid", label: "robust" },
    { pattern: /\bseamless(?:ly)?\b/gi, replace_with: "smooth", label: "seamless" },
    { pattern: /\bcutting-edge\b/gi, replace_with: "new", label: "cutting-edge" },
    { pattern: /\bstate-of-the-art\b/gi, replace_with: "current", label: "state-of-the-art" },
    { pattern: /\bgroundbreaking\b/gi, replace_with: "big", label: "groundbreaking" },
    { pattern: /\binnovative\b/gi, replace_with: "new", label: "innovative" },
    { pattern: /\brevolutionary\b/gi, replace_with: "major", label: "revolutionary" },
    { pattern: /\bparadigm shift\b/gi, replace_with: "big change", label: "paradigm shift" },
    { pattern: /\bin today's (?:fast-paced|digital) world\b/gi, replace_with: "these days", label: "in today's world" },
    { pattern: /\bin conclusion,?\s*/gi, replace_with: "", label: "in conclusion" },
    { pattern: /\bto summarize,?\s*/gi, replace_with: "", label: "to summarize" },
    { pattern: /\bin summary,?\s*/gi, replace_with: "", label: "in summary" },
    { pattern: /\bin essence,?\s*/gi, replace_with: "basically, ", label: "in essence" },
    { pattern: /\bultimately,?\s*/gi, replace_with: "in the end, ", label: "ultimately" },
    { pattern: /\bit is (?:important|worth) (?:to note|noting) that\b/gi, replace_with: "", label: "it is important to note" },
    { pattern: /\bit'?s (?:important|worth) (?:to note|noting) that\b/gi, replace_with: "", label: "it's important to note" },
    { pattern: /\bnotably,?\s*/gi, replace_with: "", label: "notably" },
    { pattern: /\bimportantly,?\s*/gi, replace_with: "", label: "importantly" },
    { pattern: /\binterestingly,?\s*/gi, replace_with: "", label: "interestingly" },
    { pattern: /\bfurthermore,?\s*/gi, replace_with: "Also, ", label: "furthermore" },
    { pattern: /\bmoreover,?\s*/gi, replace_with: "Also, ", label: "moreover" },
    { pattern: /\badditionally,?\s*/gi, replace_with: "Also, ", label: "additionally" },
    { pattern: /\bhowever,?\s*/gi, replace_with: "But ", label: "however" },
    { pattern: /\btherefore,?\s*/gi, replace_with: "So ", label: "therefore" },
    { pattern: /\bthus,?\s*/gi, replace_with: "So ", label: "thus" },
    { pattern: /\bhence,?\s*/gi, replace_with: "So ", label: "hence" },
    { pattern: /\boverall,?\s*/gi, replace_with: "", label: "overall" },
    { pattern: /\bat the end of the day,?\s*/gi, replace_with: "", label: "at the end of the day" },
    { pattern: /\ba myriad of\b/gi, replace_with: "many", label: "a myriad of" },
    { pattern: /\bplethora of\b/gi, replace_with: "lot of", label: "plethora of" },
    { pattern: /\bbespoke\b/gi, replace_with: "custom", label: "bespoke" },
    verb("empower", "s|ed|ing", ["help", "helps", "helped", "helping"], "empower"),
    { pattern: /\bunlock(?:s|ed|ing)? (?:the )?(?:potential|power|value)\b/gi, replace_with: "get more from", label: "unlock potential" },
    { pattern: /\bnavigat(?:e|es|ing) the\b/gi, replace_with: "deal with the", label: "navigate the" },
    verb("play", "s|ed", ["matter", "matters", "mattered", "mattering"], "plays a crucial role", " an? (?:crucial|critical|vital|key|pivotal|important) role"),
    { pattern: /\bin the world of\b/gi, replace_with: "in", label: "in the world of" },
    { pattern: /\blet'?s dive in\.?\s*/gi, replace_with: "", label: "let's dive in" },
    { pattern: /\blet'?s explore\b/gi, replace_with: "here's", label: "let's explore" },
    { pattern: /\bthis comprehensive guide\b/gi, replace_with: "this guide", label: "comprehensive guide" },
    { pattern: /\bgame-?changer\b/gi, replace_with: "big deal", label: "game-changer" },
    { pattern: /\bholistic\b/gi, replace_with: "full", label: "holistic" },
    { pattern: /\btransformative\b/gi, replace_with: "useful", label: "transformative" },
    { pattern: /\brevolutioniz(?:e|es|ed|ing)\b/gi, replace_with: "change", label: "revolutionize" },
    { pattern: /\bnot only ([^,]+), but also\b/gi, replace_with: "$1, and also", label: "not only...but also" },
    { pattern: /\bIn today'?s digital age,?\s*/gi, replace_with: "", label: "digital age opener" },
    { pattern: /\bAs an AI(?: language model)?[,.]?\s*/gi, replace_with: "", label: "as an AI" },
    { pattern: /\bI hope this helps!?\.?\s*/gi, replace_with: "", label: "I hope this helps" },
    { pattern: /\bFeel free to (?:ask|reach out).*?[.!]?\s*/gi, replace_with: "", label: "feel free to ask" },
    { pattern: /\bhands down\b/gi, replace_with: "by far", label: "hands down" },
    { pattern: /\bTime complexity:\s*/gi, replace_with: "Time: ", label: "time complexity label" },
    { pattern: /\bSpace complexity:\s*/gi, replace_with: "Space: ", label: "space complexity label" },
    { pattern: /\bwhich means\b/gi, replace_with: "so", label: "which means" },
    { pattern: /\bIn other words,?\s*/gi, replace_with: "", label: "in other words" },
    { pattern: /\bThis is like doing all the work[^.]+\.\s*/gi, replace_with: "", label: "this is like doing all the work" },
    { pattern: /\bOn the other hand,?\s*/gi, replace_with: "", label: "on the other hand" },
    { pattern: /\bSo let's break down\b/gi, replace_with: "Breakdown:", label: "so let's break down" },
    { pattern: /\bHere's how (?:it|they|the three functions?) works?:?\s*/gi, replace_with: "", label: "here's how it works" },
    { pattern: /\bAs for (?:space|time),?\s*/gi, replace_with: "", label: "as for space/time" },
    { pattern: /\ba huge time saver\b/gi, replace_with: "faster", label: "huge time saver" },
    { pattern: /\bThis is the textbook correct way to do it\.?\s*/gi, replace_with: "", label: "textbook correct" },
    { pattern: /\btestament to\b/gi, replace_with: "proof of", label: "testament to" },
    { pattern: /\bbeacon of\b/gi, replace_with: "model for", label: "beacon of" },
    { pattern: /\bcornerstone\b/gi, replace_with: "core part", label: "cornerstone" },
    { pattern: /\bparamount\b/gi, replace_with: "key", label: "paramount" },
    verb("foster", "s|ed|ing", ["build", "builds", "built", "building"], "foster"),
    verb("spearhead", "s|ed|ing", ["lead", "leads", "led", "leading"], "spearhead"),
    verb("harness", "es|ed|ing", ["use", "uses", "used", "using"], "harness"),
    { pattern: /\bshed light on\b/gi, replace_with: "explain", label: "shed light on" },
    { pattern: /\bdive deeper into\b/gi, replace_with: "look closer at", label: "dive deeper into" },
    { pattern: /\bembark on\b/gi, replace_with: "start", label: "embark on" },
    { pattern: /\bever-evolving\b/gi, replace_with: "changing", label: "ever-evolving" },
    { pattern: /\bstaggering\b/gi, replace_with: "huge", label: "staggering" },
    { pattern: /\bimperative\b/gi, replace_with: "needed", label: "imperative" },
    verb("streamlin", "es|ed|ing|e", ["simplify", "simplifies", "simplified", "simplifying"], "streamline"),
    verb("unleash", "es|ed|ing", ["free", "frees", "freed", "freeing"], "unleash"),
    verb("elevat", "es|ed|ing|e", ["boost", "boosts", "boosted", "boosting"], "elevate"),
    { pattern: /\binterplay\b/gi, replace_with: "mix", label: "interplay" },
    { pattern: /\bmultifaceted\b/gi, replace_with: "complex", label: "multifaceted" },
    { pattern: /\bunwavering\b/gi, replace_with: "strong", label: "unwavering" },
    { pattern: /\bdouble-edged sword\b/gi, replace_with: "tradeoff", label: "double-edged sword" },
    { pattern: /\bat its core,?\s*/gi, replace_with: "basically, ", label: "at its core" },
    { pattern: /\btakes center stage\b/gi, replace_with: "matters most", label: "takes center stage" },
    { pattern: /\bserves as a\b/gi, replace_with: "is a", label: "serves as a" },
    { pattern: /\bacts as a\b/gi, replace_with: "is a", label: "acts as a" },
    { pattern: /\bas mentioned (?:earlier|above)\b/gi, replace_with: "", label: "as mentioned earlier" },
    { pattern: /\bit goes without saying that\b/gi, replace_with: "", label: "it goes without saying" },
    { pattern: /\bthat being said,?\s*/gi, replace_with: "Still, ", label: "that being said" },
    { pattern: /\bconversely,?\s*/gi, replace_with: "On the flip side, ", label: "conversely" }
];

// Chatbot habits people spot first in pasted AI answers (from our test rounds, 2026-11):
// "let me break it down" pivots, references to a chat the reader never saw, and "want to know more?" sign-offs.
// Each one deletes a whole lead-in or sentence, so grammar stays intact.
export const chat_leftovers: Replacement[] =
[
    // Assistant openers
    { pattern: /^(?:Absolutely|Certainly|Sure|Of course|Great question)[!.,]\s*/gim, replace_with: "", label: "assistant opener" },
    { pattern: /^So,? you (?:want|wanna) (?:me to )?[^.?!\n]*[.?]\s*(?:I can (?:do that|help with that)[.!]\s*)?/gim, replace_with: "", label: "so you want me to" },
    { pattern: /^(?:So,? )?(?:you )?(?:wanna|want to) know (?:about )?[^?\n]+\?\s*/gim, replace_with: "", label: "question hook" },
    { pattern: /\bI can (?:do that|help with that)[.!]\s*/gi, replace_with: "", label: "I can do that" },

    // Stock pivots
    // Stops at ":" too, so "That sounds complicated, so think about it like this: <fact>." keeps the fact.
    { pattern: /\bThat (?:sounds|might sound|may sound) (?:complicated|confusing|abstract|technical|weird)[^.!?:\n]*[.!?:]\s*/gi, replace_with: "", label: "that sounds complicated" },
    { pattern: /\b(?:Yeah,?\s+)?(?:It |That )?sounds (?:technical|weird|complicated|confusing|crazy|strange)(?:, right)?\?\s*/gi, replace_with: "", label: "sounds weird, right?" },
    { pattern: /(?:Okay,?\s+)?(?:So,?\s+)?(?:let me|let's) (?:break (?:it|this) down|unpack (?:it|this))(?: (?:for you|simply|without the jargon|step by step|a bit))?(?:,[^.!?\n]*)?[.!:]\s*/gi, replace_with: "", label: "let me break it down" },
    { pattern: /\bHere's the (?:simplest|easiest|best) way to (?:understand|think about|picture|get|put) (?:it|this)[:.]\s*/gi, replace_with: "", label: "simplest way to understand it" },
    { pattern: /\bHere's the thing[:,]\s*/gi, replace_with: "", label: "here's the thing" },
    { pattern: /\bThe thing is,\s*/gi, replace_with: "", label: "the thing is" },
    { pattern: /\bThink about it this way[:.]\s*/gi, replace_with: "", label: "think about it this way" },
    { pattern: /\bThink about this for a moment[.:]\s*/gi, replace_with: "", label: "think about this for a moment" },
    { pattern: /\b(?:Now,?\s+)?(?:Here's|This is) where (?:things|it) gets? (?:really )?(?:interesting|weird|cool|wild|crazy)\s*[-–—.:!]\s*/gi, replace_with: "", label: "here's where it gets interesting" },
    { pattern: /\b(?:But )?here's the twist\s*[-–—.:]\s*/gi, replace_with: "", label: "here's the twist" },
    { pattern: /\bBut there's a twist[.:]\s*/gi, replace_with: "", label: "here's the twist" },
    // The "But" goes too: "But here's the key part:\n\nEmpty space..." would leave "But Empty space".
    { pattern: /\b(?:But |And )?here's the (?:key|important|crucial|big) (?:part|point|distinction|difference)\s*[:.]\s*/gi, replace_with: "", label: "here's the key part" },
    { pattern: /\bHere's the big picture(?: connecting back to [^:\n]+)?:\s*/gi, replace_with: "", label: "here's the big picture" },
    { pattern: /(?<![*\w])\*([^*\s](?:[^*\n]{0,38}[^*\s])?)\*(?![*\w])/g, replace_with: "$1", label: "markdown italics" },
    { pattern: /\bAnd get this\s*[-–—:,]\s*/gi, replace_with: "", label: "and get this" },
    { pattern: /\bOh,? and one more thing[:.]\s*/gi, replace_with: "", label: "one more thing" },
    { pattern: /\bThis is the (?:really )?interesting part[.:!]\s*/gi, replace_with: "", label: "the interesting part" },
    { pattern: /\b(?:And )?(?:that's|here's) the (?:really )?mind-blowing part[:.!]\s*/gi, replace_with: "", label: "mind-blowing part" },
    { pattern: /\bHere's what happens:\s*/gi, replace_with: "", label: "here's what happens" },
    { pattern: /\bSo the setup was this:\s*/gi, replace_with: "", label: "the setup was this" },
    { pattern: /\bNow let's take it one step further[.:]\s*/gi, replace_with: "", label: "one step further" },
    { pattern: /\bIn a very real sense,\s*/gi, replace_with: "", label: "in a very real sense" },
    { pattern: /\b(?:So,?\s+|And\s+)?(?:here's|Here's) the (?:deal|kicker)(?:\.{3}|[.:!,])?\s*/g, replace_with: "", label: "here's the kicker" },
    { pattern: /\bThe real kicker\?\s*/gi, replace_with: "", label: "the real kicker" },
    { pattern: /\s*\b(?:But )?(?:that's|that is) (?:a(?:nother)? story|a topic) for (?:later|another (?:day|time))[.!]/gi, replace_with: "", label: "another story for later" },

    // References to a conversation the reader never saw
    { pattern: /\b(?:So,?\s+)?(?:let's|let me) connect this (?:back )?to your (?:original )?question about ([^.!?\n]+)[.!]/gi, replace_with: "Back to $1.", label: "your original question" },
    { pattern: /\b(?:as|like) (?:I|we) (?:mentioned|said|discussed|covered) (?:earlier|before|above),?\s*/gi, replace_with: "", label: "as I mentioned" },
    { pattern: /\b(?:our|the|my) (?:earlier|previous) (?:discussion|conversation|answer) about\s+/gi, replace_with: "", label: "our earlier discussion" },

    // "Want to know more?" sign-offs
    { pattern: /(?:And )?if you(?:'d)? (?:want|like) to (?:explore|learn|dig|know|go)(?: into it)? (?:more|further|deeper)[^.!?\n]*[.!?]\s*/gi, replace_with: "", label: "if you want to explore more" },
    { pattern: /\bOne thing worth exploring next is[^.!?\n]*[.!?]\s*/gi, replace_with: "", label: "worth exploring next" },
    { pattern: /\bIf you're curious[^.!?\n]*that's where[^.!?\n]*[.!]\s*/gi, replace_with: "", label: "if you're curious" },
    { pattern: /\bThat's where [^.!?\n]{0,40}? gets? (?:really |even )?(?:fascinating|interesting|wild|weird|weirder)[.!]\s*/gi, replace_with: "", label: "where it gets fascinating" },
    { pattern: /\bSo,? here's how I'd sum(?:marize| it up| up)[^:.\n]*[:.]\s*/gi, replace_with: "", label: "here's how I'd summarize" },
    { pattern: /\bSo,? (?:these|those) are the (?:tools|options|ones) I(?:'ve| have) found[^.!?\n]*[.!]\s*/gi, replace_with: "", label: "the tools I've found" },
    { pattern: /\b(?:Let me know if|Would you like me to|Want me to|If you'd like, I can)[^.!?\n]*[.!?]\s*/gi, replace_with: "", label: "follow-up offer" }
];

export const structural_cleanup: Replacement[] =
[
    // Strip markdown bold list item headers: "- **Title:** text" -> "- Title: text" or plain talk
    { pattern: /^(?:\s*[-*+]|\d+\.)\s*\*\*([^*]+)\*\*:\s*/gim, replace_with: "$1: ", label: "bold list header" },
    // Collapse inline markdown bolding used excessively by AI
    { pattern: /\*\*([^*]+)\*\*/g, replace_with: "$1", label: "excess bold" },
    // Collapse AI-favorite em dash stacks into commas or periods where safe
    { pattern: /\s*—\s*/g, replace_with: ", ", label: "em dash" },
    // Too many exclamation points
    { pattern: /!{2,}/g, replace_with: "!", label: "extra bangs" },
    // Space before punctuation leftovers
    { pattern: /\s+([,.!?])/g, replace_with: "$1", label: "space before punct" },
    // Double spaces / messy whitespace
    { pattern: /[ \t]{2,}/g, replace_with: " ", label: "extra spaces" },
    // Empty "Also," lines after stripping
    { pattern: /(?:^|\n)\s*Also,\s*(?=\n|$)/g, replace_with: "\n", label: "orphan Also" },
    // Too many blank lines
    { pattern: /\n{3,}/g, replace_with: "\n\n", label: "blank lines" }
];
