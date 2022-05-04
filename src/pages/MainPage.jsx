import { useState } from 'react';

import {
	getAttributesFromTable,
	validateAttributes
} from '../helpers/load-json';

import './MainPage.css';

export default function MainPage() {
	const [query, setQuery] = useState('');

	const onClick = () => {
		const tables = ['Usuario', 'Contas'];
		const columns = ['idUsuario', 'SaldoInicial'];
		const result = validateAttributes(tables, columns);

		const text = `Tabelas: ${tables}\nAtributos/Colunas: ${columns}\nResultado: ${result}`;
		console.log(getAttributesFromTable('Usuario'));

		setQuery(text);
	};

	return (
		<div className="main">
			<div className="user-input">
				<h2>Processador de consultas</h2>
				<input
					type="text"
					id="query"
					placeholder="Insira!"
					value={query}
					onChange={(q) => setQuery(q.target.value)}
				></input>
				<button id="parse-query" onClick={onClick}>
					Receba!
				</button>
			</div>
			<div className="results">
				<h2>Resultado da consulta</h2>
				<div id="results-body">{query}</div>
			</div>
		</div>
	);
}
