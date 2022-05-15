import { useState } from 'react';
import ZingChart from 'zingchart-react';

import {
	generateGraphToPlot,
	splitQueryIntoBodies
} from '../helpers/relationalAlgebra.js';
import { validateAttributes } from '../helpers/load-json';
import { removeWhitespaces } from '../helpers/text-parser';
import { regex } from '../helpers/regex';

import './MainPage.css';
import 'zingchart/es6';
import 'zingchart/modules-es6/zingchart-tree.min.js';

const ENTER_KEYCODE = 13;
const ERROR_MESSAGE_TIMEOUT = 3000;

export default function MainPage() {
	const [query, setQuery] = useState('');
	const [showGraph, canShowGraph] = useState(false);
	const [error, setError] = useState('');

	let chartConfig = null;
	// let GraphComponent = null;

	const onClick = () => {
		if (!query) {
			showErrorMessage('Sem query!');
			return;
		}

		console.log(query)
		const filteredQuery = removeWhitespaces(query.replaceAll("\n", " "));

		if (!filteredQuery.match(regex)) {
			console.warn('Query filtrada', filteredQuery);
			showErrorMessage('Query não passou no regex de verificação inicial!');
			return;
		}

		let bodies;
		try {
			bodies = splitQueryIntoBodies(filteredQuery);
			if (!bodies) {
				showErrorMessage('Não foi possível decompor a query!');
				return
			}
		} catch (err) {
			console.warn(err)
			showErrorMessage('Erro ao decompor a string');
			return
		}

		console.log(bodies);
		if (!validateAttributes(bodies.tables, bodies.SELECT.split(', '))) {
			showErrorMessage('Algum atributo/tabela não existe no banco de dados!');
			return
		}

		try {
			const plotSeries = generateGraphToPlot(filteredQuery);

			chartConfig = {
				type: 'tree',
				options: {
					aspect: 'tree-down',
					orgChart: true,
					link: {
						aspect: 'line'
					},
					node: {
						backgroundColor: 'rgba(0,0,0,0)',
						hoverState: {
							visible: false
						},
						label: {
							width: '100%',
							fontSize: '10px'
						}
					}
				},
				plotarea: {
					marginLeft: 150,
					marginRight: 170
				},
				series: plotSeries
			};

			zingchart.render({
				id: 'graph',
				data: chartConfig,
			});
			canShowGraph(true)

		} catch (err) {
			console.warn(err);
			showErrorMessage('Não foi possível gerar a árvore visualmente!');
		}
	};

	const showErrorMessage = (message) => {
		console.error(message);
		setError(message);
			canShowGraph(false);
		// setResult(null);
		setTimeout(() => setError(''), ERROR_MESSAGE_TIMEOUT);
	};

	return (
		<div className="main">
			<section className="corpo">
				<h1>Processador de consultas - AV2</h1>
				<div className="user-input">
					<textarea
						id="query"
						rows={5}
						placeholder="Insira sua consulta SQL."
						value={query}
						onChange={(q) => setQuery(q.target.value.toUpperCase())}
						onKeyDown={(e) => e.keyCode === ENTER_KEYCODE && onClick()}
					></textarea>
					<button id="parse-query" onClick={onClick}>
						Executar
					</button>
				</div>
				<div className="results">
					<h2>Resultado da consulta</h2>
					{Boolean(error) && <h3 className="error-message">Erro: {error}</h3>}
					{showGraph && (
						<div id="results-body">
							<div id="graph" className="chart--container">
					{/* {GraphComponent} */}
							</div>
						</div>
					)}
				</div>
			</section>
		</div>
	);
}
