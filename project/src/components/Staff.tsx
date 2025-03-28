import Image from 'next/image';
import { specialElite } from '../../public/fonts/fonts';
import { Card, CardContent, CardHeader } from "@/components/ui/card";

interface StaffCardProps {
    imgUrl: string;
    name: string;
    pronouns: string;
    title: string;
}

export function StaffCard({ imgUrl, name, pronouns, title }: StaffCardProps) {
    return (
        <Card className="flex flex-col">
            <CardHeader className="p-0 relative pt-[100%] max-h-[300px]">
                <div className="absolute inset-0 w-full h-full">
                    <Image
                        src={imgUrl}
                        alt={name}
                        fill
                        className="object-cover rounded-t-lg"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 33vw, 300px"
                    />
                </div>
            </CardHeader>
            <CardContent className="flex-grow p-4">
                <div className="flex flex-col">
                    <h3 className="font-medium text-4xl text-center">
                        {name}
                    </h3>
                    <p className="text-xl text-muted-foreground text-center">
                        {pronouns}
                    </p>
                    <p className={`${specialElite.className} text-lg text-center`}>
                        {title}
                    </p>
                </div>
            </CardContent>
        </Card>
    );
}

export default function StaffGrid({ staffMembers }: { staffMembers: StaffCardProps[] }) {
    return (
        <div className="container mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {staffMembers.map((staff, index) => (
                    <StaffCard key={staff.name || index} {...staff} />
                ))}
            </div>
        </div>
    );
}