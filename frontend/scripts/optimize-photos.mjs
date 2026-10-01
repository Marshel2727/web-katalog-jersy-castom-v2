import fs from 'node:fs';
import path from 'node:path';
import sharp from 'sharp';
const roots=['public/images/katalog','public/images/models'];
const files=roots.flatMap(root=>fs.readdirSync(root,{recursive:true}).filter(f=>/\.(jpg|png)$/i.test(f)).map(f=>path.join(root,f)));
files.push('public/images/bp-sport-emerald.jpg');
const manifest={};let original=0,small=0,large=0;
for(const file of files){const relative=file.replaceAll('\\','/').replace(/^public\//,'');const base='public/images/optimized/'+relative.replace(/^images\//,'').replace(/\.[^.]+$/,'');fs.mkdirSync(path.dirname(base),{recursive:true});const source=sharp(file).rotate();const sizes={};for(const [name,width] of [['small',700],['large',1200]]){const output=base+'-'+name+'.webp';await source.clone().resize({width,height:width,fit:'inside',withoutEnlargement:true}).webp({quality:78,effort:5}).toFile(output);sizes[name]='/'+output.replace(/^public\//,'');if(name==='small')small+=fs.statSync(output).size;else large+=fs.statSync(output).size;}const blur=await source.clone().resize(16,16,{fit:'inside'}).webp({quality:35}).toBuffer();manifest['/'+relative]={...sizes,blur:'data:image/webp;base64,'+blur.toString('base64')};original+=fs.statSync(file).size;}
fs.writeFileSync('src/data/optimized-images.json',JSON.stringify(manifest,null,2)+'\n');console.log({count:files.length,original,small,large});
