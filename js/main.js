var programs         = [];
var counter          = 0;
const progsByBatch   = 4;
const addition       = 1;
const substraction   = 2;
const multiplication = 3;
const division       = 4;
const module         = 5;
const nroot          = 6;
var appendError = function( node , errorMessage ) {
    var parent    = node.parentNode;
    var errorSpan = document.createElement( 'span' );
    var message   = document.createTextNode( errorMessage );
    errorSpan.appendChild( message );
    parent.appendChild( errorSpan );
}
var removeError = function( node ) {
    node.removeAttribute( 'class' );
    var parent       = node.parentNode;
    var errorSpan    = node.nextElementSibling;
    parent.removeChild( errorSpan );
}
var removeFirstProcess = function() {
    var currentBatch    = document.getElementById('current-batch');
    var spanWillRemoved = currentBatch.firstChild;

    currentBatch.removeChild(spanWillRemoved);
    spanWillRemoved = currentBatch.firstChild;
    currentBatch.removeChild(spanWillRemoved);
}
var restart = function() {
    var i;
    var inputs = {
        inputName: document.getElementById( 'name' ),
        inputNum1: document.getElementById( 'num1' ),
        inputOp: document.getElementById( 'op' ),
        inputNum2: document.getElementById( 'num2' ),
        inputMaxTime: document.getElementById( 'max-time' ),
        inputIdProgram: document.getElementById( 'id-program' )
    };
    for (var key in inputs) {
        inputs[key].value = '';
    }
    inputs.inputOp.value = 'none';
}
var guardar = function() {
    var currentProg = validate();
    var counterSpan = document.getElementById('counter');
    if( currentProg ) {
        if( opValidate( currentProg ) ) {
        	if( idValidation( currentProg.idProgram ) ) {
        		programs[counter] = currentProg;
	            counter ++;
	            swal("Muy bien " + currentProg.name , "Tu programa ha sido guardado" , "success");
	            counterSpan.innerText = counter;
	            restart();
        	}
        	else {
        		var imageUrl = getImageUrl();
        		swal({
                	title: 'Id inválido',
                    text: 'El número de programa que intentas ingresar, ya ha sido registrado',
                    imageUrl: imageUrl
                });
        	}
        }
    }
}
var validate = function() {
    var currentProg  = null;
    var errorMessage = '';

    var inputs = {
        inputName: document.getElementById('name'),
        inputNum1: document.getElementById('num1'),
        inputOp: document.getElementById('op'),
        inputNum2: document.getElementById('num2'),
        inputMaxTime: document.getElementById('max-time'),
        inputIdProgram: document.getElementById('id-program')
    };
    var errors        = 0;
    for (var key in inputs) {
        if( inputs[key].value.trim() === '' ) {
            if( inputs[key].getAttribute( 'class' ) !== 'error' ) {
                inputs[key].setAttribute( 'class' , 'error' );
                errorMessage = 'Campo requerido';
                appendError( inputs[key] , errorMessage );
            }
            errors ++;
        }
        else if ( key === 'inputOp' ) {
            if( inputs[key].value === 'none' ) {
                if( inputs[key].getAttribute( 'class' ) === 'error' ) {
                    removeError( inputs[key] );
                }
                inputs[key].setAttribute( 'class' , 'error' );
                errorMessage = 'Selecciona operación!';
                appendError( inputs[key] , errorMessage );
                errors ++;
            }
            else if( inputs[key].getAttribute( 'class' ) === 'error' ) {
                removeError( inputs[key] );
            }
        }
        else if( inputs[key].getAttribute( 'class' ) === 'error' ) {
            removeError( inputs[key] );
        }
    }

    if( errors === 0 ) {
        currentProg = {
            name: inputs['inputName'].value,
            num1: inputs['inputNum1'].value,
            op: inputs['inputOp'].value,
            num2: inputs['inputNum2'].value,
            maxTime: inputs['inputMaxTime'].value,
            idProgram: inputs['inputIdProgram'].value
        };
    }
	return currentProg;
}
var getImageUrl = function() {
	var rand     = Math.round((Math.random() * 100)) % 2;
    var imageUrl = "images/error.png";
    if ( rand ) {
        imageUrl = "images/no.png";
    }
    return imageUrl;
}
var opValidate = function( program ) {
    var valid = true;
    var imageUrl = getImageUrl();
    switch ( program.op ) {
        case 'division':
            if( program.num2 == 0 ) {
                swal({
                	title: 'Operación inválida',
                    text: 'No puedes hacer una división entre cero',
                    imageUrl: imageUrl
                });
                valid = false;
            }
        break;
        case 'module':
            if( program.num2 == 0 ) {
                swal({
                	title: 'Operación inválida',
                    text: 'No puedes obtener un módulo entre cero',
                    imageUrl: imageUrl
                });
                valid = false;
            }
        break;
        case 'root':
            if ( (isEven(program.num1) && program.num2 < 0) || (program.num1 == 0 && program.num2 == 0)) {
                swal({
                    title: 'Operación inválida',
                    text: 'No puedes obtener la raíz par de un número negativo, ni la raíz cero de cero',
                    imageUrl: imageUrl
                });
                valid = false;
            }
        break;
    }
    return valid;
}
function isEven( n ) {
    n = Number( n );
    return n === 0 || !!( n && !(n%2) );
}
function getNRoot( n, x ) {
    var nroot;
    //Está validado que no se puedan obtener raíces pares de números negativos
    x = Math.abs(x);
    if ( n > 0 ) {
        n     = 1/n;
        nroot = Math.pow( x, n );
    } else if ( n == 0 ) {
        //Ya validé que no puedan ser n=0 y x=0
        nroot = 1;
    } else {
        n     = 1/Math.abs( n );
        nroot = 1/Math.pow( x, n );
    }
    return nroot;
}
var idValidation = function( id ) {
    var valid = true;
    for (var i = programs.length - 1; i >= 0; i--) {
        if ( programs[i].idProgram == id ) {
            valid = false;
            break;
        }
    }
    return valid;
}
var batchGenerate = function( ini , end ) {
    var i;
    var spanId;
    var spanMte;
    var content;
    var totalTime      = 0;
    var batchesSection = document.getElementById( 'batches' );
    var batchesDiv     = document.createElement( "div" );
    batchesDiv.setAttribute( 'id' , 'current-batch' );
    batchesSection.appendChild( batchesDiv );
    for ( i = ini; i < end; i ++ ) {
        spanId    = document.createElement( "span" );
        spanMte   = document.createElement( "span" );
        content   = document.createTextNode( programs[i].idProgram );
        spanId.appendChild( content );
        spanId.setAttribute( 'class' , 'left' );
        content     = document.createTextNode( programs[i].maxTime );
        totalTime += parseInt( programs[i].maxTime ) + 1;
        spanMte.appendChild( content );
        spanMte.setAttribute( 'class' , 'right' );
        batchesDiv.appendChild( spanId );
        batchesDiv.appendChild( spanMte );
    }
    return totalTime;
}
var batchRemove = function( pendingBatches ) {
    var oldBatch = document.getElementById('current-batch');
    if (oldBatch) {
        pendingBatches.value = pendingBatches.value - 1;
        oldBatch.remove();
    }
}
var getOperation = function( n1 , n2 , op ) {
    var operation;
    switch ( op ) {
        case 'sum' :
            operation = n1 + " + " + n2;
        break;
        case 'substraction' :
            operation = n1 + " - " + n2;
        break;
        case 'multiplication' :
            operation = n1 + " * " + n2;
        break;
        case 'division' :
            operation = n1 + " / " + n2;
        break;
        case 'module' :
            operation = n1 + " módulo " + n2;
        break;
        case 'root' :
            operation = "raíz(" + n1 + "," + n2 + ")";
        break;
    }
    return operation;
}
var getResultS = function( n1 , n2 , op ) {
    var result;
    switch ( op ) {
        case 'sum' :
            result = parseFloat(n1) + parseFloat(n2);
        break;
        case 'substraction' :
            result = n1 - n2;
        break;
        case 'multiplication' :
            result = n1 * n2;
        break;
        case 'division' :
            result = n1 / n2;
        break;
        case 'module' :
            result = n1 % n2;
        break;
        case 'root' :
            result = getNRoot( n1, n2 );
        break;
    }
    return result;
}
var getOpAndResult = function(index) {
    var opAndResult = getOperation( programs[index].num1, programs[index].num2, programs[index].op ) + 
                      ' = ' + getResultS( programs[index].num1, programs[index].num2, programs[index].op);
    return opAndResult;
}
var printResult = function( index ) {
    var resultsSection  = document.getElementById( 'results' );
    var spanId          = document.createElement( 'span' );
    var spanOpAndResult = document.createElement( 'span' );
    var spanBatchNumber = document.createElement( 'span' );
    var textId          = document.createTextNode( programs[index].idProgram );
    var textOpAndResult = document.createTextNode( getOpAndResult(index) );
    var textBatchNumber = document.createTextNode( Math.ceil((index + 1)/progsByBatch) );

    spanId.setAttribute( 'class', 'col-md-3' );
    spanOpAndResult.setAttribute( 'class', 'col-md-6' );
    spanBatchNumber.setAttribute( 'class', 'col-md-3 center-text' );
    spanId.appendChild( textId );
    spanOpAndResult.appendChild( textOpAndResult );
    spanBatchNumber.appendChild( textBatchNumber );
    resultsSection.appendChild( spanId );
    resultsSection.appendChild( spanOpAndResult );
    resultsSection.appendChild( spanBatchNumber );
}
var excecuteProcess = function( limit, totalTime, pastTime, remainingTime, index ) {
    var i         = 0;
    var myProcess = setInterval( function() {
        if ( i < limit )  {
            i ++;
            totalTime.value ++;
            pastTime.value ++;
            remainingTime.value --;
        } else {
            printResult( index );
            if ( (index + 1) % progsByBatch !== 0 || index + 1 === programs.length ) {
                removeFirstProcess();
            }
            clearInterval( myProcess );
        }
    }, 1000 );
}
var excecuteBatch = function( index, end, inputs ) {
    var timeSleep      = 0;
    var totalTimeSleep = 0;
    var ini            = index;
    while ( index < end ) {
        (function( ind ) {
            if ( ind > ini ) {
                timeSleep       = programs[ind-1].maxTime;
                totalTimeSleep += parseInt( timeSleep ) + 1;
            }
            setTimeout( function() {
                inputs.inputName.value          = programs[ind].name;
                inputs.inputOp.value            = getOperation( programs[ind].num1 , programs[ind].num2 , programs[ind].op );
                inputs.inputMaxTime.value       = programs[ind].maxTime;
                inputs.inputId.value            = programs[ind].idProgram;
                inputs.inputPastTime.value      = 0;
                inputs.inputRemainingTime.value = programs[ind].maxTime;
                excecuteProcess(
                    programs[ind].maxTime,
                    inputs.inputTotalTime,
                    inputs.inputPastTime,
                    inputs.inputRemainingTime,
                    ind
                );
            }, (totalTimeSleep) * 1000 );
        })(index);
        index++;
    }
}
var getSleepTimeByBatch = function( ini , end ) {
    var i;
    var totalTime = 0;
    for ( i = ini; i < end; i ++ ) {
        totalTime += parseInt( programs[i].maxTime ) + 1;
    }
    return totalTime;
}
var changeToExcecutionView = function() {
    var initForm  = document.getElementById('init-form');
    var execution = document.getElementById('execution');

    initForm.setAttribute('class', 'hidden');
    execution.removeAttribute('class');
}
var excecute = function() {
    var i,timer,secondaryLimit;
    var numBatches  = Math.ceil(counter/progsByBatch);
    var remaining   = counter % progsByBatch;
    var exact       = remaining ? false : true;
    var finishRound = false;
    var totalTime   = 0;
    var sleepTimes  = [];
    var sleepTime   = 0;
    var finishRound = false;
    var inputs      = {
        inputName: document.getElementById('name-process'),
        inputOp: document.getElementById('op-process'),
        inputMaxTime: document.getElementById('time-process'),
        inputId: document.getElementById('id-process'),
        inputPastTime: document.getElementById('past-time-process'),
        inputRemainingTime: document.getElementById('remaining-time-process'),
        inputTotalTime: document.getElementById('total-time'),
        inputPendingBatches: document.getElementById('pending-batches')
    };
    changeToExcecutionView();
    //Inicialización del input de "lotes pendientes" (si es que hay lotes)
    if ( progsByBatch > 0 ) {
        inputs.inputPendingBatches.value = numBatches - 1;
    }
    //Cálculo de los tiempos que debe detenerse el for principal para cada iteración.
    for( i = 0; i < numBatches; i ++ ) {
        sleepTimes[i]  = sleepTime;
        secondaryLimit = i * progsByBatch + progsByBatch;
        if ( i === numBatches - 1 ) {
            finishRound = true;
            if( exact ) {
                secondaryLimit = i * progsByBatch + progsByBatch;
            }
            else {
                secondaryLimit = i * progsByBatch + remaining;
            }
        }
        sleepTime += getSleepTimeByBatch( i * progsByBatch, secondaryLimit );
    }
    //Inicio del for principal
    for( i = 0; i < numBatches; i ++ ) {
        (function( index , nBatches ) {
            setTimeout(function() {
                secondaryLimit = index * progsByBatch + progsByBatch;
                if( index === nBatches - 1 ) {
                    finishRound = true;
                    if( exact ) {
                        secondaryLimit = index * progsByBatch + progsByBatch;
                    }
                    else {
                        secondaryLimit = index * progsByBatch + remaining;
                    }
                }
                batchRemove( inputs.inputPendingBatches );
                totalTime += batchGenerate( index * progsByBatch , secondaryLimit );
                sleepTime += totalTime;

                excecuteBatch( index * progsByBatch , secondaryLimit, inputs );

            }, sleepTimes[index] * 1000);
        })( i , numBatches);
    }
}
