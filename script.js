var xhr = new XMLHttpRequest();
$(".file_save").on("change",function(){
	var file = myfile.files[0];
	console.log('save'+path+"/"+file.name);
	xhr.open('POST','save'+path+"/"+file.name, false);
    xhr.send(file);
})

if (xhr.status != 200) {
  alert( xhr.status + ': ' + xhr.statusText ); // пример вывода: 404: Not Found
} else {
  alert( xhr.responseText ); // responseText -- текст ответа.
}