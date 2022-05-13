import { regex } from '../src/helpers/regex';

test('PASS - Simple query', () => {
	const query = `SELECT * FROM USUARIO;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(true);
});

test('FAIL - No selection', () => {
	const query = `SELECT FROM INVALID_TABLE;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(false);
});

test('FAIL - Invalid whitespace', () => {
	const query = `SELECT *  FROM INVALID_TABLE;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(false);
});

test('FAIL - Inexistent FROM operator', () => {
	const query = `SELECT * INVALID_TABLE;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(false);
});

test('FAIL - Inexistent ON after JOIN operator', () => {
	const query = `SELECT * FROM USUARIO JOIN;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(false);
});

test('FAIL - Invalid comma on SELECT', () => {
	const query = `SELECT A, B, FROM USUARIO;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(false);
});

test('FAIL - Misspelled SELECT operator', () => {
	const query = `SELCET * FROM TABLE;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(false);
});

test('FAIL - Missing semicolon', () => {
	const query = `SELCET * FROM TABLE`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(false);
});

test('PASS - Equal operator =', () => {
	const query = `SELECT * FROM USUARIO WHERE ID = 1;`;
	const result = regex.test(query);
	expect(result).toBe(true);
});

test('PASS - Difference operator <>', () => {
	const query = `SELECT * FROM USUARIO WHERE id <> 1;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(true);
});

test('PASS - Greater than operator >', () => {
	const query = `SELECT * FROM USUARIO WHERE id > 1;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(true);
});

test('PASS - Lesser than operator <', () => {
	const query = `SELECT * FROM USUARIO WHERE id < 1;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(true);
});

test('PASS - Greater or equal than operator >=', () => {
	const query = `SELECT * FROM USUARIO WHERE id >= 1;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(true);
});

test('PASS - Lesser or equal than operator <=', () => {
	const query = `SELECT * FROM USUARIO WHERE id <= 1;`;
	const result = new RegExp(regex).test(query);
	expect(result).toBe(true);
});
