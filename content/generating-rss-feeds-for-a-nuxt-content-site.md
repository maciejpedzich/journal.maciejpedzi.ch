---
title: How to generate an RSS feed for a Nuxt Content site
category: tutorial
description: Learn how to write a server route for generating RSS feeds for your
  site powered by Nuxt Content v2
date: 2022-07-14T13:15:00.000Z
---
Welcome back! In this very first *proper* journal entry, I'll show you how to write a server route for generating an RSS feed for a blog powered by Nuxt 3 and Nuxt Content v2. Keep in mind that this article assumes prior knowledge of these two technologies, so I won't go into too much detail regarding some of their key concepts mentioned here. Without further ado, let's just jump into it!

## Installing dependencies and laying the foundation

Before we start writing actual code, let's install the [`feed`](https://www.npmjs.com/package/feed) module, which is (as you may have already guessed), an RSS feed generator for Node.js:

```shell
npm i feed
# OR:
yarn add feed
```

Once that's done, create a `server` directory in your Nuxt project's root. In that `server` folder, create another one called `routes` with an `rss.xml.ts` file inside. Open it with a code editor of your choice and begin by importing the feed module and `serverQueryContent` virtual module. Then define an event handler where you initialise the RSS feed generator and query for all the Nuxt Content documents, like so:

```typescript
import { Feed } from 'feed';
import { serverQueryContent } from '#content/server';

export default defineEventHandler(async (event) => {
  const blogUrl = 'https://www.example.com';
  const feed = new Feed({
    id: 'rss',
    title: 'Your Cool Blog',
    description: "RSS feed for Your Cool Blog",
    link: blogUrl,
    copyright: '2022-present Your Cool Blog'
  });
  const docs = await serverQueryContent(event).find();
});
```

> Great, so now we just have to loop through all the `docs` and add items to the feed generator, right?

Not so fast, because there's a *teeny-tiny* detail I'll have to explain to you before we move on to that part.

## Anatomy of a Nuxt Content post's `body`

In order for you to fully understand the rest of the article, we need to talk about the body structure of each piece of content returned via [query builders](https://content.nuxtjs.org/guide/displaying/querying). According to the [`markdown` configuration option](https://content.nuxtjs.org/api/configuration#markdown)'s description:

> This module uses [remark](https://github.com/remarkjs/remark) and [rehype](https://github.com/remarkjs/remark-rehype) under the hood to compile markdown files into JSON AST that will be stored into the body variable.

But what exactly is an *AST*? To give you a better idea, take a look at a sample from [my previous article](https://journal.maciejpedzi.ch/announcing-spotify-playlist-archive-website):

```json
{
  "type": "root",
  "children": [
    {
      "type": "element",
      "tag": "p",
      "props": {},
      "children": [
        {
          "type": "text",
          "value": "It feels amazing to be back (...)"
        },
        {
          "type": "element",
          "tag": "a",
          "props": {
            "href": "https://github.com/mackorone/spotify-playlist-archive",
            "rel": [
              "nofollow",
              "noopener",
              "noreferrer"
            ],
            "target": "_blank"
          },
          "children": [
            {
              "type": "text",
              "value": "spotify-playlist-archive"
            }
          ]
        }
      ]
    }
  ]
}
```

Notice a pattern here: each object consists of a `type` string, as well as (apart from root) a `tag` string, `props` object, and `children` array of objects with the same properties as the ones I've just described. Objects with `type` set to text are an exception to this rule, since they only consist of a `value` string.

This model seems oddly familiar, doesn't it? It's almost as if it were a representation of an HTML document **tree** in a *JS(ON)-friendly* friendly format, **abstracting away** syntactic details of the *source language*. This is known as an **A**bstract **S**yntax **T**ree. And in our case, we're talking a format very similar to [HAST](https://github.com/syntax-tree/hast), a standard for representing an HTML document as a unist [syntax tree](https://github.com/syntax-tree/unist).

## Converting `body` back to HTML

Equipped with fancy Computer Science knowledge, we can start working our way towards turning each post's body into valid HTML strings. Luckily for us, there's an [existing HAST to HTML converter](https://github.com/syntax-tree/hast-util-to-html) available on NPM, so we might as well add it to our Nuxt project:

```shell
npm i hast-util-to-html
# OR:
yarn add hast-util-to-html
```

But before we get down to using this package in our route, remember how I mentioned that Nuxt Content document's body format is very similar to that HAST standard? Bear in mind that **similar does not mean identical**, which becomes evident If you read HAST's `Element` node spec and compare it to the sample above.

You'll notice that Nuxt Content's counterparts don't have either the `properties` or `tagName` keys. They are, however, required in order for the converter to successfully output HTML. Therefore we have to *patch* root children node; and each root child's own children and so on until we reach a `text` node; to include these keys. So add the following snippet right below the `docs` declaration:

```typescript
for (const doc of docs) {
  const recursivelyPatchChildren = (node) => {
    if (node.type === 'text') return node;

    node.tagName = node.tag;
    node.properties = node.props;
    node.children = node.children.map(recursivelyPatchChildren);

    return node;
  };
}
```

## BONUS: patching syntax-highlighted code blocks

Feel free to skip this section if your articles don't include code snippets with syntax highlighting, but if they do, the  patch function modification I'll introduce is a must. This is due to the way these code snippets are structured within the tree. They're essentially `code` elements with `language` and `code` props specifying the programming language and block's content respectively.

> So... what's the problem?

For you see, each child is a span with a couple more child spans containing style `props` like this:

```json
{
  "props": {
    "style": {
      "color": "#XXXXXX"
    }
  }
}
```

And as it turns out, the HAST to HTML converter incorrectly grabs the entire object as the end-value of a `style` attribute, leaving us with **a lot** of `<span style="[object Object]">(...)</span>` elements. Furthermore, as [Alex Riviere](https://alex.party) pointed out in [Frontend Horse Discord](https://frontend.horse/chat), style attributes are not allowed in RSS feeds per [the W3C spec](https://validator.w3.org/feed/docs/warning/SecurityRiskAttr.html). So ideally we would want to end up with each code block being generated as something like:

```html
<code lang="identifier">ACTUAL CODE HERE</code>
```

Luckily for us, we don't have to traverse all these child nodes to obtain the original code snippet's content thanks to the aforementioned `code` prop of the container element, we just have to replace its children with a single text node with `value` set to that prop. So go ahead and replace the original `node.type === 'text'` check with the following:

```typescript
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

  delete node.props.language;
  delete node.props.code;
}
```

## Piecing everything together

Now we're good to import and use the HAST to HTML converter, but also add items to the RSS feed generator. So insert this little chunk of code right below the `recursivelyPatchChildren` function's definition. Note that I've only included [Nuxt Content's native frontmatter parameters](https://content.nuxtjs.org/guide/writing/markdown#native-parameters) (and some other *built-in* content document properties), but if you want to include custom ones in each item, refer to feed package's documentation.

```typescript
doc.body.children = doc.body.children.map(recursivelyPatchChildren);
const content = toHtml(doc.body);

feed.addItem({
  id: doc._id,
  title: doc.title,
  description: doc.description,
  link: new URL(doc._path, blogUrl).href,
  content
});
```

And finally, place this outside the for loop:

```typescript
 appendHeader(event, 'Content-Type', 'application/xml');
 return feed.rss2();
 // Optionally: return feed.atom1();
```

As a bonus, you can prerender this route by adding the following to `nuxt.config.ts`:

```typescript
import { defineNuxtConfig } from 'nuxt';

export default defineNuxtConfig({
  nitro: {
    prerender: {
      routes: ['/rss.xml']
    }
  }
});
```

## *That's all, folks!*

Thank you so much for reading this article! I hope you found it helpful, and if you ran into any issues, [ping me on Twitter](https://twitter.com/MaciejPedzich), or [send me an email](mailto:contact@maciejpedzi.ch). Take care!