const teste =
	"SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRIÇÃO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA WHERE SALDOINICIAL < 3000 AND UF = 'CE' AND DESCRIÇÃO <> 'CONTA CORRENTE'";

let mySqlStringSplitted = teste.split(' ');

let bodies = {};

let relationalAlgebraStrings = {
	SELECT: function (body) {
		return `π ${body}`;
	},
	JOIN: function (body, fromBody) {
		let relationalBodyString = `${fromBody} ⋈ ${body['ON'][0]} ${body['JOIN'][0]}`;
		delete body['ON'][0];
		delete body['JOIN'][0];

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

delete bodies[''];

function printTest() {
	console.log(bodies);
	console.log();
	console.log(relationalAlgebraStrings['SELECT'](bodies['SELECT']));
	console.log(relationalAlgebraStrings['WHERE'](bodies['WHERE']));

	let joinAux = { JOIN: bodies['JOIN'], ON: bodies['ON'] };

	console.log(relationalAlgebraStrings['JOIN'](joinAux, bodies['FROM']));
}

printTest();

//console.log(1)
