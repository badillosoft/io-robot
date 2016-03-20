# IO-Robot

Alan Badillo Salas

## Introducción

IO-Robot es un proyecto para programar robots vía JSON.
Cada json recibido representa un comando y sus
parámetros, los cuales pueden variar dependiendo
del comando.
Cada que el robot recibe un json de entrada, intenta
ejecutar los comandos descritos y devuelve
un json como salida con la información sobre si pudo
ejecutar el comando y el estado parcial que fue
modificado.

## Crear un comando

El robot inicialmente posee un conjunto
dado de comandos, sin embargo, podemos
reemplazar los comandos o crear nuevos
comandos a través del comando `create`.

Los comandos creados deberán
implementar las siguientes claves en el
json, con el fin que el robot funcione
correctamente.

> Ejemplo del comando norm

~~~js
{
	command: 'create',
	library: 'vector',
	name: "norm",
	params: [
		{
			name: 'vector',
			flag: 'v',
			type: 'vector'
		}
	]
	output: '$v.x * $v.x + $v.y * $v.y'
}
~~~ 

> Ejemplo del comando normalize

~~~js
{
	command: 'create',
	library: 'vector',
	name: "normalize",
	params: [
		{
			name: 'vector',
			flag: 'v',
			type: 'vector'
		}
	],
	process: 'var r = $v.x * $v.x + $v.y * $v.y',
	output: {
		x: '$v.x / r',
		y: '$v.y / r',
		z: '$v.z / r'
	}
}
~~~ 

> Ejemplo del comando +

~~~js
{
	command: 'create',
	library: 'vector',
	name: "sum",
	alias: "+",
	params: [
		{
			name: 'u',
			flag: 'u',
			type: 'vector'
		},
		{
			name: 'v',
			flag: 'v',
			type: 'vector'
		}
	],
	output: {
		x: '$u.x + $v.x',
		y: '$u.y + $v.y',
		z: '$u.z + $v.z'
	}
}
~~~

> Ejemplo del comando angle

~~~js
{
	command: 'create',
	library: 'vector',
	name: "angle",
	params: [
		{
			name: 'u',
			flag: 'u',
			type: 'vector'
		},
		{
			name: 'v',
			flag: 'v',
			type: 'vector'
		}
	],
	process: [
		'var un = $.normalize($u)',
		'var vn = $.normalize($v)',
		'var a = $.dot(un, vn)'
	],
	output: 'a'
}
~~~ 

## Comandos

A continuación se describirá cada comando con sus
parámetros y tipo de dato con el siguiente formato
`comando:id parametro|corto=valorDefecto@tipo ...`.

**status flags|f@[string]** - muestra el estado del
robot en los flags habilitados.

> Ejemplo

~~~js
{
	command: 'status',
	flags: [
		'position',
		'angle',
		'world_angle',
		'dx',
		'all'
	]
}
~~~

**move distance|d@number forward|fw=true@bool** -
mueve el robot la distancia especificada.

**sensor limit|l=0@number** - obtiene la distancia
del sensor que apunta hacia donde se mueve
el robot, el límite menor a cero significa infinito.

## Comandos de la librería vector

La librería vector permite realizar operaciones
entre vectores haciendo que el robot las compute
y nos devuelva el resultado.

Para ejecutar un comando de la librería vector
tenemos que añadirle la clave `library` a nuestro
json con el valor ["vector"].

**norm vector|v@vector** - obtiene
la norma euclidiana del vector.

**normalize vector|v@vector** - obtiene
el vector unitario del vector.

**angle u@vector v@vector** - obtiene el ángulo
entre dos vectores.

**distance u@vector v={x:0,y:0}@vector** - 
obtiene la distancia entre dos vectores.

**+ u@vector v@vector** - suma dos vectores.

**- u@vector v@vector** - resta dos vectores.

*** u@vector v@vector** - devuelve el producto interno
entre dos vectores.

**rotate vector|v@vector angle|a@number** - rota el 
vector según el ángulo.