import React from "react";
import TagComponent from "src/components/Tag";
import { allTags, Tag } from "src/lib/tags";

export default function TagPage({ tags }: { tags: Tag[] }) {
  return (
    <div className="flex flex-wrap gap-4 text-lg">
      {tags.map((tag) => (
        <TagComponent key={tag.name} text={tag.name} count={tag.count} />
      ))}
    </div>
  );
}

export async function getStaticProps() {
  const tags = allTags().sort((a, b) => b.count - a.count);
  return {
    props: {
      tags,
    },
  };
}
