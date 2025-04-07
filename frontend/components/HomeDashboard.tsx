import { Card, CardContent } from "@/components/ui/card";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface HomeButtonItem {
  label: string;
  href: string;
  image?: string;
  isExternal?: boolean;
}

interface CategorySectionProps {
  title: string;
  items: HomeButtonItem[];
}

export default function HomeDashboard({ title, items }: CategorySectionProps) {
  return (
    <div className="my-6 bg-gray-200 p-6 rounded-2xl min-h-[300px]">
      <h2 className="text-xl font-semibold mb-4 border-b-2 border-yellow-500 w-fit">
        {title}
      </h2>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {items.map((item, idx) => {
          const { isExternal = false } = item;

          const content = (
            <Card className="bg-black text-yellow-400 hover:bg-gray-600 transition-all rounded-xl shadow-md h-40 w-40 flex items-center justify-center mx-auto">
              <CardContent className="flex flex-col items-center justify-center p-2 text-center h-full w-full">
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.label}
                    width={40}
                    height={40}
                    className="mb-2 object-contain"
                  />
                )}

                <span className="underline">{item.label}</span>
              </CardContent>
            </Card>
          );
          return isExternal ? (
            <a
              href={item.href}
              target="_blank"
              rel="noopener noreferrer"
              key={idx}
            >
              {content}
            </a>
          ) : (
            <Link href={item.href} key={idx}>
              {content}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
