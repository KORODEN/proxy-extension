const icons = new Map();

export function getStatusIcon(status) {
    if (icons.has(status)) return icons.get(status);

    const imageData = {};
    for (const size of [16, 32, 48]) {
        const canvas = new OffscreenCanvas(size, size);
        const ctx = canvas.getContext("2d");
        ctx.scale(size / 24, size / 24);
        ctx.strokeStyle = "#737373";
        ctx.lineWidth = 2;
        ctx.lineCap = "round";

        ctx.beginPath();
        ctx.arc(12, 12, 9, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.ellipse(12, 12, 4, 9, 0, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(3, 12);
        ctx.lineTo(21, 12);
        ctx.stroke();

        if (status === "error" || status === "enabled") {
            // Transparent clearance keeps the dot distinct on any toolbar theme.
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.arc(19, 19, 5, 0, Math.PI * 2);
            ctx.fill();
            ctx.globalCompositeOperation = "source-over";
            ctx.fillStyle = status === "error" ? "#dc2626" : "#16a34a";
            ctx.beginPath();
            ctx.arc(19, 19, 4, 0, Math.PI * 2);
            ctx.fill();
        }
        imageData[size] = ctx.getImageData(0, 0, size, size);
    }
    icons.set(status, imageData);
    return imageData;
}
