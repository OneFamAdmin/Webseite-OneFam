# -*- coding: utf-8 -*-
import numpy as np, cv2
from PIL import Image
from scipy.ndimage import distance_transform_edt
from skimage.morphology import skeletonize

def zerlege(im):
    H,W,_=im.shape
    ring=np.concatenate([im[:3].reshape(-1,3),im[-3:].reshape(-1,3),im[:,:3].reshape(-1,3),im[:,-3:].reshape(-1,3)])
    c,n=np.unique(ring.reshape(-1,3),axis=0,return_counts=True); bg=c[n.argmax()]
    m=(np.abs(im.astype(int)-bg.astype(int)).sum(axis=2)>30)
    tile=np.zeros_like(m); tile[int(0.78*H):,int(0.78*W):]=True
    return bg, m&~tile, tile

def kernel(r):
    s=int(np.ceil(r)); y,x=np.mgrid[-s:s+1,-s:s+1]
    return ((x*x+y*y)<=r*r).astype(np.uint8)

def palette(im,m,min_share=0.005):
    q=(im.astype(np.int16)//24*24)
    cols,cnt=np.unique(q[m].reshape(-1,3),axis=0,return_counts=True)
    tot=m.sum()
    keep=cols[cnt/tot>=min_share]
    if len(keep)==0: keep=cols[cnt.argmax()][None,:]
    return keep.astype(np.int16)

def zuordnen(im,m,pal):
    d=np.full(m.shape,1e9); idx=np.zeros(m.shape,np.int32)
    v=im.astype(np.int16)
    for i,c in enumerate(pal):
        dd=np.abs(v-c).sum(axis=2)
        b=dd<d; d[b]=dd[b]; idx[b]=i
    return idx

def vereinfache(im, min_mm, min_area=0.004):
    bg,m,tile=zerlege(im)
    ys,xs=np.nonzero(m); ppm=(xs.max()-xs.min()+1)/80.0
    r=min_mm*ppm/2.0
    el=kernel(r)
    pal=palette(im,m); idx=zuordnen(im,m,pal); idx[~m]=-1
    tot=int(m.sum())
    sil=cv2.morphologyEx(m.astype(np.uint8),cv2.MORPH_CLOSE,el).astype(bool)&~tile
    erg=np.full(m.shape,-1,np.int32); leben=[]
    for i in range(len(pal)):
        lay=(idx==i).astype(np.uint8)
        lay=cv2.morphologyEx(lay,cv2.MORPH_OPEN,el)
        lay=cv2.morphologyEx(lay,cv2.MORPH_CLOSE,el)
        if lay.sum()/tot < min_area: continue
        leben.append(i); erg[lay.astype(bool)]=i
    bek=erg>=0
    if bek.any():
        _,ind=distance_transform_edt(~bek,return_indices=True)
        rest=sil&~bek; erg[rest]=erg[ind[0][rest],ind[1][rest]]
    out=np.zeros_like(im); out[:]=bg
    for i in leben: out[erg==i]=pal[i].astype(np.uint8)
    out[tile]=im[tile]
    return out, len(leben)

def messe(im):
    bg,m,tile=zerlege(im)
    ys,xs=np.nonzero(m); mmpp=80.0/(xs.max()-xs.min()+1)
    q=(im.astype(np.int16)//24*24); tot=int(m.sum()); duenn=0; nf=0
    cols,cnt=np.unique(q[m].reshape(-1,3),axis=0,return_counts=True)
    for col,kk in zip(cols,cnt):
        if kk/tot<0.005: duenn+=int(kk); continue
        nf+=1; cm=np.all(q==col,axis=-1)&m
        nl,l,st,_=cv2.connectedComponentsWithStats(cm.astype(np.uint8),8)
        for i in range(1,nl):
            a=int(st[i,cv2.CC_STAT_AREA]); fr=l==i
            if a/tot<0.002: duenn+=a; continue
            dt=distance_transform_edt(fr); sk=skeletonize(fr)
            if sk.sum()==0: duenn+=a; continue
            if float(np.median(dt[sk]*2*mmpp))<1.5: duenn+=a
    return 100*duenn/tot, nf
