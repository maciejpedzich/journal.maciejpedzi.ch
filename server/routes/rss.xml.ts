import { toHtml } from 'hast-util-to-html';
import { Feed } from 'feed';
import { serverQueryContent } from '#content/server';

export default defineEventHandler(async (event) => {
  // Obtain all docs and init RSS feed creator

  const docs = await serverQueryContent(event).find();
  const currentYear = new Date().getFullYear();
  const feed = new Feed({
    id: 'rss',
    title: "Mac's Journal - RSS feed",
    description: "RSS feed for the latest Mac's journal articles",
    link: 'https://journal.maciejpedzi.ch',
    copyright: `${currentYear} Maciej Pedzich`
  });

  for (const doc of docs) {
    // Make sure to patch all child nodes to match the HAST model
    // Reference: https://github.com/syntax-tree/hast
    const recursivelyPatchChildren = (node) => {
      if (!node.children) return node;

      // Don't delete "old keys", because some element parsers may use them
      node.tagName = node.tag;
      node.properties = node.props;
      node.children = node.children.map(recursivelyPatchChildren);
      return node;
    };

    doc.body.children = doc.body.children.map(recursivelyPatchChildren);
    const content = toHtml(doc.body);

    feed.addItem({
      id: doc._id,
      title: doc.title,
      description: doc.description,
      date: new Date(doc.date_published),
      link: new URL(doc._path, 'https://journal.maciejpedzi.ch').href,
      content
    });
  }

  appendHeader(event, 'Content-Type', 'application/xml');

  // Optionally:
  // return feed.atom1();
  return feed.rss2();
});
