from flask import Flask,jsonify,request
from tinydb import TinyDB, Query
from flask_cors import CORS

db=TinyDB('a.json')


app= Flask(__name__)
CORS(app)


@app.route('/')
def display():
    return "<h1>Database Storage</h1>"

@app.route('/data')
def data():
    d=db.all()
    url=request.values.get('url')
    print(url)
    x=[]
    for e in d:
        if url == e['url']:
            x.append(e)
    return jsonify(x)

@app.route('/getdata')
def get_data():
    data=jsonify(db.all())
    return data

@app.route('/texts')
def get_text():
    data=db.all()
    texts=""
    for d in data:
        texts+="<p>"+d['text']+"</p><br>"
    return texts

@app.route('/store',methods=['POST'])
def store():
    jsn={}
    jsn['url']=request.values.get('url')
    jsn['xpath']=request.values.get('xpath')
    jsn['text']=request.values.get('text')
    jsn['tag']=request.values.get('tag')
    jsn['startPoint']=request.values.get('startPoint')
    jsn['endPoint']=request.values.get('endPoint')
    print(jsn)
    db.insert(jsn)
    return "OK"

if __name__ == '__main__':
    app.run(debug=True)
