import Image from "next/image";
import Head from "next/head";
import urlMetadata from "url-metadata";
import axios from "axios";
export default function Post({ post, meta }) {
  console.log(meta, "meta");

  return (
    <>
      <Head>
        <meta property="og:url" content="" />
        <link rel="canonical" href={meta.canonical} />
        <meta property="og:title" content={meta["og:title"]} />
        <meta property="og:image" content={meta["og:image"]} />
        <meta property="og:type" content="article" />
      </Head>
      <div style={{ padding: "2.5rem" }}>
        <h1>{post.title}</h1>
        <Image
          width="640"
          height="426"
          src={post.featuredImage.node.sourceUrl}
        />
        <article dangerouslySetInnerHTML={{ __html: post.content }}></article>
      </div>
    </>
  );
}

export async function getStaticProps(context) {
  const url = context.params.slug.join("/");
  const metadata = await urlMetadata(`https://amazing-watch.com/${url}`);
  const { data } = await axios({
    url: `https://amazing-watch.com/graphql`,
    method: "post",
    data: {
      query: `
      query SinglePost($id: ID!, $idType: PostIdType!) {
          post(id: $id, idType: $idType) {
              title
              slug
              content
              featuredImage {
                  node {
                      sourceUrl
                  }
              }
          }
      }
  `,
      variables: {
        id: url,
        idType: "SLUG",
      },
    },
  });

  return {
    props: {
      post: data.data.post,
      meta: metadata,
    },
  };
}

export async function getStaticPaths() {
  const { data } = await axios({
    url: `https://amazing-watch.com/graphql`,
    method: "post",
    data: {
      query: `
            query AllPostsQuery {
                posts {
                    nodes {
                        slug
                        content
                        title
                        date
                        featuredImage {
                            node {
                                sourceUrl
                            }
                        }
                    }
                }
            }
        `,
    },
  });

  const posts = data.data.posts.nodes;

  const paths = posts.map((post) => {
    let postDate = new Date(post.date);
    let formatedDate = postDate.toISOString().split("T")[0];
    let slug = formatedDate.split("-");
    slug.push(post.slug);
    return {
      params: {
        slug,
      },
    };
  });

  return { paths, fallback: false };
}
