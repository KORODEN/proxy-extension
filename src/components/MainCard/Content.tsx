import { CardContent } from "@/components/ui/card";
import { useStore } from "@/store";

export function Content() {
    const { currentHost } = useStore();

    return (
        <CardContent className="px-0 pt-3 mt-2 border-t">
            <div className="flex items-center gap-2 mb-2">
                <span className="text-xs text-muted-foreground">
                    Текущий сайт:
                </span>
                <span className="text-xs text-card-foreground">
                    {currentHost}
                </span>
            </div>
        </CardContent>
    );
}
