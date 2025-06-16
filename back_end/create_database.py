import sqlite3
from pathlib import Path

def create_database():
    # 确保back_end目录存在
    db_dir = Path(__file__).parent
    db_dir.mkdir(exist_ok=True)
    
    # 连接数据库(如果不存在会自动创建)
    conn = sqlite3.connect(db_dir / 'circos.db')
    cursor = conn.cursor()
    
    # 创建表
    cursor.execute('''
    CREATE TABLE IF NOT EXISTS projects (
        projectID TEXT PRIMARY KEY,
        fileInfo TEXT,
        chatHistory TEXT,
        trackInfo TEXT,
        sequenceLog TEXT,
        stepSnapshots TEXT
    )
    ''')
    
    conn.commit()
    conn.close()

if __name__ == '__main__':
    create_database()
    print("数据库创建成功！")
  