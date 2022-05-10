import { databaseTable } from './db';

class TreeOptimizer {
	constructor(query) {
		this.leaves = [];
		this.leaves.push(new No('', '', query.FROM));
		console.log(query);
		console.log(query.JOIN);
		for (let table of query.JOIN) {
			let aux = new No('', '', table);

			this.leaves.push(aux);
		}
	}

	buildTree(query) {}

	printLeaves() {
		for (let leave of this.leaves) {
			console.log(leave, '-->');
		}
	}

	getTable(table, select) {
		for (let i of select) {

		}

		databaseTable
	}
}

class No {
	constructor(selecao, projecao, name) {
		this.aresta = new Aresta(selecao, projecao);
		this.name = name;
	}

	setPai(no) {
		this.pai = no;
	}
}

class Aresta {
	constructor(selecao, projecao) {
		this.selecao = selecao;
		this.projecao = projecao;
	}
}

let relationalAlgebraStrings = {
	SELECT: function (body) {
		return `π ${body}`;
	},
	JOIN: function (body, fromBody) {
		let relationalBodyString = `${fromBody} ⋈ ${body['ON'][0]} ${body['JOIN'][0]}`;
		//delete body['ON'][0];
		//delete body['JOIN'][0];

		body['JOIN'].forEach((joinValue, index) => {
			const onValue = body['ON'][index];

			relationalBodyString = `${relationalBodyString} ⋈ ${onValue} ${joinValue}`;
		});

		return `(${relationalBodyString})`;
	},
	WHERE: function (body) {
		return `σ ${body} `;
	}
};

/*function printTest() {
	console.log(bodies);
	console.log();
	console.log(relationalAlgebraStrings['SELECT'](bodies['SELECT']));
	console.log(relationalAlgebraStrings['WHERE'](bodies['WHERE']));

	let joinAux = { JOIN: bodies['JOIN'], ON: bodies['ON'] };

	console.log(relationalAlgebraStrings['JOIN'](joinAux, bodies['FROM']));
}*/

//printTest();
const teste = "SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRIÇÃO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA WHERE SALDOINICIAL < 3000 AND UF = 'CE' AND DESCRIÇÃO <> 'CONTA CORRENTE'";

console.log('----------------------------------------------------------------');
console.log(splitQueryIntoBodies(teste));
const tree = new TreeOptimizer(splitQueryIntoBodies(teste));
console.log('leaves: ', tree.printLeaves());

export function splitQueryIntoBodies(query) {
	let mySqlStringSplitted = query.split(' ');

	let bodies = {};

	let auxBody = '';
	let keyWords = ['SELECT', 'FROM', 'JOIN', 'ON', 'WHERE'];
	let auxKeyWord = '';

	for (let word of mySqlStringSplitted) {
		if (keyWords.includes(word)) {
			let auxBodyArray =
				bodies[auxKeyWord] == undefined ? [] : bodies[auxKeyWord];
			auxBodyArray.push(auxBody.trim());

			bodies[auxKeyWord] = auxBodyArray;

			auxKeyWord = word;
			auxBody = '';
		} else {
			auxBody += word + ' ';
		}
	}

	bodies[auxKeyWord] = auxBody.trim();

	Object.entries(bodies).forEach(([key, value]) => {
		if (key != 'JOIN' && key != 'ON' && key != 'WHERE') {
			bodies[key] = value[0];
		}
	});

	Object.entries(bodies['ON']).forEach(([key, value]) => {
		let contents = value.split("=")
		let contentLeft = {}
		let contentRight = {}


        if (contents[0].trim().split(".").length < 2) {
            contentLeft = { "table": " ", "atribute": contents[0].trim().split(".")[0] }
            contentRight = { "table": " ", "atribute": contents[1].trim().split(".")[0] }
        } else {
            contentLeft = { "table": contents[0].trim().split(".")[0], "atribute": contents[0].trim().split(".")[1] }
            contentRight = { "table": contents[1].trim().split(".")[0], "atribute": contents[1].trim().split(".")[1] }
        }

        bodies['ON'][key] = { "left": contentLeft, "right": contentRight }
    });

	delete bodies[''];
	return bodies;
}
