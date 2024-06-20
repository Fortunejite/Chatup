export async function fetchUsers(skip = 0, limit = 10, route='') {
  const params = new URLSearchParams();
  params.set('skip', skip.toString());
  params.set('limit', limit.toString());
  const res = await fetch(`${route}?${params.toString()}`);
  const { data } = await res.json() as {data: UserPlus[]};
  return {data};
}