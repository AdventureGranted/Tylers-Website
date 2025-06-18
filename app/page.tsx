import React from "react";
import ProfileCard from "./components/ProfileCard";
import Card from "./components/Card";

const subjects = [
  "Object Oriented Programming",
  "Data Structures",
  "Algorithms",
  "Databases",
  "Web/Mobile Development",
  "Agile Development",
  "Test Driven Development",
  "Pair Programming",
  "Computer/Distributed Systems",
  "Human-Computer Interaction",
  "Foundations of Data Analysis",
  "Computer Architecture",
  "Linear Algebra",
  "Statistics",
];

const languages = [
  "TypeScript/JavaScript",
  "React.js",
  "Node.js",
  "C#",
  "Java",
  "C++",
  "Python",
  "Ruby on Rails",
  "Kotlin",
  "ASP.Net",
  "Jest",
  "RSpec",
];

const technologies = [
  "Ubuntu",
  "macOS",
  "Windows",
  "bash/zsh/PowerShell",
  "Git",
  "Spring",
  "AWS/Azure",
  "Kubernetes",
  "Docker",
  "Swagger",
  "Postman",
  "MySQL",
  "Salesforce",
  "Circle CI",
  "NewRelic",
  "Honeycomb",
  "Expo",
  "MongoDB",
];

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-900">
      <main className="p-6 md:p-24">
        <div className="">
          <ProfileCard />
          <div className="flex flex-col lg:flex-row mt-8 max-w-full mx- gap-10">
            <Card title="Subjects">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-200 text-lg mt-6">
                {subjects.map((subject) => (
                  <span
                    key={subject}
                    className="flex flex-col justify-center text-center"
                  >
                    {subject}
                  </span>
                ))}
              </div>
            </Card>
            <Card title="Programming Languages">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-2 text-gray-200 text-lg mt-6">
                {languages.map((lang) => (
                  <span
                    key={lang}
                    className="flex flex-col justify-center text-center"
                  >
                    {lang}
                  </span>
                ))}
              </div>
            </Card>
            <Card title="Technologies">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-x-8 gap-y-2 text-gray-200 text-lg mt-6">
                {technologies.map((tech) => (
                  <span
                    key={tech}
                    className="flex flex-col justify-center text-center"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
}
