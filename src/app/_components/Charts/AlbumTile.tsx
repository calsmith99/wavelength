
"use client";

interface AlbumProps {
    name: String;
    artist: String;
    image?: String;
  }

export function AlbumTile( {name, artist, image} : AlbumProps) {

    return (
        <div className="flex flex-col justify-between rounded-xl p-4 aspect-square w-full"
            style={{
                backgroundImage: `url(${image})`,
                backgroundPosition: 'center',
                backgroundSize: 'cover',
            }}
        >
            <div id="top-half" className="max-h-[50%] overflow-hidden">
                <div className="text-lg font-bold capitalize overflow-hidden text-ellipsis max-h-[100%] mix-blend-difference">
                    {name}
                </div>
            </div>
            <div id="bottom-half" className="h-[50%] flex flex-col justify-end">
                <div className="text-lg font-bold capitalize mix-blend-difference">{artist}</div>
            </div>
        </div>
    );
}
