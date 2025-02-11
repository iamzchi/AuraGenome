import fs from 'fs';
import path from 'path';

// 获取当前文件的目录路径
const __dirname = path.dirname(new URL(import.meta.url).pathname);

// 定义文件夹
const folders = ['id_001', 'id_002'];

// 遍历每个文件夹
folders.forEach(folder => {
  for (let i = 1; i <= 20; i++) {
    const fileName = `step${i}.vue`;
    const filePath = path.join(__dirname, folder, fileName);

    // 检查文件是否存在
    if (!fs.existsSync(filePath)) {
      // 文件不存在，创建文件
      fs.mkdirSync(path.join(__dirname, folder), { recursive: true });  // 确保文件夹存在
      fs.writeFileSync(filePath, `<template>\n  <div>Step ${i}</div>\n</template>`);  // 写入基础内容
      console.log(`${filePath} created.`);
    } else {
      console.log(`${filePath} already exists, skipping.`);
    }
  }
});
