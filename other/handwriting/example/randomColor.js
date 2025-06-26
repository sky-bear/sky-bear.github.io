function randomColor() {
  const color = `#${Math.floor(Math.random() * 0xffffff).toString(16)}`;
  return color;
}

function randomColor() {
  const letters = '0123456789ABCDEF';
  let color = '#';
  for (let i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}



function getRandomRGBA() {
  const r = Math.floor(Math.random() * 256);
  const g = Math.floor(Math.random() * 256);
  const b = Math.floor(Math.random() * 256);
  const a = Math.random().toFixed(2); // 透明度保留两位小数
  return `rgba(${r},${g},${b},${a})`;
}