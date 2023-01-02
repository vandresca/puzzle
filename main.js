//Inicializar
var inicio=true;
var img = new Image;

//Objetos
var Evento = {
        addHandler: function(element, type, handler) {
            if (element.addEventListener) {
                element.addEventListener(type, handler, false);
            } else if (element.attachEvent) {
                element.attachEvent("on" + type, handler);
            } else {
                element["on" + type] = handler;
            }
        },
        removeHandler: function(element, type, handler) {
            if (element.removeEventListener) {
                element.removeEventListener(type, handler, false);
            } else if (element.detachEvent) {
                element.detachEvent("on" + type, handler);
            } else {
                element["on" + type] = null;
            }
        },
        getCurrentTarget: function(e) {
            if (e.toElement) {
                return e.toElement;
            } else if (e.currentTarget) {
                return e.currentTarget;
            } else if (e.srcElement) {
                return e.srcElement;
            } else {
                return null;
            }
        }
}




//Funciones
//..Al cargar el documento.
window.onload = function()
{
    isotope = document.querySelector('.grid');
    
    var buttonok=document.getElementById("ok");
    Evento.addHandler(buttonok,'click', function(){
        $("#msg").attr("class","hide");
    });

    var input = document.getElementById('picture');
    Evento.addHandler(input,'change', handleFiles);

    handleFiles(null);

    $(function () {
      $('.inputfile').each(function () {
        var $input = $(this);
        $input.on('change', function (e) {
          var fileName = '';
          if (e.target.value){
            fileName = e.target.value.split('\\').pop();
          }
          if (fileName){
            var $fileName = $('#file_name');
            $fileName.html(fileName);
          } else {
            $fileName.html('');
          }
        });
      });
    });
}

function handleFiles(e)
{
    var showImage=document.getElementById("showImage");
    showImage.style.display="inline-block";
    if(e!=null){
        showImage.src=URL.createObjectURL(e.target.files[0]);
    }else{
        showImage.src="paisaje.jpg";
    }
    var canvasMain=document.getElementById('canvas');
    var ctx = document.getElementById('canvas').getContext('2d');
    
    var imgRedim = new Image;
    if(e!=null){
        img.src=URL.createObjectURL(e.target.files[0]);
    }else{
        img.src="paisaje.jpg";
    }
    
    var posiciones=new Array(5*5);
   
      
    img.onload = function()
    {
        var MAX_WIDTH = 500;
        var MAX_HEIGHT = 500;
        var width = img.width;
        var height = img.height;

        if (width > height)
        {
            if (width > MAX_WIDTH)
            {
                height *= MAX_WIDTH / width;
                width = MAX_WIDTH;
            }
        }
        else
        {
            if (height > MAX_HEIGHT)
            {
                width *= MAX_HEIGHT / height;
                height = MAX_HEIGHT;
            }
        }

        canvas.width = 400;
        canvas.height = 400;

        ctx.drawImage(img, 0,0,400, 400);

        imgRedim.src=canvasMain.toDataURL();
        
        
    }

    imgRedim.onload = function()
    {
      if($('#base')){
        $('#base').remove()
      }
      var proporcion=imgRedim.width/5;
        $("<div/>").attr("id","base").attr("style","position:relative;margin-left:20px;width:"+((proporcion*5)+(5*4.5))+"px;height:"+((proporcion*5)+(5*5))+"px;").appendTo("body");
        $( "<table/>", {"class": "grid"}).appendTo($("#base"));
        //var table=document.createElement("table");
        $(".grid").attr("style", "width:"+((proporcion*5)+(5*4.5))+"px;height:"+((proporcion*5)+(5*5))+"px;");

        for(let i=0;i<5;i++){
          $("<tr/>",{"class":"r"+i}).appendTo($(".grid"));
          for(let j=0;j<5;j++){
            posiciones[i*5+j]=i*5+j;

            $("<td/>",{"class":"grid-item"}).attr("data-category","item").attr("data-position",i*5+j).attr("id",(i*5+j)).attr("style","display:inline-block!important;width:"+proporcion+"px;height:"+proporcion+"px").appendTo($(".r"+i));

            var casilla=document.createElement("canvas");

            //$(casilla).attr("data-position",(i*5+j));
            $(casilla).attr("draggable","true");
            $(casilla).attr("style","width:"+proporcion+"px;height:"+proporcion+"px;");

            casilla.width=proporcion;
            casilla.height=proporcion;
            
            var ctx2 = casilla.getContext('2d');
            ctx2.drawImage(imgRedim, proporcion*j, proporcion*i, proporcion, proporcion, 0, 0, proporcion, proporcion);
            
            Evento.addHandler(casilla,"dragstart", function(event) {
                event.dataTransfer.setData("Text", event.target.parentElement.id+";"+event.target.parentElement.attributes["data-position"].nodeValue);
                var target = EventUtil.getCurrentTarget(event);
                target.style.cursor = 'grabbing'
            });

            Evento.addHandler(casilla, "dragend", function(event) {
                event.preventDefault();
                var target = EventUtil.getCurrentTarget(event);
                target.style.cursor = 'pointer'
            });

            Evento.addHandler(casilla, "drop", function(event){
                event.preventDefault();
                inicio=false;
                var origen=event.dataTransfer.getData("text").split(";");
                var idorigen=origen[0];
                var dsorigen=origen[1];

                var iddestino=event.target.parentElement.id;
                var dsdestino=event.target.parentElement.attributes["data-position"].nodeValue;
                
                var pIdsorigen=parseInt(dsorigen);
                var pIdsdestino=parseInt(dsdestino);
                var rowOrigen=pIdsorigen/5;
                var colOrigen=pIdsorigen%5;


                if(rowOrigen < 5 && rowOrigen >=0 && colOrigen < 5 && colOrigen >=0 && (idorigen=="24" || iddestino=="24")){
                   
                   if(
                    ((pIdsorigen+5)==pIdsdestino) ||
                    ((pIdsorigen-5)==pIdsdestino) ||
                    ((pIdsorigen+1)==pIdsdestino) ||
                    ((pIdsorigen-1)==pIdsdestino)
                    ){

                        $("#"+idorigen).attr("data-position",dsdestino);
                        $("#"+iddestino).attr("data-position",dsorigen);
                        
                        isotop.isotope('updateSortData').isotope({sortBy:'position'});
                    }
                }
            });
            Evento.addHandler(casilla, "dragover", function(event) {
                event.preventDefault();
            });
            
            $("#"+(i*5+j)).append($(casilla));
            $("#"+(5*5-1)+' canvas').attr("style","opacity:0;")
          }
        }
        var isotop=$('.grid').isotope({
            itemSelector: '.grid-item',
            getSortData: { "position": "[data-position] parseInt"}
        });
        isotop.on('arrangeComplete', function() {
            var win=false;
            if(!inicio){
                win=true;
                for(let i=0;i<5;i++){
                    for(let j=0;j<5;j++){
                        if($("#"+(i*5+j)).attr("id")!=$("#"+(i*5+j)).attr("data-position")){
                            win=false;
                        }
                    }
                }
            }
            if(win){
                $("#msg").attr("class","show");
            }
        });
           

        var restart=document.getElementById("restart");
        Evento.addHandler(restart, "click", function(){
            inicio=true;
            for(let i=0;i<5;i++){
                for(let j=0;j<5;j++){
                    $("#"+(i*5+j)).attr("data-position",i*5+j);
                }
            }
            isotop.isotope('updateSortData').isotope({sortBy:'position'});
        });

        var mix=document.getElementById("mix");
        Evento.addHandler(mix,"click",function(){
            inicio=false;
            
            var isRes=true;

            do{
                shuffle(posiciones);
                
                //Comprobamos si el orden que nos da la función shuffle es resolvible
                isRes=isSolvable(posiciones);
                if(isRes){
                    for(let i=0;i<5;i++){
                        for(let j=0;j<5;j++){
                            $("#"+(i*5+j)).attr("data-position",posiciones[i*5+j]);
                        }
                    }
                    isotop.isotope('updateSortData').isotope({ sortBy : 'position' });
                }
            }
            while(!isRes);
        });
    }
}


function shuffle(arra1) {
    var ctr = arra1.length, temp, index;
    while (ctr > 0) {
        index = Math.floor(Math.random() * ctr);
        ctr--;
        temp = arra1[ctr];
        arra1[ctr] = arra1[index];
        arra1[index] = temp;
    }
        return arra1;
} 


function getInvCount(posi) 
{ 
    var inv_count = 0; 
    for (let i = 0; i < 5 - 1; i++) 
        for (let j = i+1; j < 5; j++) 
             if (posi[i*5+j] > 0 && posi[j*5+i] > 0 && 
                            posi[j*5+i] > posi[i*5+j]) 
                  inv_count++; 
    return inv_count; 
} 
   
function isSolvable(posi) 
{ 
    var invCount = getInvCount(posi); 
    return (invCount%2 == 0); 
} 