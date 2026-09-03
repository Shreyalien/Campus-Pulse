const express=require('express'),http=require('http'),cors=require('cors'),{Server}=require('socket.io'),Database=require('better-sqlite3');
const app=express(),server=http.createServer(app),io=new Server(server,{cors:{origin:'*'}}),db=new Database('campus-pulse.db');
app.use(cors());app.use(express.json());
db.exec(`CREATE TABLE IF NOT EXISTS issues(id INTEGER PRIMARY KEY AUTOINCREMENT,title TEXT NOT NULL,description TEXT,category TEXT,status TEXT DEFAULT 'Reported',location TEXT,priority TEXT DEFAULT 'Medium',created_at TEXT DEFAULT CURRENT_TIMESTAMP,updated_at TEXT DEFAULT CURRENT_TIMESTAMP)`);
app.get('/api/health',(q,r)=>r.json({ok:true,service:'Campus Pulse'}));
app.get('/api/issues',(q,r)=>r.json(db.prepare('SELECT * FROM issues ORDER BY id DESC').all()));
app.post('/api/issues',(q,r)=>{let {title,description='',category='Other',location='',priority='Medium'}=q.body;if(!title||!location)return r.status(400).json({error:'title and location required'});let x=db.prepare('INSERT INTO issues(title,description,category,location,priority) VALUES(?,?,?,?,?)').run(title,description,category,location,priority);let issue=db.prepare('SELECT * FROM issues WHERE id=?').get(x.lastInsertRowid);io.emit('issue:new',issue);r.status(201).json(issue)});
app.patch('/api/issues/:id',(q,r)=>{let {status}=q.body;db.prepare('UPDATE issues SET status=?,updated_at=CURRENT_TIMESTAMP WHERE id=?').run(status,q.params.id);let issue=db.prepare('SELECT * FROM issues WHERE id=?').get(q.params.id);io.emit('issue:updated',issue);r.json(issue)});
server.listen(process.env.PORT||5000,()=>console.log('Campus Pulse server on 5000'));
