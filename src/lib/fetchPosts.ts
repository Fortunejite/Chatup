interface req{
  posts: Post[],
  authors: {[id: string]: Author}
}

export async function fetchPosts(skip = 0, limit = 10) {
  const params = new URLSearchParams();
  params.set('skip', skip.toString());
  params.set('limit', limit.toString());
  const res = await fetch(`/api/post?${params.toString()}`);
  const { posts }: {posts: Post[]}= await res.json();

  return {posts};
}

// export async function fetchAuthor(id: string) {
//   const params = new URLSearchParams();
//   params.set('id', id);
//   const res = await fetch(`/api/post/author?${params.toString()}`);
//   return author;
// }

export async function fetchUserPosts(skip = 0, limit = 10, route='') {
  const params = new URLSearchParams();
  params.set('skip', skip.toString());
  params.set('limit', limit.toString());
  const res = await fetch(`${route}?${params.toString()}`);
  const { data } = await res.json() as {data: Post[]};
  data.forEach((data)=>{
    data.date = new Date(data.date)
  })
  return {data};
}