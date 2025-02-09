"use client";
import { api } from "~/trpc/react";
import { AlbumTile } from "./AlbumTile";
import { useRef, useState } from "react";

interface ChartProps {
    chart: any;
    username?: String;
  }

export function Chart({chart, username} : ChartProps) {
  const chartRef = useRef(null);
  const [albums, setAlbums] = useState(chart);

  // Handle drag start
  const handleDragStart = (e, index) => {
    e.dataTransfer.setData("text/plain", index); // Store the index of the dragged item
  };

  // Handle drag over
  const handleDragOver = (e) => {
    e.preventDefault(); // Allow dropping
  };

  // Handle drop
  const handleDrop = (e, targetIndex) => {
    e.preventDefault();
    const draggedIndex = e.dataTransfer.getData("text/plain") ? e.dataTransfer.getData("text/plain") : e.dataTransfer.getData("text/json"); // Get the index of the dragged item
    const newAlbums = [...albums];
    console.log(JSON.parse(draggedIndex));
    if (typeof(JSON.parse(draggedIndex)) == 'number') {
      // Swap the dragged item and the target item
      [newAlbums[draggedIndex], newAlbums[targetIndex]] = [
        newAlbums[targetIndex],
        newAlbums[draggedIndex],
      ];
    } else {
      const targetAlbum = albums[targetIndex];
      const data = JSON.parse(draggedIndex);
      targetAlbum.name = data.name;
      targetAlbum.artist['#text'] = data.artist;
      targetAlbum.image = data.image;

      newAlbums[targetIndex] = targetAlbum;
    }
    setAlbums(newAlbums); // Update the state with the new order
  };

  const handleSaveChartAsImage = () => {
    if (chartRef.current) {
      // Use html2canvas to capture the chart as an image
      import("html2canvas").then((html2canvas) => {
        console.log(chartRef.current);
        html2canvas.default(chartRef.current, { useCORS: true}).then((canvas) => {
          // Convert the canvas to an image URL
          const image = canvas.toDataURL("image/png");

          // Create a temporary link element to trigger the download
          const link = document.createElement("a");
          link.href = image;
          link.download = "chart.png"; // Set the filename for the downloaded image
          link.click(); // Trigger the download
        });
      });
    }
  };

  return (
    <div className="w-full flex flex-col justify-center gap-4">
      <button className="rounded-full bg-white/10 px-10 py-3 font-semibold no-underline transition hover:bg-white/20" onClick={handleSaveChartAsImage}>Save Chart as Image</button>
      {albums ? (
        <div ref={chartRef} className="grid grid-cols-[repeat(auto-fit,minmax(200px,1fr))] gap-4 justify-center">

          {albums.map((album, index) => (
            <div
              key={album.url}
              draggable
              onDragStart={(e) => handleDragStart(e, index)}
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, index)}
            >
              <AlbumTile name={album.name} artist={album.artist['#text']} image={album.image} key={album.url} highlight={album?.users?.includes(username)} />
            </div>
          ))}
        </div>
      ) : (
        <p>You have no chart.</p>
      )}
    </div>
  );
}
