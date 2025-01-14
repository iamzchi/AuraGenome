import csv

# 读取原始CSV文件
with open('cytobands.csv', mode='r', newline='') as infile:
    reader = csv.reader(infile)
    rows = list(reader)

# 处理数据，去掉id列中的'chr'
for row in rows:
    if row[0].startswith('chr'):
        row[0] = row[0][3:]  # 去掉'chr'前缀

# 写回到新的CSV文件
with open('cytobands_modified.csv', mode='w', newline='') as outfile:
    writer = csv.writer(outfile)
    writer.writerows(rows)

print("文件处理完毕，已保存为 'cytobands_modified.csv'")
