```javascript
import Circos from 'circos';
import { readFile, reduceData_Position } from './data_processing';
import { gieStainColor } from './utils_circos';

async function createDarkBlueBarChart() {
  const karyotype = [
    // Define your karyotype data here
    { id: 'chr1', len: 248956422 },
    { id: 'chr2', len: 242193529 },
    { id: 'chr3', len: 198295559 },
    { id: 'chr4', len: 190214555 },
    { id: 'chr5', len: 181538259 },
    { id: 'chr6', len: 170805979 },
    { id: 'chr7', len: 159345973 },
    { id: 'chr8', len: 145138636 },
    { id: 'chr9', len: 138394717 },
    { id: 'chr10', len: 133797422 },
    { id: 'chr11', len: 135086622 },
    { id: 'chr12', len: 133275309 },
    { id: 'chr13', len: 114364328 },
    { id: 'chr14', len: 107043718 },
    { id: 'chr15', len: 101991189 },
    { id: 'chr16', len: 90338345 },
    { id: 'chr17', len: 83257441 },
    { id: 'chr18', len: 80373285 },
    { id: 'chr19', len: 58617616 },
    { id: 'chr20', len: 64444167 },
    { id: 'chr21', len: 46709983 },
    { id: 'chr22', len: 50818468 },
    { id: 'chrX', len: 156040895 },
    { id: 'chrY', len: 57227415 },
  ];

  const fileData = await readFile('file1.csv');
  const processedData = reduceData_Position(fileData, karyotype, 5000000);

  const circos = new Circos({
    container: '#circosChart',
    width: 1000,
    height: 1000,
  });

  circos.layout(karyotype, {
    innerRadius: 500,
    outerRadius: 540,
    labels: {
      display: false,
    },
    ticks: {
      display: false,
    },
    color: gieStainColor,
  });

  circos.histogram('dark-blue-bar-chart', processedData, {
    innerRadius: 0.7,
    outerRadius: 0.9,
    color: 'darkblue',
    strokeColor: 'none',
  });

  circos.render();
}

createDarkBlueBarChart();
```