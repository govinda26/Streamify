import { Link } from "react-router-dom";

function VideoCard({ video }) {
  const { _id, title, thumbnail, views = 0 } = video || {};

  return (
    <Link to={`/video/${_id}`} className="group block">
      <div className="aspect-video w-full overflow-hidden rounded-lg bg-neutral-900">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-neutral-500">No thumbnail</div>
        )}
      </div>
      <div className="mt-2">
        <h3 className="line-clamp-2 text-sm font-medium text-neutral-100">{title}</h3>
        <p className="mt-1 text-xs text-neutral-400">{views} views</p>
      </div>
    </Link>
  );
}

export default VideoCard;











