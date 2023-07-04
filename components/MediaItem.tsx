import useLoadImage from "@/hooks/useLoadImage";
import { Song } from "@/types";
import Image from "next/image";

interface MediaItemProps {
    onClick?: (id: string) => void
    data: Song
}

const MediaItem: React.FC<MediaItemProps> = ({ onClick, data }) => {

    const imageUrl = ''// useLoadImage(data);

    const handleOnClick = () => {
        if (onClick) {
            return onClick(data.id)
        }
        // TODO: Default turn on player
    }

    return (
        <div onClick={handleOnClick} className="flex items-center gap-x-3 cursor-pointer hover:bg-neutral-800/50 w-full p-2 rounded-md">
            <div className="relative rounded-md min-h-[48px] min-w-[48px] overflow-hidden">
                <Image fill src={imageUrl || '/images/liked.png'} alt="User Song" className="object-cover" />
            </div>
        </div>
    );
}

export default MediaItem;