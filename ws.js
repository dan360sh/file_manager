const ws = new WebSocket('ws://localhost:800');
var path = "";
var mass_path =[""];
ws.onmessage = function(response){
    var files = JSON.parse(response.data);
    $(".spisok_file").html("");
    for(var i in files.p){
    	$(".spisok_file").append("<p class='p1 p'><img src='papka.png' class='papka'>"+files.p[i]+"</p><img src='close.png' mydir='"+files.p[i]+"' class='close close_p'>");
    }
    for(var i in files.f){
    	$(".spisok_file").append("<p class='p1 f'><a href='file"+path+"/"+files.f[i]+"' download>"+files.f[i]+"</a></p><img src='close.png' mydir='"+files.f[i]+"' class='close close_f'>");
    }
    $(".p").on("click",function(){
    	path =  path +"/"+$(this).text();
    	$('.path').html(path);
    	mass_path.push(path);
    	ws.send(JSON.stringify({type:'dir',message:path}));
    });
    $(".close_p").on("click",function(){ 	
    	ws.send(JSON.stringify({type:'delete_p',message:path+"/"+$(this).attr("mydir")}));
    });
    $(".close_f").on("click",function(){ 	
    	ws.send(JSON.stringify({type:'delete_f',message:path+"/"+$(this).attr("mydir")}));
    })
}
$(".back").on('click',function(){
    mass_path.pop();
    path = mass_path[mass_path.length-1];
    $('.path').html(path);
    if(path){
    	ws.send(JSON.stringify({type:'dir',message:path}));;

    }else{
    	path = "";
    	ws.send(JSON.stringify({type:'dir',message:'/'}));
    	
    }
    
})
$(".new_papka").on('click',function(){
	ws.send(JSON.stringify({type:'new_p',message:path+"/"+$(".new_p").val()}));
})