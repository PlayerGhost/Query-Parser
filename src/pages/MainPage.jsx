import { useState } from 'react';

import { removeWhitespaces } from '../helpers/text-parser';
import { regex } from '../helpers/regex';
import { generateGraphToPlot } from '../helpers/relationalAlgebra.js';
// import ZingChart from 'zingchart-react';
import 'zingchart/es6';
import 'zingchart/modules-es6/zingchart-tree.min.js';

import './MainPage.css';

const ENTER_KEYCODE = 13;
const ERROR_MESSAGE_TIMEOUT = 3000;

export default function MainPage() {
	const [query, setQuery] = useState('');
	const [error, setError] = useState('');

	const onClick = () => {
		if (!query) {
			showErrorMessage('Sem query!');
			return;
		}

		const userQuery = query.replaceAll('\n', ' ').toUpperCase().trim();

		if (!userQuery.match(regex)) {
			console.warn('Query filtrada', userQuery);
			showErrorMessage('Query não passou no regex de verificação inicial!');
			return;
		}

		const filteredQuery = removeWhitespaces(userQuery);
		let graphTree;
		try {
			graphTree = generateGraphToPlot(filteredQuery.replaceAll(';', ''));
		} catch (err) {
			console.log(err);
			showErrorMessage('Houve algum erro gerando a árvore!');
		}

		let chartConfig = {
			type: 'tree',

			options: {
				aspect: 'tree-down',
				orgChart: true,

				link: {
					aspect: 'line'
				},

				node: {
					backgroundColor: 'rgba(0,0,0,0)',
					width: '100%',
					height: '100%',

					hoverState: {
						visible: false
					},

					label: {
						fontSize: '12px',
						color: '#000000'
					}
				}
			},

			plot: {
				exact: true,
				smartSampling: true,
				maxNodes: 0,
				maxTrackers: 0
			},

			plotarea: {
				margin: '30px 85px'
			},

			series: graphTree
		};

		zingchart.render({
			id: 'graphDiv',
			data: chartConfig,
			cache: {
				data: false
			}
			// height: '100%',
			// width: '100%',
			// output: 'canvas'
		});
	};

	const showErrorMessage = (message) => {
		console.error(message);
		setError(message);
		setTimeout(() => setError(''), ERROR_MESSAGE_TIMEOUT);
	};

	return (
		<div className="main">
			<section className="corpo">
				<h1>Processador de consultas - AV2</h1>
				<div className="user-input">
					<textarea
						id="query"
						placeholder="Insira sua consulta SQL."
						value={query}
						onChange={(q) => setQuery(q.target.value.toUpperCase())}
						onKeyDown={(e) => e.keyCode === ENTER_KEYCODE && onClick()}
						rows={7}
					></textarea>
					<button id="parse-query" onClick={onClick}>
						Executar
					</button>
				</div>
				<div className="results">
					<h2>Resultado da consulta</h2>
					{Boolean(error) && <h3 className="error-message">Erro: {error}</h3>}
					<div id="graphDiv" className="graph--container"></div>
				</div>
			</section>
		</div>
	);
}
