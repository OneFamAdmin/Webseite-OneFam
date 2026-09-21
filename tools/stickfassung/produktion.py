# -*- coding: utf-8 -*-
import numpy as np, cv2, os, re
from PIL import Image
from v2 import vereinfache, zerlege, messe

def slug(s):
    s=(s.replace('ä','ae').replace('ö','oe').replace('ü','ue').replace('ß','ss')
        .replace('Ä','Ae').replace('Ö','Oe').replace('Ü','Ue').replace('é','e')
        .replace('í','i').replace('ô','o').replace('ç','c').replace('å','a').replace('Å','A'))
    s=re.sub(r'[^A-Za-z0-9]+','-',s).strip('-')
    return s

def freistellen(out_arr, quelle_arr):
    """Motiv ohne Hintergrund und ohne Flaggenkachel, auf Bounding Box beschnitten."""
    bg,m,tile=zerlege(quelle_arr)
    ys,xs=np.nonzero(m)
    y0,y1,x0,x1=ys.min(),ys.max()+1,xs.min(),xs.max()+1
    rgb=out_arr[y0:y1,x0:x1]
    a=(m[y0:y1,x0:x1]*255).astype(np.uint8)
    rgba=np.dstack([rgb,a])
    return rgba,(x0,y0,x1,y1),m

def svg(out_arr, m, box, breite_mm=80.0, eps=0.7, min_px=12):
    x0,y0,x1,y1=box
    sub=out_arr[y0:y1,x0:x1]; sm=m[y0:y1,x0:x1]
    H,W=sm.shape
    sk=breite_mm/W
    cols=np.unique(sub[sm].reshape(-1,3),axis=0)
    teile=[]
    for c in cols:
        mask=(np.all(sub==c,axis=-1)&sm).astype(np.uint8)
        if mask.sum()<min_px: continue
        cnts,hier=cv2.findContours(mask,cv2.RETR_CCOMP,cv2.CHAIN_APPROX_SIMPLE)
        d=[]
        for cnt in cnts:
            if cv2.contourArea(cnt)<min_px: continue
            ap=cv2.approxPolyDP(cnt,eps,True)
            if len(ap)<3: continue
            p=' '.join('%.2f,%.2f'%(pt[0][0]*sk,pt[0][1]*sk) for pt in ap)
            d.append('M '+p+' Z')
        if d:
            teile.append('<path fill="#%02X%02X%02X" fill-rule="evenodd" d="%s"/>'%(c[0],c[1],c[2],' '.join(d)))
    h_mm=H*sk
    return ('<?xml version="1.0" encoding="UTF-8"?>\n'
            '<svg xmlns="http://www.w3.org/2000/svg" width="%.2fmm" height="%.2fmm" '
            'viewBox="0 0 %.2f %.2f">\n%s\n</svg>\n'%(breite_mm,h_mm,breite_mm,h_mm,'\n'.join(teile)))

def eins(png, min_mm, ziel_png, ziel_svg):
    src=np.array(Image.open(png).convert('RGB'))
    out,nf=vereinfache(src,min_mm)
    rgba,box,m=freistellen(out,src)
    Image.fromarray(rgba).save(ziel_png)
    open(ziel_svg,'w',encoding='utf-8').write(svg(out,m,box))
    v,_=messe(out)
    return nf, v, rgba.shape[1], os.path.getsize(ziel_svg)
