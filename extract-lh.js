const fs=require('fs');
const d=JSON.parse(fs.readFileSync('lighthose-exp.json','utf8'));
const audits=d.audits;

console.log('=== FAILING AUDITS ===');
const failures=Object.entries(audits).filter(e=>e[1].score<1&&e[1].score!==null);
failures.forEach(([k,v])=>console.log('- '+k+': '+v.title));

console.log('\n=== UNUSED JAVASCRIPT ===');
audits['unused-javascript']?.details?.items?.slice(0,8).forEach(i=>console.log('- '+(i.url||i.text).substring(0,80)+' - '+Math.round(i.wastedBytes/1024)+'KB'));

console.log('\n=== RENDER-BLOCKING RESOURCES ===');
audits['render-blocking-resources']?.details?.items?.forEach(i=>console.log('- '+i.url?.substring(0,80)));

console.log('\n=== LARGE IMAGES ===');
audits['modern-image-formats']?.details?.items?.slice(0,5).forEach(i=>console.log('- '+i.url?.substring(0,80)+' wasted: '+Math.round(i.wastedBytes/1024)+'KB'));

console.log('\n=== OPPORTUNITIES ===');
console.log(' Largest Contentful Paint:', audits['largest-contentful-paint'].displayValue);
console.log(' Speed Index:', audits['speed-index'].displayValue);
console.log(' Reduce unused JS:', audits['unused-javascript'].displayValue);
console.log(' Enable text compression:', audits['text-compression'].displayValue);
