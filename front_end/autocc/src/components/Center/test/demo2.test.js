import { describe, it, expect, vi, beforeEach } from 'vitest';
import { mount } from '@vue/test-utils';
import * as d3 from 'd3';
import Demo2 from '../demo2.vue';

// 模拟数据
const mockCsvData = [
  { chr1: 'chr1', chr2: 'chr2', start1: '100', end1: '200', start2: '300', end2: '400', color: '25' },
  { chr1: 'chr3', chr2: 'chr4', start1: '500', end1: '600', start2: '700', end2: '800', color: '75' },
  { chr1: 'chr5', chr2: 'chr6', start1: '900', end1: '1000', start2: '1100', end2: '1200', color: '125' },
  { chr1: 'chr7', chr2: 'chr8', start1: '1300', end1: '1400', start2: '1500', end2: '1600', color: '175' },
  { chr1: 'chr9', chr2: 'chr10', start1: '1700', end1: '1800', start2: '1900', end2: '2000', color: '225' },
  { chr1: 'chr11', chr2: 'chr12', start1: '2100', end1: '2200', start2: '2300', end2: '2400', color: '275' }
];

// 模拟d3.csv方法
vi.mock('d3', () => ({
  csv: vi.fn(() => Promise.resolve(mockCsvData)),
  json: vi.fn(() => Promise.resolve([]))
}));

describe('Demo2.vue', () => {
  let wrapper;
  let lines;
  let lines_1, lines_2, lines_3, lines_4, lines_5, lines_6;

  beforeEach(async () => {
    wrapper = mount(Demo2);
    await wrapper.vm.$nextTick();

    // 获取处理后的数据
    lines = mockCsvData.map((item) => ({
      ...item,
      chr1: item.chr1.replace('chr', ''),
      chr2: item.chr2.replace('chr', '')
    }));

    // 按颜色范围过滤数据
    lines_1 = lines.filter(item => item.color >= 0 && item.color <= 50);
    lines_2 = lines.filter(item => item.color >= 50 && item.color <= 100);
    lines_3 = lines.filter(item => item.color >= 100 && item.color <= 150);
    lines_4 = lines.filter(item => item.color >= 150 && item.color <= 200);
    lines_5 = lines.filter(item => item.color >= 200 && item.color <= 250);
    lines_6 = lines.filter(item => item.color >= 250 && item.color <= 300);

    // 转换数据格式
    const transformData = (data) => data.map(item => ({
      source: {
        id: item.chr1,
        start: Number(item.start1),
        end: Number(item.end1)
      },
      target: {
        id: item.chr2,
        start: Number(item.start2),
        end: Number(item.end2)
      }
    }));

    lines_1 = transformData(lines_1);
    lines_2 = transformData(lines_2);
    lines_3 = transformData(lines_3);
    lines_4 = transformData(lines_4);
    lines_5 = transformData(lines_5);
    lines_6 = transformData(lines_6);
  });

  it('应该正确过滤和转换数据，并在控制台输出所有lines数组', () => {
    console.log('lines_1 (0-50):', lines_1);
    console.log('lines_2 (50-100):', lines_2);
    console.log('lines_3 (100-150):', lines_3);
    console.log('lines_4 (150-200):', lines_4);
    console.log('lines_5 (200-250):', lines_5);
    console.log('lines_6 (250-300):', lines_6);

    // 验证每个区间的数据长度
    expect(lines_1).toHaveLength(1); // 25在0-50区间
    expect(lines_2).toHaveLength(1); // 75在50-100区间
    expect(lines_3).toHaveLength(1); // 125在100-150区间
    expect(lines_4).toHaveLength(1); // 175在150-200区间
    expect(lines_5).toHaveLength(1); // 225在200-250区间
    expect(lines_6).toHaveLength(1); // 275在250-300区间

    // 验证数据转换的正确性
    expect(lines_1[0]).toEqual({
      source: { id: '1', start: 100, end: 200 },
      target: { id: '2', start: 300, end: 400 }
    });
  });
});