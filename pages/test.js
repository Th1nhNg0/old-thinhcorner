import React from "react";

export default function test() {
  let stats = [
    { label: "A", value: 100 },
    { label: "B", value: 100 },
    { label: "C", value: 100 },
    { label: "D", value: 100 },
    { label: "E", value: 100 },
    { label: "F", value: 100 },
  ];
  function valueToPoint(value, index, total) {
    var x = 0;
    var y = -value * 0.4;
    var angle = ((Math.PI * 2) / total) * index;
    var cos = Math.cos(angle);
    var sin = Math.sin(angle);
    var tx = x * cos - y * sin + 50;
    var ty = x * sin + y * cos + 50;
    return {
      left: tx + "%",
      top: ty + "%",
    };
  }
  return (
    <div className="w-1/2 mx-auto">
      <div className="relative bg-blue-500 aspect-w-1 aspect-h-1">
        {stats.map((e, i) => (
          <div
            key={i}
            className="absolute flex items-center justify-center w-12 h-12 p-5 duration-300 origin-center -translate-x-1/2 -translate-y-1/2 bg-green-500 rounded-full group hover:w-28 hover:h-28 round-full"
            style={valueToPoint(e.value, i, stats.length)}
          >
            <span>{e.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
