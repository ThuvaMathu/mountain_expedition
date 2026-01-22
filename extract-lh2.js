const fs=require('fs');
const d=JSON.parse(fs.readFileSync('lighthose-exp.json','utf8'));
const audits=d.audits;

console.log('=== ACCESSIBILITY ISSUES ===');
console.log('Contrast issues:', audits['color-contrast'].details?.items?.length||0);
audits['color-contrast']?.details?.items?.slice(0,3).forEach(i=>console.log(' - '+i.node?.selector));

console.log('\n=== TARGET SIZE ISSUES ===');
console.log('Small targets:', audits['target-size']?.details?.items?.length||0);
audits['target-size']?.details?.items?.slice(0,3).forEach(i=>console.log(' - '+i.node?.selector?.substring(0,60)));

console.log('\n=== BUTTON/NAME ISSUES ===');
console.log('Button name issues:', audits['button-name']?.details?.items?.length||0);
audits['button-name']?.details?.items?.slice(0,3).forEach(i=>console.log(' - '+i.node?.selector?.substring(0,60)));

console.log('\n=== SEO ISSUES ===');
console.log('Is crawlable:', audits['is-crawlable'].score);
console.log('Link text issues:', audits['link-name']?.details?.items?.length||0);
audits['link-name']?.details?.items?.slice(0,3).forEach(i=>console.log(' - '+i.node?.selector?.substring(0,60)));

console.log('\n=== IMAGE ISSUES ===');
console.log('Image delivery issues:', audits['image-delivery-insight']?.details?.items?.length||0);
audits['image-delivery-insight']?.details?.items?.slice(0,5).forEach(i=>console.log(' - '+i.url?.substring(0,60)+' wasted: '+Math.round((i.wastedMs||0)/1000)+'s'));

console.log('\n=== TOTAL BYTE WEIGHT ===');
console.log('Total weight:', audits['total-byte-weight'].displayValue);
console.log('Budget: Good < 1.6MB, Needs Improvement < 3.5MB');

console.log('\n=== FORCED REFLOW ===');
console.log('Forced reflow count:', audits['forced-reflow-insight']?.details?.items?.length||0);
audits['forced-reflow-insight']?.details?.items?.slice(0,3).forEach(i=>console.log(' - '+i.stackTrace||i.value));
