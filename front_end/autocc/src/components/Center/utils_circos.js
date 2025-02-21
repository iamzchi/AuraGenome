//引入d3
import * as d3 from 'd3';
/**
 * 根据与参考数组的比较条件过滤数据数组中的行。
 * 保留那些在指定的data_number列中的值小于对应参考数组中reference_number列值的行。
 *
 * @param {Array} data - 要过滤的数据对象数组。
 * @param {string} data_column - 在数据对象中用于匹配参考值的列的键名。
 * @param {string} data_number - 要与参考数组中数据进行比较的列的键名。
 * @param {Array} reference - 用于比较的参考数组，包含参考值。
 * @param {string} reference_column - 参考数组中用于匹配data_column的列的键名。
 * @param {string} reference_number - 参考数组中用于比较的列的键名。
 * @returns {Array} - 返回一个包含符合条件的行的新数组。
 */
function delete_overflow(data, data_column, data_number, reference, reference_column, reference_number) {
    return data.filter(row => {
      const dataColumnValue = row[data_column];  // 获取当前行对应data_column的值
      const dataNumberValue = row[data_number];  // 获取当前行对应data_number的值
  
      const referenceRow = reference.find(ref => ref[reference_column] === dataColumnValue);  // 查找参考数组中与data_column匹配的行
  
      if (referenceRow && dataNumberValue < referenceRow[reference_number]) {  // 如果找到了匹配的参考行且data_number小于参考值
        return true;  // 保留该行
      }
  
      return false;  // 否则，删除该行
    });
  }
  
  
  /**
   * 函数说明：reduceData
   * 
   * 功能
   * 根据基因组数据和染色体信息，按染色体划分数据并统计每个区间内的数据数量。
   * 
   * 参数
   * 1. rawData
   *    - 类型：数组
   *    - 描述：基因组数据数组，每个对象包含：（注意首字母大小写）
   *      - id: 染色体 ID。
   *      - Start: 数据起始位置（数字）。
   *      - End: 数据结束位置（数字）。
   * 
   * 2. karyotype
   *    - 类型：数组
   *    - 描述：染色体信息数组，每个对象包含：
   *      - id: 染色体 ID。
   *      - len: 染色体长度。
   * 
   * 3. range (可选)
   *    - 类型：数字
   *    - 描述：区间长度，默认值为 10,000,000。
   * 
   * 返回值
   * - 类型：数组
   * - 描述：统计结果数组，每个对象包含：
   *   - block_id: 染色体 ID。
   *   - start: 区间起始位置。
   *   - end: 区间结束位置。
   *   - value: 区间内的数据数量。
   */
  function reduceData(rawData, karyotype, range) {
    console.log('RawData:', rawData);
  
    // rawData.forEach(d => console.log('RawData ID:', d.id, typeof d.id));
    // karyotype.forEach(chr => console.log('Karyotype ID:', chr.id, typeof chr.id));
  
    const binLength = range || 10000000;
    const data = [];
  
    // 确保分组使用字符串类型的 id
    const rawDataByChr = d3.group(rawData, d => String(d.id));
  
    // 遍历每个染色体
    karyotype.forEach(chr => {
      const raw = rawDataByChr.get(chr.id) || []; // 获取染色体数据
  
      // console.log('Processing Chr:', chr.id, 'Data Count:', raw.length);
  
      // 遍历每个区间
      for (let position = 0; position < chr.len; position += binLength) {
        let counter = 0;
  
        // 遍历染色体数据，统计当前区间的数据数量
        raw.forEach(datum => {
          const start = parseInt(datum.Start, 10);
          const end = parseInt(datum.End, 10);
  
          // 检查数据是否落在当前区间内
          if (start < position + binLength && end > position) {
            counter++;
          }
        });
  
        data.push({
          block_id: chr.id,
          start: position,
          end: Math.min(position + binLength - 1, chr.len),
          value: counter
        });
      }
    });
  
    return data;
  }
  /**
   * 同样是聚合数据，如果输入的文件中包含Position，则使用这个函数
   * @param rawData 参数不是Start/End,而是Position
   * @param karyotype 同上
   * @param range 同上
   */
  function reduceData_Position(rawData, karyotype, range) {
    console.log('RawData:', rawData);
  
    // rawData.forEach(d => console.log('RawData ID:', d.id, typeof d.id));
    // karyotype.forEach(chr => console.log('Karyotype ID:', chr.id, typeof chr.id));
  
    const binLength = range || 10000000;
    const data = [];
  
    // 确保分组使用字符串类型的 id
    const rawDataByChr = d3.group(rawData, d => String(d.id));
  
    // 遍历每个染色体
    karyotype.forEach(chr => {
      const raw = rawDataByChr.get(chr.id) || []; // 获取染色体数据
  
      // console.log('Processing Chr:', chr.id, 'Data Count:', raw.length);
  
      // 遍历每个区间
      for (let position = 0; position < chr.len; position += binLength) {
        let counter = 0;
  
        // 遍历染色体数据，统计当前区间的数据数量
        raw.forEach(datum => {
          const pos = parseInt(datum.Position, 10);
  
          // 检查数据是否落在当前区间内
          if (pos >= position && pos < position + binLength) {
            counter++;
          }
        });
  
        data.push({
          block_id: chr.id,
          start: position,
          end: Math.min(position + binLength - 1, chr.len),
          value: counter
        });
      }
    });
  
    return data;
  }
  /**
   * 把输入json中的start/end 变成position
   * @param inputData json数组，必须包含id\Start\End
   */
  function transform_startend_position(inputData, number_column) {
    // Initialize the output array
    const outputData = [];
  
    // Iterate over each record in the input array
    inputData.forEach(record => {
      // Parse required values from the input record
      const blockId = record.id;
      const value = number_column ? parseFloat(record[number_column]) : 1;
      const start = parseInt(record.Start, 10);
      const end = parseInt(record.End, 10);
  
      // Add two entries: one for Start position and one for End position
      outputData.push({
        block_id: blockId,
        position: start,
        value: value
      });
  
      outputData.push({
        block_id: blockId,
        position: end,
        value: value
      });
    });
  
    return outputData;
  }
  
  var gieStainColor = {
    gpos100: 'rgb(0,0,0)',
    gpos: 'rgb(0,0,0)',
    gpos75: 'rgb(130,130,130)',
    gpos66: 'rgb(160,160,160)',
    gpos50: 'rgb(200,200,200)',
    gpos33: 'rgb(210,210,210)',
    gpos25: 'rgb(200,200,200)',
    gvar: 'rgb(220,220,220)',
    gneg: 'rgb(255,255,255)',
    acen: 'rgb(217,47,39)',
    stalk: 'rgb(100,127,164)',
    select: 'rgb(135,177,255)'
  }


  export {
    delete_overflow,
    reduceData,
    reduceData_Position,
    transform_startend_position,
    gieStainColor,
  }
