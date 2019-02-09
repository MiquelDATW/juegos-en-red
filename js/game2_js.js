const filamax= 7;
const colamax= 7;
const conecta= 4;

var matriz= [];
var fila= document.getElementsByClassName("fila");
var turno= 0;
var hayjuego= false;
var haysimula= false;
var hayganador= false;
var llena= [colamax,colamax,colamax,colamax,colamax,colamax,colamax,colamax];

function resetJuego(){
	/*
	Reinicializa todas las variables y matrizes globales del juego
	*/
	generaMatriz();
	document.getElementById('ayuda').innerHTML= "";
	document.getElementById('ayuda').style= "color: black;";
	llena= [colamax,colamax,colamax,colamax,colamax,colamax,colamax,colamax];
	turno= 0;
	hayjuego= true;
	hayganador= false;
	var i=0;
	var j=0;

	while (i<=filamax){
		j=0;
		while (j<=colamax){
			fila[i].children[j].className= "caja";
			fila[i].children[j].innerHTML= "";
			j++;
		}
		i++;
	}
}

function pulsaBoton(mifila,micola){
	/*
	Lee la jugada del usuario
	*/
	if (hayjuego){

		/*
		Hace caer la ficha del usuario hasta la fila más baja posible
		*/
		var aux= caerFicha(mifila,micola);
		mifila= aux[0];
		micola= aux[1];

		/*
		Si recoge -1, quiere decir q la columna está llena
		Por tanto, sale de la función y no hace nada
		*/
		if ((mifila==micola) && (mifila==-1)){
			return -1;
		}

		/*
		Pinta la jugada, actualiza la matriz de jugadas y avanza el turno
		*/
		mueveFicha(mifila,micola);

		/*
		Comprueba si hay 4 fichas en línea de un mismo color
		Si las hay, llama a la función ganarJuego(), que hace hayjuego= false
		*/
		compruebaVecinos(mifila,micola);

		/*
		Si está jugando contra la máquina, inicia el turno de la IA
		*/
		if (document.getElementById('opcion1').checked && hayjuego){
			setTimeout(turnoIA, 250);
		}

		/*
		Si no se ha ganado el juego, comprueba si se ha llenado el tablero
		*/
		if (turno==(filamax+1)*(colamax+1)){
			document.getElementById('ayuda').innerHTML= "Se acabó el juego";
			document.getElementById('ayuda').style= "color: red;";
			hayjuego= false;
		}
	}
}

function caerFicha(mifila,micola){

	/*
	Hace caer la ficha del usuario hasta la fila más baja posible
	(realmente sólo nos interesa qué columna ha pulsado)
	*/

	/*
	Inicialmente, la columna estará sin fichas
	Conforme vaya aceptandolas, se irá reduciendo el contador
	El contador cuenta las fichas q aún le caben
	Si la IA está haciendo simulaciones de la jugada, no reduce el contador
	*/
	var mifila0= llena[micola];
	if (!haysimula){
		llena[micola]--;
	}

	/*
	Devuelve la fila donde "caería" la ficha en un juego real de mesa
	Siempre q no sea -1, q quiere decir q la columna está llena de fichas
	*/
	if (mifila0>=0){
		return [mifila0,micola];
	}else{
		document.getElementById('ayuda').innerHTML+= "Columna llena!";
		return [-1,-1];
	}
}

function mueveFicha(mifila,micola){

	/*
	Si la columna está llena de fichas, no hace nada
	*/
	if (mifila<0 || micola<0){
		document.getElementById('ayuda').innerHTML+= "ERROR <0";
		hayjuego= false;
		return 0;
	}

	/*
	Si matriz= 0, está sin ficha de ningún jugador
	Asigna la celda al jugador q sea el turno
	Pinta el fondo de la celda, y escribe el número del jugador
	El párrafo de ayuda muestra información de: turno, jugador y celda
	*/
	if (matriz[mifila][micola]==0){
		matriz[mifila][micola]= (turno%2==0) ? 1 : 2;

		if (turno%2==0){
			fila[mifila].children[micola].className= "caja rojoC";
		}else{
			fila[mifila].children[micola].className= "caja negroC";
		}
		turno++;

		fila[mifila].children[micola].innerHTML= matriz[mifila][micola];
		document.getElementById('ayuda').innerHTML= "Turno: "+turno+". Jugador: "+matriz[mifila][micola]+". Fila "+mifila+", Columna "+micola;
	}else{

		document.getElementById('ayuda').innerHTML= "Celda llena!";
	}
}

function compruebaVecinos(yfila,xcola){

	/*
	Debe comprobar si hay 4 fichas en línea del mismo jugador
	La ficha acabada de introducir puede estar en cualquiera de 4 posiciones
	x000 0x000 00x0 000x -> la 1a, 2a, 3a o 4a dentro del grupo de 4 posiciones q debemos comprobar
	Sólo tiene la celda de la ficha introducida y debe asegurarse de no salirse de la matriz
	Cuando compruebe las celdas vecinas
	Sigue 2 pasos:
		1. Se asegura q existan las celdas adyacentes
		2a. Llama a la función q comprueba las fichas sean del mismo jugador
		2b. De haber 4 en línea, internamente llama a ganarJuego()
	Con las booleanas hayjuego y hayganador, se evita hacer cálculos en vano
	*/


	/* Horizontal */

	if (hayjuego&&!hayganador){

		/*
		Debe comprobar q no esté cerca de los bordes y se salga de la matriz
		En horizontal sólo comprueba las columnas, la fila no varía
		*/

		/*
		paso1: x000 -> desde columna hasta columna+3
		paso2: 0x00 -> desde columna-1 hasta columna+2
		paso3: 00x0 -> desde columna-2 hasta columna+1
		paso4: 000x -> desde columna-3 hasta columna
		*/

		paso1= (xcola-0>=0)&&(xcola+3<=colamax);
		paso2= (xcola-1>=0)&&(xcola+2<=colamax);
		paso3= (xcola-2>=0)&&(xcola+1<=colamax);
		paso4= (xcola-3>=0)&&(xcola+0<=colamax);

		if (paso1&&!hayganador){ comprueba4(yfila, yfila, xcola-0, xcola+3,1);}
		if (paso2&&!hayganador){ comprueba4(yfila, yfila, xcola-1, xcola+2,1);}
		if (paso3&&!hayganador){ comprueba4(yfila, yfila, xcola-2, xcola+1,1);}
		if (paso4&&!hayganador){ comprueba4(yfila, yfila, xcola-3, xcola+0,1);}
	}

	/* Vertical */

	if (hayjuego){

		/*
		Debe comprobar q no esté cerca de los bordes y se salga de la matriz
		En vertical sólo comprueba las filas, la columna no varía
		*/

		/*
		Como las columnas, pero variando en filas
		*/

		var paso1= (yfila-0>=0)&&(yfila+3<=filamax);
		var paso2= (yfila-1>=0)&&(yfila+2<=filamax);
		var paso3= (yfila-2>=0)&&(yfila+1<=filamax);
		var paso4= (yfila-3>=0)&&(yfila+0<=filamax);


		if (paso1&&!hayganador){ comprueba4(yfila-0, yfila+3, xcola, xcola,1);}
		if (paso2&&!hayganador){ comprueba4(yfila-1, yfila+2, xcola, xcola,1);}
		if (paso3&&!hayganador){ comprueba4(yfila-2, yfila+1, xcola, xcola,1);}
		if (paso4&&!hayganador){ comprueba4(yfila-3, yfila+0, xcola, xcola,1);}
	}

	/* Diagonal \ */

	if (hayjuego&&!hayganador){

		/*
		Debe comprobar q no esté cerca de los bordes y se salga de la matriz
		En diagonal debe comprobar las filas y columnas
		*/

		/*
		paso1:	x--- 	debe avanzar en fila ↓ y en columna →
				-0-- 	desde fila hasta fila+3
				--0- 	desde columna hasta columna+3
				---0 	
		paso2:	0--- 	debe avanzar en fila ↓ y en columna →
				-x-- 	desde fila-1 hasta fila+2
				--0- 	desde columna-1 hasta columna+2
				---0 	
		paso3:	0--- 	debe avanzar en fila ↓ y en columna →
				-0-- 	desde fila-2 hasta fila+1
				--x- 	desde columna-2 hasta columna+1
				---0 	
		paso4:	0--- 	debe avanzar en fila ↓ y en columna →
				-0-- 	desde fila-3 hasta fila
				--0- 	desde columna-3 hasta columna
				---x 	
		*/

		paso1= (yfila-0>=0)&&(yfila+3<=filamax)&&(xcola-0>=0)&&(xcola+3<=colamax);
		paso2= (yfila-1>=0)&&(yfila+2<=filamax)&&(xcola-1>=0)&&(xcola+2<=colamax);
		paso3= (yfila-2>=0)&&(yfila+1<=filamax)&&(xcola-2>=0)&&(xcola+1<=colamax);
		paso4= (yfila-3>=0)&&(yfila+0<=filamax)&&(xcola-3>=0)&&(xcola+0<=colamax);

		if (paso1&&!hayganador){ comprueba4(yfila+0, yfila+3, xcola-0, xcola+3,1);}
		if (paso2&&!hayganador){ comprueba4(yfila-1, yfila+2, xcola-1, xcola+2,1);}
		if (paso3&&!hayganador){ comprueba4(yfila-2, yfila+1, xcola-2, xcola+1,1);}
		if (paso4&&!hayganador){ comprueba4(yfila-3, yfila+0, xcola-3, xcola+0,1);}
	}

	/* Diagonal / */

	if (hayjuego&&!hayganador){

		/*
		Debe comprobar q no esté cerca de los bordes y se salga de la matriz
		Esta diagonal es diferente del resto de casos xq ascendemos en las filas
		Debe restar a la fila conforme avanza en el grupo de 4 celdas adyacentes
		*/

		/*
		paso1:	---0 	debe retroceder en fila ↑ y avanzar en columna →
				--0- 	desde fila hasta fila-3
				-0-- 	desde columna hasta columna+3
				x--- 	
		paso2:	---0 	debe retroceder en fila ↑ y avanzar en columna →
				--0- 	desde fila+1 hasta fila-2
				-x-- 	desde columna-1 hasta columna+2
				0--- 	
		paso3:	---0 	debe retroceder en fila ↑ y avanzar en columna →
				--x- 	desde fila+2 hasta fila-1
				-0-- 	desde columna-2 hasta columna+1
				0--- 	
		paso4:	---x 	debe retroceder en fila ↑ y avanzar en columna →
				--0- 	desde fila+3 hasta fila
				-0-- 	desde columna-3 hasta columna
				0--- 	
		*/

		paso1= (yfila+0<=filamax)&&(yfila-3>=0)&&(xcola-0>=0)&&(xcola+3<=colamax);
		paso2= (yfila+1<=filamax)&&(yfila-2>=0)&&(xcola-1>=0)&&(xcola+2<=colamax);
		paso3= (yfila+2<=filamax)&&(yfila-1>=0)&&(xcola-2>=0)&&(xcola+1<=colamax);
		paso4= (yfila+3<=filamax)&&(yfila-0>=0)&&(xcola-3>=0)&&(xcola+0<=colamax);

		if (paso1&&!hayganador){ comprueba4(yfila+0, yfila-3, xcola-0, xcola+3,0);}
		if (paso2&&!hayganador){ comprueba4(yfila+1, yfila-2, xcola-1, xcola+2,0);}
		if (paso3&&!hayganador){ comprueba4(yfila+2, yfila-1, xcola-2, xcola+1,0);}
		if (paso4&&!hayganador){ comprueba4(yfila+3, yfila-0, xcola-3, xcola+0,0);}
	}

	/*
	Como hace servir variables booleanas globales, no devuelve ningún resultado
	*/
}

function comprueba4(f1,f2,c1,c2,opcion){

	/*
	Recoge los valores de la matriz para las 4 celdas adyacentes
	Para la 2a diagonal, el contador debe disminuir en las filas
	Comprueba si las 4 celdas están ocupadas por el mismo jugador
	Si la IA está haciendo simulaciones de la jugada, no llama ganarJuego()
	*/

	var celda= [];
	var a= f1;
	var b= c1;
	var i= 0;

	while (i<conecta){

		celda[i]= matriz[a][b];
		b= (c1==c2) ? c1 : b+1;
		a= (f1==f2) ? f1 : ((opcion==1) ? a+1 : a-1 );

		i++;
	}

	if ((celda[0]== celda[1]) && (celda[1]== celda[2]) && (celda[2]== celda[3]) && (celda[3]== celda[0])){
		if (!haysimula){
			ganarJuego();
		}
		hayganador= true;
	}
}

function turnoIA(){

	/*
	Pone haysimula= true, para simular jugadas y no activar ganarJuego()
	La IA tiene 3 "estados": 1. ganar la partida, 2. bloquear el adversario y 3. simular su propia siguiente jugada
	En cada "estado", primero usa buscaIA() y si es necesario juegaIA()
	buscaIA() se encarga de buscar la columna q consigue el objetivo del "estado"
	juegaIA() se encarga de colocar la ficha en la columna elegida, previamente pone haysimula= false
	Si no ha encontrado una columna q gane la partida ni la q impide ganar al adversario, llega al "estado" 3. simula
	Aquí debe simular una jugada propia y anticipar la siguiente jugada del adversario, y elegir la opción mejor/menos mala
	*/

	document.getElementById('ayuda').innerHTML+= "<br>No te flipes!!";

	haysimula= true;
	var columna;

	columna= buscaIA("wins");
	if (hayganador){

		haysimula= false;
		juegaIA(columna,"WINS");
		return 1;
	}

	columna= buscaIA("blocks");
	if (hayganador){

		haysimula= false;
		juegaIA(columna,"BLOCKS");
		return 1;
	}

	columna= buscaIA("simula");
	haysimula= false;
	juegaIA(columna,"simula");

	//columna= buscaIA("random");
	//juegaIA(columna,"random");
}

function buscaIA(opcion){

	/*
	Busca la columna q consigue el objetivo del "estado"
	1. ganar la partida, 2. bloquear el adversario y 3. simular su propia siguiente jugada
	Llama caerFicha(), código adaptado de mueveFicha() y compruebaVecinos()
	*/

	var i= 0;
	var j= 0;
	var aux, mifila, micola, a;

	/*
	Si está bloqueando la jugada ganadora del adversario
	Disminuye el contador de turno, para simular q es el otro
	*/
	turno= (opcion=="blocks") ? --turno : turno;

	/*
	Si va a simular la mejor jugada, debe recorrer las 8 columnas
	Genera un vector q contenga las 8 columnas en order aleatorio, para no ir siempre desde 0 hasta 7
	*/
	if (opcion=="simula"){
		var v= generaVector();
	}

	/*
	Recorre las 8 columnas hasta q encuentre la columna q gana/bloquea
	O hasta q haya acabado de el bucle
	*/
	while (i<=colamax && !hayganador){

		/*
		Si va a simular la mejor jugada, usa el vector aleatorio, sino recorre las columnas de 0 a 7
		*/
		a= (opcion=="simula") ? v[i] : i;
		a= (opcion=="random") ? Math.floor(Math.random()*colamax) : a;

		/*
		Hace caer la ficha del usuario hasta la fila más baja posible
		*/
		aux= caerFicha(0,a);
		mifila= aux[0];
		micola= aux[1];

		/*
		Si recoge -1, quiere decir q la columna está llena
		Por tanto, no entra en la condición y no hace nada este paso del bucle
		*/
		if (mifila>=0){
			if (opcion=="random"){
				i= a+1;
				break;
			}
			/*
			Asigna la celda al jugador está simulando q sea el turno
			Este código es reciclado de mueveFicha(), pero no llamamos la función xq hace muchas más cosas
			Que no nos interesan xq estamos simulando jugadas
			*/
			matriz[mifila][micola]= (turno%2==0) ? 1 : 2;
			/*
			TODO: aún no funciona
			*/
			if (opcion=="simula"){
				turno++;
				j= buscaIA("predice");
				matriz[mifila][micola]= 0;
				turno--;
				if (!hayganador){
					console.log("IA knows nothing");
					i= a+1;
					break;
				}else{
					console.log("IA predicts win: "+j);
				}
			}else{
				/*
				Si está en 1. ganar la partida o 2. bloquear el adversario
				Comprueba si hay 4 fichas en línea de un mismo color
				Si las hay, llama a la función ganarJuego(), que hace hayganador= true
				Que hará no volver a entrar al bucle
				*/
				compruebaVecinos(mifila,micola);
				/*
				Reasigna la celda a 0, haciéndola vacía de nuevo
				*/
				matriz[mifila][micola]= 0;
			}
		}else{
			document.getElementById('ayuda').innerHTML= "Columna llena!";
		}

		/*
		El contador del bucle representa la columna q estamos jugando
		Si ha hecho hayganador= true, saldrá del bucle, pero aún aumentará i
		*/
		i++;
	}

	/*
	Si está bloqueando la jugada ganadora del adversario
	Vuelve a poner el contador de turno a su valor original
	*/
	turno= (opcion=="blocks") ? ++turno : turno;

	/*
	Devuelve la columna ganadora, pero ha sido incrementada en la última línea del bucle
	La decrementa para q devolcer la verdadera columna ganadora
	*/
	return --i;
}

function juegaIA(columna,opcion){

	/*
	Sigue los movimientos de cada jugada, como en pulsaBoton()
	*/

	var aux, mifila, micola;

	hayganador= false;
	console.log("IA "+opcion);
	aux= caerFicha(0,columna);
	mifila= aux[0];
	micola= aux[1];
	mueveFicha(mifila,micola);
	compruebaVecinos(mifila,micola);
}

function iniciaIA(){

	/*
	Es llamada para q la máquina juegue contra ella misma
	Llama turnoIA() para su "propio" turno
	En lugar de usar un bucle, q degenerará a bucle infinito
	Tras esperar un tiempo, se llama recursivamente a ella misma
	*/

	if (hayjuego){

		if (turno==(filamax+1)*(colamax+1)){
			document.getElementById('ayuda').innerHTML= "Se acabó el juego";
			document.getElementById('ayuda').style= "color: red;";
			hayjuego= false;
		}

		turnoIA();

		setTimeout(iniciaIA, 500);
	}
}

function ganarJuego(){

	/*
	Cuando se detectan 4 fichas en línea del mismo jugador
	Modifica las variables booleanas globales para acabar el juego
	*/

	var juga= ((turno-1)%2==0) ? "1" : "2";
	document.getElementById('ayuda').innerHTML= "Ha ganado el jugador "+juga;
	document.getElementById('ayuda').style= "color: red;";
	hayjuego= false;
	hayganador= true;
}

function generaMatriz(){

	/*
	Genera la matriz q guardará la ficha de cada jugador
	*/

	var i=0;
	var j=0;

	while(i<=filamax){
		matriz[i]= [];
		j=0;
		while(j<=colamax){

			matriz[i][j]= 0;
			j++;
		}
		i++;

	}

	hayjuego= true;
	//console.log(matriz);
}

function generaVector(){

	/*
	Genera un vector q contiene números del 0 al 7 en order aleatorio
	Aleatoriza un vector ordenado intercambiando sus posiciones de manera aleatoria
	*/

	var i;
	var v= [];
	var a, b;

	i=0;
	while (i<=colamax){
		v[i]=i;
		i++;
	}
	i=0;
	while (i<=colamax){
		a= Math.floor(Math.random()*colamax);
		b= v[i];
		v[i]= v[a];
		v[a]= b;
		i++;
	}

	return v;
}