const server = require('http').createServer();
const fs = require('fs');
var WebSocket = require('ws');
const wserver =  new WebSocket.Server({port:800});
const nodeStatic = require('node-static');
const file = new nodeStatic.Server('.', {
  cache: 0
});
wserver.on('connection', ws=>{
	var path = '/';
	file_send(path,ws);
	ws.on('message',message=>{
		message = JSON.parse(message);
		if(message.type=='dir'){
			path = message.message;	
			file_send(path,ws);
	    }
	    if(message.type=="new_p"){
	    	fs.mkdirSync(message.message);
	    	file_send(path,ws);
	    }
	    if(message.type=="delete_p"){
	    	console.log(message.message)
	    	fs.rmdirSync(message.message);
	    	file_send(path,ws);
	    }
	    if(message.type=="delete_f"){
	    	console.log(message.message)
	    	fs.unlinkSync(message.message);
	    	file_send(path,ws);
	    }
	})
	//ws.send(JSON.stringify(fs.readdirSync('/')));
})
function file_send(path,ws){
	var mass = {};
	mass.f = [];
	mass.p = [];
	var dir = fs.readdirSync(path);
	for(var i in dir){
		try{
			var e = fs.readdirSync(path+'/'+dir[i]);
			mass.p.push(dir[i]);
		}catch(e){
			mass.f.push(dir[i]);
		}
		
	}
	ws.send(JSON.stringify(mass));
}


server.listen(3000, () => console.log("сервер запущен"));
server.on('request', (req, res) => {
  req.url = decodeURI(req.url);
  var post_url = req.url.split("/");
  console.log(req.url);
  if (post_url[1] == 'save') {
  	post_url.shift();
  	post_url.shift();
  	post_url = post_url.join("/");
    req.pipe(
      fs.createWriteStream("/"+post_url)
    ).on('finish', () => res.end('ok'));
    res.end('ok');
    return;
  }

  if(post_url[1]=="file"){
  	post_url.shift();
  	post_url.shift();
  	post_url = "/"+post_url.join("/")
  	var files = fs.readFileSync(post_url);
  	res.end(files);
  	return;
  }
  file.serve(req, res);
});
