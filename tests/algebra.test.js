import { TreeOptimizer } from '../src/helpers/relationalAlgebra';

test('PASS - Simple query 1', () => {
	const query = `SELECT IDUSUARIO, NOME, LOGRADOURO FROM USUARIO;`;
	const tree = new TreeOptimizer(splitQueryIntoBodies(query));
	let treeStructure = tree.buildJunction(tree.leaves);
	console.log(treeStructure);
	expect(treeStructure).toBeDefined();
});

test('PASS - Medium query 1', () => {
	const query = `SELECT IDUSUARIO, NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL, UF, DESCRIÇÃO FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO JOIN TIPOCONTA ON TIPOCONTA.IDTIPOCONTA = CONTAS.TIPOCONTA_IDTIPOCONTA WHERE SALDOINICIAL < 3000 AND UF <> 'CE' AND DESCRIÇÃO = 'CONTA CORRENTE'`;
	const tree = new TreeOptimizer(splitQueryIntoBodies(query));
	let treeStructure = tree.buildJunction(tree.leaves);
	console.log(treeStructure);
	expect(treeStructure).toBeDefined();
});

test('PASS - Medium query 2', () => {
	const query = `SELECT NOME, DATANASCIMENTO, DESCRICAO, SALDOINICIAL FROM USUARIO JOIN CONTAS ON USUARIO.IDUSUARIO = CONTAS.USUARIO_IDUSUARIO WHERE SALDOINICIAL >= 235 AND UF = 'CE' AND CEP <> '62930000'`;
	const tree = new TreeOptimizer(splitQueryIntoBodies(query));
	let treeStructure = tree.buildJunction(tree.leaves);
	console.log(treeStructure);
	expect(treeStructure).toBeDefined();
});

test('PASS - Medium query 3', () => {
	const query = `SELECT LNAME FROM EMPLOYEE, WORKS_ON, PROJECT WHERE PNAME = ‘AQUARIUS’ AND PNUMBER = PNO AND ESSN = SSN AND BDATE > ‘1957-12-31’`;
	const tree = new TreeOptimizer(splitQueryIntoBodies(query));
	let treeStructure = tree.buildJunction(tree.leaves);
	console.log(treeStructure);
	expect(treeStructure).toBeDefined();
});
