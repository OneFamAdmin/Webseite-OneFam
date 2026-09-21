iso=open('iso.txt').read().split()
def build():
    M={}
    for p in range(1,77): M[p]=iso[p-1]              # 1..76  = AD..GA
    M[77]='XE-ENG'; M[78]='XE-NIR'; M[79]='XE-SCT'; M[80]='XE-WLS'
    for p in range(81,195): M[p]=iso[p-5]            # 81..194 = GB..RS
    for p in range(195,235): M[p]=iso[p-4]           # 195..234 = RW..UG (RU fehlt)
    for p in range(235,247): M[p]=iso[p-3]           # 235..246 = US..WS (UM fehlt)
    M[247]='XK'                                      # Kosovo
    for p in range(248,253): M[p]=iso[p-4]           # 248..252 = YE..ZW
    return M
M=build()
# Kontrollpunkte aus der visuellen Pruefung
CHK={2:'AE',4:'AG',16:'AZ',24:'BI',28:'BN',30:'BQ',34:'BV',41:'CF',43:'CH',46:'CL',51:'CU',
56:'CZ',57:'DE',59:'DK',60:'DM',61:'DO',64:'EE',66:'EH',67:'ER',68:'ES',69:'ET',70:'FI',
71:'FJ',72:'FK',73:'FM',74:'FO',75:'FR',76:'GA',81:'GB',82:'GD',83:'GE',85:'GG',89:'GM',
92:'GQ',93:'GR',98:'GY',104:'HU',110:'IO',111:'IQ',112:'IR',117:'JO',119:'KE',123:'KM',
124:'KN',125:'KP',127:'KW',130:'LA',132:'LC',135:'LR',138:'LU',140:'LY',150:'MM',152:'MO',
159:'MV',162:'MY',163:'MZ',164:'NA',166:'NE',170:'NL',171:'NO',176:'OM',177:'PA',181:'PH',
186:'PR',187:'PS',188:'PT',189:'PW',190:'PY',191:'QA',192:'RE',193:'RO',194:'RS',195:'RW',
196:'SA',197:'SB',198:'SC',199:'SD',203:'SI',204:'SJ',205:'SK',206:'SL',209:'SO',210:'SR',
211:'SS',216:'SZ',224:'TL',228:'TR',229:'TT',234:'UG',235:'US',236:'UY',237:'UZ',244:'VU',
245:'WF',246:'WS',248:'YE',249:'YT',250:'ZA',252:'ZW'}
if __name__=='__main__':
    bad=[(p,M[p],c) for p,c in CHK.items() if M[p]!=c]
    print('Abweichungen:',bad if bad else 'keine - Mapping stimmt an allen %d Kontrollpunkten'%len(CHK))
