const fs = require('fs');
const path = require('path');
const text = fs.readFileSync(path.join(__dirname, '..', 'lead.txt'), 'utf8');
const lines = text.trim().split(/\r?\n/).slice(1);
const areaToId = {
  '운명의 핵심 기질': 'overall',
  '사랑 / 연애의 흐름': 'love',
  '인생의 큰 전환점': 'career',
  '사람을 끌어당기는 기운': 'attract',
  '당신이 강해지는 순간': 'strength',
  '당신에게 맞는 길': 'path',
  '숨겨진 재능의 방향': 'talent',
  '돈의 흐름 패턴': 'money',
  '인간관계의 특징': 'relation',
  '앞으로의 흐름': 'future'
};
const map = {};
for (const line of lines) {
  const i = line.indexOf(',');
  const j = line.indexOf(',', i + 1);
  const area = line.slice(0, i).trim();
  const msg = line.slice(j + 1).trim();
  const id = areaToId[area];
  if (!id) continue;
  if (!map[id]) map[id] = [];
  map[id].push(msg);
}
const ids = ['overall', 'love', 'career', 'attract', 'strength', 'path', 'talent', 'money', 'relation', 'future'];
let out = 'export const LEAD_MESSAGES: Record<string, string[]> = {\n';
for (const id of ids) {
  out += '  ' + id + ': [\n';
  for (const m of map[id] || []) {
    const escaped = m.replace(/\\/g, '\\\\').replace(/"/g, '\\"');
    out += '    "' + escaped + '",\n';
  }
  out += '  ],\n';
}
out += '};\n';
fs.writeFileSync(path.join(__dirname, '..', 'lib', 'leadMessages_new.ts'), out);
console.log('Done. Wrote lib/leadMessages_new.ts');
