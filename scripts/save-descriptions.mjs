import fs from 'node:fs';
const ids = [60,61,63,64,65,66,67,68,69,70,71,72,73,75,77,78,79,80,81,82,83,84,85,86,87,88,89,91,92,93,94,95,96,97,98,99,100,101,102];
const out = [];
for (const id of ids) {
  try {
    const h = await (await fetch('https://ram-haim.co.il/apartments/' + id)).text();
    const descs = [...h.matchAll(/\\"description\\":\\"([^"]{0,500})/g)].map((m) => m[1].replace(/\\\\n/g, ' ').replace(/\\\\/g, ''));
    const od = descs.find((d) => !d.includes('משרד תיווך')) || '';
    out.push('#' + id + ': ' + od.slice(0, 240).trim());
  } catch (e) { out.push('#' + id + ': ERR'); }
}
fs.writeFileSync('property-descriptions.txt', out.join('\n\n'), 'utf8');
console.log('Saved property-descriptions.txt — ' + out.length + ' items');
