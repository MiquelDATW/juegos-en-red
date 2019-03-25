
/* PARTIDA */

function resetJuego(){
	/*
	Reinicializa todas las variables y matrizes globales del juego
	*/
	matriz = generaMatriz();

	var i=0;
	while(i<FILAMAX){
		llena[i]=COLAMAX-1;
		i++;
	}

	newturno= 0;
	newjugador= JUGADOR1;
	hayjuego= true;
	hayganador= false;

	$('#b1').text("Reset juego");
	ayuda.text("Comienza la partida!").css("color","black");
	fila.children().removeClass().addClass("caja").text("");
}

function generaMatriz(){

	/*
	Genera la matriz q guardará la ficha de cada jugador
	*/

	var i=0;
	var j=0;
	var aux = [];

	while(i<FILAMAX){
		aux[i]= [];
		j=0;
		while(j<COLAMAX){

			aux[i][j]= 0;
			j++;
		}
		i++;

	}

	return aux;
}

function copiaMatriz(original){

	return $.extend(true, [], original);
}

function ganarJuego(){

	/*
	Cuando se detectan N fichas en línea del mismo jugador
	Modifica las variables booleanas globales para acabar el juego
	*/

	ayuda.text("Ha ganado el jugador "+newjugador).css("color","red");
	hayjuego= false;
	hayganador= true;
	$('#b1').text("Comenzar juego");
}

/* TABLERO */

function caerFicha(micola){

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
	var mifila= llena[micola];
	if (!haysimula){
		llena[micola]--;
	}

	/*
	Devuelve la fila donde "caería" la ficha en un juego real de mesa
	Siempre q no sea -1, q quiere decir q la columna está llena de fichas
	*/
	if (mifila>=0){
		return mifila;
	}else{
		return -1;
	}
}

function mueveFicha(mifila,micola){

	/*
	Si la columna está llena de fichas, no hace nada
	*/
	if (mifila<0 || micola<0){
		ayuda.text("ERROR <0");
		hayjuego= false;
		return -1;
	}

	/*
	Si matriz= 0, está sin ficha de ningún jugador
	Asigna la celda al jugador q sea el turno
	Pinta el fondo de la celda, y escribe el número del jugador
	El párrafo de ayuda muestra información de: turno, jugador y celda
	*/
	if (matriz[mifila][micola]==0){
		matriz[mifila][micola] = newjugador;

		if (newjugador==1){
			$(fila[mifila].children[micola]).removeClass().addClass("caja rojoC");
		}else{
			$(fila[mifila].children[micola]).removeClass().addClass("caja amarilloC");
		}

		$(fila[mifila].children[micola]).text(newjugador);
		ayuda.text("Turno: "+newturno+". Jugador: "+newjugador);
		ay1.text("Turno: "+newturno+". Jugador: "+newjugador);
		ay2.text("Turno: "+(newturno+1)+". Jugador: "+(newjugador == 1 ? 2 : 1));
		return 1;
	}else{

		ayuda.text("Celda llena!");
		return 0;
	}
}

function compruebaVecinos(yfila,xcola){

	/*
	Debe comprobar si hay N fichas en línea del mismo jugador
	La ficha acabada de introducir puede estar en cualquiera de N posiciones
	x000 0x000 00x0 000x -> la 1a, 2a, 3a o Na dentro del grupo de N posiciones q debemos comprobar
	Sólo tiene la celda de la ficha introducida y debe asegurarse de no salirse de la matriz
	Cuando compruebe las celdas vecinas
	Sigue 2 pasos:
		1. Se asegura q existan las celdas adyacentes
		2a. Llama a la función q comprueba las fichas sean del mismo jugador
		2b. De haber N en línea, internamente llama a ganarJuego()
	Con las booleanas hayjuego y hayganador, se evita hacer cálculos en vano
	*/

	var i, j, paso;

	/* Horizontal */

	if (hayjuego&&!hayganador){

		/*
		Debe comprobar q no esté cerca de los bordes y se salga de la matriz
		En horizontal sólo comprueba las columnas, la fila no varía
		*/

		/*
			x000 -> desde columna-0 hasta columna+N
		*/

		i=0;
		j=CONECTA-1;

		while(i<CONECTA){
			paso = (xcola-i>=0)&&(xcola+j<COLAMAX);
			if (paso && !hayganador){
				comprueba(yfila, yfila, xcola-i, xcola+j,1);
			}
			i++;
			j--;
		}
	}

	/* Vertical */

	if (hayjuego&&!hayganador){

		/*
		Debe comprobar q no esté cerca de los bordes y se salga de la matriz
		En vertical sólo comprueba las filas, la columna no varía
		*/

		/*
		Como las columnas, pero variando en filas
		*/

		i=0;
		j=CONECTA-1;
		while(i<CONECTA){
			paso = (yfila-i>=0)&&(yfila+j<FILAMAX);
			if (paso && !hayganador){
				comprueba(yfila-i, yfila+j, xcola, xcola,1);
			}
			i++;
			j--;
		}
	}

	/* Diagonal \ */

	if (hayjuego&&!hayganador){

		/*
		Debe comprobar q no esté cerca de los bordes y se salga de la matriz
		En diagonal debe comprobar las filas y columnas
		*/

		/*
			x--- 	debe avanzar en fila ↓ y en columna →
			-0-- 	desde fila-0 hasta fila+N
			--0- 	desde columna+0 hasta columna+N
			---0 	
		*/

		i=0;
		j=CONECTA-1;
		while(i<CONECTA){
			paso = (yfila-i>=0)&&(yfila+j<FILAMAX)&&(xcola-i>=0)&&(xcola+j<COLAMAX);
			if (paso && !hayganador){
				comprueba(yfila-i, yfila+j, xcola-i, xcola+j,1);
			}
			i++;
			j--;
		}
	}

	/* Diagonal / */

	if (hayjuego&&!hayganador){

		/*
		Debe comprobar q no esté cerca de los bordes y se salga de la matriz
		Esta diagonal es diferente del resto de casos xq ascendemos en las filas
		Debe restar a la fila conforme avanza en el grupo de N celdas adyacentes
		*/

		/*
			---0 	debe retroceder en fila ↑ y avanzar en columna →
			--0- 	desde fila+0 hasta fila-N
			-0-- 	desde columna-0 hasta columna+N
			x--- 	
		*/

		i=0;
		j=CONECTA-1;
		while(i<CONECTA){
			paso = (yfila+i<FILAMAX)&&(yfila-j>=0)&&(xcola-i>=0)&&(xcola+j<COLAMAX);
			if (paso && !hayganador){
				comprueba(yfila+i, yfila-j, xcola-i, xcola+j,0);
			}
			i++;
			j--;
		}
	}

	/*
	Como hace servir variables booleanas globales, no devuelve ningún resultado
	*/
}

function comprueba(f1,f2,c1,c2,opcion){

	/*
	Recoge los valores de la matriz para las N celdas adyacentes
	Para la 2a diagonal, el contador debe disminuir en las filas
	Comprueba si las N celdas están ocupadas por el mismo jugador
	Si la IA está haciendo simulaciones de la jugada, no llama ganarJuego()
	*/

	var celda= [];
	var a= f1;
	var b= c1;
	var i= 0;

	while (i<CONECTA){

		celda[i]= matriz[a][b];
		b= (c1==c2) ? c1 : b+1;
		a= (f1==f2) ? f1 : ((opcion==1) ? a+1 : a-1 );

		i++;
	}

	i=0;
	var c=0;
	while(i<CONECTA-1){

		if (celda[i]==celda[i+1]){
			c++;
		}
		i++;
	}

	if (c==CONECTA-1){
		if (!haysimula){
			ganarJuego();
		}
		hayganador= true;
	}
}

/* JUGADOR */

function pulsaBoton(micola){
	/*
	Lee la jugada del usuario
	*/
	if (hayjuego && newjugador==JUGADOR1){

		/*
		Hace caer la ficha del usuario hasta la fila más baja posible
		*/
		var mifila= caerFicha(micola);

		/*
		Si recoge -1, quiere decir q la columna está llena
		Por tanto, sale de la función y no hace nada
		*/
		if (mifila==-1){
			ayuda.text("Columna llena! Elige otra!");
			return -1;
		}

		/*
		Pinta la jugada, actualiza la matriz de jugadas y avanza el turno
		*/
		newturno++;
		var ficha = mueveFicha(mifila,micola);

		/*
		Comprueba si hay N fichas en línea de un mismo color
		Si las hay, llama a la función ganarJuego(), que hace hayjuego= false
		*/
		if (ficha==1){
			compruebaVecinos(mifila,micola);
			/*
			Si está jugando contra la máquina, inicia el turno de la IA
			*/
			newjugador = JUGADOR2;
			if ($('#opcion1').is(':checked') && hayjuego){
				setTimeout(turnoIA, 250);
			}
		}


		/*
		Si no se ha ganado el juego, comprueba si se ha llenado el tablero
		*/
		if (newturno==(FILAMAX)*(COLAMAX)){
			ayuda.text("Se acabó el juego").css("color","red");
			hayjuego= false;
		}
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

	//ayuda.html("<b>No te flipes!!</b>");

	haysimula= true;
	var columna;

	//columna= buscaIA("wins");
	columna = winnerIA(newturno);
	if (hayganador){

		haysimula= false;
		juegaIA(columna,"WINS");
		return 1;
	}

	//columna= buscaIA("blocks");
	columna = blockerIA(newturno);
	if (hayganador){

		haysimula= false;
		juegaIA(columna,"BLOCKS");
		return 1;
	}

	columna= buscaIA("simula");
	//columna = simulerIA(newturno);
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
	var juga, mifila, micola, a;

	/*
	Si está bloqueando la jugada ganadora del adversario
	Disminuye el contador de turno, para simular q es el otro
	*/
	var miturno = (opcion=="blocks") ? (newturno-1) : ((opcion=="predice") ? (newturno+1) : newturno);

	if (opcion=="predice"){
		console.log("Predice");
	}

	/*
	Si va a simular la mejor jugada, debe recorrer las 8 columnas
	Genera un vector q contenga las 8 columnas en order aleatorio, para no ir siempre desde 0 hasta 7
	*/
	if (opcion=="simula"){
		var v= generaVector(COLAMAX);
	}

	/*
	Recorre las 8 columnas hasta q encuentre la columna q gana/bloquea
	O hasta q haya acabado de el bucle
	*/
	while (i<COLAMAX && !hayganador){

		/*
		Si va a simular la mejor jugada, usa el vector aleatorio, sino recorre las columnas de 0 a 7
		*/
		a= (opcion=="simula") ? v[i] : i;
		a= (opcion=="random") ? generaNumeroAleatorio(COLAMAX) : a;

		/*
		Hace caer la ficha del usuario hasta la fila más baja posible
		*/
		mifila= caerFicha(a);
		micola= a;

		/*
		Si recoge -1, quiere decir q la columna está llena
		Por tanto, no entra en la condición y no hace nada este paso del bucle
		*/
		if (mifila>=0){
			//if (opcion=="random"){
			//	i= a+1;
			//	break;
			//}
			/*
			Asigna la celda al jugador está simulando q sea el turno
			Este código es reciclado de mueveFicha(), pero no llamamos la función xq hace muchas más cosas
			Que no nos interesan xq estamos simulando jugadas
			*/
			juga= (miturno%2==0) ? 1 : 2;
			matriz[mifila][micola] = juga;
			/*
			TODO: aún no funciona
			*/
			if (opcion=="simula"){

				j= buscaIA("predice");
				matriz[mifila][micola]= 0;

				if (!hayganador){
					//console.log("IA knows nothing");
					i= a+1;
					break;
				}else{
					//console.log("IA predicts win: "+j);
				}
			}else{
				/*
				Si está en 1. ganar la partida o 2. bloquear el adversario
				Comprueba si hay N fichas en línea de un mismo color
				Si las hay, llama a la función ganarJuego(), que hace hayganador= true
				Que hará no volver a entrar al bucle
				*/
				compruebaVecinos(mifila,micola);
				/*
				Reasigna la celda a 0, haciéndola vacía de nuevo
				*/
				matriz[mifila][micola]= 0;
			}
		}/*else{
			ayuda.text("Columna llena!");
		}*/

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
	miturno= (opcion=="blocks") ? newturno+1 : ((opcion=="predice") ? (newturno-1) : newturno);

	/*
	Devuelve la columna ganadora, pero ha sido incrementada en la última línea del bucle
	La decrementa para q devolcer la verdadera columna ganadora
	*/
	return --i;
}

function juegaIA(micola,opcion){

	/*
	Sigue los movimientos de cada jugada, como en pulsaBoton()
	*/

	var mifila;

	hayganador= false;
	console.log("IA "+opcion);
	mifila= caerFicha(micola);
	newturno++;
	mueveFicha(mifila,micola);
	compruebaVecinos(mifila,micola);

	newjugador = JUGADOR1;
}

function iniciaIA(){

	/*
	Es llamada para q la máquina juegue contra ella misma
	Llama turnoIA() para su "propio" turno
	En lugar de usar un bucle, q degenerará a bucle infinito
	Tras esperar un tiempo, se llama recursivamente a ella misma
	*/

	if (hayjuego){

		if (newturno==(FILAMAX)*(COLAMAX)){
			ayuda.text("Se acabó el juego").css("color","red");
			hayjuego= false;
		}

		turnoIA();

		setTimeout(iniciaIA, 500);
	}
}

function generaVector(numero){

	/*
	Genera un vector q contiene números del 0 al 7 en order aleatorio
	Aleatoriza un vector ordenado intercambiando sus posiciones de manera aleatoria
	*/

	var i;
	var v= [];
	var a, b;

	i=0;
	while (i<numero){
		v[i]=i;
		i++;
	}
	i=0;
	while (i<numero){
		a= generaNumeroAleatorio(numero);
		b= v[i];
		v[i]= v[a];
		v[a]= b;
		i++;
	}

	return v;
}

function generaNumeroAleatorio(numero){

	return Math.floor(Math.random()*(numero))
}


/***************************************************************************/

function winnerIA(trn){

	var matriz2 = [];
	var llena2 = [];

	var i= 0;
	var j= 0;
	var juga, mifila, micola, a;

	var miturno = trn;

	var v= generaVector(COLAMAX);

	while (i<COLAMAX && !hayganador){

		a= v[i];
		matriz2 = copiaMatriz(matriz);
		llena2 = copiaMatriz(llena);

		mifila= caerFicha2(a,llena2);
		micola= a;

		if (mifila>=0){
			juga= (miturno%2==0) ? 1 : 2;
			matriz2[mifila][micola] = juga;

			compruebaVecinos2(mifila,micola,matriz2);
			matriz2[mifila][micola]= 0;
		}else{
			ayuda.text("Columna llena!");
		}
		i++;
	}

	return a;
}

function blockerIA(trn){

	var matriz2 = [];
	var llena2 = [];

	var i= 0;
	var j= 0;
	var juga, mifila, micola, a;

	var miturno = trn-1;

	while (i<COLAMAX && !hayganador){

		a= i;
		matriz2 = copiaMatriz(matriz);
		llena2 = copiaMatriz(llena);

		mifila= caerFicha2(a,llena2);
		micola= a;

		if (mifila>=0){
			juga= (miturno%2==0) ? 1 : 2;
			matriz2[mifila][micola] = juga;

			compruebaVecinos2(mifila,micola,matriz2);
			matriz2[mifila][micola]= 0;
		}else{
			ayuda.text("Columna llena!");
		}
		i++;
	}

	return a;
}

function caerFicha2(micola,aux){

	var mifila= aux[micola];
	if (!haysimula){
		aux[micola]--;
	}
	if (mifila>=0){
		return mifila;
	}else{
		ayuda.text("Columna llena!");
		return -1;
	}
}

function mueveFicha2(mifila,micola,aux){

	if (mifila<0 || micola<0){
		ayuda.text("ERROR <0");
		hayjuego= false;
		return -1;
	}

	if (aux[mifila][micola]==0){
		aux[mifila][micola]= newjugador;

		if (newjugador==1){
			$(fila[mifila].children[micola]).removeClass().addClass("caja rojoC");
		}else{
			$(fila[mifila].children[micola]).removeClass().addClass("caja amarilloC");
		}

		$(fila[mifila].children[micola]).text(newjugador);
		ayuda.text("Turno: "+newturno+". Jugador: "+newjugador);
		ay1.text("Turno: "+newturno+". Jugador: "+newjugador);
		ay2.text("Turno: "+(newturno+1)+". Jugador: "+(newjugador == 1 ? 2 : 1));

		return 1;
	}else{
		ayuda.text("Celda llena!");
		return 0;
	}
}

function compruebaVecinos2(yfila,xcola,aux){

	var i, j, paso;

	if (hayjuego&&!hayganador){
		i=0;
		j=CONECTA-1;

		while(i<CONECTA){
			paso = (xcola-i>=0)&&(xcola+j<COLAMAX);
			if (paso && !hayganador){
				comprueba2(yfila, yfila, xcola-i, xcola+j,1,aux);
			}
			i++;
			j--;
		}
	}

	if (hayjuego&&!hayganador){
		i=0;
		j=CONECTA-1;
		while(i<CONECTA){
			paso = (yfila-i>=0)&&(yfila+j<FILAMAX);
			if (paso && !hayganador){
				comprueba2(yfila-i, yfila+j, xcola, xcola,1,aux);
			}
			i++;
			j--;
		}
	}

	if (hayjuego&&!hayganador){
		i=0;
		j=CONECTA-1;
		while(i<CONECTA){
			paso = (yfila-i>=0)&&(yfila+j<FILAMAX)&&(xcola-i>=0)&&(xcola+j<COLAMAX);
			if (paso && !hayganador){
				comprueba2(yfila-i, yfila+j, xcola-i, xcola+j,1,aux);
			}
			i++;
			j--;
		}
	}

	if (hayjuego&&!hayganador){
		i=0;
		j=CONECTA-1;
		while(i<CONECTA){
			paso = (yfila+i<FILAMAX)&&(yfila-j>=0)&&(xcola-i>=0)&&(xcola+j<COLAMAX);
			if (paso && !hayganador){
				comprueba2(yfila+i, yfila-j, xcola-i, xcola+j,0,aux);
			}
			i++;
			j--;
		}
	}
}

function comprueba2(f1,f2,c1,c2,opcion,aux){

	var celda= [];
	var a= f1;
	var b= c1;
	var i= 0;

	while (i<CONECTA){

		celda[i]= aux[a][b];
		b= (c1==c2) ? c1 : b+1;
		a= (f1==f2) ? f1 : ((opcion==1) ? a+1 : a-1 );

		i++;
	}

	i=0;
	var c=0;
	while(i<CONECTA-1){

		if (celda[i]==celda[i+1]){
			c++;
		}
		i++;
	}

	if (c==CONECTA-1){
		if (!haysimula){
			ganarJuego();
		}
		hayganador= true;
	}
}