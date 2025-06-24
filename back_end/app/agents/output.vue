<script setup>
import { ref, onMounted, inject } from 'vue';
import * as d3 from 'd3';
import Circos from 'circos';
import { readFile } from '@/utils/server';
import { reduceData, reduceData_Position, gieStainColor, transform_startend_position } from '@/components/Center/utils_circos.js';
import { add_hover_effect, addTrack, reverse } from '@/components/Center/utils_interact.js';

const bus = inject('bus');
const tracks = ref({});
let circos;

onMounted(async () => {
  try {
    let hg19 = await d3.json('/data/hg19.json');
    let cytobands = await d3.csv('/data/cytobands.csv');

    let chartWidth = document.getElementById('chart').clientWidth;
    let width = chartWidth;
    let innerRadius = chartWidth / 2 - 100;
    let outerRadius = chartWidth / 2 - 100 + 50;

    circos = new Circos({
      container: `#chart`,
      width: width,
      height: width,
    });

    circos.layout(
      hg19,
      {
        innerRadius: innerRadius,
        outerRadius: outerRadius,
        labels: {
          display: true,
          radialOffset: 60,
          color: "black",
          size: 10
        },
        ticks: {
          display: true,
          color: 'grey',
          labels: false,
          labelSuffix: 'Mb',
          labelDenominator: 5000000,
          spacing: 5000000,
          labelSize: 5,
          labelColor: 'grey',
        },
      }
    );

    let highlightData = cytobands.map(function (d) {
      return {
        block_id: d.id,
        start: parseInt(d.start),
        end: parseInt(d.end),
        gieStain: d.gieStain
      }
    });

    let highlightConfig = {
      innerRadius: innerRadius,
      outerRadius: outerRadius,
      opacity: .7,
      color: function (d) {
        return gieStainColor[d.gieStain]
      }
    };

    circos.highlight('highlight', highlightData, highlightConfig);

    let level2 = await readFile('id_001/file2.csv');
    let level2_1 = level2.filter((item) => item["Type"] == "Insertion" && item["Validation_status"] != "");
    let level2_2 = level2.filter((item) => item["Type"] == "Deletion" && item["Validation_status"] != "");

    level2_1 = reduceData(level2_1, hg19, 10000000);
    level2_2 = reduceData(level2_2, hg19, 10000000);

    addTrack(circos,tracks,'level2_1', level2_1, 'histogram', {
      innerRadius: .95,
      outerRadius: .96,
      color: "red",
      opacity: 1.0
    });

    addTrack(circos,tracks,'level2_2', level2_2, 'histogram', {
      innerRadius: .96,
      outerRadius: .97,
      color: "green",
      opacity: 1.0
    });

    let level3 = await readFile('id_001/file1.csv');
    let level3_1 = level3.filter((item) => item["Zygosity"] == "het");
    let level3_2 = level3.filter((item) => item["Zygosity"] == "hom");

    level3_1 = reduceData_Position(level3_1, hg19, 10000000);
    level3_2 = reduceData_Position(level3_2, hg19, 10000000);

    addTrack(circos,tracks,'level3_1', level3_1, 'line', {
      innerRadius: 0.88,
      outerRadius: 0.93,
      color: "#faa95d",
      opacity: 1.0
    });

    addTrack(circos,tracks,'level3_2', level3_2, 'histogram', {
      innerRadius: 0.80,
      outerRadius: 0.85,
      color: "#f0761e",
      opacity: 1.0
    });

    let level4 = await readFile('id_001/file4.csv');
    let level4_1 = level4.filter((item) => item["Effect"] == "Silent");
    let level4_2 = level4.filter((item) => item["Effect"] == "Missense");
    let level4_3 = level4.filter((item) => item["Effect"] == "Nonsense");
    let level4_4 = level4.filter((item) => item["Effect"] == "Splice");

    level4_1 = level4_1.map((item) => ({ block_id: item["Chromosome"], position: item["Position"], value: 1 }));
    level4_2 = level4_2.map((item) => ({ block_id: item["Chromosome"], position: item["Position"], value: 1 }));
    level4_3 = level4_3.map((item) => ({ block_id: item["Chromosome"], position: item["Position"], value: 1 }));
    level4_4 = level4_4.map((item) => ({ block_id: item["Chromosome"], position: item["Position"], value: 1 }));

    addTrack(circos,tracks,'level4_1', level4_1, 'scatter', {
      innerRadius: 0.77,
      outerRadius: 0.80,
      color: "gray",
      fill: "gray",
      size: 3,
      strokeColor: "none"
    });
    addTrack(circos,tracks,'level4_2', level4_2, 'scatter', {
      innerRadius: 0.74,
      outerRadius: 0.77,
      color: "purple",
      fill: "purple",
      size: 3,
      strokeColor: "none"
    });
    addTrack(circos,tracks,'level4_3', level4_3, 'scatter', {
      innerRadius: 0.71,
      outerRadius: 0.74,
      color: "red",
      fill: "red",
      size: 3,
      strokeColor: "none"
    });
    addTrack(circos,tracks,'level4_4', level4_4, 'scatter', {
      innerRadius: 0.68,
      outerRadius: 0.71,
      color: "black",
      fill: "black",
      size: 3,
      strokeColor: "none"
    });

    let level5 = await readFile('id_001/file5.csv');
    level5 = transform_startend_position(level5, "Copy number");

    addTrack(circos,tracks,'level5', level5, 'line', {
      innerRadius: 0.50,
      outerRadius: 0.68,
      color: "#5979ae",
      axes: [{ spacing: 2, color: "gray", thickness: .3, opacity: .5 }],
      backgrounds: [{ color: "#d6d6d6" }]
    });

    let level6 = await readFile('id_001/file6.csv');
    level6 = level6.map((item) => ({
      'block_id': item["id"],
      'start': Number(item["Start"]),
      'end': Number(item["End"]),
      'value': 1
    }));

    addTrack(circos,tracks,'level6', level6, 'heatmap', {
      innerRadius: 0.49,
      outerRadius: 0.50,
      color: "red",
      opacity: 1.0
    });

    let level7 = await readFile('id_001/file3.csv');
    let level7_1 = level7.filter((item) => item["Chromosome"] == item["Chromosome.1"]);
    let level7_2 = level7.filter((item) => item["Chromosome"] != item["Chromosome.1"]);

    level7_1 = level7_1.map((item) => ({
      source: {
        id: item["Chromosome"],
        start: Number(item["Position"]),
        end: Number(item["Position"]) + 10000000
      },
      target: {
        id: item["Chromosome.1"],
        start: Number(item["Position.1"]),
        end: Number(item["Position.1"]) + 10000000
      }
    }));
    level7_2 = level7_2.map((item) => ({
      source: {
        id: item["Chromosome"],
        start: Number(item["Position"]),
        end: Number(item["Position"]) + 10000000
      },
      target: {
        id: item["Chromosome.1"],
        start: Number(item["Position.1"]),
        end: Number(item["Position.1"]) + 10000000
      }
    }));

    addTrack(circos,tracks,'level7_1', level7_1, 'chords', {
      color: "green",
      radius: 0.48
    });

    addTrack(circos,tracks,'level7_2', level7_2, 'chords', {
      color: "purple",
      radius: 0.48
    });

    circos.render();
    add_hover_effect(bus);
  } catch (err) {
    console.error('Error fetching or processing data:', err);
  }
});

const reverse_track = (id1, id2) => {
  reverse(circos,tracks,id1,id2);
};

bus.on('go_exchange', (tracks) => {
  reverse_track(tracks[0],tracks[1]);
});
</script>

<template>
  <div id="chart"></div>
</template>

<style scoped>
#chart {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 100%;
}
</style>