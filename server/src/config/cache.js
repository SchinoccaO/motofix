import NodeCache from 'node-cache';

// TTL de 60 segundos — suficiente para absorber picos de tráfico sin servir datos muy viejos.
// checkperiod: cada 120s limpia las claves expiradas de memoria.
const cache = new NodeCache({ stdTTL: 60, checkperiod: 120 });

export default cache;
