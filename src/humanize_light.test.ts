import assert from "node:assert/strict";
import test from "node:test";
import { humanize } from "./humanize.js";

/** Light mode must not produce known nonsense collocations from stacked single-word swaps. */
const broken_collocation = /\buse fit\b|\bfit together\b|\bget more from of\b/i;

/** Grammar the swaps used to break: wrong article, lost verb endings, "work together between". */
const broken_grammar = /\ban (?=[bcdfgjklmnpqrstvwxyz])|\bplatform help\b|\bbuild collaboration remains\b|\bwork together between\b|\ball matters\b|\bleveraging\b/i;

const jargon_sentences: string[] =
[
    "Furthermore, it is important to note that we leverage synergies.",
    "We must leverage our core competencies to drive transformative outcomes.",
    "This robust solution offers seamless integration across the holistic ecosystem.",
    "In today's fast-paced digital world, we utilize cutting-edge technology.",
    "Moreover, it is worth noting that we should streamline our workflow.",
    "The team will spearhead an innovative paradigm shift this quarter.",
    "We need to harness synergies between sales and engineering.",
    "In conclusion, this comprehensive guide will delve into best practices.",
    "Our bespoke platform empowers users to unlock the potential of data.",
    "Ultimately, fostering collaboration remains paramount to success.",
    "Background apps and screen brightness all play a crucial role, so consider leveraging battery saver."
];

test("light humanize: eleven jargon sentences preserve meaning (no broken collocations)", async () =>
{
    const rows: Array<{ before: string; after: string }> = [];

    for (const before of jargon_sentences)
    {
        const result = await humanize({ text: before, intensity: "light", use_llm: false });
        rows.push({ before, after: result.output });
        assert.equal(result.used_llm, false);
        assert.doesNotMatch(
            result.output,
            broken_collocation,
            `broken collocation in output for: ${before}\n  -> ${result.output}`
        );
        assert.doesNotMatch(
            result.output,
            broken_grammar,
            `broken grammar in output for: ${before}\n  -> ${result.output}`
        );
    }

    // Anchor case from fresh-folder smoke test.
    const anchor = rows.find((r) => r.before.includes("leverage synergies"));
    assert.ok(anchor);
    assert.match(anchor.after, /work together/i);
    assert.doesNotMatch(anchor.after, /\buse fit\b/i);

    // Printed for COMPOSER_REPORTS paste (npm test captures stdout).
    console.log("\n--- light humanize: 11 jargon sentences (before -> after) ---");
    for (const row of rows)
    {
        console.log(`BEFORE: ${row.before}`);
        console.log(`AFTER:  ${row.after}`);
        console.log("");
    }
});
