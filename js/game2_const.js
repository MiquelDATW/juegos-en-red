const filamax= 8;
const colamax= 8;
const conecta= 4;

var matriz= [];
var turno= 0;
var hayjuego= false;
var haysimula= false;
var hayganador= false;
var llena=[]; //= [colamax,colamax,colamax,colamax,colamax,colamax,colamax,colamax];

while(turno<filamax){
	llena[turno]=colamax-1;
	turno++;
}
turno= 0;
