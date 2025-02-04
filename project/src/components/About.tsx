import Image from "next/image"
import { Book, Pen, Globe } from "lucide-react"


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
const activities = [
    {
      icon: <Book className="w-8 h-8 text-pink-500" />,
      title: "Thing We Do 1",
      description:
        "Description of the thing we do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      icon: <Pen className="w-8 h-8 text-pink-500" />,
      title: "Thing We Do 2",
      description:
        "Description of the thing we do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
    {
      icon: <Globe className="w-8 h-8 text-pink-500" />,
      title: "Thing We Do 3",
      description:
        "Description of the thing we do. Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.",
    },
  ]

export function StaffSection() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-pink-600 text-center">Our Staff</h2>
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

export function WhatWeDo() {
  return (
    <section className="py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold mb-10 text-pink-600 text-center">What We Do</h2>
        <div className="grid md:grid-cols-3 gap-8">
          {activities.map((activity, index) => (
            <div key={index} className="bg-pink-50 p-6 rounded-lg shadow-md">
              <div className="flex justify-center mb-4">{activity.icon}</div>
              <h3 className="text-xl font-semibold mb-2 text-pink-600 text-center">{activity.title}</h3>
              <p className="text-gray-700 text-center">{activity.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export function WhoWeAre() {
    return (
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold mb-6 text-pink-600 text-center">Who We Are</h2>
          <p className="text-lg text-gray-700 mb-4">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc pulvinar
            mauris et eleifend tincidunt. Maecenas eget ipsum porttitor ante 
            ornare porta eu ac dui. Phasellus rhoncus lorem et sagittis faucibus.
            Morbi tincidunt orci purus, ac sodales ipsum facilisis at. Aenean 
            finibus enim in neque cursus, in pulvinar sapien vehicula. 
            Pellentesque gravida nibh ipsum, nec mollis quam dictum eget. 
          </p>
          <p className="text-lg text-gray-700">
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc pulvinar
            mauris et eleifend tincidunt. Maecenas eget ipsum porttitor ante 
            ornare porta eu ac dui. Phasellus rhoncus lorem et sagittis faucibus.
            Morbi tincidunt orci purus, ac sodales ipsum facilisis at. Aenean 
            finibus enim in neque cursus, in pulvinar sapien vehicula. 
            Pellentesque gravida nibh ipsum, nec mollis quam dictum eget.
          </p>
        </div>
      </section>
    )
  }
  
  