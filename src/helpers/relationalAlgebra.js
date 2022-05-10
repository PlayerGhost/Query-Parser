import { TreeOptimizer } from "./classes/Tree";

const teste =
	"SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRIÇÃO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA WHERE SALDOINICIAL < 3000 AND UF = 'CE' AND DESCRIÇÃO <> 'CONTA CORRENTE'";

let mySqlStringSplitted = teste.split(' ');

let bodies = {};

const KEYWORDS = ['SELECT', 'FROM', 'JOIN', 'ON', 'WHERE'];

function splitQueryIntoBodies(query) {
	let mySqlStringSplitted = query.split(' ');

	let bodies = {};

	let auxBody = '';
	let auxKeyWord = '';

	for (let word of mySqlStringSplitted) {
		const uppercaseWord = word.toUpperCase();

		if (KEYWORDS.includes(uppercaseWord)) {
			let auxBodyArray = bodies[auxKeyWord] || [];
			auxBodyArray.push(auxBody.trim());

			bodies[auxKeyWord] = auxBodyArray;

			auxKeyWord = uppercaseWord;
			auxBody = '';
		} else {
			auxBody += uppercaseWord + ' ';
		}
	}

	bodies[auxKeyWord] = auxBody.trim();

	Object.entries(bodies).forEach(([key, value]) => {
		if (!['JOIN', 'ON', 'WHERE'].includes(key)) {
			bodies[key] = value[0];
		}
	});

	delete bodies[''];
	return bodies;
}

function makeTree(query){
    const tree = new TreeOptimizer(query)
    tree.printLeaves()
}

const value = splitQueryIntoBodies(teste)
console.log(value)
makeTree(value)