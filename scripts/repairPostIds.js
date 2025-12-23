import { postStore } from '../app/api/data';

async function main() {
  const repaired = await postStore.repairAllPostIds();
  console.log('已修复文章ID：', repaired.map(p => ({ id: p.id, title: p.title })));
}

main();