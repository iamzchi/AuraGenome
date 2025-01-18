<script setup>
const props = defineProps({
    data: {
        type: Array,
        default: () => [],
    },
    columns: {
        type: Array,
        default: () => [],
    },
})
</script>

<template>
  <table class="custom-table">
    <thead>
      <tr>
        <!-- Loop through columns to create headers -->
        <th v-for="(col, index) in columns" :key="index">{{ col.title }}</th>
      </tr>
    </thead>
    <tbody>
      <!-- Loop through data to create table rows -->
      <tr v-for="(row, rowIndex) in data" :key="rowIndex">
        <td v-for="(col, colIndex) in columns" :key="colIndex">
          {{ row[col.colKey] }}
        </td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped lang="scss">
.custom-table {
  width: 100%;
  border-collapse: collapse;
  // margin: 5px 0;

  th, td {
    // padding: 8px 12px;
    border: 1px solid #ddd;
    text-align: left;
    font-size: .5rem;
  }

  th {
    background-color: #f4f4f4;
  }

  tr:nth-child(even) {
    background-color: #f9f9f9;
  }

  tr:hover {
    background-color: #e9e9e9;
  }
}
</style>
