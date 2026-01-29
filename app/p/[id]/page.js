async function getPaste(id) {
  const res = await fetch(
    `${process.env.NEXT_PUBLIC_BASE_URL}/api/pastes/${id}`,
    { cache: "no-store" }
  );
  if (!res.ok) return null;
  return res.json();
}

export default async function PastePage({ params }) {
  const data = await getPaste(params.id);
  if (!data) return <h1>404 - Not Found</h1>;

  return <pre>{data.content}</pre>;
}
