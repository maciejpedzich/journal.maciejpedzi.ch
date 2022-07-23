import { toHtml } from 'hast-util-to-html';
import { Feed } from 'feed';
import { serverQueryContent } from '#content/server';

export default defineEventHandler(async (event) => {
  // Obtain all docs and init RSS feed creator

  const currentYear = new Date().getFullYear();
  const feed = new Feed({
    id: 'rss',
    title: "Mac's Journal - RSS feed",
    description: "RSS feed for the latest Mac's Journal articles",
    link: 'https://journal.maciejpedzi.ch',
    copyright: `${currentYear} Maciej Pedzich`
  });
  const docs = await serverQueryContent(event).sort({ date: -1 }).find();

  for (const doc of docs) {
    // Make sure to patch all child nodes to match the HAST spec
    // Reference: https://github.com/syntax-tree/hast
    const recursivelyPatchChildren = (node) => {
      if (node.type === 'text') {
        return node;
      } else if (node.tag === 'code' && node.props.language) {
        node.props.lang = node.props.language;
        node.children = [
          {
            type: 'text',
            value: node.props.code
          }
        ];

        // Prevent inclusion of redundant props
        delete node.props.language;
        delete node.props.code;
      }

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
      image: 'https://journal.maciejpedzi.ch/images/banner.png',
      description: doc.description,
      date: new Date(doc.date),
      link: new URL(doc._path, 'https://journal.maciejpedzi.ch').href,
      content
    });
  }

  appendHeader(event, 'Content-Type', 'application/xml');
  return feed.rss2();
  // Optionally:
  // return feed.atom1();
});
