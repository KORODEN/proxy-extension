import { Card } from "@/components/ui/card";
import { useStore } from "@/store";

import { CardSkeleton } from "./CardSkeleton";
import { Header } from "./Header";
import { Content } from "./Content";
import { Footer } from "./Footer";

export function MainCard() {
    const { loading, currentHost } = useStore();

    if (loading) {
        return <CardSkeleton />;
    }

    return (
        <Card className="bg-transparent w-full gap-1 p-4">
            <Header />

            {currentHost && <Content />}

            <Footer />
        </Card>
    );
}
