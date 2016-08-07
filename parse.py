import csv
import string


def load1(x,l):
    csvfile = open(r'C:\Users\asus pc\Desktop\project\area\data'+'\\'+str(x)+'.csv','r') # 1
    i=0
    for row in csv.reader(csvfile, delimiter=','): # 2
        if i != 0:
            lists={"type":"ticket","month":i,"value":row[2]}
            l.append(lists)
        i=i+1
    csvfile.close()

def load2(x,l):
    csvfile = open(r'C:\Users\asus pc\Desktop\project\area\data'+'\\'+str(x)+'.csv','r')
    i=0
    for row in csv.reader(csvfile, delimiter=','): # 2
        if i != 0:
            lists={"type":"one_day","month":i,"value":row[3]}
            l.append(lists)
        i=i+1
    csvfile.close()

def load3(x,l):
    csvfile = open(r'C:\Users\asus pc\Desktop\project\area\data'+'\\'+str(x)+'.csv','r')
    i=0
    for row in csv.reader(csvfile, delimiter=','): # 2
        if i != 0:
            lists={"type":"one_way","month":i,"value":row[4]}
            l.append(lists)
        i=i+1
    csvfile.close()

def load4(x,l):
    csvfile = open(r'C:\Users\asus pc\Desktop\project\area\data'+'\\'+str(x)+'.csv','r')
    i=0
    for row in csv.reader(csvfile, delimiter=','): # 2
        if i != 0:
            lists={"type":"group","month":i,"value":row[5]}
            l.append(lists)
        i=i+1
    csvfile.close()

def load5(x,l):
    csvfile = open(r'C:\Users\asus pc\Desktop\project\area\data'+'\\'+str(x)+'.csv','r')
    i=0
    for row in csv.reader(csvfile, delimiter=','): # 2
        if i != 0:
            lists={"type":"other","month":i,"value":row[6]}
            l.append(lists)
        i=i+1
    csvfile.close()


def load(x,l):
    load1(x,l)
    load2(x,l)
    load3(x,l)
    load4(x,l)
    load5(x,l)

headers = ['type','month','value']

for num in range(97,106):
    x=[]
    load(num,x)
    with open(str(num)+'.csv','w') as f:
        f_csv = csv.DictWriter(f,delimiter=',', lineterminator='\n',fieldnames=headers)
        f_csv.writeheader()
        f_csv.writerows(x)
    f.close()

