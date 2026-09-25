import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function CardSkeleton() {
    return (
        <Card className="bg-transparent w-full gap-1">
            <div className="flex items-center space-x-4 mx-6 border-b pb-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[75px]" />
                    <Skeleton className="h-4 w-[150px]" />
                </div>
            </div>

            <div className="mx-6 pt-3">
                <Skeleton className="h-4 w-[150px]" />
            </div>

            <div className="mx-6 pt-3">
                <Skeleton className="h-8 w-full" />
            </div>
        </Card>
    );
}
