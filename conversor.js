

$(document).ready(function (){
  $("#spinner").addClass("hide");
});
// CONVERTIR DECIMALES A BINARIO
function number_to_binary(number){
  var str = number;
  var bin = (+str).toString(2);

  return (pad(bin, 8, 0));
}
// AUMENTAR 0 A LA IZQUIERDA
function pad(input, length, padding) {
  var str = input + "";
  return (length <= str.length) ? str : pad(padding+str, length, padding);
}
// CONVERTIR LA IP A VECTOR SIN PUNTO
function ip(ip){
  var ipVector = ip.split(".");
  var ipBinary = "";
  for(var i = 0; i < ipVector.length; i++){
    ipBinary += number_to_binary(parseInt(ipVector[i]));
  }
  return ipBinary;
}
// CONVERTIR TEXTO A BINARIO
function textToBin(text) {
  var length = text.length,
      output = [];
  for (var i = 0;i < length; i++) {
    var bin = text[i].charCodeAt().toString(2);
    output.push(Array(8-bin.length+1).join("0") + bin);
  }
  return output.join("");
}

$("#btn_convertir").on("click",function(){
  $("#spinner").removeClass("hide");
  var color = randomColor();

  var splitted = $('#inputMensaje').val().split("\n");

  var ipOrigen   = $("#inputIpOrigen");
  var ipDestino  = $("#inputIpDestino");
  var anchoBanda = $("#anchoBanda");
  var mensaje    = $("#inputMensaje");

  var limite = anchoBanda.val() - 8;

  setTimeout(function() {

    $("#spinner").addClass("hide");

    if(mensaje.val().length <= limite) {

      var close = "</label>";
      var labels = [];
      for(var j = 0; j < 4; j++) { labels.push( "<label style='color: " + randomColor() + "'>" ); }
      var mensajeCodificado = labels[0] + ip(ipOrigen.val()) + close +
                              labels[2] + textToBin(mensaje.val()) + close +
                              labels[0] + ip(ipDestino.val()) + close;
      $("#output").append(mensajeCodificado);
      alertify.success('El texto se ha convertido con éxito.');

    }else{

      limite = limite - 1;
      var partes = mensaje.val().length / limite;
      var index = 1;
      var close = "</label>";
      for(var i = 0; i < partes; i++){
        var labels = [];
        for(var j = 0; j < 4; j++) { labels.push( "<label style='color: " + randomColor() + "'>" ); }

        var mensajeCodificado = labels[0] + ip(ipOrigen.val()) + close +
                                labels[1] + ip(index.toString()) + close +
                                labels[2] + textToBin(mensaje.val().substr(limite * i,limite)) + close +
                                labels[0] + ip(ipDestino.val()) + close;
        $("#output").append(mensajeCodificado);
        index++;
      }
      alertify.success('El texto se ha convertido con éxito en ' + (index - 1) + ' partes.');

    }

  }, (10 * (mensaje.val().length / limite)));

});

$("#clean").on("click",function(){
  $("#output").empty();
  alertify.error('Se han borrado los datos');
});







//    DECODIFICAR

function bin_to_dec(bstr) {
    return parseInt((bstr + '')
    .replace(/[^01]/gi, ''), 2);
}

function binaryToWords(str) {
    if(str.match(/[10]{8}/g)){
        var wordFromBinary = str.match(/([10]{8}|\s+)/g).map(function(fromBinary){
            return String.fromCharCode(parseInt(fromBinary, 2) );
        }).join('');
        return wordFromBinary;
    }
}

  var mensajeData = [];

function highest(myArguments)
{
  return myArguments.sort(function(a,b)
  {
    return b - a;
  });
}

$("#btn_decode").on("click",function(){
  var mensajeBinario = $("#inputBinario");
  var ipOrigenBinario  = mensajeBinario.val().substr(0,32);
  var ipDestinoBinario = mensajeBinario.val().substr(mensajeBinario.val().length - 32,32);
  var indexIpDestino   = mensajeBinario.val().indexOf(ipDestinoBinario);
  var mensajeSize      = indexIpDestino + 32;
  var size             = indexIpDestino - 40;
  var partes           = mensajeBinario.val().length / mensajeSize;

  var mensajeVector = [];

  if(partes > 1){

    for(var i = 0; i < partes; i++){

      var ipOrigenVectorBinario = bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(0,32).substr(0,8))  + "." +
                                  bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(0,32).substr(8,8))  + "." +
                                  bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(0,32).substr(16,8)) + "." +
                                  bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(0,32).substr(24,8));

      var ipDestinoVectorBinario = bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(indexIpDestino,32).substr(0,8))  + "." +
                                   bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(indexIpDestino,32).substr(8,8))  + "." +
                                   bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(indexIpDestino,32).substr(16,8)) + "." +
                                   bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(indexIpDestino,32).substr(24,8));

      mensajeVector.push([{ ipOrigen     : ipOrigenVectorBinario }     ,
                         { numeroMensaje : bin_to_dec(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(32,8)) }     ,
                         { mensaje       : binaryToWords(mensajeBinario.val().substr( mensajeSize * i, mensajeSize ).substr(40,size)) }  ,
                         { ipDestino     : ipDestinoVectorBinario }]);

    }


    var mensajeDecode = "<label>";

    for(var j = 1; j <= mensajeVector.length; j++){
      for(var x = 0; x < mensajeVector.length; x++){
        if(j == Object.values(mensajeVector[x][1])) {
          // console.log( Object.values(mensajeVector[x][2]) );
          mensajeDecode += Object.values(mensajeVector[x][2]);
        }
      }
    }

    mensajeDecode += "</label>";

  }else if(partes == 1){

    size = indexIpDestino - 32;

    var ipOrigenVectorBinario = bin_to_dec(mensajeBinario.val().substr(0,32).substr(0,8))  + "." +
                                bin_to_dec(mensajeBinario.val().substr(0,32).substr(8,8))  + "." +
                                bin_to_dec(mensajeBinario.val().substr(0,32).substr(16,8)) + "." +
                                bin_to_dec(mensajeBinario.val().substr(0,32).substr(24,8));

    var ipDestinoVectorBinario = bin_to_dec(mensajeBinario.val().substr(indexIpDestino,32).substr(0,8))  + "." +
                                 bin_to_dec(mensajeBinario.val().substr(indexIpDestino,32).substr(8,8))  + "." +
                                 bin_to_dec(mensajeBinario.val().substr(indexIpDestino,32).substr(16,8)) + "." +
                                 bin_to_dec(mensajeBinario.val().substr(indexIpDestino,32).substr(24,8));

    mensajeVector.push([{ ipOrigen     : ipOrigenVectorBinario }     ,
                       { mensaje       : binaryToWords(mensajeBinario.val().substr( 32, size )) }  ,
                       { ipDestino     : ipDestinoVectorBinario }]);

        var mensajeDecode = "<label>" + Object.values(mensajeVector[0][1]); + "</label>";

  }

  // var mensajeData = mensajeBinario.val().split(ipOrigenBinario);

  console.log(mensajeSize);
  $("#output").empty();
  $("#output").append(mensajeDecode);
  alertify.success('El texto se ha decodificado con éxito.');


  $("#inputIpOrigenBinario" ).val(Object.values(mensajeVector[0][0]));
  $("#inputIpDestinoBinario").val(Object.values(mensajeVector[0][mensajeVector[0].length - 1]));
  $("#anchoBandaBinario").val((size / 8) + 9);

  // console.log(bin_to_dec(ipOrigenBinario.substr(0,8)) + "." + bin_to_dec(ipOrigenBinario.substr(8,8)) + "." + bin_to_dec(ipOrigenBinario.substr(16,8)) + "." + bin_to_dec(ipOrigenBinario.substr(24,8)));
  // console.log(bin_to_dec(ipDestinoBinario.substr(0,8)) + "." + bin_to_dec(ipDestinoBinario.substr(8,8)) + "." + bin_to_dec(ipDestinoBinario.substr(16,8)) + "." + bin_to_dec(ipDestinoBinario.substr(24,8)));
});
