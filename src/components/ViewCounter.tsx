import { useEffect } from "react";
import fetcher from "src/lib/fetcher";
import { Views } from "src/lib/types";
import useSWR from "swr";

export default function ViewCounter({
  slug,
  update = false,
}: {
  slug: string;
  update?: boolean;
}) {
  const { data } = useSWR<Views>(`/api/views/${slug}`, fetcher);
  const views = new Number(data?.total);

  useEffect(() => {
    if (update)
      fetch(`/api/views/${slug}`, {
        method: "POST",
      });
  }, [slug, update]);

  return <span>{`${views > 0 ? views.toLocaleString() : "–––"} views`}</span>;
}
