import os, glob, json, subprocess
from multiprocessing import Pool
from produktion import eins, slug
from mapping import M
from namen import N
PDF=os.environ.get('PDF','/Users/labinotbajrami/Downloads/loco-motive_Logo_rgb_flags_final 2.pdf')
OUT='stick15'; os.makedirs(OUT,exist_ok=True); os.makedirs('work',exist_ok=True)

def job(p):
    nm='%03d_%s_%s'%(p,M[p],slug(N[M[p]]))
    try:
        nf,v,w,sz=eins('work/w-%03d-%03d.png'%(p,p),1.5,'%s/%s.png'%(OUT,nm),'%s/%s.svg'%(OUT,nm))
        return {'page':p,'name':nm,'farben':nf,'v':v}
    except Exception as e:
        return {'page':p,'name':nm,'err':str(e)}

if __name__=='__main__':
    res=[]
    pages=list(range(1,253))
    for i in range(0,len(pages),18):
        ch=pages[i:i+18]
        for p in ch:
            subprocess.run(['pdftoppm','-f',str(p),'-l',str(p),'-r','300','-png',PDF,'work/w-%03d'%p],check=True)
        with Pool(2) as pool: res+=pool.map(job,ch)
        for f in glob.glob('work/*.png'): os.remove(f)
        json.dump(res,open('produktion.json','w'))
        print('fertig bis',ch[-1],flush=True)
    print('DONE',len(res))
