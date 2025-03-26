
"use client";

interface AlbumProps {
    name: String;
    artist: String;
    image?: String;
    highlight: Boolean;
  }

export function AlbumTile( {name, artist, image, highlight} : AlbumProps) {

    return (
        <div className={`group flex flex-col justify-between rounded-xl aspect-square w-full ${highlight && 'border-solid border-2'}`}
            style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
        >
            <div id="top-half" className="max-h-[50%] p-4 rounded-xl overflow-hidden w-[100%] bg-gradient-to-b from-gray-500/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-lg font-bold capitalize overflow-hidden text-ellipsis max-h-[100%]">
                    {name}
                </div>
            </div>
            <div id="bottom-half" className="h-[50%] p-4 rounded-xl flex flex-col justify-end bg-gradient-to-b to-gray-500/80 from-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <div className="text-lg font-bold capitalize">{artist}</div>
            </div>
        </div>
    );
}
