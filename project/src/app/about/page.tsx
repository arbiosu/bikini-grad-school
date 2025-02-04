
import { WhoWeAre, WhatWeDo, StaffSection } from "@/components/About"

export default function About() {
    return (
        <main className="overflow-auto">
            <WhoWeAre />
            <WhatWeDo />
            <StaffSection />
        </main>
    )
}