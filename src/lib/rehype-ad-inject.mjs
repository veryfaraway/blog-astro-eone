/**
 * Injects one in-article ad unit near the middle of a post.
 *
 * PostLayout receives the body through a single <slot />, so the layout can only
 * reach the top and bottom of an article. Placing a unit mid-article from there
 * is impossible without editing every MDX file, hence this plugin.
 *
 * It emits the <ins> element only. The push() call lives in BaseLayout, because
 * a script node here would reach MDX as JSX and its braces would be read as an
 * expression.
 */

/** Posts shorter than this get the top and bottom units only. */
const MIN_TEXT_LENGTH = 1900;

/** Below this there is not enough structure to have a sensible middle. */
const MIN_HEADINGS = 3;

function textLength(node) {
  if (node.type === 'text') return node.value.length;
  if (!node.children) return 0;
  let total = 0;
  for (const child of node.children) total += textLength(child);
  return total;
}

function adNode(client, slot) {
  return {
    type: 'element',
    tagName: 'div',
    properties: { className: ['ad-slot', 'not-prose', 'my-8'] },
    children: [
      {
        type: 'element',
        tagName: 'ins',
        properties: {
          className: ['adsbygoogle'],
          style: 'display:block',
          dataAdClient: client,
          dataAdSlot: slot,
          dataAdFormat: 'fluid',
          dataAdLayout: 'in-article',
          dataFullWidthResponsive: 'true',
        },
        children: [],
      },
    ],
  };
}

export default function rehypeAdInject(options = {}) {
  const { client, slot } = options;

  // No credentials, no markup — same contract as AdSlot.astro.
  if (!client || !slot) return () => {};

  return (tree) => {
    const children = tree.children;
    if (textLength(tree) < MIN_TEXT_LENGTH) return;

    // A post that places <AdSlot /> by hand keeps control of its own body.
    const hasManualSlot = children.some(
      (node) => node.type === 'mdxJsxFlowElement' && node.name === 'AdSlot'
    );
    if (hasManualSlot) return;

    const headings = [];
    for (let i = 0; i < children.length; i++) {
      const node = children[i];
      if (node.type === 'element' && node.tagName === 'h2') headings.push(i);
    }
    if (headings.length < MIN_HEADINGS) return;

    // Insert before a heading rather than after one, so the unit lands on a
    // section break instead of splitting a heading from its first paragraph.
    // The first and last headings are skipped to keep it away from the top and
    // bottom units.
    const target = children.length / 2;
    let index = headings[1];
    for (const candidate of headings.slice(1, -1)) {
      if (Math.abs(candidate - target) < Math.abs(index - target)) index = candidate;
    }

    children.splice(index, 0, adNode(client, slot));
  };
}
