import json,os,shutil
from pathlib import Path
from PIL import Image,ImageDraw,ImageFont
from docx import Document
from docx.shared import Cm,Pt,RGBColor
from docx.oxml import OxmlElement
from docx.oxml.ns import qn
from docx.enum.text import WD_ALIGN_PARAGRAPH
from docx.enum.section import WD_SECTION_START
from docx.enum.table import WD_TABLE_ALIGNMENT
ROOT=Path(os.environ.get('GUITARRA_WORKDIR',Path.cwd())).resolve();APP=ROOT/'sites' if (ROOT/'sites').is_dir() else ROOT;OUT=ROOT/'output';OUT.mkdir(exist_ok=True)
shots=Path(os.environ.get('GUITARRA_CAPTURES',APP/'docs/manual-source/captures'));assets=OUT/'assets';assets.mkdir(exist_ok=True)
# Exact app assets are composed only for document layout.
shutil.copy(APP/'public/branding/guitarra-pro-logo.png',assets/'logo.png')
cover=Image.new('RGB',(1240,1754),'#0F4F45');d=ImageDraw.Draw(cover)
font='/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf';bold='/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf'
logo=Image.open(assets/'logo.png').convert('RGBA');logo.thumbnail((700,180));d.rounded_rectangle((100,130,1140,340),radius=25,fill='white');cover.paste(logo,((1240-logo.width)//2,155),logo)
d.text((100,455),'MANUAL DE USO',font=ImageFont.truetype(bold,65),fill='white');d.text((100,560),'Guitarra PRO',font=ImageFont.truetype(font,43),fill='#BFDCD4')
guitar=Image.open(APP/'public/branding/acoustic-guitar-hero.webp').convert('RGBA');guitar.thumbnail((640,740));cover.paste(guitar,((1240-guitar.width)//2,670),guitar)
d.text((100,1510),'Versión 1.1 · Edición 8 de la aplicación',font=ImageFont.truetype(font,29),fill='white');d.text((100,1570),'11 de noviembre de 2026',font=ImageFont.truetype(font,29),fill='#BFDCD4');cover.save(assets/'cover.png')
D=Document();s=D.sections[0];s.page_width=Cm(21);s.page_height=Cm(29.7);s.top_margin=Cm(1.55);s.bottom_margin=Cm(1.5);s.left_margin=s.right_margin=Cm(1.6)
styles=D.styles
for n in ['Normal','Body Text','List Number','List Bullet']:
 styles[n].font.name='DejaVu Sans';styles[n].font.size=Pt(10)
 styles[n].paragraph_format.space_after=Pt(6);styles[n].paragraph_format.line_spacing=1.12
for n,size in [('Title',30),('Heading 1',20),('Heading 2',12)]:
 styles[n].font.name='DejaVu Sans';styles[n].font.size=Pt(size);styles[n].font.color.rgb=RGBColor.from_string('0F4F45');styles[n].paragraph_format.space_after=Pt(10)
styles['Heading 1'].paragraph_format.keep_with_next=True
styles['Caption'].font.size=Pt(8);styles['Caption'].font.color.rgb=RGBColor.from_string('52605E')
# A full-page first-page cover anchored behind text avoids extra blank pages.
p=D.add_paragraph();p.paragraph_format.space_after=Pt(0);run=p.add_run();pic=run.add_picture(str(assets/'cover.png'),width=Cm(21),height=Cm(29.7));inline=pic._inline
anchor=OxmlElement('wp:anchor')
for a,v in {'distT':'0','distB':'0','distL':'0','distR':'0','simplePos':'0','relativeHeight':'0','behindDoc':'1','locked':'0','layoutInCell':'1','allowOverlap':'1'}.items():anchor.set(a,v)
sp=OxmlElement('wp:simplePos');sp.set('x','0');sp.set('y','0');anchor.append(sp)
for axis in ['H','V']:
 pos=OxmlElement('wp:position'+axis);pos.set('relativeFrom','page');off=OxmlElement('wp:posOffset');off.text='0';pos.append(off);anchor.append(pos)
for tag in ['extent','effectExtent']:
 el=inline.find(qn('wp:'+tag))
 if el is not None:anchor.append(el)
anchor.append(OxmlElement('wp:wrapNone'))
for tag in ['docPr','cNvGraphicFramePr']:
 el=inline.find(qn('wp:'+tag))
 if el is not None:anchor.append(el)
anchor.append(inline.find(qn('a:graphic')));inline.getparent().replace(inline,anchor)
# Screen readers and Word outline retain a real title.
p=D.add_paragraph('MANUAL DE USO','Title');p.runs[0].font.hidden=True
footer=s.footer.paragraphs[0];footer.alignment=WD_ALIGN_PARAGRAPH.RIGHT;footer.add_run('Guitarra PRO · Manual 1.1   |   ').font.size=Pt(8)
f=OxmlElement('w:fldSimple');f.set(qn('w:instr'),'PAGE');footer._p.append(f)
s.different_first_page_header_footer=True
pages=json.loads((ROOT/'manual-content.json' if (ROOT/'manual-content.json').exists() else APP/'docs/manual-source/content.json').read_text())
D.add_page_break();D.add_heading('Índice de contenidos',0)
D.add_paragraph('Pulsa un capítulo para abrirlo. Las páginas están numeradas y los títulos aparecen también en los marcadores del PDF.')
def link(p,text,anchor=None,url=None):
 h=OxmlElement('w:hyperlink')
 if anchor:h.set(qn('w:anchor'),anchor)
 else:
  from docx.opc.constants import RELATIONSHIP_TYPE
  h.set(qn('r:id'),p.part.relate_to(url,RELATIONSHIP_TYPE.HYPERLINK,is_external=True))
 r=OxmlElement('w:r');pr=OxmlElement('w:rPr');c=OxmlElement('w:color');c.set(qn('w:val'),'187B68');pr.append(c);r.append(pr);t=OxmlElement('w:t');t.text=text;r.append(t);h.append(r);p._p.append(h)
for i,page in enumerate(pages):
 p=D.add_paragraph();p.paragraph_format.space_after=Pt(4);link(p,page['title']+'  ·  '+str(i+3),anchor='chapter_'+str(i+1))
for i,page in enumerate(pages):
 D.add_page_break();h=D.add_heading(page['title'],1);start=OxmlElement('w:bookmarkStart');start.set(qn('w:id'),str(i+1));start.set(qn('w:name'),'chapter_'+str(i+1));h._p.insert(0,start);end=OxmlElement('w:bookmarkEnd');end.set(qn('w:id'),str(i+1));h._p.append(end)
 if page.get('intro'):D.add_paragraph(page['intro'])
 img=shots/page.get('image','missing')
 if img.is_file():
  # Crop only browser chrome/banner, retaining the actual captured UI.
  im=Image.open(img).convert('RGB');im.thumbnail((1348,926));dst=assets/(img.stem+'.jpg');im.save(dst,quality=90)
  p=D.add_paragraph();p.paragraph_format.space_after=Pt(3);p.add_run().add_picture(str(dst),width=Cm(17.5))
  D.add_paragraph('Captura actual de la aplicación · '+page['title'].split('. ',1)[-1],style='Caption')
 if page.get('table'):
  rows=page['table'];t=D.add_table(rows=1,cols=len(rows[0]));t.alignment=WD_TABLE_ALIGNMENT.CENTER;t.style='Light Shading Accent 1'
  for j,v in enumerate(rows[0]):t.rows[0].cells[j].text=v
  for row in rows[1:]:
   for j,v in enumerate(row):t.add_row().cells[j].text=v if False else ''
  # Rebuild rows without adding duplicate lines.
  while len(t.rows)>1:t._tbl.remove(t.rows[-1]._tr)
  for row in rows[1:]:
   cells=t.add_row().cells
   for j,v in enumerate(row):cells[j].text=v
  for row in t.rows:
   for cell in row.cells:
    for p in cell.paragraphs:
     p.paragraph_format.space_after=Pt(4);p.paragraph_format.line_spacing=1.05
     for r in p.runs:r.font.size=Pt(9)
  trpr=t.rows[0]._tr.get_or_add_trPr();trpr.append(OxmlElement('w:tblHeader'))
 if page.get('steps'):
  if img.is_file():D.add_heading('Paso a paso',2)
  for n,step in enumerate(page['steps'],1):
   p=D.add_paragraph();p.paragraph_format.space_after=Pt(5)
   if 'https://' in step:
    label,url=step.split('https://',1);p.add_run(str(n)+'. '+label);link(p,'https://'+url,url='https://'+url)
   else:p.add_run(str(n)+'. '+step)
 if page.get('note'):
  p=D.add_paragraph();r=p.add_run('Consejo y aclaración. ');r.bold=True;p.add_run(page['note']);p.paragraph_format.space_before=Pt(5)
  pp=p._p.get_or_add_pPr();shade=OxmlElement('w:shd');shade.set(qn('w:fill'),'E8F2EE');pp.append(shade)
# Green table palette and clean paragraph borders.
for table in D.tables:
 for k,row in enumerate(table.rows):
  for cell in row.cells:
   sh=OxmlElement('w:shd');sh.set(qn('w:fill'),'0F4F45' if k==0 else 'E8F2EE' if k%2 else 'FFFFFF');cell._tc.get_or_add_tcPr().append(sh)
   for para in cell.paragraphs:
    for run in para.runs:
     if k==0:run.font.color.rgb=RGBColor(255,255,255);run.bold=True
# Exact swatches for the application palette.
for row in D.tables[-1].rows[1:]:
 value=row.cells[0].text.strip()
 if value.startswith('#'):
  color=value[1:];sh=OxmlElement('w:shd');sh.set(qn('w:fill'),color);row.cells[0]._tc.get_or_add_tcPr().append(sh)
  for p in row.cells[0].paragraphs:
   for r in p.runs:r.font.color.rgb=RGBColor.from_string('10243D' if color in ['E8F2EE','F6F8F7'] else 'FFFFFF')
for root in [D._element,D.styles.element]:
 for border in list(root.iter(qn('w:pBdr'))):border.getparent().remove(border)
# Metadata and native internal links.
D.core_properties.title='MANUAL DE USO';D.core_properties.subject='Guitarra PRO';D.core_properties.author='Guitarra PRO';D.core_properties.version='1.1';D.core_properties.comments='Guía de usuario revisada el 11 de noviembre de 2026'
D.save(OUT/'Guitarra_PRO_MANUAL_DE_USO_v1_1_2026_11_11.docx')
print('Word creado con',len(pages),'capítulos')
