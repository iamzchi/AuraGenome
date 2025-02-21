//引入d3
import * as d3 from 'd3';
//交互功能-添加高亮
function add_hover_effect() {
  console.log("渲染完成！");
  let allDom = document.querySelectorAll('.all')[0]
  console.log(allDom);
  // 获取所有第一层子div
  let children = allDom.children;
  console.log("children", children);
  // 遍历每个子div并添加hover事件监听

  for (let child of children) {
    child.addEventListener('mouseenter', () => {
      child.style.cursor = 'pointer';
      // 获取 g 元素的边界信息
      let rect = child.getBoundingClientRect();

      // 获取宽度和高度
      let width = rect.width;
      let height = rect.height;
      // 创建一个SVG圆圈元素
      let circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", 0);
      circle.setAttribute("cy", 0);
      circle.setAttribute("r", width/2);
      circle.setAttribute("stroke", "#d9d9d9");
      circle.setAttribute("fill", "none"); 
      circle.setAttribute("stroke-width", "1");
      circle.classList.add("circle-hover");
      
      // 将圆圈插入到child元素的第一个位置
      child.insertBefore(circle, child.firstChild);

      child.style.transform = 'scale(1.01)';
      child.style.stroke = '#ffff00';
      child.style.strokeWidth = '2';
      child.style.filter = 'drop-shadow(0 0 5px #ffff00)';
      child.style.transition = 'all 0.3s ease';
    });

    child.addEventListener('mouseleave', () => {
      // 获取所有circle-hover元素
      let circles = child.getElementsByClassName('circle-hover');
      // 删除所有circle-hover元素
      while(circles.length > 0) {
          circles[0].remove();
      }
      child.style.transform = 'scale(1)';
      child.style.stroke = 'none';
      child.style.strokeWidth = '0';
      child.style.filter = 'none';
    });
    child.addEventListener('click', () => {
      // 输出class名
      console.log("点击了", child.className.baseVal);
    });
  }
}

//交换两个track
const addTrack = (circos,tracks,id, data, type, config) => {
    tracks.value[id] = {
      type,
      data,
      config: { ...config }
    };
    switch (type) {
      case 'histogram':
        circos.histogram(id, data, config);
        break;
      case 'line':
        circos.line(id, data, config);
        break;
      case 'scatter':
        circos.scatter(id, data, config);
        break;
      case 'heatmap':
        circos.heatmap(id, data, config);
        break;
      case 'chords':
        circos.chords(id, data, config);
        break;
      case 'highlight':
        circos.highlight(id, data, config);
        break;
    }
  }
  
  // 交换两个track
  const reverse = (circos,tracks,id1, id2) => {

    if (tracks.value[id1] && tracks.value[id2]) {
      const tempInner = tracks.value[id1].config.innerRadius;
      tracks.value[id1].config.innerRadius = tracks.value[id2].config.innerRadius;
      tracks.value[id2].config.innerRadius = tempInner;
  
      const tempOuter = tracks.value[id1].config.outerRadius;
      tracks.value[id1].config.outerRadius = tracks.value[id2].config.outerRadius;
      tracks.value[id2].config.outerRadius = tempOuter;
  
      updateTrack(circos,tracks,id1);
      updateTrack(circos,tracks,id2);
  
      circos.render();
      add_hover_effect();
    } else {
      console.log("交换的track不存在");
    }
  }
  
  const updateTrack = (circos,tracks,id) => {
    
    const { type, data, config } = tracks.value[id];
    switch (type) {
      case 'histogram':
        circos.histogram(id, data, config);
        break;
      case 'line':
        circos.line(id, data, config);
        break;
      case 'scatter':
        circos.scatter(id, data, config);
        break;
      case 'heatmap':
        circos.heatmap(id, data, config);
        break;
      case 'chords':
        circos.chords(id, data, config);
        break;
      case 'highlight':
        circos.highlight(id, data, config);
        break;
    }
  };

export {
  add_hover_effect,
  addTrack,
  reverse,
}