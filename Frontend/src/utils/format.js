export const formatDuration = (seconds) => {
    if (seconds === undefined || seconds === null) return "";
    const totalSeconds = Math.max(0, Math.round(Number(seconds)));
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    if (hours > 0) {
        return [hours, minutes, secs]
            .map((val) => String(val).padStart(2, "0"))
            .join(":");
    }
    return [minutes, secs].map((val) => String(val).padStart(2, "0")).join(":");
};

export const formatTimeAgo = (value) => {
    if (!value) return "";
    const date = new Date(value);
    const now = new Date();
    const diff = date.getTime() - now.getTime();
    const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
    const minutes = Math.round(diff / (1000 * 60));
    const hours = Math.round(diff / (1000 * 60 * 60));
    const days = Math.round(diff / (1000 * 60 * 60 * 24));
    const months = Math.round(diff / (1000 * 60 * 60 * 24 * 30));
    const years = Math.round(diff / (1000 * 60 * 60 * 24 * 365));

    if (Math.abs(minutes) < 60) return rtf.format(minutes, "minute");
    if (Math.abs(hours) < 24) return rtf.format(hours, "hour");
    if (Math.abs(days) < 30) return rtf.format(days, "day");
    if (Math.abs(months) < 12) return rtf.format(months, "month");
    return rtf.format(years, "year");
};

export const formatViews = (views) => {
    if (views === undefined || views === null) return "0 views";
    if (views < 1000) return `${views} views`;
    const formatter = new Intl.NumberFormat("en", {
        notation: "compact",
        maximumFractionDigits: 1,
    });
    return `${formatter.format(views)} views`;
};
