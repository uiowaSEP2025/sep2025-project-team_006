import {Card, CardContent} from "@/components/ui/card";

interface HomeButtonItem {
    label: string;
    href: string;
}

interface CategorySectionProps {
    title: string;
    items: HomeButtonItem[];
}

export default function HomeDashboard({ title, items}: CategorySectionProps) {
    return(
        <div className="my-6 bg-gray-500 p-6 rounded-2xl">
            <h2 className="text-x1 font-semibold mb-4 border-b-2 border-yello-500 w-fit"> 
                {title}
            </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    {items.map((item, idx) => (
                        <a href={item.href} key={idx}>
                            <Card className="bg-black text-yellow-400 hover:bg-gray-600 transition-all rounded-xl shadow-md">
                                <CardContent className="flex flex-col items-center justify-center p-4 text-center">
                                    <span className="underline">{item.label}</span>
                                </CardContent>
                            </Card>
                        </a>
                    ))}
                </div>
        </div>
    );
}