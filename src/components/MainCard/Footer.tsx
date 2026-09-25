import { RotateCw } from "lucide-react";

import { CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function Footer() {
    const handleReloadPage = () => {
        chrome.tabs.reload();
    };

    return (
        <CardFooter className="p-0">
            <Button
                onClick={handleReloadPage}
                variant="outline"
                size="sm"
                className="w-full cursor-pointer"
            >
                <RotateCw className="w-4 h-4 mr-2" />
                Перезагрузить страницу
            </Button>
        </CardFooter>
    );
}
