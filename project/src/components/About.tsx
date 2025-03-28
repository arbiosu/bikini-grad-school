import Image from "next/image"
import book from "@/../public/bigger-text.png"

const staffMembers = [
  { name: "Jayne Baran", role: "Editor-in-Chief", image: "/next.svg" },
  { name: "Aiden Saul", role: "Chief Chemist", image: "/next.svg"},
  { name: "Macy Baran", role: "Director", image: "/next.svg"},
  { name: "Drew Baran", role: "Chef", image: "/next.svg"},
  { name: "Coop Baran", role: "Creative Director", image: "/next.svg" },
  { name: "Scrambled Eggs", role: "Senior Writer", image: "/next.svg" },
  { name: "Rice Aroni", role: "Community Manager", image: "/next.svg" },
  { name: "Winn Dixie", role: "Dog", image: "/next.svg"},
]

export function StaffSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-6xl mb-10 text-black text-center">Staff</h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {staffMembers.map((member, index) => (
            <div key={index} className="bg-white p-6 rounded-lg shadow-md text-center">
              <Image
                src={member.image}
                alt={member.name}
                width={150}
                height={150}
                className="rounded-full mx-auto mb-4"
              />
              <h3 className="text-xl font-semibold mb-2 text-pink-600">{member.name}</h3>
              <p className="text-gray-700">{member.role}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function AboutUsBook() {
  return (
    <div>
      <Image 
        src={book} 
        alt="Bikini Grad School About Us Book"
        priority
      />
    </div>
  );
}

